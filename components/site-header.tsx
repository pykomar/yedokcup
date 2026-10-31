import Link from 'next/link';
import { TOURNAMENT } from '@/lib/data';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/fixtures', label: 'Fixtures' },
  { href: '/teams', label: 'Teams' },
];

function Mark() {
  return (
    <svg className="site-header__mark" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeOpacity=".55" strokeWidth="1.4" />
      <circle cx="24" cy="24" r="15.5" fill="none" stroke="currentColor" strokeOpacity=".22" strokeWidth="1" />
      <path
        d="M24 9.5 27.6 18.4 37 19.2l-7.1 6.2 2.1 9.1L24 29.8l-8 4.7 2.1-9.1L11 19.2l9.4-.8z"
        fill="currentColor"
        fillOpacity=".92"
      />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <Link href="/" className="site-header__brand">
          <Mark />
          <span>
            <span className="site-header__title">{TOURNAMENT.title}</span>
            <span className="site-header__sub">Motion scoreboard · {TOURNAMENT.season}</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="site-nav__link">
              {item.label}
            </Link>
          ))}
          <Link href="/board" className="btn btn--gold site-nav__cta">
            Live board
          </Link>
        </nav>
      </div>
    </header>
  );
}
