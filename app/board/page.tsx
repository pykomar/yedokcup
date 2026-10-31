import type { Metadata } from 'next';
import { Scoreboard } from '@/components/scoreboard/scoreboard';
import { TEAMS } from '@/lib/scoreboard-data';
import type { TeamId } from '@/lib/scoreboard-data';
import './scoreboard.css';

export const metadata: Metadata = {
  title: 'Live scoreboard',
  description:
    'The broadcast scoreboard: two live fixtures, four goal signatures and a design studio that runs entirely in the browser.',
};

interface BoardPageProps {
  searchParams: Promise<{ capture?: string; t?: string; autoplay?: string; studio?: string; chrome?: string }>;
}

export default async function BoardPage({ searchParams }: BoardPageProps) {
  const params = await searchParams;

  const captureKey = (params.capture ?? '').toLowerCase();
  const capture = (Object.keys(TEAMS) as TeamId[]).includes(captureKey as TeamId) ? (captureKey as TeamId) : null;

  const rawTime = Number(params.t ?? 900);
  const captureTime = Number.isFinite(rawTime) ? Math.max(0, Math.min(3000, rawTime)) : 900;

  return (
    <Scoreboard
      capture={capture}
      captureTime={captureTime}
      autoplay={params.autoplay !== '0'}
      openStudioInitially={params.studio === '1'}
      hideChrome={params.chrome === '0'}
    />
  );
}
