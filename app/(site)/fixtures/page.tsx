import type { Metadata } from 'next';
import { MatchCard, SectionHead, StandingsTable } from '@/components/blocks';
import { matchdays, standings } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Fixtures & results',
  description: 'The Yedok\u2019 Sport Cup schedule, results and standings for the 2026 season.',
};

export default function FixturesPage() {
  const table = standings();
  const days = matchdays();

  return (
    <>
      <section className="container section">
        <SectionHead
          index="01 / Schedule"
          title="Season 2026"
          description="Four clubs, eight matches, two rounds played. Scores are part of the site content; the live board is where you change them."
        />

        <div className="stack" style={{ gap: 30 }}>
          {days.map((day) => {
            const played = day.fixtures.filter((fixture) => fixture.status === 'final').length;
            return (
              <div key={day.matchday}>
                <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
                  <h3
                    className="h-display"
                    style={{ fontSize: 22, letterSpacing: '0.04em', color: 'var(--gold)' }}
                  >
                    Matchday {day.matchday}
                  </h3>
                  <span className="pill">
                    {played}/{day.fixtures.length} played
                  </span>
                </div>
                <div className="stack">
                  {day.fixtures.map((fixture) => (
                    <MatchCard key={fixture.id} fixture={fixture} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container section" style={{ paddingTop: 0 }}>
        <SectionHead
          index="02 / Table"
          title="Standings"
          description="Computed from the finished matches above — points, goal difference and recent form."
        />
        <StandingsTable rows={table} />
      </section>
    </>
  );
}
