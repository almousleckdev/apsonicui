'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Archive, ArchiveRestore, Copy, ExternalLink, FileText, Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { ActionModal } from '@/components/admin/ActionModal';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';
import { pagesService } from '@/services/pages';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/lib/utils/errors';
import type { PageStatus, PageSummary } from '@/lib/page-builder/types';

type Tab = 'ACTIVE' | PageStatus;
const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'ACTIVE', label: 'All pages' },
  { id: 'DRAFT', label: 'Drafts' },
  { id: 'PUBLISHED', label: 'Published' },
  { id: 'ARCHIVED', label: 'Archived' },
];
const STATUS_STYLES: Record<PageStatus, string> = {
  DRAFT: 'bg-amber-100 text-amber-800',
  PUBLISHED: 'bg-brand-green/10 text-brand-green',
  ARCHIVED: 'bg-zinc-200 text-zinc-600',
};
const PAGE_SIZE = 15;

type Pending = { kind: 'archive' | 'delete'; page: PageSummary } | null;

const formatDate = (iso?: string) => (iso ? new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso)) : '');

export function PagesList() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const can = (permission: string) => !!user?.permissions?.includes(permission);

  const [tab, setTab] = useState<Tab>('ACTIVE');
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [pending, setPending] = useState<Pending>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => { setDebounced(search.trim()); setPageNumber(0); }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const query = useQuery({
    queryKey: ['admin-pages', tab, debounced, pageNumber],
    queryFn: () => pagesService.list({ status: tab === 'ACTIVE' ? undefined : tab, q: debounced || undefined, page: pageNumber, size: PAGE_SIZE }),
    placeholderData: (previous) => previous,
  });
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin-pages'] });
  const rows = query.data?.content ?? [];

  const run = async (action: () => Promise<unknown>, success: string) => {
    try {
      await action();
      toast.success(success);
      await refresh();
    } catch (e) {
      toast.error(getErrorMessage(e, 'That did not work.'));
    }
  };

  const confirm = async () => {
    if (!pending) return;
    setBusy(true);
    const { kind, page } = pending;
    await run(() => (kind === 'archive' ? pagesService.archive(page.id, page.version) : pagesService.remove(page.id)), kind === 'archive' ? 'Page archived.' : 'Page deleted.');
    setBusy(false);
    setPending(null);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5 font-sans">
      <AdminPageHeader
        title="Pages" subtitle="Create and manage the pages of the website. Changes stay private until you publish them."
        actionLabel={can('WRITE_PAGES') ? 'New page' : undefined} actionHref="/admin/pages/new" actionIcon={Plus}
        onRefresh={() => { void refresh(); }} isRefreshing={query.isFetching}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Filter pages" className="inline-flex self-start rounded-xl bg-zinc-100 p-0.5">
          {TABS.map((t) => (
            <button key={t.id} role="tab" type="button" aria-selected={tab === t.id} onClick={() => { setTab(t.id); setPageNumber(0); }}
              className={cn('rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors', tab === t.id ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800')}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or address" aria-label="Search pages"
            className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20" />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        {query.isLoading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-sm font-medium text-zinc-500" role="status"><Loader2 className="h-5 w-5 animate-spin" /> Loading pages…</div>
        ) : query.isError ? (
          <div className="py-20 text-center text-sm font-semibold text-red-600" role="alert">{getErrorMessage(query.error, 'The pages could not be loaded.')}</div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400"><FileText className="h-6 w-6" aria-hidden /></span>
            <p className="text-sm font-extrabold text-zinc-800">{debounced ? 'No page matches your search' : tab === 'ARCHIVED' ? 'No archived pages' : 'No pages yet'}</p>
            {!debounced && tab !== 'ARCHIVED' && can('WRITE_PAGES') && (
              <Link href="/admin/pages/new" className="rounded-lg bg-brand-green px-4 py-2 text-xs font-extrabold text-white hover:bg-brand-green-hover">Create your first page</Link>
            )}
          </div>
        ) : (
          <table className="w-full text-left">
            <caption className="sr-only">Pages</caption>
            <thead className="border-b border-zinc-100 bg-zinc-50/70 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
              <tr>
                <th scope="col" className="px-5 py-3">Page</th>
                <th scope="col" className="hidden px-3 py-3 sm:table-cell">Status</th>
                <th scope="col" className="hidden px-3 py-3 md:table-cell">Last edited</th>
                <th scope="col" className="px-5 py-3 text-right"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {rows.map((page) => (
                <tr key={page.id} className="hover:bg-zinc-50/60">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/pages/${page.id}`} className="block text-sm font-extrabold text-zinc-900 hover:text-brand-green">{page.title}</Link>
                    <span className="text-xs text-zinc-500">/{page.slug}</span>
                  </td>
                  <td className="hidden px-3 py-3.5 sm:table-cell">
                    <span className={cn('inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider', STATUS_STYLES[page.status])}>{page.status}</span>
                    {page.hasUnpublishedChanges && <span className="mt-1 block text-[11px] font-semibold text-amber-700">Changes not live</span>}
                  </td>
                  <td className="hidden px-3 py-3.5 text-xs text-zinc-500 md:table-cell">
                    {formatDate(page.updatedAt)}
                    {page.updatedBy && <span className="block text-zinc-400">by {page.updatedBy}</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-0.5">
                      {page.status !== 'ARCHIVED' && <RowAction label="Edit page" onClick={() => router.push(`/admin/pages/${page.id}`)}><Pencil className="h-4 w-4" /></RowAction>}
                      {page.status === 'PUBLISHED' && (
                        <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" aria-label="View the live page" title="View the live page"
                          className="rounded-md p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800"><ExternalLink className="h-4 w-4" /></a>
                      )}
                      {can('WRITE_PAGES') && page.status !== 'ARCHIVED' && (
                        <RowAction label="Duplicate page" onClick={() => run(async () => { const copy = await pagesService.duplicate(page.id); router.push(`/admin/pages/${copy.id}`); }, 'Page duplicated.')}><Copy className="h-4 w-4" /></RowAction>
                      )}
                      {page.status === 'ARCHIVED' ? (
                        <>
                          {can('RESTORE_PAGES') && <RowAction label="Restore page" onClick={() => run(() => pagesService.restore(page.id, page.version), 'Page restored as a draft.')}><ArchiveRestore className="h-4 w-4" /></RowAction>}
                          {can('DELETE_PAGES') && <RowAction label="Delete page" danger onClick={() => setPending({ kind: 'delete', page })}><Trash2 className="h-4 w-4" /></RowAction>}
                        </>
                      ) : (
                        can('DELETE_PAGES') && <RowAction label="Archive page" danger onClick={() => setPending({ kind: 'archive', page })}><Archive className="h-4 w-4" /></RowAction>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {query.data && query.data.totalPages > 1 && (
        <nav aria-label="Pagination" className="flex items-center justify-between text-xs font-semibold text-zinc-500">
          <span>Page {query.data.pageNumber + 1} of {query.data.totalPages} · {query.data.totalElements} pages</span>
          <span className="flex gap-2">
            <button type="button" disabled={query.data.first} onClick={() => setPageNumber((p) => Math.max(0, p - 1))} className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 hover:bg-zinc-50 disabled:opacity-40">Previous</button>
            <button type="button" disabled={query.data.last} onClick={() => setPageNumber((p) => p + 1)} className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 hover:bg-zinc-50 disabled:opacity-40">Next</button>
          </span>
        </nav>
      )}

      <ActionModal
        isOpen={pending !== null} onClose={() => setPending(null)} onConfirm={confirm} isLoading={busy} variant="danger"
        title={pending?.kind === 'delete' ? 'Delete this page?' : 'Archive this page?'}
        description={pending?.kind === 'delete'
          ? `“${pending?.page.title}” will be removed from the list. Its web address stays reserved so no one can reuse an old link.`
          : `“${pending?.page.title}” will be taken offline and become read-only. You can restore it later.`}
        confirmLabel={pending?.kind === 'delete' ? 'Delete' : 'Archive'}
      />
    </div>
  );
}

function RowAction({ label, onClick, danger, children }: { label: string; onClick: () => void; danger?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick}
      className={cn('rounded-md p-2 text-zinc-400 transition-colors', danger ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-zinc-100 hover:text-zinc-800')}>
      {children}
    </button>
  );
}
