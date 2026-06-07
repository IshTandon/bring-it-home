'use client';

import dynamic from 'next/dynamic';

function BracketSkeleton() {
  return (
    <div>
      <div className="mb-4">
        <div className="h-3 w-24 bg-gray-200 animate-pulse rounded mb-1" />
        <div className="h-6 w-40 bg-gray-200 animate-pulse rounded mb-1" />
        <div className="h-3 w-56 bg-gray-200 animate-pulse rounded" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="h-3 w-20 bg-gray-200 animate-pulse rounded" />
              <div className="h-3 w-16 bg-gray-200 animate-pulse rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
              </div>
              <div className="h-6 w-8 bg-gray-200 animate-pulse rounded" />
            </div>
            <div className="border-t border-gray-100 my-2" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
              </div>
              <div className="h-6 w-8 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const BracketSimulator = dynamic(() => import('@/components/bracket/BracketSimulator'), {
  loading: () => <BracketSkeleton />,
  ssr: false,
});

export default function BracketPage() {
  return <BracketSimulator />;
}
