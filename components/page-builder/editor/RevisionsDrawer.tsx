'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { History, Loader2, RotateCcw, X } from 'lucide-react';
import { pagesService } from '@/services/pages';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/lib/utils/errors';
import { sectionSummary } from '@/lib/page-builder/document';
import type { RevisionSummary, SectionDefinition } from '@/lib/page-builder/types';

const KIND_LABEL: Record<RevisionSummary['kind'], { text: string; tone: string }> = {
  CREATE: { text: 'Created', tone: 'bg-zinc-100 text-zinc-600' },
  DRAFT: { text: 'Draft saved', tone: 'bg-amber-100 text-amber-800' },
  PUBLISH: { text: 'Published', tone: 'bg-brand-green/10 text-brand-green' },
  ROLLBACK: { text: 'Restored', tone: 'bg-blue-100 text-blue-800' },
  MIGRATION: { text: 'Converted', tone: 'bg-zinc-100 text-zinc-600' },
  LEGACY: { text: 'Old editor', tone: 'bg-zinc-100 text-zinc-500' },
};

const when = (iso: string) => new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));

interface Props {
  pageId: number;
  definitions: Map<string, SectionDefinition>;
  canRestore: boolean;
  restoreBlockedReason?: string;
  /** Restores a revision into the draft; resolves when done. */
  onRestore: (number: number) => Promise<void>;
  onClose: () => void;
}

/** The page's history, newest first. Looking at a version never changes anything; restoring replaces the draft only. */
export function RevisionsDrawer({ pageId, definitions, canRestore, restoreBlockedReason, onRestore, onClose }: Props) {
  const { data: revisions, isLoading, isError, error } = useQuery({ queryKey: ['page-revisions', pageId], queryFn: () => pagesService.revisions(pageId), staleTime: 0 });
  const [openNumber, setOpenNumber] = useState<number | null>(null);
  const [restoring, setRestoring] = useState<number | null>(null);
  const [problem, setProblem] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['page-revision', pageId, openNumber],
    queryFn: () => pagesService.revision(pageId, openNumber!),
    enabled: openNumber !== null,
  });

  const restore = async (n: number) => {
    setRestoring(n);
    setProblem(null);
    try {
      await onRestore(n);
    } catch (e) {
      setProblem(getErrorMessage(e, 'Could not restore this version.'));
    } finally {
      setRestoring(null);
    }
  };

  return (
    <aside aria-label="Version history" className="absolute inset-y-0 right-0 z-30 flex w-[380px] max-w-full flex-col border-l border-zinc-200 bg-white shadow-2xl">
      <div className="flex items-start justify-between border-b border-zinc-200 px-4 py-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-zinc-900"><History className="h-4 w-4 text-brand-green" aria-hidden /> Version history</h2>
          <p className="text-[11px] text-zinc-500">Restoring a version changes your draft only. Nothing goes live until you publish.</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close version history" className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800"><X className="h-4 w-4" /></button>
      </div>

      {problem && <p role="alert" className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{problem}</p>}

      <div className="flex-1 overflow-y-auto p-3">
        {isLoading && <p className="flex items-center justify-center gap-2 py-12 text-sm text-zinc-500" role="status"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p>}
        {isError && <p role="alert" className="py-12 text-center text-sm font-semibold text-red-600">{getErrorMessage(error, 'The history could not be loaded.')}</p>}
        <ol className="space-y-2">
          {revisions?.map((r) => {
            const open = openNumber === r.number;
            const kind = KIND_LABEL[r.kind];
            const restorable = r.kind !== 'LEGACY';
            return (
              <li key={r.number} className={cn('rounded-xl border', open ? 'border-brand-green' : 'border-zinc-200')}>
                <button type="button" aria-expanded={open} onClick={() => setOpenNumber(open ? null : r.number)} className="flex w-full items-start gap-3 px-3 py-2.5 text-left">
                  <span className="mt-0.5 w-7 shrink-0 text-xs font-extrabold tabular-nums text-zinc-400">#{r.number}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider', kind.tone)}>{kind.text}</span>
                      <span className="truncate text-[11px] text-zinc-500">{when(r.savedAt)}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-zinc-500">{r.createdBy ? `by ${r.createdBy}` : ''}{r.note ? `${r.createdBy ? ' · ' : ''}${r.note}` : ''}</span>
                  </span>
                </button>
                {open && (
                  <div className="border-t border-zinc-100 px-3 pb-3 pt-2">
                    {detail.isLoading && <p className="py-3 text-xs text-zinc-500" role="status">Loading this version…</p>}
                    {detail.data && detail.data.number === r.number && (
                      detail.data.document.sections.length === 0
                        ? <p className="py-2 text-xs text-zinc-500">No sections in this version.</p>
                        : (
                          <ul className="space-y-1 py-1">
                            {detail.data.document.sections.map((s) => (
                              <li key={s.id} className="flex items-baseline gap-2 text-xs">
                                <span className={cn('font-bold', s.hidden ? 'text-zinc-400 line-through' : 'text-zinc-700')}>{definitions.get(s.type)?.label ?? s.type}</span>
                                <span className="truncate text-zinc-400">{sectionSummary(s)}</span>
                              </li>
                            ))}
                          </ul>
                        )
                    )}
                    {restorable ? (
                      <button type="button" disabled={!canRestore || restoring !== null} onClick={() => restore(r.number)} title={canRestore ? undefined : restoreBlockedReason}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-brand-green px-3 py-1.5 text-xs font-extrabold text-white hover:bg-brand-green-hover disabled:cursor-not-allowed disabled:opacity-50">
                        {restoring === r.number ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" aria-hidden />} Restore to draft
                      </button>
                    ) : <p className="mt-2 text-[11px] text-zinc-400">Saved by the previous page editor; it cannot be restored.</p>}
                    {!canRestore && restorable && restoreBlockedReason && <p className="mt-1 text-[11px] text-zinc-400">{restoreBlockedReason}</p>}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}
