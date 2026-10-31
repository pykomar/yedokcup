import type { Metadata } from 'next';
import { Anton, Barlow_Condensed, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const display = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const condensed = Barlow_Condensed({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cond',
  display: 'swap',
});

const mono = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://yedokcup.vercel.app'),
  title: {
    default: "Yedok' Sport Cup — Motion Scoreboard",
    template: "%s · Yedok' Sport Cup",
  },
  description:
    'The Yedok\u2019 Sport Cup: four clubs, four goal signatures, one broadcast board that runs live in the browser.',
  applicationName: "Yedok' Sport Cup",
  openGraph: {
    title: "Yedok' Sport Cup",
    description: 'Four clubs. Four goal signatures. One broadcast board.',
    type: 'website',
    locale: 'en_MY',
  },
  icons: { icon: '/logos/yedok.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${condensed.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
