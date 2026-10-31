import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MatchCard, SectionHead } from '@/components/blocks';
import { SIGNATURES, TEAMS, TEAM_BY_SLUG, teamFixtures, teamRecord } from '@/lib/data';

interface TeamPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return TEAMS.map((team) => ({ slug: team.slug }));
}

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const { slug } = await params;
  const team = TEAM_BY_SLUG[slug];
  if (!team) return { title: 'Team not found' };
  return {
    title: team.name,
    description: `${team.name} — ${team.nickname}. ${SIGNATURES[team.signature].name} goal signature.`,
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { slug } = await params;
  const team = TEAM_BY_SLUG[slug];
  if (!team) notFound();

  const record = teamRecord(team.code);
  const fixtures = teamFixtures(team.code);
  const signature = SIGNATURES[team.signature];

  return (
    <>
      <section className="container">
        <div
          className="team-hero"
          style={{ '--team-accent': team.colours.accent } as React.CSSProperties}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={team.crest} alt={`${team.name} crest`} className="team-hero__crest" width={120} height={120} />
          <div>
            <span className="team-hero__code">
              {team.code} · {team.home}
            </span>
            <h1 className="team-hero__name">{team.name}</h1>
            <p className="team-hero__meta" style={{ margin: 0 }}>
              {team.nickname} · {team.stadium}
            </p>
          </div>
          <div className="team-hero__record">
            <b>{record?.points ?? 0}</b>
            <span>Points · {record?.played ?? 0} played</span>
          </div>
        </div>
      </section>

      <section className="container section" style={{ paddingTop: 40 }}>
        <div className="two-col">
          <div>
            <SectionHead index="Fixtures" title={`${team.code} in the cup`} />
            <div className="stack">
              {fixtures.map((fixture) => (
                <MatchCard key={fixture.id} fixture={fixture} />
              ))}
            </div>
          </div>

          <div className="stack">
            <div className="panel">
              <h3>Goal signature</h3>
              <p style={{ margin: '0 0 8px', fontFamily: 'var(--font-cond)', fontWeight: 700, fontSize: 20 }}>
                {signature.name}
              </p>
              <p className="muted small" style={{ margin: '0 0 10px' }}>
                {signature.blurb}
              </p>
              <p className="pill" style={{ margin: 0 }}>
                {signature.motion}
              </p>
            </div>

            <div className="panel">
              <h3>Palette</h3>
              <ul className="panel__list">
                <li>
                  Primary
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink)' }}>
                    <i
                      aria-hidden="true"
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 2,
                        background: team.colours.primary,
                        border: '1px solid rgba(255,255,255,.2)',
                      }}
                    />
                    {team.colours.primary}
                  </span>
                </li>
                <li>
                  Deep rail
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink)' }}>
                    <i
                      aria-hidden="true"
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 2,
                        background: team.colours.deep,
                        border: '1px solid rgba(255,255,255,.2)',
                      }}
                    />
                    {team.colours.deep}
                  </span>
                </li>
                <li>
                  Signature accent
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink)' }}>
                    <i
                      aria-hidden="true"
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 2,
                        background: team.colours.accent,
                        border: '1px solid rgba(255,255,255,.2)',
                      }}
                    />
                    {team.colours.accent}
                  </span>
                </li>
              </ul>
            </div>

            <div className="panel">
              <h3>Form</h3>
              <p className="row" style={{ margin: 0, gap: 6 }}>
                {record?.form.length ? (
                  record.form.map((result, index) => (
                    <span key={index} className={`form-badge form-badge--${result.toLowerCase()}`}>
                      {result}
                    </span>
                  ))
                ) : (
                  <span className="muted small">No matches played yet.</span>
                )}
              </p>
            </div>

            <Link href="/board" className="btn btn--gold" style={{ justifyContent: 'center' }}>
              Trigger {team.code}&apos;s goal
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
