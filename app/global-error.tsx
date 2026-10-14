'use client';

import React from 'react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-white text-zinc-900 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full text-center space-y-6 bg-zinc-50 p-8 sm:p-10 rounded-3xl border border-zinc-100 shadow-sm">
          <h1 className="text-2xl font-extrabold text-zinc-950">System Error</h1>
          <p className="text-xs text-zinc-500">An unexpected system error occurred.</p>
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 bg-brand-green text-white font-bold text-xs rounded-xl shadow-sm hover:bg-green-700"
          >
            Refresh System
          </button>
        </div>
      </body>
    </html>
  );
}
