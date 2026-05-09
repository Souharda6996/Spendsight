import type { Metadata } from 'next';
import './globals.css';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://spendsight.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'SpendSight — Stop Overpaying for AI Tools',
    template: '%s | SpendSight',
  },
  description:
    'Free 60-second AI spend audit for startup engineering teams. Input your subscriptions, get an instant breakdown of overspend, and a shareable report.',
  keywords: ['AI spend audit', 'reduce AI costs', 'cursor pricing', 'claude vs chatgpt', 'github copilot cost'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'SpendSight',
    title: 'SpendSight — Stop Overpaying for AI Tools',
    description:
      'Free 60-second AI spend audit for startup engineering teams. Input your subscriptions, get an instant breakdown of overspend.',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpendSight — Stop Overpaying for AI Tools',
    description:
      'Free 60-second AI spend audit. See exactly where your team is leaving money on the table.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
