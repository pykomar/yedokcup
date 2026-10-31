export type TeamCode = 'ULT' | 'YD' | 'AVR' | 'ISB';

export type SignatureKey = 'tiger-slash' | 'city-pulse' | 'red-tide' | 'tidal-shift';

export interface Team {
  /** URL segment, also the file stem of the crest */
  slug: string;
  code: TeamCode;
  name: string;
  nickname: string;
  home: string;
  stadium: string;
  colours: { primary: string; deep: string; accent: string };
  crest: string;
  signature: SignatureKey;
}

export type FixtureStatus = 'final' | 'upcoming';

export interface Fixture {
  id: string;
  matchday: number;
  /** ISO date-time, +08:00 */
  kickoff: string;
  venue: string;
  home: TeamCode;
  away: TeamCode;
  status: FixtureStatus;
  /** [home, away] — only present once played */
  score?: [number, number];
}

export interface StandingRow {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: Array<'W' | 'D' | 'L'>;
}
