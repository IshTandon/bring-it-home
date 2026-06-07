import type { Metadata, Viewport } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Bring It Home — FIFA World Cup 2026',
  description: 'Every team starts the tournament. Only one nation brings it home. Build your bracket, track every group, scout every player.',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Bring It Home — FIFA World Cup 2026',
    description: 'Every team starts the tournament. Only one nation brings it home.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
