'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { History, Loader2, RotateCcw, X } from 'lucide-react';
import { pagesService } from '@/services/pages';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/lib/utils/errors';
import { sectionSummary } from '@/lib/page-builder/document';
import type { RevisionSummary, SectionDefinition } from '@/lib/page-builder/types';
import { T, TServer } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';

const KIND_TONE: Record<RevisionSummary['kind'], string> = {
  CREATE: 'bg-zinc-100 text-zinc-600',
  DRAFT: 'bg-amber-100 text-amber-800',
  PUBLISH: 'bg-brand-green/10 text-brand-green',
  ROLLBACK: 'bg-blue-100 text-blue-800',
  MIGRATION: 'bg-zinc-100 text-zinc-600',
  LEGACY: 'bg-zinc-100 text-zinc-500',
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
  const { t } = useAdminText();
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
      setProblem(getErrorMessage(e, t('history.restoreFailed')));
    } finally {
      setRestoring(null);
    }
  };

  return (
    <aside aria-label={t('history.title')} className="absolute inset-y-0 right-0 z-30 flex w-[380px] max-w-full flex-col border-l border-zinc-200 bg-white shadow-2xl">
      <div className="flex items-start justify-between border-b border-zinc-200 px-4 py-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-zinc-900"><History className="h-4 w-4 text-brand-green" aria-hidden /> <T id="history.title" /></h2>
          <p className="text-2xs text-zinc-500"><T id="history.hint" /></p>
        </div>
        <button type="button" onClick={onClose} aria-label={t('history.close')} className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800"><X className="h-4 w-4" /></button>
      </div>

      {problem && <p role="alert" className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{problem}</p>}

      <div className="flex-1 overflow-y-auto p-3">
        {isLoading && <p className="flex items-center justify-center gap-2 py-12 text-sm text-zinc-500" role="status"><Loader2 className="h-4 w-4 animate-spin" /> <T id="history.loading" /></p>}
        {isError && <p role="alert" className="py-12 text-center text-sm font-semibold text-red-600">{getErrorMessage(error, t('history.loadFailed'))}</p>}
        <ol className="space-y-2">
          {revisions?.map((r) => {
            const open = openNumber === r.number;
            const restorable = r.kind !== 'LEGACY';
            return (
              <li key={r.number} className={cn('rounded-xl border', open ? 'border-brand-green' : 'border-zinc-200')}>
                <button type="button" aria-expanded={open} onClick={() => setOpenNumber(open ? null : r.number)} className="flex w-full items-start gap-3 px-3 py-2.5 text-left">
                  <span className="mt-0.5 w-7 shrink-0 text-xs font-extrabold tabular-nums text-zinc-400">#{r.number}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className={cn('rounded-full px-2 py-0.5 text-3xs font-extrabold uppercase tracking-wider', KIND_TONE[r.kind])}><T id={`history.kind.${r.kind}`} /></span>
                      <span className="truncate text-2xs text-zinc-500">{when(r.savedAt)}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-2xs text-zinc-500">{r.createdBy ? t('history.by', { name: r.createdBy }) : ''}{r.note ? `${r.createdBy ? ' · ' : ''}${r.note}` : ''}</span>
                  </span>
                </button>
                {open && (
                  <div className="border-t border-zinc-100 px-3 pb-3 pt-2">
                    {detail.isLoading && <p className="py-3 text-xs text-zinc-500" role="status"><T id="history.loadingVersion" /></p>}
                    {detail.data && detail.data.number === r.number && (
                      detail.data.document.sections.length === 0
                        ? <p className="py-2 text-xs text-zinc-500"><T id="history.noSections" /></p>
                        : (
                          <ul className="space-y-1 py-1">
                            {detail.data.document.sections.map((s) => (
                              <li key={s.id} className="flex items-baseline gap-2 text-xs">
                                <span className={cn('font-bold', s.hidden ? 'text-zinc-400 line-through' : 'text-zinc-700')}><TServer text={definitions.get(s.type)?.label ?? s.type} /></span>
                                <span className="truncate text-zinc-400">{sectionSummary(s)}</span>
                              </li>
                            ))}
                          </ul>
                        )
                    )}
                    {restorable ? (
                      <button type="button" disabled={!canRestore || restoring !== null} onClick={() => restore(r.number)} title={canRestore ? undefined : restoreBlockedReason}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-brand-green px-3 py-1.5 text-xs font-extrabold text-white hover:bg-brand-green-hover disabled:cursor-not-allowed disabled:opacity-50">
                        {restoring === r.number ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" aria-hidden />} <T id="history.restore" />
                      </button>
                    ) : <p className="mt-2 text-2xs text-zinc-400"><T id="history.legacy" /></p>}
                    {!canRestore && restorable && restoreBlockedReason && <p className="mt-1 text-2xs text-zinc-400">{restoreBlockedReason}</p>}
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
