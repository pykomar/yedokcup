'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  BASE_DESIGN,
  DESIGN_KEY,
  MATCHES,
  MATCH_ORDER,
  START_CLOCKS,
  TEAM_ORDER,
  clamp,
  fmtClock,
  mergeDesign,
  mixHex,
  normalizeHex,
  resolveTeams,
  rgbTriplet,
} from '@/lib/scoreboard-data';
import type { Design, MatchId, Team, TeamId } from '@/lib/scoreboard-data';
import { Studio } from './studio';

type Scores = Record<TeamId, number>;
type Clocks = Record<MatchId, number>;

interface GoalState {
  teamId: TeamId;
  token: number;
  out: boolean;
  count: number;
}

interface Particle {
  left: string;
  top: string;
  dx: string;
  dy: string;
  rot: string;
  scale: string;
  dur: string;
  delay: string;
  alpha: string;
  c: string;
}

export interface ScoreboardProps {
  capture?: TeamId | null;
  captureTime?: number;
  autoplay?: boolean;
  openStudioInitially?: boolean;
  /** hide the site-facing affordances — for embeds and framing stills */
  hideChrome?: boolean;
}

const EMPTY_SCORES: Scores = { jdt: 0, klc: 0, sel: 0, tfc: 0 };
const AUTO_ORDER: TeamId[] = ['jdt', 'sel', 'klc', 'tfc'];

/* --------------------------------- mark --------------------------------- */

function Mark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <use href="#league-mark" />
    </svg>
  );
}

/* ------------------------------ match rail ------------------------------ */

interface MatchRailProps {
  matchId: MatchId;
  teams: Record<TeamId, Team>;
  scores: Scores;
  clock: number;
  scoring?: boolean;
  goalTeam?: TeamId;
  interactive?: boolean;
  onGoal?: (id: TeamId) => void;
}

function MatchRail({ matchId, teams, scores, clock, scoring, goalTeam, interactive, onGoal }: MatchRailProps) {
  const match = MATCHES[matchId];
  const home = teams[match.home];
  const away = teams[match.away];
  const isGoalSide = (side: 'home' | 'away') => goalTeam === (side === 'home' ? match.home : match.away);

  const teamProps = (side: 'home' | 'away') => {
    const team = side === 'home' ? home : away;
    if (!interactive) return {};
    return { type: 'button' as const, onClick: () => onGoal?.(team.id), 'aria-label': `Trigger a ${team.name} goal` };
  };

  return (
    <article
      className={`match${scoring ? ' is-scoring' : ''}`}
      data-match={matchId}
      style={
        {
          '--home': home.color,
          '--home-deep': home.deep,
          '--away': away.color,
          '--away-deep': away.deep,
        } as CSSProperties
      }
    >
      <div className="match__wash" />
      <div className="match__mesh" />
      <div className="match__streak" />

      <div className="match__tab match__tab--home" aria-hidden="true">
        <span className="tab__line" />
        <span className="tab__code">{home.code}</span>
        <span className="tab__label">HOME</span>
      </div>

      <button
        className={`team team--home${isGoalSide('home') ? ' is-goal-team' : ''}`}
        {...teamProps('home')}
        tabIndex={interactive ? undefined : -1}
      >
        <span className="team__crest">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={home.logo} alt="" loading="eager" decoding="async" />
        </span>
        <span className="team__copy">
          <span className="team__name">{home.name}</span>
          <span className="team__sub">{home.sub}</span>
          <span className="team__goal-cue">
            <i>+</i> trigger goal
          </span>
        </span>
      </button>

      <div className="scoreplate">
        <div className="scoreplate__top">
          <span className="half">2ND HALF</span>
          <span className="minute">{fmtClock(clock)}</span>
          <span className="half">LIVE</span>
        </div>
        <div className="score">
          <span className={`score__num${scoring ? ' is-rolling' : ''}`}>{scores[match.home]}</span>
          <span className="score__sep">:</span>
          <span className={`score__num${scoring ? ' is-rolling' : ''}`}>{scores[match.away]}</span>
        </div>
        <div className={`scoreplate__bottom${scoring ? ' is-hot' : ''}`}>
          <span className="status-dot" />
          {scoring ? `GOAL! · ${fmtClock(clock)}` : 'LIVE · MATCHDAY 12'}
        </div>
      </div>

      <button
        className={`team team--away${isGoalSide('away') ? ' is-goal-team' : ''}`}
        {...teamProps('away')}
        tabIndex={interactive ? undefined : -1}
      >
        <span className="team__copy">
          <span className="team__name">{away.name}</span>
          <span className="team__sub">{away.sub}</span>
          <span className="team__goal-cue">
            <i>+</i> trigger goal
          </span>
        </span>
        <span className="team__crest">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={away.logo} alt="" loading="eager" decoding="async" />
        </span>
      </button>

      <div className="match__tab match__tab--away" aria-hidden="true">
        <span className="tab__line" />
        <span className="tab__code">{away.code}</span>
        <span className="tab__label">AWAY</span>
      </div>
    </article>
  );
}

/* ------------------------------- overlay -------------------------------- */

function GoalFx() {
  return (
    <div className="goal__fx">
      <div className="fx-jdt" aria-hidden="true">
        <span className="jdt-burst" />
        <span className="slash slash--1" />
        <span className="slash slash--2" />
        <span className="slash slash--3" />
        <span className="slash slash--4" />
      </div>

      <div className="fx-klc" aria-hidden="true">
        <span className="klc-rays" />
        <span className="klc-bars">
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
        <div className="klc-rings">
          <span className="klc-ring" />
          <span className="klc-ring" />
          <span className="klc-ring" />
          <span className="klc-ring" />
        </div>
        <div className="klc-scan" />
        <div className="klc-grid" />
        <div className="klc-skyline" />
      </div>

      <div className="fx-sel" aria-hidden="true">
        <svg viewBox="0 0 1600 900" preserveAspectRatio="none">
          <path className="sel-ribbon sel-ribbon--1" d="M-220 700 C 210 380, 460 800, 850 545 S 1360 215, 1830 500" />
          <path className="sel-ribbon sel-ribbon--2" d="M-180 790 C 260 500, 610 850, 980 590 S 1440 330, 1840 620" />
          <path className="sel-ribbon sel-ribbon--3" d="M-160 260 C 250 80, 620 450, 1020 230 S 1460 90, 1800 240" />
          <circle cx="1340" cy="155" r="320" fill="none" stroke="rgba(255,212,71,.10)" strokeWidth="1" />
          <circle cx="1340" cy="155" r="235" fill="none" stroke="rgba(255,212,71,.08)" strokeWidth="1" />
        </svg>
        <div className="sel-sun" />
      </div>

      <div className="fx-tfc" aria-hidden="true">
        <div className="tfc-hex">
          <svg viewBox="0 0 300 340" fill="none" stroke="rgba(255,196,0,.42)" strokeWidth="1.4">
            <polygon points="150,18 276,92 276,250 150,324 24,250 24,92" />
            <polygon points="150,48 250,108 250,232 150,292 50,232 50,108" />
            <polygon points="150,80 220,122 220,214 150,256 80,214 80,122" />
            <path d="M150 18v62M276 92l-56 30M276 250l-56-28M150 324v-68M24 250l56-28M24 92l56 30M150 80V48M220 122l30-14M220 214l30 18M150 256v36M80 214l-30 18M80 122 50 108" />
          </svg>
        </div>
        <span className="tfc-shard tfc-shard--1" />
        <span className="tfc-shard tfc-shard--2" />
        <span className="tfc-shard tfc-shard--3" />
        <span className="tfc-shard tfc-shard--4" />
      </div>
    </div>
  );
}

/* --------------------------------- ticker -------------------------------- */

interface TickerItemProps {
  kind: number;
  teams: Record<TeamId, Team>;
  scores: Scores;
  clocks: Clocks;
  tagline: string;
}

function TickerItem({ kind, teams, scores, clocks, tagline }: TickerItemProps) {
  const a = MATCHES.a;
  const b = MATCHES.b;

  if (kind === 0) {
    return (
      <div className="ticker__item ticker__item--live">
        <span className="mini-dot" />
        <strong>LIVE</strong> {teams[a.home].code} VS {teams[a.away].name}{' '}
        <span className="ticker__score">
          {scores[a.home]} : {scores[a.away]}
        </span>
        <b>{Math.floor(clocks.a / 60)}&apos;</b>
      </div>
    );
  }

  if (kind === 1) {
    return (
      <div className="ticker__item">
        <span className="mini-dot" />
        <strong>{teams[b.home].name}</strong> VS {teams[b.away].name}{' '}
        <span className="ticker__score">
          {scores[b.home]} : {scores[b.away]}
        </span>
        <b>{Math.floor(clocks.b / 60)}&apos;</b>
      </div>
    );
  }

  if (kind === 2) {
    return (
      <div className="ticker__item">
        <strong>{tagline}</strong>
        <span className="mini-dot" />
        {TEAM_ORDER.map((id) => teams[id].motion).join(' / ')}
      </div>
    );
  }

  return (
    <div className="ticker__item">
      <span className="mini-dot" />
      MATCHDAY 12 <span className="mini-dot" />
      BUKIT JALIL NATIONAL STADIUM <span className="mini-dot" />
      MALAYSIA
    </div>
  );
}

/* ------------------------------ scoreboard ------------------------------ */

export function Scoreboard({
  capture = null,
  captureTime = 900,
  autoplay = true,
  openStudioInitially = false,
  hideChrome = false,
}: ScoreboardProps) {
  const [design, setDesign] = useState<Design>(() => mergeDesign(null));
  const [scores, setScores] = useState<Scores>(EMPTY_SCORES);
  const [clocks, setClocks] = useState<Clocks>({ ...START_CLOCKS });
  const [auto, setAuto] = useState(autoplay);
  const [sound, setSound] = useState(false);
  const [goal, setGoal] = useState<GoalState | null>(null);
  const [goalCount, setGoalCount] = useState(0);
  const [autoIndex, setAutoIndex] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [studioOpen, setStudioOpen] = useState(openStudioInitially);
  const [reduced, setReduced] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const teams = useMemo(() => resolveTeams(design), [design]);
  const busyRef = useRef(false);
  const tokenRef = useRef(0);
  const countRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  const audioRef = useRef<AudioContext | null>(null);
  const designRef = useRef(design);
  const soundRef = useRef(sound);
  const reducedRef = useRef(reduced);

  designRef.current = design;
  soundRef.current = sound;
  reducedRef.current = reduced;

  const isCapture = Boolean(capture);

  /* ---------------- persistence ---------------- */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DESIGN_KEY);
      if (raw) setDesign(mergeDesign(JSON.parse(raw)));
    } catch {
      /* private mode / local file — defaults are fine */
    }
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(DESIGN_KEY, JSON.stringify(design));
    } catch {
      /* storage full — the board still works in memory */
    }
  }, [design, hydrated]);

  /* ---------------- apply the design tokens ---------------- */
  useEffect(() => {
    const root = document.documentElement.style;
    const accent = normalizeHex(design.accent, BASE_DESIGN.accent);
    root.setProperty('--gold', accent);
    root.setProperty('--gold-rgb', rgbTriplet(accent));
    root.setProperty('--gold-hi', mixHex(accent, '#ffffff', 0.34));
    root.setProperty('--gold-deep', mixHex(accent, '#000000', 0.32));
    root.setProperty('--impact', String(design.fonts.display || BASE_DESIGN.fonts.display));
    root.setProperty('--cond', String(design.fonts.condensed || BASE_DESIGN.fonts.condensed));
    root.setProperty('--font', String(design.fonts.ui || BASE_DESIGN.fonts.ui));
    root.setProperty('--team-name-size', `${clamp(Number(design.type.teamNameSize) || 28, 20, 34)}px`);
    const title = `${design.brand.titleA} ${design.brand.titleB}`.trim() || "YEDOK' SPORT CUP";
    document.title = `${title} — Motion Scoreboard`;
  }, [design]);

  /* ---------------- stage fit ---------------- */
  const fitStage = useCallback(() => {
    const reserve = studioOpen && window.innerWidth >= 1024 ? 420 : 0;
    const scale = Math.min((window.innerWidth - reserve) / 1600, window.innerHeight / 900);
    document.documentElement.style.setProperty('--stage-scale', String(scale));
    document.documentElement.style.setProperty('--stage-shift', `${reserve / 2}px`);
  }, [studioOpen]);

  useEffect(() => {
    fitStage();
    window.addEventListener('resize', fitStage);
    window.addEventListener('orientationchange', fitStage);
    return () => {
      window.removeEventListener('resize', fitStage);
      window.removeEventListener('orientationchange', fitStage);
    };
  }, [fitStage]);

  useEffect(() => {
    document.body.classList.toggle('studio-open', studioOpen);
    return () => document.body.classList.remove('studio-open');
  }, [studioOpen]);

  useEffect(() => {
    document.documentElement.classList.toggle('is-capture', isCapture);
    return () => document.documentElement.classList.remove('is-capture');
  }, [isCapture]);

  /* ---------------- match clock ---------------- */
  useEffect(() => {
    if (isCapture) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setClocks((current) => ({ a: current.a + 1, b: current.b + 1 }));
    }, 1000);
    return () => window.clearInterval(id);
  }, [isCapture]);

  /* ---------------- sound ---------------- */
  const playGoalSound = useCallback((team: Team) => {
    if (!soundRef.current) return;
    try {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      audioRef.current ??= new Ctor();
      const ctx = audioRef.current;
      if (ctx.state === 'suspended') void ctx.resume();
      const t = ctx.currentTime;

      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.knee.value = 18;
      comp.ratio.value = 4;
      comp.connect(ctx.destination);

      const osc = ctx.createOscillator();
      const og = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(team.id === 'tfc' ? 150 : 132, t);
      osc.frequency.exponentialRampToValueAtTime(43, t + 0.5);
      og.gain.setValueAtTime(0.0001, t);
      og.gain.exponentialRampToValueAtTime(0.18, t + 0.015);
      og.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
      osc.connect(og);
      og.connect(comp);
      osc.start(t);
      osc.stop(t + 0.6);

      const len = Math.floor(ctx.sampleRate * 1.55);
      const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < len; i += 1) {
        const env = Math.min(1, i / (ctx.sampleRate * 0.07)) * Math.max(0, 1 - i / len);
        data[i] = (Math.random() * 2 - 1) * env;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 760;
      bp.Q.value = 0.7;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.055, t);
      ng.gain.exponentialRampToValueAtTime(0.0001, t + 1.45);
      noise.connect(bp);
      bp.connect(ng);
      ng.connect(comp);
      noise.start(t);

      const notes = team.id === 'jdt' ? [196, 293.7] : team.id === 'klc' ? [261.6, 392] : team.id === 'sel' ? [220, 330] : [246.9, 370];
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, t + 0.1 + idx * 0.08);
        g.gain.exponentialRampToValueAtTime(0.035, t + 0.14 + idx * 0.08);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.15 + idx * 0.08);
        o.connect(g);
        g.connect(comp);
        o.start(t + 0.1 + idx * 0.08);
        o.stop(t + 1.3);
      });
    } catch {
      /* audio is a nicety, never a failure */
    }
  }, []);

  /* ---------------- goal flow ---------------- */
  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  const triggerGoal = useCallback(
    (teamId: TeamId, opts: { instant?: boolean } = {}) => {
      if (busyRef.current && !opts.instant) return false;
      busyRef.current = true;
      clearTimers();
      const token = tokenRef.current + 1;
      tokenRef.current = token;

      const team = teams[teamId];
      const current = designRef.current;

      setScores((prev) => ({ ...prev, [teamId]: prev[teamId] + 1 }));
      countRef.current += 1;
      setGoalCount(countRef.current);
      setGoal({ teamId, token, out: false, count: countRef.current });

      if (!reducedRef.current && current.motion.particles) {
        const list: Particle[] = Array.from({ length: 44 }, () => {
          const angle = Math.random() * Math.PI * 2;
          const radius = 70 + Math.random() * 590;
          return {
            left: `${team.origin.x + (Math.random() * 18 - 9)}%`,
            top: `${team.origin.y + (Math.random() * 18 - 9)}%`,
            dx: `${(Math.cos(angle) * radius * (0.65 + Math.random() * 0.75)).toFixed(0)}px`,
            dy: `${(Math.sin(angle) * radius * (0.35 + Math.random() * 0.68) - 40).toFixed(0)}px`,
            rot: `${(Math.random() * 900 - 450).toFixed(0)}deg`,
            scale: (0.5 + Math.random() * 1.3).toFixed(2),
            dur: `${(0.9 + Math.random() * 1.15).toFixed(2)}s`,
            delay: `${(Math.random() * 0.23).toFixed(2)}s`,
            alpha: (0.45 + Math.random() * 0.5).toFixed(2),
            c: team.particleColors[Math.floor(Math.random() * team.particleColors.length)],
          };
        });
        setParticles(list);
      } else {
        setParticles([]);
      }

      playGoalSound(team);

      if (opts.instant) return true;

      const hold = clamp(Number(current.motion.holdMs) || 2650, 2200, 4200);
      later(() => {
        if (token !== tokenRef.current) return;
        setGoal((prev) => (prev ? { ...prev, out: true } : prev));
        later(() => {
          if (token !== tokenRef.current) return;
          setGoal(null);
          setParticles([]);
          busyRef.current = false;
        }, 620);
      }, hold);

      return true;
    },
    [clearTimers, later, playGoalSound, teams],
  );

  const resetDemo = useCallback(() => {
    tokenRef.current += 1;
    busyRef.current = false;
    clearTimers();
    setScores(EMPTY_SCORES);
    setClocks({ ...START_CLOCKS });
    countRef.current = 0;
    setGoalCount(0);
    setAutoIndex(0);
    setGoal(null);
    setParticles([]);
  }, [clearTimers]);

  /* ---------------- auto demo ---------------- */
  useEffect(() => {
    if (!auto || isCapture || studioOpen || goal) return;
    const delay = goalCount === 0 ? design.motion.autoStartMs : design.motion.autoGapMs;
    const team = AUTO_ORDER[autoIndex % AUTO_ORDER.length];
    const id = window.setTimeout(() => {
      setAutoIndex((i) => i + 1);
      triggerGoal(team);
    }, clamp(delay, 1200, 6000));
    return () => window.clearTimeout(id);
  }, [auto, isCapture, studioOpen, goal, goalCount, autoIndex, design.motion.autoStartMs, design.motion.autoGapMs, triggerGoal]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  /* ---------------- keyboard ---------------- */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
      if (typing) return;

      const map: Record<string, TeamId> = { '1': 'jdt', '2': 'klc', '3': 'sel', '4': 'tfc' };
      const mapped = map[event.key];
      if (mapped) {
        triggerGoal(mapped);
        return;
      }

      if (event.key === ' ') {
        event.preventDefault();
        triggerGoal(AUTO_ORDER[autoIndex % AUTO_ORDER.length]);
        setAutoIndex((i) => i + 1);
      } else if (event.key.toLowerCase() === 'a') {
        setAuto((v) => !v);
      } else if (event.key.toLowerCase() === 'm') {
        setSound((v) => !v);
      } else if (event.key.toLowerCase() === 'r') {
        resetDemo();
      } else if (event.key.toLowerCase() === 'd') {
        if (!isCapture) setStudioOpen((v) => !v);
      } else if (event.key === 'Escape') {
        setStudioOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [autoIndex, isCapture, resetDemo, triggerGoal]);

  /* ---------------- capture mode ---------------- */
  useEffect(() => {
    if (!capture || !hydrated) return;
    triggerGoal(capture, { instant: true });
    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getAnimations().forEach((animation) => {
          try {
            animation.currentTime = captureTime;
            animation.pause();
          } catch {
            /* some animations are not pauseable */
          }
        });
      });
    });
    return () => cancelAnimationFrame(raf1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, capture, captureTime]);

  /* ---------------- derived ---------------- */
  const goalTeam = goal ? teams[goal.teamId] : null;
  const goalMatch = goalTeam ? MATCHES[goalTeam.match] : null;
  const scoringMatch = goal && goal.out ? goalTeam?.match : undefined;
  const heroTitleA = design.brand.titleA;
  const heroTitleB = design.brand.titleB;

  const updateDesign = useCallback((updater: (current: Design) => Design) => {
    setDesign((current) => updater(current));
  }, []);

  return (
    <>
      <div className="stage" id="stage">
        <div className="bg">
          <div className="bg__aurora bg__aurora--a" />
          <div className="bg__aurora bg__aurora--b" />
          <div className="bg__aurora bg__aurora--c" />
          <div className="bg__halftone" />
          <div className="bg__lines" />
          <div className="bg__crowd" />
          <div className="bg__field" />
          <Mark className="bg__watermark" />
          <div className="bg__grain" />
          <div className="bg__vignette" />
        </div>

        <div className="stage__index">12</div>
        <div className="side-note side-note--l">
          <b>MALAYSIA SUPER LEAGUE</b> &nbsp;/&nbsp; MOTION PACKAGE 01
        </div>
        <div className="side-note side-note--r">
          MATCHDAY 12 &nbsp;/&nbsp; <b>KUALA LUMPUR</b>
        </div>

        <div className="stage__inner">
          <header className="topbar">
            <div className="brand">
              <Mark className="brand__mark" />
              <div className="brand__copy">
                <div className="brand__name">
                  LIGA <span>MALAYSIA</span>
                </div>
                <div className="brand__sub">SUPER LEAGUE · CONCEPT 2024</div>
              </div>
            </div>
            <div className="topbar__center">
              <span>MATCHDAY 12</span>
              <span className="sep" />
              <span>
                <strong>BUKIT JALIL</strong>
              </span>
              <span className="sep" />
              <span>20:45 MYT</span>
            </div>
            <div className="topbar__right">
              <div className="live-pill">
                <i className="live-dot" />
                LIVE
              </div>
              <div className="topbar__clock">
                {fmtClock(clocks.a)} <small>GAME CLOCK</small>
              </div>
            </div>
          </header>

          <section className="hero" aria-label="Match day">
            <div>
              <p className="kicker">
                <span className="kicker__bar" />
                MATCH CENTRE <span className="kicker__dot" /> <em>TWO LIVE GAMES</em>
              </p>
              <h1 className="hero__title">
                <span>{heroTitleA}</span> <em>{heroTitleB}</em>
              </h1>
            </div>
            <div className="hero__side">
              <p className="hero__tagline">
                <span>{design.brand.taglineLead}</span> <strong>{design.brand.taglineAccent}</strong>
              </p>
              <p className="hero__hint">
                Tap a crest or press{' '}
                <kbd>1</kbd>–<kbd>4</kbd> to score
              </p>
            </div>
          </section>

          <main className="fixtures" aria-label="Live fixtures">
            {MATCH_ORDER.map((id) => (
              <MatchRail
                key={id}
                matchId={id}
                teams={teams}
                scores={scores}
                clock={clocks[id]}
                scoring={scoringMatch === id}
                interactive
                onGoal={triggerGoal}
              />
            ))}
          </main>

          <section className="signatures" aria-label="Goal motion signatures">
            <div className="sig-head">
              <div className="sig-head__title">
                GOAL SIGNATURES <span className="sig-head__count">04</span>
              </div>
              <div className="sig-head__note">One score, one signature cut</div>
              <div className="sig-head__controls">
                <button
                  className={`ctrl${auto ? ' is-on' : ''}`}
                  type="button"
                  aria-pressed={auto}
                  title="Toggle auto demo (A)"
                  onClick={() => setAuto((v) => !v)}
                >
                  <span className="ctrl__lamp" />
                  AUTO
                </button>
                <button
                  className={`ctrl${sound ? ' is-on' : ''}`}
                  type="button"
                  aria-pressed={sound}
                  title="Toggle sound (M)"
                  onClick={() => setSound((v) => !v)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
                    <path d="m16 8 5 8m0-8-5 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".7" />
                  </svg>
                  <span>{sound ? 'SOUND ON' : 'SOUND OFF'}</span>
                </button>
                <button className="ctrl" type="button" title="Reset scoreboard (R)" onClick={resetDemo}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 10a8 8 0 1 1 2 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M4 5v5h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  RESET
                </button>
              </div>
            </div>

            <div className="sig-grid">
              {TEAM_ORDER.map((id) => {
                const team = teams[id];
                return (
                  <button
                    key={id}
                    className={`sig sig--${id}${goal?.teamId === id ? ' is-firing' : ''}`}
                    type="button"
                    data-goal={id}
                    data-team={id}
                    style={{ '--c': team.color, '--c2': team.accent } as CSSProperties}
                    onClick={() => triggerGoal(id)}
                  >
                    <span className="sig__idx">{team.index}</span>
                    <span className="sig__badge">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={team.logo} alt="" loading="eager" decoding="async" />
                    </span>
                    <span className="sig__copy">
                      <span className="sig__team">{team.name}</span>
                      <span className="sig__motion">{team.motion}</span>
                    </span>
                    <span className="sig__go">+</span>
                    <span className="sig__glyph" />
                  </button>
                );
              })}
            </div>
          </section>

          <footer className="ticker" aria-label="League ticker">
            <div className="ticker__brand">
              <Mark />
              <div className="ticker__brand-copy">
                <b>LIGA MALAYSIA</b>
                <span>SUPER LEAGUE</span>
              </div>
            </div>
            <div className="ticker__rail">
              <div className="ticker__run">
                {[0, 1, 2, 3, 0, 1, 2, 3].map((kind, index) => (
                  <TickerItem
                    key={index}
                    kind={kind}
                    teams={teams}
                    scores={scores}
                    clocks={clocks}
                    tagline={String(design.brand.taglineAccent || 'Made in Malaysia').toUpperCase()}
                  />
                ))}
              </div>
            </div>
            <div className="ticker__clock">
              <b>20:45</b>
              <span>MYT · KUALA LUMPUR</span>
            </div>
          </footer>

          <section
            className={`goal${goalTeam ? ` goal--${goalTeam.id} is-on${goal?.out ? ' is-out' : ''}` : ''}`}
            aria-hidden={!goalTeam}
            aria-live="assertive"
          >
            <div className="goal__veil" />
            <div className="goal__halo" />
            <div className="goal__code">{goalTeam?.code ?? ''}</div>
            <GoalFx />
            <div className="goal__particles">
              {particles.map((p, index) => (
                <i
                  key={index}
                  style={
                    {
                      left: p.left,
                      top: p.top,
                      '--dx': p.dx,
                      '--dy': p.dy,
                      '--rot': p.rot,
                      '--scale': p.scale,
                      '--dur': p.dur,
                      '--delay': p.delay,
                      '--alpha': p.alpha,
                      '--c': p.c,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            <div className="goal__content">
              <div className="goal__corner goal__corner--l">
                <Mark />
                <span>LIGA MALAYSIA</span>
              </div>
              <div className="goal__corner goal__corner--r">
                <span className="live-mini">
                  <i />
                  GOAL REPLAY
                </span>
                <span>GOAL {String(goal?.count ?? 0).padStart(2, '0')}</span>
              </div>
              <div className="goal__kicker">
                MALAYSIA SUPER LEAGUE <b>·</b> MATCHDAY 12 <b>·</b>{' '}
                <span>
                  {goalMatch ? `${teams[goalMatch.home].code} VS ${teams[goalMatch.away].code}` : ''}
                </span>
              </div>
              <div className="goal__word-wrap">
                <div className="goal__word">GOAL</div>
              </div>
              <div className="goal-board">
                {goalTeam && goalMatch ? (
                  <MatchRail
                    matchId={goalMatch.id}
                    teams={teams}
                    scores={scores}
                    clock={clocks[goalMatch.id]}
                    scoring
                    goalTeam={goalTeam.id}
                    interactive={false}
                  />
                ) : null}
              </div>
              <div className="goal__tagline">{goalTeam?.tagline ?? ''}</div>
              <div className="goal__motion-pill">{goalTeam?.motion ?? ''}</div>
              <div className="goal__foot">
                <span>
                  <b>MALAYSIA SUPER LEAGUE</b> &nbsp;·&nbsp; BUKIT JALIL NATIONAL STADIUM
                </span>
                <span className="goalno">
                  SIGNATURE <span>{goalTeam?.index ?? '01'}</span>
                </span>
              </div>
            </div>
            <div className="goal__grain" />
          </section>

          <div className="sr-only" aria-live="assertive">
            {goalTeam && goalMatch
              ? `Goal! ${goalTeam.name}. ${teams[goalMatch.home].name} ${scores[goalMatch.home]}, ${teams[goalMatch.away].name} ${scores[goalMatch.away]}.`
              : ''}
          </div>
        </div>
      </div>

      <button
        className="studio-launch"
        type="button"
        aria-controls="studio"
        aria-expanded={studioOpen}
        aria-label="Open design studio"
        title="Design studio (D)"
        onClick={() => setStudioOpen((v) => !v)}
        style={hideChrome ? { display: 'none' } : undefined}
      >
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <path d="M1.8 4h8.4M13 4h1.2M1.8 8h2.4M7 8h7.2M1.8 12h6.4M11 12h3.2" />
          <circle cx="11.6" cy="4" r="1.4" />
          <circle cx="5.8" cy="8" r="1.4" />
          <circle cx="9.8" cy="12" r="1.4" />
        </svg>
        <span className="studio-launch__led" />
        <span>Design studio</span>
      </button>

      <Studio
        open={studioOpen}
        design={design}
        teams={teams}
        auto={auto}
        sound={sound}
        onChange={updateDesign}
        onClose={() => setStudioOpen(false)}
        onToggleAuto={() => setAuto((v) => !v)}
        onToggleSound={() => setSound((v) => !v)}
        onPreview={(teamId) => triggerGoal(teamId)}
      />

      <Link className="stage-back" href="/" style={hideChrome ? { display: 'none' } : undefined}>
        ← Site
      </Link>

      <svg width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" className="mark-stop-hi" />
            <stop offset=".5" className="mark-stop" />
            <stop offset="1" className="mark-stop-deep" />
          </linearGradient>
          <linearGradient id="petalGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="mark-stop-hi" />
            <stop offset=".6" className="mark-stop" />
            <stop offset="1" className="mark-stop-deep" />
          </linearGradient>

          <symbol id="league-mark" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="30" fill="#080613" stroke="url(#goldGrad)" strokeWidth="1.7" />
            <circle cx="32" cy="32" r="25.2" fill="none" className="mark-ring" strokeWidth=".7" />
            <g transform="translate(32 32)">
              <g fill="url(#petalGrad)">
                <path d="M0 -5 C6 -11 8 -19 0 -25 C-8 -19 -6 -11 0 -5Z" transform="rotate(0)" />
                <path d="M0 -5 C6 -11 8 -19 0 -25 C-8 -19 -6 -11 0 -5Z" transform="rotate(72)" />
                <path d="M0 -5 C6 -11 8 -19 0 -25 C-8 -19 -6 -11 0 -5Z" transform="rotate(144)" />
                <path d="M0 -5 C6 -11 8 -19 0 -25 C-8 -19 -6 -11 0 -5Z" transform="rotate(216)" />
                <path d="M0 -5 C6 -11 8 -19 0 -25 C-8 -19 -6 -11 0 -5Z" transform="rotate(288)" />
              </g>
              <circle cx="0" cy="0" r="9.4" fill="#f5efdf" />
              <path d="M0 -6.2 5.9 -2v7.7L0 10l-5.9-4.3V-2Z" fill="#171024" />
              <path d="M0 -6.2V10M-5.9 -2 5.9 5.7M5.9-2-5.9 5.7" stroke="#f5efdf" strokeWidth=".6" opacity=".32" />
            </g>
            <path d="M32 3v4M32 57v4M3 32h4M57 32h4" stroke="rgba(255,255,255,.32)" strokeWidth="1" />
          </symbol>
        </defs>
      </svg>
    </>
  );
}
