'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit2, Trash2, Calendar, Newspaper } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { useAuth } from '@/hooks/useAuth';
import { canDeleteCatalog } from '@/lib/utils/permissions';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';
import { newsLanguages } from '@/lib/news-languages';
import { LANGUAGE_NAMES, CONTENT_LANGS } from '@/lib/i18n/translation-copy';
import type { AdminKey } from '@/lib/i18n/admin/catalog';
import type { NewsItem } from '@/lib/types/news';

interface AdminNewsTableProps {
  loading: boolean;
  newsList: NewsItem[];
  onTogglePublish: (item: NewsItem) => void;
  onDeleteRequest: (item: NewsItem) => void;
}

const CATEGORY_KEYS: Record<string, AdminKey> = {
  Corporate: 'news.categories.Corporate',
  Events: 'news.categories.Events',
  'Product Launch': 'news.categories.Product Launch',
  CSR: 'news.categories.CSR',
};

export const AdminNewsTable: React.FC<AdminNewsTableProps> = ({
  loading,
  newsList,
  onTogglePublish,
  onDeleteRequest,
}) => {
  const { user } = useAuth();
  const { t } = useAdminText();
  const allowDelete = canDeleteCatalog(user);

  const columns: ColumnDef<NewsItem>[] = [
    {
      accessorKey: 'title',
      header: () => <T id="news.columns.title" />,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-12 rounded-xl bg-zinc-100 overflow-hidden flex-shrink-0 border border-zinc-100 flex items-center justify-center">
              {item.thumbnail ? (
                <Image src={item.thumbnail} alt={item.title} fill className="object-cover" sizes="64px" />
              ) : (
                <Newspaper className="w-5 h-5 text-zinc-300" />
              )}
            </div>
            <div className="space-y-0.5">
              <p className="font-bold text-zinc-900 line-clamp-1 max-w-sm">{item.title}</p>
              <div className="flex items-center gap-2 text-2xs text-zinc-400">
                <Calendar className="w-3 h-3 text-zinc-400" />
                <span>{item.date || <T id="news.draftDate" />}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'category',
      header: () => <T id="news.columns.category" />,
      cell: ({ row }) => (
        <span className="px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-full font-bold text-3xs">
          {row.original.category in CATEGORY_KEYS ? <T id={CATEGORY_KEYS[row.original.category]} /> : row.original.category}
        </span>
      ),
    },
    {
      accessorKey: 'authorName',
      header: () => <T id="news.columns.author" />,
      cell: ({ row }) => {
        const author = row.original.authorName || t('news.editor');
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-bold text-3xs">
              {author.charAt(0).toUpperCase()}
            </div>
            <span className="text-zinc-700 font-semibold">{author}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'viewsCount',
      header: () => <T id="news.columns.views" />,
      cell: ({ row }) => <span className="font-mono text-zinc-600">{row.original.viewsCount?.toLocaleString() || 0}</span>,
    },
    {
      accessorKey: 'published',
      header: () => <T id="news.columns.status" />,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <button
            type="button"
            onClick={() => onTogglePublish(item)}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <span className={`w-2 h-2 rounded-full ${item.published ? 'bg-brand-green' : 'bg-amber-400'}`} />
            <span className={`font-bold ${item.published ? 'text-brand-green' : 'text-amber-600'}`}>
              <T id={item.published ? 'common.published' : 'common.draft'} />
            </span>
          </button>
        );
      },
    },
    {
      id: 'languages',
      header: () => <T id="news.columns.languages" />,
      cell: ({ row }) => {
        const written = newsLanguages(row.original);
        const names = CONTENT_LANGS.filter((l) => written[l]).map((l) => LANGUAGE_NAMES[l]).join(', ');
        return (
          <div className="flex items-center gap-1" title={t('news.translated', { languages: names || '—' })}>
            {CONTENT_LANGS.map((l) => (
              <span key={l} className={`rounded px-1.5 py-0.5 text-3xs font-extrabold ${written[l] ? 'bg-brand-green/10 text-brand-green' : 'bg-zinc-100 text-zinc-300'}`}>{l === 'zh' ? '中' : l.toUpperCase()}</span>
            ))}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right"><T id="news.columns.actions" /></div>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center justify-end gap-1.5">
            <Link
              href={`/news/${item.slug || item.id}`}
              target="_blank"
              className="p-2 hover:bg-zinc-100 text-zinc-600 rounded-xl transition-colors"
              title={t('news.viewArticle')}
            >
              <Eye className="w-4 h-4" />
            </Link>
            <Link
              href={`/admin/news/${item.id}/edit`}
              className="p-2 hover:bg-zinc-100 text-zinc-600 rounded-xl transition-colors"
              title={t('news.editArticle')}
            >
              <Edit2 className="w-4 h-4" />
            </Link>
            {allowDelete && (
              <button
                type="button"
                onClick={() => onDeleteRequest(item)}
                className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors cursor-pointer"
                title={t('news.deleteArticle')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={newsList}
      loading={loading}
      emptyTitle={<T id="news.emptyTitle" />}
      emptyDescription={<T id="news.emptyText" />}
      emptyIcon={Newspaper}
    />
  );
};
