/* =========================================================================
   Yedok' Sport Cup — scoreboard model
   Ported from the original single-file broadcast scoreboard. Internal team
   ids stay jdt/klc/sel/tfc so the motion CSS keeps working unchanged.
   ========================================================================= */

export type TeamId = 'jdt' | 'klc' | 'sel' | 'tfc';
export type MatchId = 'a' | 'b';
export type StudioTab = 'brand' | 'teams' | 'type' | 'motion';

export interface Team {
  id: TeamId;
  index: string;
  code: string;
  name: string;
  sub: string;
  nickname: string;
  logo: string;
  color: string;
  deep: string;
  accent: string;
  match: MatchId;
  side: 'home' | 'away';
  motion: string;
  tagline: string;
  particleColors: string[];
  origin: { x: number; y: number };
}

export interface TeamConfig {
  code: string;
  name: string;
  sub: string;
  primary: string;
  deep: string;
  accent: string;
  logo: string;
}

export interface Design {
  accent: string;
  brand: { titleA: string; titleB: string; taglineLead: string; taglineAccent: string };
  fonts: { display: string; condensed: string; ui: string };
  type: { teamNameSize: number };
  teams: Record<TeamId, TeamConfig>;
  motion: { holdMs: number; autoGapMs: number; autoStartMs: number; particles: boolean };
}

export const TEAMS: Record<TeamId, Team> = {
  jdt: {
    id: 'jdt',
    index: '01',
    code: 'ULT',
    name: 'ULTIMATE TITAN',
    sub: 'KEJOR YEOP KEJOR',
    nickname: 'THE TITANS',
    logo: '/logos/ultimate-titan.png',
    color: '#d91f2a',
    deep: '#3a060b',
    accent: '#f2c75c',
    match: 'a',
    side: 'home',
    motion: 'TIGER SLASH',
    tagline: 'THE TITANS RISE',
    particleColors: ['#d91f2a', '#f2c75c', '#fff3d0', '#7d1322'],
    origin: { x: 26, y: 49 },
  },
  klc: {
    id: 'klc',
    index: '02',
    code: 'YD',
    name: 'YEDOK FC',
    sub: 'THE HUZZ HUNTER',
    nickname: 'THE HUZZ HUNTER',
    logo: '/logos/yedok.png',
    color: '#0b0c12',
    deep: '#030305',
    accent: '#6cecff',
    match: 'a',
    side: 'away',
    motion: 'CITY PULSE',
    tagline: 'THE HUZZ HUNTERS STRIKE',
    particleColors: ['#2d7bff', '#6cecff', '#ffffff', '#123c8a'],
    origin: { x: 50, y: 51 },
  },
  sel: {
    id: 'sel',
    index: '03',
    code: 'AVR',
    name: 'AVERNUS FC',
    sub: 'KUANTAN GOLDEN BOY',
    nickname: 'THE GOLDEN BOYS',
    logo: '/logos/avernus.png',
    color: '#3b0a16',
    deep: '#100207',
    accent: '#ffd447',
    match: 'b',
    side: 'home',
    motion: 'RED TIDE',
    tagline: 'THE GOLDEN BOYS ROAR',
    particleColors: ['#e5232e', '#ffd447', '#fff1bd', '#9d0e18'],
    origin: { x: 48, y: 55 },
  },
  tfc: {
    id: 'tfc',
    index: '04',
    code: 'ISB',
    name: 'ISBA FC',
    sub: 'ISLAMIC FINANCE ASSOCIATION',
    nickname: 'THE ASSOCIATION',
    logo: '/logos/isba.png',
    color: '#d4af37',
    deep: '#332507',
    accent: '#faf3dc',
    match: 'b',
    side: 'away',
    motion: 'TIDAL SHIFT',
    tagline: 'THE ASSOCIATION MAKES WAVES',
    particleColors: ['#ffc400', '#faf3dc', '#ff8a00', '#8d6a05'],
    origin: { x: 74, y: 48 },
  },
};

export const MOTION_PARTICLES: Record<TeamId, string[]> = {
  jdt: ['#d91f2a', '#f2c75c', '#fff3d0', '#7d1322'],
  klc: ['#2d7bff', '#6cecff', '#ffffff', '#123c8a'],
  sel: ['#e5232e', '#ffd447', '#fff1bd', '#9d0e18'],
  tfc: ['#ffc400', '#faf3dc', '#ff8a00', '#8d6a05'],
};

export const MATCHES: Record<MatchId, { id: MatchId; home: TeamId; away: TeamId }> = {
  a: { id: 'a', home: 'jdt', away: 'klc' },
  b: { id: 'b', home: 'sel', away: 'tfc' },
};

export const MATCH_ORDER: MatchId[] = ['a', 'b'];

export const TEAM_ORDER: TeamId[] = ['jdt', 'klc', 'sel', 'tfc'];

export const DESIGN_KEY = 'yedokSportCup.design.v2';

const SITE_DISPLAY = 'var(--font-display), Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
const SITE_CONDENSED = 'var(--font-cond), "Bahnschrift Condensed", "Arial Narrow", Arial, sans-serif';
const SITE_UI = 'var(--font-cond), "Bahnschrift", "Segoe UI", "Helvetica Neue", Arial, sans-serif';

export const FONT_PRESETS: Record<'display' | 'condensed' | 'ui', Array<{ label: string; value: string }>> = {
  display: [
    { label: 'Site display (Anton)', value: SITE_DISPLAY },
    { label: 'Impact', value: 'Impact, Haettenschweiler, "Arial Narrow Bold", "Bahnschrift Condensed", sans-serif' },
    { label: 'Bahnschrift Condensed', value: '"Bahnschrift Condensed", "Bahnschrift", "Arial Narrow", sans-serif' },
    { label: 'Arial Black', value: '"Arial Black", Arial, sans-serif' },
    { label: 'Franklin Gothic Heavy', value: '"Franklin Gothic Heavy", "Arial Black", sans-serif' },
    { label: 'Segoe UI Black', value: '"Segoe UI Black", "Segoe UI", Arial, sans-serif' },
    { label: 'Trebuchet MS', value: '"Trebuchet MS", "Segoe UI", sans-serif' },
  ],
  condensed: [
    { label: 'Site condensed (Barlow)', value: SITE_CONDENSED },
    { label: 'Bahnschrift Condensed', value: '"Bahnschrift Condensed", "Bahnschrift", "Arial Narrow", Arial, sans-serif' },
    { label: 'Bahnschrift', value: '"Bahnschrift", "Segoe UI", "Arial Narrow", Arial, sans-serif' },
    { label: 'Arial Narrow', value: '"Arial Narrow", Arial, sans-serif' },
    { label: 'Franklin Gothic', value: '"Franklin Gothic Medium", "Franklin Gothic", "Arial Narrow", sans-serif' },
    { label: 'Segoe UI', value: '"Segoe UI", Arial, sans-serif' },
    { label: 'Trebuchet MS', value: '"Trebuchet MS", "Segoe UI", sans-serif' },
  ],
  ui: [
    { label: 'Site interface (Barlow)', value: SITE_UI },
    { label: 'Bahnschrift', value: '"Bahnschrift", "Segoe UI", "Helvetica Neue", Arial, sans-serif' },
    { label: 'Segoe UI', value: '"Segoe UI", "Helvetica Neue", Arial, sans-serif' },
    { label: 'Arial', value: 'Arial, "Helvetica Neue", sans-serif' },
    { label: 'Trebuchet MS', value: '"Trebuchet MS", "Segoe UI", sans-serif' },
    { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
    { label: 'Georgia', value: 'Georgia, "Times New Roman", serif' },
  ],
};

export const BASE_DESIGN: Design = {
  accent: '#f2c75c',
  brand: {
    titleA: "YEDOK' SPORT",
    titleB: 'CUP',
    taglineLead: 'We create, you wear.',
    taglineAccent: 'Made in Malaysia',
  },
  fonts: {
    display: SITE_DISPLAY,
    condensed: SITE_CONDENSED,
    ui: SITE_UI,
  },
  type: { teamNameSize: 28 },
  teams: {
    jdt: { code: 'ULT', name: 'ULTIMATE TITAN', sub: 'KEJOR YEOP KEJOR', primary: '#d91f2a', deep: '#3a060b', accent: '#f2c75c', logo: '/logos/ultimate-titan.png' },
    klc: { code: 'YD', name: 'YEDOK FC', sub: 'THE HUZZ HUNTER', primary: '#0b0c12', deep: '#030305', accent: '#6cecff', logo: '/logos/yedok.png' },
    sel: { code: 'AVR', name: 'AVERNUS FC', sub: 'KUANTAN GOLDEN BOY', primary: '#3b0a16', deep: '#100207', accent: '#ffd447', logo: '/logos/avernus.png' },
    tfc: { code: 'ISB', name: 'ISBA FC', sub: 'ISLAMIC FINANCE ASSOCIATION', primary: '#d4af37', deep: '#332507', accent: '#faf3dc', logo: '/logos/isba.png' },
  },
  motion: { holdMs: 2650, autoGapMs: 3800, autoStartMs: 2300, particles: true },
};

/* ------------------------------- helpers -------------------------------- */

export function fmtClock(sec: number): string {
  const safe = Math.max(0, Math.floor(sec));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function normalizeHex(value: unknown, fallback = '#f2c75c'): string {
  if (typeof value !== 'string') return fallback;
  let v = value.trim();
  if (!v.startsWith('#')) v = '#' + v;
  if (/^#[0-9a-f]{3}$/i.test(v)) {
    v = '#' + v.slice(1).split('').map((c) => c + c).join('');
  }
  return /^#[0-9a-f]{6}$/i.test(v) ? v.toLowerCase() : fallback;
}

export function rgbTriplet(hex: string): string {
  const h = normalizeHex(hex, '#f2c75c').slice(1);
  return `${parseInt(h.slice(0, 2), 16)} ${parseInt(h.slice(2, 4), 16)} ${parseInt(h.slice(4, 6), 16)}`;
}

export function mixHex(a: string, b: string, amount = 0.5): string {
  const aa = normalizeHex(a, '#f2c75c').slice(1);
  const bb = normalizeHex(b, '#ffffff').slice(1);
  const t = clamp(Number(amount) || 0, 0, 1);
  const ch = (i: number) => {
    const x = parseInt(aa.slice(i, i + 2), 16);
    const y = parseInt(bb.slice(i, i + 2), 16);
    return Math.round(x + (y - x) * t).toString(16).padStart(2, '0');
  };
  return `#${ch(0)}${ch(2)}${ch(4)}`;
}

/** Merge a saved design over the base, ignoring anything malformed. */
export function mergeDesign(saved: unknown): Design {
  const out: Design = JSON.parse(JSON.stringify(BASE_DESIGN));
  if (!saved || typeof saved !== 'object') return out;
  const input = saved as Partial<Design> & Record<string, unknown>;

  if (typeof input.accent === 'string') out.accent = input.accent;

  (['brand', 'fonts', 'type', 'motion'] as const).forEach((group) => {
    const value = input[group];
    if (value && typeof value === 'object') Object.assign(out[group], value);
  });

  if (input.teams && typeof input.teams === 'object') {
    (Object.keys(out.teams) as TeamId[]).forEach((id) => {
      const cfg = (input.teams as Record<string, unknown>)[id];
      if (cfg && typeof cfg === 'object') Object.assign(out.teams[id], cfg);
    });
  }

  return out;
}

/** Resolve the live team records from the current design. */
export function resolveTeams(design: Design): Record<TeamId, Team> {
  const out = {} as Record<TeamId, Team>;
  (Object.keys(TEAMS) as TeamId[]).forEach((id) => {
    const base = TEAMS[id];
    const cfg: Partial<TeamConfig> = design.teams?.[id] ?? {};
    const fallback = BASE_DESIGN.teams[id];
    const code = String(cfg.code ?? fallback.code).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
    const color = normalizeHex(cfg.primary, fallback.primary);
    const accent = normalizeHex(cfg.accent, fallback.accent);

    out[id] = {
      ...base,
      code: code || fallback.code,
      name: String(cfg.name ?? fallback.name).trim() || fallback.name,
      sub: String(cfg.sub ?? fallback.sub).trim() || fallback.sub,
      color,
      deep: normalizeHex(cfg.deep, fallback.deep),
      accent,
      logo: typeof cfg.logo === 'string' && cfg.logo ? cfg.logo : fallback.logo,
      particleColors: (MOTION_PARTICLES[id] ?? [color, accent, '#ffffff', mixHex(color, '#000000', 0.45)]).slice(),
    };
  });
  return out;
}

export const START_CLOCKS: Record<MatchId, number> = { a: 63 * 60 + 26, b: 71 * 60 + 18 };
