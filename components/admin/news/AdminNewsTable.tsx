'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit2, Trash2, Calendar, Newspaper } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { useAuth } from '@/hooks/useAuth';
import { canDeleteCatalog } from '@/lib/utils/permissions';
import type { NewsItem } from '@/lib/types/news';

interface AdminNewsTableProps {
  loading: boolean;
  newsList: NewsItem[];
  onTogglePublish: (item: NewsItem) => void;
  onDeleteRequest: (item: NewsItem) => void;
}

export const AdminNewsTable: React.FC<AdminNewsTableProps> = ({
  loading,
  newsList,
  onTogglePublish,
  onDeleteRequest,
}) => {
  const { user } = useAuth();
  const allowDelete = canDeleteCatalog(user);

  const columns: ColumnDef<NewsItem>[] = [
    {
      accessorKey: 'title',
      header: 'Article Title',
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
              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                <Calendar className="w-3 h-3 text-zinc-400" />
                <span>{item.date || 'Draft'}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className="px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-full font-bold text-[10px] uppercase">
          {row.original.category}
        </span>
      ),
    },
    {
      accessorKey: 'authorName',
      header: 'Author',
      cell: ({ row }) => {
        const author = row.original.authorName || 'Editor';
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-bold text-[10px]">
              {author.charAt(0).toUpperCase()}
            </div>
            <span className="text-zinc-700 font-semibold">{author}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'viewsCount',
      header: 'Views',
      cell: ({ row }) => <span className="font-mono text-zinc-600">{row.original.viewsCount?.toLocaleString() || 0}</span>,
    },
    {
      accessorKey: 'published',
      header: 'Status',
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
              {item.published ? 'Published' : 'Draft'}
            </span>
          </button>
        );
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center justify-end gap-1.5">
            <Link
              href={`/news/${item.slug || item.id}`}
              target="_blank"
              className="p-2 hover:bg-zinc-100 text-zinc-600 rounded-xl transition-colors"
              title="View Article"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <Link
              href={`/admin/news/${item.id}/edit`}
              className="p-2 hover:bg-zinc-100 text-zinc-600 rounded-xl transition-colors"
              title="Edit Article"
            >
              <Edit2 className="w-4 h-4" />
            </Link>
            {allowDelete && (
              <button
                type="button"
                onClick={() => onDeleteRequest(item)}
                className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors cursor-pointer"
                title="Delete Article"
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
      emptyTitle="No News Articles Found"
      emptyDescription="Publish your first brand story, product launch, or press release."
      emptyIcon={Newspaper}
    />
  );
};
