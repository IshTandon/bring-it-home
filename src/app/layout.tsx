import type { Metadata, Viewport } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: "Who's Gonna Bring It Home?",
  description: 'Every team starts the tournament. Only one nation brings it home.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-180x180.png', sizes: '180x180', type: 'image/png' },
      { url: '/icon-167x167.png', sizes: '167x167', type: 'image/png' },
      { url: '/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icon-120x120.png', sizes: '120x120', type: 'image/png' },
    ],
    other: [
      { rel: 'apple-touch-icon', url: '/icon-180x180.png' },
    ],
  },
  openGraph: {
    title: "Who's Gonna Bring It Home?",
    description: 'Every team starts the tournament. Only one nation brings it home.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Who's Gonna Bring It Home?",
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#0A1628',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-dark-bg text-dark-text-primary min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
