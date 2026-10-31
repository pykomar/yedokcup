import Link from 'next/link';
import { MatchCard, SectionHead, StandingsTable, TeamCard } from '@/components/blocks';
import {
  FIXTURES,
  SIGNATURES,
  TEAMS,
  TOURNAMENT,
  countdown,
  fixtureTeams,
  formatKickoff,
  lastResult,
  nextFixture,
  standings,
} from '@/lib/data';

export default function HomePage() {
  const table = standings();
  const upcoming = nextFixture();
  const latest = lastResult();
  const recordFor = (code: string) => table.find((row) => row.team.code === code);

  return (
    <>
      <section className="container hero">
        <div>
          <span className="eyebrow">
            <i /> Season 2026 · four clubs
          </span>
          <h1 className="h-display hero__title">
            Own the
            <span>moment</span>
          </h1>
          <p className="hero__lede">
            A broadcast scoreboard built around four clubs and four different goal reactions. Every goal is a full
            takeover — new score, unique motion cut, live ticker. <b>The whole board runs in the browser.</b>
          </p>
          <div className="hero__actions">
            <Link href="/board" className="btn btn--gold">
              Launch the live board
            </Link>
            <Link href="/fixtures" className="btn btn--ghost">
              Fixtures &amp; results
            </Link>
          </div>
        </div>

        <div className="hero__shot">
          <div className="frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/previews/board.png"
              alt="The Yedok' Sport Cup broadcast board showing four fixtures and a live scoreplate."
              width={1600}
              height={900}
            />
            <div className="frame__cap">
              <b>Live</b> Matchday board <em>ULT 1 – 0</em>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="stat-strip">
          <div>
            <b>{String(TEAMS.length).padStart(2, '0')}</b>
            <span>Clubs</span>
          </div>
          <div>
            <b>{String(Object.keys(SIGNATURES).length).padStart(2, '0')}</b>
            <span>Goal signatures</span>
          </div>
          <div>
            <b>{String(FIXTURES.length).padStart(2, '0')}</b>
            <span>Fixtures</span>
          </div>
          <div>
            <b>0</b>
            <span>Servers needed</span>
          </div>
        </div>
      </div>

      <section className="container section">
        <SectionHead
          index="01 / Next up"
          title="The next kick-off"
          description="One match ahead on the calendar, and the last result to arrive before it."
        />

        <div className="card-grid card-grid--3">
          {upcoming ? (
            <div className="card" style={{ gridColumn: 'span 2' }}>
              <span className="card__tag">Matchday {upcoming.matchday}</span>
              <h3>
                {fixtureTeams(upcoming).home.name} v {fixtureTeams(upcoming).away.name}
              </h3>
              <p>
                {formatKickoff(upcoming.kickoff)} · {upcoming.venue}
              </p>
              <p className="row" style={{ gap: 8 }}>
                <span className="pill">Starts in {countdown(upcoming.kickoff)}</span>
                <span className="pill">{fixtureTeams(upcoming).home.nickname}</span>
                <span className="pill">{fixtureTeams(upcoming).away.nickname}</span>
              </p>
              <Link href="/fixtures" className="card__go">
                Full schedule
              </Link>
            </div>
          ) : null}

          {latest && latest.score ? (
            <div className="card">
              <span className="card__tag">Latest result</span>
              <h3>
                {latest.score[0]} – {latest.score[1]}
              </h3>
              <p>
                {fixtureTeams(latest).home.name} v {fixtureTeams(latest).away.name}
              </p>
              <p className="muted small">
                {formatKickoff(latest.kickoff)} · {latest.venue}
              </p>
              <Link href="/fixtures" className="card__go">
                All results
              </Link>
            </div>
          ) : null}
        </div>

        {upcoming ? (
          <div className="stack" style={{ marginTop: 16 }}>
            <MatchCard fixture={upcoming} />
          </div>
        ) : null}
      </section>

      <section className="container section">
        <SectionHead
          index="02 / Clubs"
          title="Four clubs, one cup"
          description="Each club owns a colour system, a crest and a goal signature that only belongs to them."
        />

        <div className="card-grid card-grid--4">
          {TEAMS.map((team) => (
            <TeamCard key={team.code} team={team} record={recordFor(team.code)} />
          ))}
        </div>
      </section>

      <section className="container section">
        <SectionHead
          index="03 / Signatures"
          title="Every goal looks different"
          description="Four motion systems: hard diagonal cuts for the Titans, pulses for Yedok, ribbons for Avernus, tiles for ISBA. Open the board to trigger them yourself."
        />

        <div className="sig-grid">
          {TEAMS.map((team) => (
            <Link
              key={team.code}
              href="/board"
              className="sig-card"
              style={{ '--sig-accent': team.colours.accent } as React.CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={team.crest} alt="" className="sig-card__crest" width={46} height={46} />
              <span className="sig-card__code">{team.code}</span>
              <span className="sig-card__name">{SIGNATURES[team.signature].name}</span>
              <span className="sig-card__motion">{SIGNATURES[team.signature].motion}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <SectionHead
          index="04 / Table"
          title="The standings"
          description="Derived from the results — no database, the numbers are computed by the app at request time."
        />
        <StandingsTable rows={table} />
      </section>

      <section className="container section">
        <SectionHead
          index="05 / From the system"
          title="Freeze frames"
          description="Stills pulled from the same board, one per signature."
        />
        <div className="gallery">
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/stills/ult.png" alt="Ultimate Titan Tiger Slash goal still" width={1600} height={900} />
            <figcaption>ULT · Tiger Slash</figcaption>
          </figure>
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/stills/yd.png" alt="Yedok FC City Pulse goal still" width={1600} height={900} />
            <figcaption>YD · City Pulse</figcaption>
          </figure>
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/stills/avr.png" alt="Avernus FC Red Tide goal still" width={1600} height={900} />
            <figcaption>AVR · Red Tide</figcaption>
          </figure>
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/stills/isb.png" alt="ISBA FC Tidal Shift goal still" width={1600} height={900} />
            <figcaption>ISB · Tidal Shift</figcaption>
          </figure>
        </div>
      </section>

      <section className="container section--tight" style={{ paddingBottom: 72 }}>
        <div className="panel row" style={{ justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginBottom: 6 }}>{TOURNAMENT.claim}</h3>
            <p className="muted small" style={{ margin: 0 }}>
              Trigger a goal, watch the takeover, reset the board. Your score is saved in this browser.
            </p>
          </div>
          <Link href="/board" className="btn btn--gold">
            Open the board
          </Link>
        </div>
      </section>
    </>
  );
}
