'use client';

import dynamic from 'next/dynamic';

function TimelineSkeleton() {
  return (
    <div>
      <div className="mb-4">
        <div className="h-3 w-24 skeleton rounded mb-1" />
        <div className="h-6 w-44 skeleton rounded mb-1" />
        <div className="h-3 w-60 skeleton rounded" />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-9 w-16 skeleton rounded-full shrink-0" />
        ))}
      </div>
      <div className="space-y-3">
        <div className="bg-dark-accent/10 border border-dark-accent/30 rounded-xl p-5">
          <div className="h-3 w-20 skeleton rounded mb-2" />
          <div className="h-5 w-64 skeleton rounded mb-3" />
          <div className="space-y-1.5">
            <div className="h-3 w-full skeleton rounded" />
            <div className="h-3 w-3/4 skeleton rounded" />
          </div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4 space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 w-24 skeleton rounded" />
              <div className="h-5 w-12 skeleton rounded" />
              <div className="h-4 w-24 skeleton rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const TournamentTimeline = dynamic(() => import('@/components/timeline/TournamentTimeline'), {
  loading: () => <TimelineSkeleton />,
  ssr: false,
});

export default function TimelinePage() {
  return <TournamentTimeline />;
}
