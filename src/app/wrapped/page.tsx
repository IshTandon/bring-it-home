'use client';

import dynamic from 'next/dynamic';

function WrappedSkeleton() {
  return (
    <div>
      <div className="mb-4">
        <div className="h-3 w-24 skeleton rounded mb-1" />
        <div className="h-6 w-36 skeleton rounded mb-1" />
        <div className="h-3 w-48 skeleton rounded" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-dark-surface border border-dark-border rounded-xl p-5 h-32 skeleton" />
        ))}
      </div>
    </div>
  );
}

const WCWrapped = dynamic(() => import('@/components/wrapped/WCWrapped'), {
  loading: () => <WrappedSkeleton />,
  ssr: false,
});

export default function WrappedPage() {
  return <WCWrapped />;
}
