import type { Metadata } from 'next';
import { SectionHead, TeamCard } from '@/components/blocks';
import { SIGNATURES, TEAMS, standings } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Teams',
  description: 'The four clubs of the Yedok\u2019 Sport Cup, their colours and goal signatures.',
};

export default function TeamsPage() {
  const table = standings();

  return (
    <section className="container section">
      <SectionHead
        index="01 / Clubs"
        title="Four clubs"
        description="Ultimate Titan, Yedok FC, Avernus FC and ISBA FC. Each one carries its own palette, crest and goal signature into the broadcast."
      />

      <div className="card-grid card-grid--4">
        {TEAMS.map((team) => (
          <TeamCard key={team.code} team={team} record={table.find((row) => row.team.code === team.code)} />
        ))}
      </div>

      <div className="panel" style={{ marginTop: 28 }}>
        <h3>How a signature works</h3>
        <p className="muted small" style={{ margin: 0 }}>
          A goal is a full broadcast takeover: the board clones itself, the score updates underneath the motion, and the
          rail stamps back into place as the takeover wipes away. Four signatures —{' '}
          {TEAMS.map((team) => SIGNATURES[team.signature].name).join(', ')} — share one timeline engine.
        </p>
      </div>
    </section>
  );
}
