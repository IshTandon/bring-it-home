'use client';

import dynamic from 'next/dynamic';

function GroupsSkeleton() {
  return (
    <div>
      <div className="mb-4">
        <div className="h-3 w-28 skeleton rounded mb-1" />
        <div className="h-6 w-40 skeleton rounded mb-1" />
        <div className="h-3 w-52 skeleton rounded" />
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-9 w-10 skeleton rounded-full shrink-0" />
        ))}
      </div>
      <div className="bg-dark-surface border border-dark-border rounded-xl p-4 space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-4 skeleton rounded" />
            <div className="w-6 h-6 rounded-full skeleton" />
            <div className="flex-1 h-3.5 skeleton rounded" />
            <div className="w-8 h-4 skeleton rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

const IfThisHappens = dynamic(() => import('@/components/groups/IfThisHappens'), {
  loading: () => <GroupsSkeleton />,
  ssr: false,
});

export default function GroupsPage() {
  return <IfThisHappens />;
}
