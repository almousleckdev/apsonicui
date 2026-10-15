'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { EditorShell } from '@/components/page-builder/editor/EditorShell';
import { ApiError } from '@/services/api-client';
import { pagesService } from '@/services/pages';
import type { PageDetail } from '@/lib/page-builder/types';

type State = { kind: 'loading' } | { kind: 'ready'; page: PageDetail } | { kind: 'error'; status: number; message: string };

export default function PageEditorRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const numeric = Number(id);
  const invalid = !Number.isInteger(numeric) || numeric <= 0;
  const [fetched, setState] = useState<State>({ kind: 'loading' });
  const state: State = invalid ? { kind: 'error', status: 404, message: 'This page does not exist.' } : fetched;

  useEffect(() => {
    if (invalid) return;
    let cancelled = false;
    pagesService.get(numeric)
      .then((page) => { if (!cancelled) setState({ kind: 'ready', page }); })
      .catch((e) => {
        if (cancelled) return;
        const status = e instanceof ApiError ? e.status : 0;
        setState({ kind: 'error', status, message: status === 404 ? 'This page does not exist (or was deleted).' : status === 403 ? 'You do not have permission to edit pages.' : 'The page could not be loaded. Check your connection and try again.' });
      });
    return () => { cancelled = true; };
  }, [numeric, invalid]);

  if (state.kind === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" role="status">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" aria-label="Loading the editor" />
      </div>
    );
  }
  if (state.kind === 'error') {
    return (
      <div className="mx-auto max-w-md py-24 text-center font-sans">
        <p className="text-lg font-extrabold text-zinc-900">{state.message}</p>
        <Link href="/admin/pages" className="mt-4 inline-block rounded-lg bg-brand-green px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-green-hover">Back to pages</Link>
      </div>
    );
  }
  return <EditorShell initial={state.page} />;
}
