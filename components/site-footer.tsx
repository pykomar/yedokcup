import Link from 'next/link';
import { TEAMS, TOURNAMENT } from '@/lib/data';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <p className="site-footer__brand">
            {TOURNAMENT.title}
            <span>{TOURNAMENT.tagline}</span>
          </p>
          <p className="site-footer__note">
            Concept and motion study using the supplied club crests. Club marks and trademarks remain the property of
            their respective owners; this is not an official league or club broadcast.
          </p>
        </div>

        <div className="site-footer__links">
          <Link href="/fixtures">Fixtures</Link>
          {TEAMS.map((team) => (
            <Link key={team.slug} href={`/teams/${team.slug}`}>
              {team.code} · {team.name}
            </Link>
          ))}
        </div>

        <div className="site-footer__meta">
          <span>Built with Next.js</span>
          <span>State lives in your browser</span>
          <span>{TOURNAMENT.taglineAccent}</span>
        </div>
      </div>
    </footer>
  );
}
