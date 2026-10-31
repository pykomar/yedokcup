import Link from 'next/link';
import { SIGNATURES, fixtureTeams, formatDate, formatTime } from '@/lib/data';
import type { Fixture, StandingRow, Team } from '@/lib/types';

export function SectionHead({
  index,
  title,
  description,
}: {
  index: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-head">
      <div className="section-head__index">{index}</div>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

export function TeamCard({ team, record }: { team: Team; record?: StandingRow }) {
  return (
    <Link
      href={`/teams/${team.slug}`}
      className="team-card"
      style={{ '--team-accent': team.colours.accent } as React.CSSProperties}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={team.crest} alt={`${team.name} crest`} className="team-card__crest" width={56} height={56} />
      <span className="team-card__code">{team.code}</span>
      <div className="team-card__name">{team.name}</div>
      <div className="team-card__meta">
        {team.nickname} · {team.home}
      </div>
      <div className="team-card__signature">
        <span>{SIGNATURES[team.signature].name}</span>
        <span>{record ? `${record.points} pts` : '—'}</span>
      </div>
    </Link>
  );
}

export function MatchCard({ fixture }: { fixture: Fixture }) {
  const { home, away } = fixtureTeams(fixture);
  const played = fixture.status === 'final' && fixture.score;

  return (
    <div className="match-card">
      <Link href={`/teams/${home.slug}`} className="match-card__side">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={home.crest} alt="" className="match-card__crest" width={30} height={30} />
        <span>{home.name}</span>
      </Link>

      <div className="match-card__centre">
        {played ? (
          <div className="match-card__score">
            {played[0]} – {played[1]}
          </div>
        ) : (
          <div className="match-card__score">
            {formatTime(fixture.kickoff)}
          </div>
        )}
        <div className="match-card__venue">
          {formatDate(fixture.kickoff)} · {fixture.venue}
        </div>
      </div>

      <Link href={`/teams/${away.slug}`} className="match-card__side match-card__side--away">
        <span>{away.name}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={away.crest} alt="" className="match-card__crest" width={30} height={30} />
      </Link>
    </div>
  );
}

export function StandingsTable({ rows }: { rows: StandingRow[] }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: 32 }}>#</th>
            <th>Club</th>
            <th className="num">P</th>
            <th className="num">W</th>
            <th className="num">D</th>
            <th className="num">L</th>
            <th className="num">GF</th>
            <th className="num">GA</th>
            <th className="num">GD</th>
            <th className="num">Pts</th>
            <th>Form</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.team.code}>
              <td className="num" style={{ color: 'rgba(255,255,255,.35)' }}>
                {index + 1}
              </td>
              <td>
                <Link href={`/teams/${row.team.slug}`} className="table__team">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={row.team.crest} alt="" className="table__crest" width={22} height={22} />
                  {row.team.name}
                </Link>
              </td>
              <td className="num">{row.played}</td>
              <td className="num">{row.won}</td>
              <td className="num">{row.drawn}</td>
              <td className="num">{row.lost}</td>
              <td className="num">{row.goalsFor}</td>
              <td className="num">{row.goalsAgainst}</td>
              <td className="num">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
              <td className="num" style={{ color: 'var(--gold)', fontWeight: 600 }}>
                {row.points}
              </td>
              <td>
                {row.form.length ? (
                  row.form.map((result, formIndex) => (
                    <span
                      key={`${row.team.code}-${formIndex}`}
                      className={`form-badge form-badge--${result.toLowerCase()}`}
                    >
                      {result}
                    </span>
                  ))
                ) : (
                  <span className="muted">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
