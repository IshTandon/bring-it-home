import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bring It Home',
  description: 'Every team starts the tournament. Only one nation brings it home.',
  openGraph: {
    title: 'Bring It Home',
    description: 'Every team starts the tournament. Only one nation brings it home.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex flex-col leading-tight">
                <span className="text-base font-semibold tracking-tight text-gray-900">Bring It Home</span>
                <span className="text-[10px] text-gray-400 tracking-widest uppercase">FIFA World Cup 2026</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[
                { href: '/',         label: 'Home' },
                { href: '/bracket',  label: 'Bracket' },
                { href: '/players',  label: 'Players' },
                { href: '/groups',   label: 'Groups' },
                { href: '/timeline', label: 'Timeline' },
                { href: '/wrapped',  label: 'Wrapped' },
              ].map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
