'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, AlertCircle } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled UI error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-6 bg-zinc-50 p-8 sm:p-10 rounded-3xl border border-zinc-100 shadow-sm">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">
            Something went wrong
          </h1>
          <p className="text-xs text-zinc-500 leading-relaxed">
            We encountered an unexpected error, but don&apos;t worry. Your data is safe.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-brand-green text-white font-bold text-xs rounded-xl shadow-sm hover:bg-green-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link href="/">
            <button className="px-5 py-2.5 bg-white border border-zinc-200 text-zinc-700 font-bold text-xs rounded-xl hover:bg-zinc-100 transition-all flex items-center gap-2 cursor-pointer">
              <Home className="w-4 h-4" />
              <span>Back Home</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
