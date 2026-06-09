'use client';

import dynamic from 'next/dynamic';

function BracketSkeleton() {
  return (
    <div>
      <div className="mb-4">
        <div className="h-3 w-24 skeleton rounded mb-1" />
        <div className="h-6 w-40 skeleton rounded mb-1" />
        <div className="h-3 w-56 skeleton rounded" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-dark-surface border border-dark-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="h-3 w-20 skeleton rounded" />
              <div className="h-3 w-16 skeleton rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full skeleton" />
                <div className="h-4 w-24 skeleton rounded" />
              </div>
              <div className="h-6 w-8 skeleton rounded" />
            </div>
            <div className="border-t border-dark-border my-2" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full skeleton" />
                <div className="h-4 w-24 skeleton rounded" />
              </div>
              <div className="h-6 w-8 skeleton rounded" />
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
