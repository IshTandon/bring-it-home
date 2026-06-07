import Link from 'next/link';

const FEATURES = [
  { href: '/bracket',  icon: '🏆', title: 'Bracket simulator',     desc: 'Pick your winner through every round. Share your bracket with the world.' },
  { href: '/players',  icon: '⚽', title: 'Player cards',           desc: 'FIFA-style cards — pace, shooting, dribbling, form, heatmaps.' },
  { href: '/groups',   icon: '📊', title: '"If this happens..."',   desc: 'Toggle results and watch qualification odds shift in real time.' },
  { href: '/timeline', icon: '📖', title: 'The tournament story',   desc: 'Every matchday, told as a chapter. Upsets, heroes, moments.' },
  { href: '/wrapped',  icon: '🎁', title: 'Your WC Wrapped',        desc: 'Your predictions, your streak, your tournament. Share it.' },
];

export default function Home() {
  return (
    <div>
      <div className="mb-10 pt-4">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">
          FIFA World Cup 2026 · USA · Canada · Mexico
        </p>
        <h1 className="text-4xl font-semibold text-gray-900 mb-2 leading-tight">
          Bring It Home.
        </h1>
        <p className="text-xl text-gray-400 mb-6">
          Every team starts the tournament.<br />
          Only one nation brings it home.
        </p>
        <div className="flex gap-3">
          <Link href="/bracket" className="btn-primary">
            Build your bracket
          </Link>
          <Link href="/timeline" className="btn">
            Today&apos;s story
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {FEATURES.map(f => (
          <Link
            key={f.href}
            href={f.href}
            className="card hover:border-gray-200 hover:shadow-sm transition-all group cursor-pointer"
          >
            <div className="text-2xl mb-3">{f.icon}</div>
            <div className="font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {f.title}
            </div>
            <div className="text-sm text-gray-500 leading-relaxed">{f.desc}</div>
          </Link>
        ))}
      </div>

      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-widest text-blue-400 mb-1">Live now</div>
          <div className="text-sm text-blue-800">
            🇧🇷 Brazil 2–1 Germany 🇩🇪 · 67&apos; &nbsp;|&nbsp; 🇫🇷 France vs Argentina 🇦🇷 · kicks off 23:00
          </div>
        </div>
        <Link href="/bracket" className="text-xs text-blue-500 hover:text-blue-700 font-medium whitespace-nowrap ml-4">
          Update bracket →
        </Link>
      </div>
    </div>
  );
}
