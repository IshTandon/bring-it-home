'use client';

import dynamic from 'next/dynamic';

function PlayerGridSkeleton() {
  return (
    <div>
      <div className="mb-4">
        <div className="h-3 w-20 skeleton rounded mb-1" />
        <div className="h-6 w-32 skeleton rounded mb-1" />
        <div className="h-3 w-48 skeleton rounded" />
      </div>
      <div className="h-10 skeleton rounded-xl mb-3" />
      <div className="flex gap-1.5 mb-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-8 w-16 skeleton rounded-full" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-dark-surface border border-dark-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full skeleton" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-32 skeleton rounded" />
              <div className="h-2.5 w-20 skeleton rounded" />
            </div>
            <div className="w-8 h-4 skeleton rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

const PlayerGrid = dynamic(() => import('@/components/players/PlayerGrid'), {
  loading: () => <PlayerGridSkeleton />,
  ssr: false,
});

export default function PlayersPage() {
  return <PlayerGrid />;
}
