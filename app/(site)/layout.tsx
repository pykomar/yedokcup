import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import './site.css';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="site-main">{children}</main>
      <SiteFooter />
    </>
  );
}
