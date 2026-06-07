'use client';

import dynamic from 'next/dynamic';

function GloryIndexSkeleton() {
  return (
    <div>
      <div className="mb-4">
        <div className="h-3 w-24 bg-gray-200 animate-pulse rounded mb-1" />
        <div className="h-6 w-28 bg-gray-200 animate-pulse rounded mb-1" />
        <div className="h-3 w-48 bg-gray-200 animate-pulse rounded" />
      </div>
      <div className="flex gap-1.5 mb-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-9 w-28 bg-gray-200 animate-pulse rounded-full" />
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          <div className="h-3 w-20 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="divide-y divide-gray-50">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="w-7 h-4 bg-gray-200 animate-pulse rounded" />
              <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
              <div className="flex-1 h-3.5 bg-gray-200 animate-pulse rounded" />
              <div className="w-12 h-4 bg-gray-200 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const GloryIndex = dynamic(() => import('@/components/rankings/GloryIndex'), {
  loading: () => <GloryIndexSkeleton />,
  ssr: false,
});

export default function RankingsPage() {
  return <GloryIndex />;
}
