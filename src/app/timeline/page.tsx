'use client';

import dynamic from 'next/dynamic';

function TimelineSkeleton() {
  return (
    <div>
      <div className="mb-4">
        <div className="h-3 w-24 bg-gray-200 animate-pulse rounded mb-1" />
        <div className="h-6 w-44 bg-gray-200 animate-pulse rounded mb-1" />
        <div className="h-3 w-60 bg-gray-200 animate-pulse rounded" />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-9 w-16 bg-gray-200 animate-pulse rounded-full shrink-0" />
        ))}
      </div>
      <div className="space-y-3">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="h-3 w-20 bg-gray-200 animate-pulse rounded mb-2" />
          <div className="h-5 w-64 bg-gray-200 animate-pulse rounded mb-3" />
          <div className="space-y-1.5">
            <div className="h-3 w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-3 w-3/4 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
              <div className="h-5 w-12 bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
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
