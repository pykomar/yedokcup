import type { Fixture, SignatureKey, StandingRow, Team, TeamCode } from './types';

export const TOURNAMENT = {
  title: "YEDOK' SPORT CUP",
  titleA: "YEDOK' SPORT",
  titleB: 'CUP',
  tagline: 'We create, you wear.',
  taglineAccent: 'Made in Malaysia',
  edition: '2026',
  season: 'Season 2026',
  claim: 'Own the moment',
} as const;

export const TEAMS: Team[] = [
  {
    slug: 'ultimate-titan',
    code: 'ULT',
    name: 'Ultimate Titan',
    nickname: 'Kejor Yeop Kejor',
    home: 'Kuala Lumpur',
    stadium: 'Titan Arena',
    colours: { primary: '#d91f2a', deep: '#3a060b', accent: '#f2c75c' },
    crest: '/logos/ultimate-titan.png',
    signature: 'tiger-slash',
  },
  {
    slug: 'yedok-fc',
    code: 'YD',
    name: 'Yedok FC',
    nickname: 'The Huzz Hunter',
    home: 'Petaling Jaya',
    stadium: 'The Hive',
    colours: { primary: '#0b0c12', deep: '#030305', accent: '#6cecff' },
    crest: '/logos/yedok.png',
    signature: 'city-pulse',
  },
  {
    slug: 'avernus-fc',
    code: 'AVR',
    name: 'Avernus FC',
    nickname: 'Kuantan Golden Boy',
    home: 'Kuantan',
    stadium: 'Avernus Park',
    colours: { primary: '#3b0a16', deep: '#100207', accent: '#ffd447' },
    crest: '/logos/avernus.png',
    signature: 'red-tide',
  },
  {
    slug: 'isba-fc',
    code: 'ISB',
    name: 'ISBA FC',
    nickname: 'Islamic Finance Association',
    home: 'Shah Alam',
    stadium: 'ISBA Field',
    colours: { primary: '#d4af37', deep: '#332507', accent: '#faf3dc' },
    crest: '/logos/isba.png',
    signature: 'tidal-shift',
  },
];

export const TEAM_BY_CODE = Object.fromEntries(TEAMS.map((team) => [team.code, team])) as Record<
  TeamCode,
  Team
>;

export const TEAM_BY_SLUG = Object.fromEntries(TEAMS.map((team) => [team.slug, team])) as Record<
  string,
  Team
>;

export const SIGNATURES: Record<
  SignatureKey,
  { name: string; motion: string; blurb: string; cssClass: string }
> = {
  'tiger-slash': {
    name: 'Tiger Slash',
    motion: 'Hard diagonal cuts · comet sparks · warped rail',
    blurb:
      'Three claw cuts tear across the frame before the rail snaps back into place. Built for a power side that wants the room to feel the hit.',
    cssClass: 'goal--tiger',
  },
  'city-pulse': {
    name: 'City Pulse',
    motion: 'Blue ring pulses · scanlines · glitch lock',
    blurb:
      'A heartbeat of concentric rings, locked to a scanline sweep and a single glitch frame. Quiet confidence, then a hard cut.',
    cssClass: 'goal--pulse',
  },
  'red-tide': {
    name: 'Red Tide',
    motion: 'Warm ribbon waves · flare · spring bounce',
    blurb:
      'Ribbons roll through the gold and burgundy, a flare burns through the score, and the plate lands on a spring bounce.',
    cssClass: 'goal--tide',
  },
  'tidal-shift': {
    name: 'Tidal Shift',
    motion: 'Gold tile field · hex shell · 3D flip',
    blurb:
      'A field of gold tiles flips from the centre outwards, the hex shell closes, and the board arrives edge-on before it squares up.',
    cssClass: 'goal--shift',
  },
};

/** Seed schedule — static content, no database (state lives in the browser). */
export const FIXTURES: Fixture[] = [
  {
    id: 'md1-ult-avr',
    matchday: 1,
    kickoff: '2026-10-10T20:45:00+08:00',
    venue: 'Titan Arena',
    home: 'ULT',
    away: 'AVR',
    status: 'final',
    score: [2, 1],
  },
  {
    id: 'md1-yd-isb',
    matchday: 1,
    kickoff: '2026-10-11T20:45:00+08:00',
    venue: 'The Hive',
    home: 'YD',
    away: 'ISB',
    status: 'final',
    score: [0, 0],
  },
  {
    id: 'md2-avr-yd',
    matchday: 2,
    kickoff: '2026-10-24T17:30:00+08:00',
    venue: 'Avernus Park',
    home: 'AVR',
    away: 'YD',
    status: 'final',
    score: [1, 3],
  },
  {
    id: 'md2-isb-ult',
    matchday: 2,
    kickoff: '2026-10-25T20:45:00+08:00',
    venue: 'ISBA Field',
    home: 'ISB',
    away: 'ULT',
    status: 'final',
    score: [0, 2],
  },
  {
    id: 'md3-ult-yd',
    matchday: 3,
    kickoff: '2026-11-07T20:45:00+08:00',
    venue: 'Titan Arena',
    home: 'ULT',
    away: 'YD',
    status: 'upcoming',
  },
  {
    id: 'md3-avr-isb',
    matchday: 3,
    kickoff: '2026-11-08T20:45:00+08:00',
    venue: 'Avernus Park',
    home: 'AVR',
    away: 'ISB',
    status: 'upcoming',
  },
  {
    id: 'md4-yd-avr',
    matchday: 4,
    kickoff: '2026-11-21T20:45:00+08:00',
    venue: 'The Hive',
    home: 'YD',
    away: 'AVR',
    status: 'upcoming',
  },
  {
    id: 'md4-isb-ult',
    matchday: 4,
    kickoff: '2026-11-22T17:30:00+08:00',
    venue: 'ISBA Field',
    home: 'ISB',
    away: 'ULT',
    status: 'upcoming',
  },
];

export function fixtureTeams(fixture: Fixture) {
  return { home: TEAM_BY_CODE[fixture.home], away: TEAM_BY_CODE[fixture.away] };
}

export function fixtureLabel(fixture: Fixture) {
  return `${fixture.home} v ${fixture.away}`;
}

export function matchdays(): Array<{ matchday: number; fixtures: Fixture[] }> {
  const byDay = new Map<number, Fixture[]>();
  for (const fixture of FIXTURES) {
    byDay.set(fixture.matchday, [...(byDay.get(fixture.matchday) ?? []), fixture]);
  }
  return [...byDay.entries()]
    .sort(([a], [b]) => a - b)
    .map(([matchday, fixtures]) => ({ matchday, fixtures }));
}

export function standings(): StandingRow[] {
  const rows = new Map<TeamCode, StandingRow>(
    TEAMS.map((team) => [
      team.code,
      {
        team,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: [],
      },
    ]),
  );

  for (const fixture of FIXTURES) {
    if (fixture.status !== 'final' || !fixture.score) continue;
    const [homeGoals, awayGoals] = fixture.score;
    const home = rows.get(fixture.home);
    const away = rows.get(fixture.away);
    if (!home || !away) continue;

    home.played += 1;
    away.played += 1;
    home.goalsFor += homeGoals;
    home.goalsAgainst += awayGoals;
    away.goalsFor += awayGoals;
    away.goalsAgainst += homeGoals;

    if (homeGoals > awayGoals) {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
      home.form.push('W');
      away.form.push('L');
    } else if (homeGoals < awayGoals) {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
      home.form.push('L');
      away.form.push('W');
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
      home.form.push('D');
      away.form.push('D');
    }
  }

  return [...rows.values()]
    .map((row) => ({ ...row, goalDifference: row.goalsFor - row.goalsAgainst }))
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDifference - a.goalDifference ||
        b.goalsFor - a.goalsFor ||
        a.team.name.localeCompare(b.team.name),
    );
}

export function teamRecord(code: TeamCode) {
  return standings().find((row) => row.team.code === code);
}

export function teamFixtures(code: TeamCode): Fixture[] {
  return FIXTURES.filter((fixture) => fixture.home === code || fixture.away === code);
}

export function nextFixture(from: Date = new Date()): Fixture | undefined {
  return FIXTURES.filter((fixture) => fixture.status === 'upcoming')
    .filter((fixture) => new Date(fixture.kickoff).getTime() >= from.getTime())
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime())[0];
}

export function lastResult(): Fixture | undefined {
  return FIXTURES.filter((fixture) => fixture.status === 'final').at(-1);
}

const DATE = new Intl.DateTimeFormat('en-MY', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  timeZone: 'Asia/Kuala_Lumpur',
});

const TIME = new Intl.DateTimeFormat('en-MY', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Kuala_Lumpur',
});

export function formatDate(iso: string) {
  return DATE.format(new Date(iso));
}

export function formatTime(iso: string) {
  return TIME.format(new Date(iso));
}

export function formatKickoff(iso: string) {
  return `${formatDate(iso)} · ${formatTime(iso)}`;
}

export function countdown(iso: string, from: Date = new Date()) {
  const diff = new Date(iso).getTime() - from.getTime();
  if (diff <= 0) return 'Kicked off';
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  if (days > 0) return `${days}d ${hours}h`;
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  return `${hours}h ${minutes}m`;
}
