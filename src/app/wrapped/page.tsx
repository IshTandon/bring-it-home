'use client';

import dynamic from 'next/dynamic';

const WCWrapped = dynamic(() => import('@/components/wrapped/WCWrapped'), { ssr: false });

export default function WrappedPage() {
  return <WCWrapped />;
}
