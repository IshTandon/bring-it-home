'use client';

import dynamic from 'next/dynamic';

function GloryIndexSkeleton() {
  return (
    <div>
      <div className="mb-4">
        <div className="h-3 w-40 skeleton rounded mb-1" />
        <div className="h-6 w-28 skeleton rounded mb-1" />
        <div className="h-4 w-56 skeleton rounded" />
      </div>
      <div className="rounded-xl bg-dark-accent/10 border border-dark-accent/30 mb-4 h-10" />
      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-dark-border/30 border-b border-dark-border">
          <div className="h-3 w-20 skeleton rounded" />
        </div>
        <div className="divide-y divide-dark-border/50">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 h-[52px]">
              <div className="w-8 h-4 skeleton rounded" />
              <div className="w-5 h-5 rounded-full skeleton" />
              <div className="flex-1 h-3.5 skeleton rounded" />
              <div className="w-16 h-5 skeleton rounded-full" />
              <div className="w-8 h-5 skeleton rounded-full" />
              <div className="w-12 h-4 skeleton rounded" />
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
