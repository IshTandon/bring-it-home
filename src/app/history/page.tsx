'use client';

import dynamic from 'next/dynamic';

function HistorySkeleton() {
  return (
    <div>
      <div className="mb-4">
        <div className="h-3 w-24 skeleton rounded mb-1" />
        <div className="h-6 w-40 skeleton rounded mb-1" />
        <div className="h-3 w-52 skeleton rounded" />
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-9 w-16 skeleton rounded-full shrink-0" />
        ))}
      </div>
      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-dark-border/30 border-b border-dark-border">
          <div className="h-3 w-28 skeleton rounded" />
        </div>
        <div className="divide-y divide-dark-border/50">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-4 skeleton rounded" />
              <div className="w-6 h-6 rounded-full skeleton" />
              <div className="flex-1 h-3.5 skeleton rounded" />
              <div className="w-12 h-4 skeleton rounded" />
              <div className="w-6 h-6 rounded-full skeleton" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const HistoricalData = dynamic(() => import('@/components/history/HistoricalData'), {
  loading: () => <HistorySkeleton />,
  ssr: false,
});

export default function HistoryPage() {
  return <HistoricalData />;
}
