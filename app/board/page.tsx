import type { Metadata } from 'next';
import Link from 'next/link';
import { BoardExperience } from '@/components/scoreboard/board-experience';
import { FIXTURES, TEAM_BY_CODE, nextFixture } from '@/lib/data';
import type { TeamCode } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Live board',
  description: 'Trigger goals, watch the four signature takeovers and keep score — all in the browser.',
};

interface BoardPageProps {
  searchParams: Promise<{ embed?: string; preview?: string }>;
}

export default async function BoardPage({ searchParams }: BoardPageProps) {
  const params = await searchParams;
  const embed = params.embed === '1';
  const fixture = nextFixture() ?? FIXTURES[0];

  const requested = params.preview?.toUpperCase() ?? '';
  const preview = requested in TEAM_BY_CODE ? (requested as TeamCode) : undefined;

  const board = (
    <BoardExperience
      home={fixture.home}
      away={fixture.away}
      matchday={fixture.matchday}
      venue={fixture.venue}
      kickoff={fixture.kickoff}
      embed={embed}
      preview={preview}
    />
  );

  if (embed) {
    return <div style={{ background: '#030209', minHeight: '100vh' }}>{board}</div>;
  }

  return (
    <div className="container board-page">
      <div className="board-page__bar">
        <Link href="/">&larr; Yedok&apos; Sport Cup</Link>
        <span>
          Live board · Matchday {fixture.matchday} · {fixture.venue}
        </span>
        <span className="board-page__hint">1 / 2 goals · R reset · M sound · Space clock · ?preview=ult to capture</span>
      </div>

      {board}
    </div>
  );
}
