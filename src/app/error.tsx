'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary]', error);
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <span className="text-6xl mb-4">🏆</span>
      <h1 className="text-xl font-semibold text-white mb-2">Something went wrong</h1>
      <p className="text-sm text-gray-400 mb-8 max-w-xs leading-relaxed">
        We hit an unexpected error. Give it another shot — the beautiful game must go on.
      </p>
      <button
        type="button"
        onClick={reset}
        className="bg-[#185FA5] hover:bg-[#1a6fbf] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors active:scale-95"
      >
        Try again
      </button>
    </div>
  );
}
