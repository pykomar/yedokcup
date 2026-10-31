'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SIGNATURES, TEAM_BY_CODE, TEAMS, formatKickoff } from '@/lib/data';
import type { SignatureKey, TeamCode } from '@/lib/types';
import { GoalTakeover } from './goal-takeover';

type Scores = Record<TeamCode, number>;

interface BoardExperienceProps {
  home: TeamCode;
  away: TeamCode;
  matchday: number;
  venue: string;
  kickoff: string;
  embed?: boolean;
  /** capture mode: play one signature on load, e.g. /board?preview=ult */
  preview?: TeamCode;
}

interface TakeoverState {
  code: TeamCode;
  signature: SignatureKey;
  ordinal: number;
  preview: boolean;
}

const EMPTY_SCORES: Scores = { ULT: 0, YD: 0, AVR: 0, ISB: 0 };
const HOLD_MS = 2150;
const CLEAR_MS = 2820;

function clockLabel(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function Mark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="board__mark">
      <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeOpacity=".5" strokeWidth="1.6" />
      <path
        d="M24 9.5 27.6 18.4 37 19.2l-7.1 6.2 2.1 9.1L24 29.8l-8 4.7 2.1-9.1L11 19.2l9.4-.8z"
        fill="currentColor"
        fillOpacity=".9"
      />
    </svg>
  );
}

export function BoardExperience({ home, away, matchday, venue, kickoff, embed, preview }: BoardExperienceProps) {
  const homeTeam = TEAM_BY_CODE[home];
  const awayTeam = TEAM_BY_CODE[away];
  const storageKey = `ysc:board:${home}-${away}:v1`;

  const [scores, setScores] = useState<Scores>(EMPTY_SCORES);
  const [goals, setGoals] = useState(0);
  const [clock, setClock] = useState(0);
  const [running, setRunning] = useState(true);
  const [muted, setMuted] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [takeover, setTakeover] = useState<TakeoverState | null>(null);
  const [leaving, setLeaving] = useState(false);

  const audioRef = useRef<AudioContext | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  /* ---------- the stage is authored at 1600×900 and scaled to fit ---------- */
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const update = () => {
      const width = el.clientWidth;
      const height = el.clientHeight;
      const next = embed ? Math.min(width / 1600, height / 900) : width / 1600;
      if (next > 0) setScale(next);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [embed]);

  /* ---------- persistence: state lives in this browser ---------- */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as { scores?: Partial<Scores>; muted?: boolean; goals?: number };
        if (saved.scores) setScores({ ...EMPTY_SCORES, ...saved.scores });
        if (typeof saved.muted === 'boolean') setMuted(saved.muted);
        if (typeof saved.goals === 'number') setGoals(saved.goals);
      }
    } catch {
      /* private mode, quota, corrupt json — the board still works in memory */
    }
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ scores, muted, goals }));
    } catch {
      /* ignore */
    }
  }, [scores, muted, goals, hydrated, storageKey]);

  /* ---------- match clock ---------- */
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setClock((value) => (value >= 90 * 60 ? value : value + 1)), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  /* ---------- takeover lifecycle ---------- */
  useEffect(() => {
    if (!takeover) return;
    const leave = window.setTimeout(() => setLeaving(true), HOLD_MS);
    const clear = window.setTimeout(() => {
      setTakeover(null);
      setLeaving(false);
    }, CLEAR_MS);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(clear);
    };
  }, [takeover]);

  /* ---------- sound design ---------- */
  const playSound = useCallback(
    (kind: 'goal' | 'preview') => {
      if (muted) return;
      try {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        audioRef.current ??= new Ctor();
        const ctx = audioRef.current;
        if (ctx.state === 'suspended') void ctx.resume();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(kind === 'goal' ? 210 : 160, now);
        osc.frequency.exponentialRampToValueAtTime(58, now + 0.42);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.16, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      } catch {
        /* audio is a nicety, never a failure */
      }
    },
    [muted],
  );

  /* ---------- actions ---------- */
  const trigger = useCallback(
    (code: TeamCode, preview = false) => {
      if (takeover) return;
      const team = TEAM_BY_CODE[code];
      if (!preview) {
        setScores((current) => ({ ...current, [code]: current[code] + 1 }));
        setGoals((current) => current + 1);
      }
      setLeaving(false);
      setTakeover({
        code,
        signature: team.signature,
        ordinal: preview ? 0 : goals + 1,
        preview,
      });
      playSound(preview ? 'preview' : 'goal');
    },
    [takeover, goals, playSound],
  );

  const reset = useCallback(() => {
    setScores(EMPTY_SCORES);
    setGoals(0);
    setClock(0);
    setTakeover(null);
    setLeaving(false);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === '1') trigger(home);
      else if (event.key === '2') trigger(away);
      else if (event.key.toLowerCase() === 'r') reset();
      else if (event.key.toLowerCase() === 'm') setMuted((value) => !value);
      else if (event.key === ' ') {
        event.preventDefault();
        setRunning((value) => !value);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [trigger, reset, home, away]);

  const scoreline = useMemo(() => [scores[home], scores[away]] as [number, number], [scores, home, away]);

  /* ---------- capture mode ---------- */
  const previewedRef = useRef(false);
  useEffect(() => {
    if (!preview || previewedRef.current) return;
    previewedRef.current = true;
    const id = window.setTimeout(() => trigger(preview, true), 350);
    return () => window.clearTimeout(id);
  }, [preview, trigger]);

  return (
    <div className={`board-experience${embed ? ' board-experience--embed' : ''}`}>
      <div
        className="board-frame"
        ref={frameRef}
        style={{ '--board-scale': scale } as React.CSSProperties}
      >
        <section className="board" aria-label={`${homeTeam.name} versus ${awayTeam.name} live board`}>
        <header className="board__top">
          <span className="board__league">
            <Mark />
            Yedok&apos; Sport Cup
          </span>
          <span className="board__fixture">
            Matchday {matchday} · {venue}
          </span>
          <span className={`board__live${running ? ' is-live' : ''}`}>
            <i aria-hidden="true" />
            {running ? 'Live' : 'Paused'}
          </span>
        </header>

        <div className="board__pitch">
          <div className="board__team board__team--home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={homeTeam.crest} alt={`${homeTeam.name} crest`} className="board__crest" />
            <span className="board__code">{homeTeam.code}</span>
            <span className="board__name">{homeTeam.name}</span>
            <span className="board__nickname">{homeTeam.nickname}</span>
          </div>

          <div className="board__centre">
            <span className="board__score">
              <b>{scoreline[0]}</b>
              <em>–</em>
              <b>{scoreline[1]}</b>
            </span>
            <button
              type="button"
              className="board__clock"
              onClick={() => setRunning((value) => !value)}
              aria-label={running ? 'Pause the match clock' : 'Start the match clock'}
            >
              {clockLabel(clock)}
            </button>
            <span className="board__kickoff">{formatKickoff(kickoff)}</span>
          </div>

          <div className="board__team board__team--away">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={awayTeam.crest} alt={`${awayTeam.name} crest`} className="board__crest" />
            <span className="board__code">{awayTeam.code}</span>
            <span className="board__name">{awayTeam.name}</span>
            <span className="board__nickname">{awayTeam.nickname}</span>
          </div>
        </div>

        <div className="board__lower">
          <span className="board__lower-label">Goal signatures</span>
          {TEAMS.map((team) => {
            const active = team.code === home || team.code === away;
            return (
              <span key={team.code} className={`board__signature${active ? ' is-active' : ''}`}>
                <b>{team.code}</b>
                {SIGNATURES[team.signature].name}
              </span>
            );
          })}
        </div>

        <div className="board__rail">
          <button type="button" className="board__goal" onClick={() => trigger(home)} disabled={Boolean(takeover)}>
            <span className="board__goal-kicker">
              Goal <kbd>1</kbd>
            </span>
            <b>{homeTeam.code}</b>
          </button>
          <button type="button" className="board__goal" onClick={() => trigger(away)} disabled={Boolean(takeover)}>
            <span className="board__goal-kicker">
              Goal <kbd>2</kbd>
            </span>
            <b>{awayTeam.code}</b>
          </button>

          <div className="board__tools">
            <span className="board__goals">{goals} goals played</span>
            <button type="button" className="board__tool" onClick={reset}>
              Reset <kbd>R</kbd>
            </button>
            <button
              type="button"
              className="board__tool"
              onClick={() => setMuted((value) => !value)}
              aria-pressed={!muted}
            >
              Sound {muted ? 'off' : 'on'} <kbd>M</kbd>
            </button>
            <button type="button" className="board__tool" onClick={() => setRunning((value) => !value)}>
              {running ? 'Pause' : 'Start'} <kbd>Space</kbd>
            </button>
          </div>
        </div>

        {takeover ? (
          <GoalTakeover
            team={TEAM_BY_CODE[takeover.code]}
            signature={takeover.signature}
            score={scoreline}
            ordinal={takeover.ordinal}
            leaving={leaving}
            preview={takeover.preview}
          />
        ) : null}
        </section>
      </div>

      {!embed ? (
        <div className="board-gallery">
          <div className="board-gallery__head">
            <h2>All four signatures</h2>
            <p>
              Play any club&apos;s goal takeover on the board above. These previews do not change the score — the match
              state stays exactly where you left it.
            </p>
          </div>
          <div className="board-gallery__grid">
            {TEAMS.map((team) => (
              <button
                key={team.code}
                type="button"
                className="sig-card"
                style={{ '--sig-accent': team.colours.accent } as React.CSSProperties}
                onClick={() => trigger(team.code, true)}
                disabled={Boolean(takeover)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={team.crest} alt="" className="sig-card__crest" />
                <span className="sig-card__code">{team.code}</span>
                <span className="sig-card__name">{team.name}</span>
                <span className="sig-card__motion">{SIGNATURES[team.signature].name}</span>
              </button>
            ))}
          </div>
          <p className="board-gallery__note">
            Scores, goal count and the sound setting are saved in this browser only — reload and the board returns
            exactly as you left it. <Link href="/">Back to the cup</Link>
          </p>
        </div>
      ) : null}
    </div>
  );
}
