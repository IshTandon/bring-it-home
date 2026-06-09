'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[GlobalErrorBoundary]', error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body
        className="min-h-screen text-white"
        style={{ background: 'linear-gradient(160deg, #0a0e1a 0%, #0d1b2a 60%, #1a0a00 100%)' }}
      >
        <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <span className="text-7xl mb-5">🏆</span>
          <h1 className="text-2xl font-semibold text-white mb-2">Something went wrong</h1>
          <p className="text-sm text-gray-400 mb-8 max-w-sm leading-relaxed">
            We hit an unexpected error. Give it another shot — the beautiful game must go on.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-[#185FA5] hover:bg-[#1a6fbf] text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors active:scale-95"
          >
            Reload page
          </button>
        </div>
      </body>
    </html>
  );
}
