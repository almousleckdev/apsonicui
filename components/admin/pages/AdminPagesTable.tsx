'use client';

import React from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit2, Trash2, LayoutTemplate } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import type { CmsPageDto } from '@/lib/types/cms-page';

interface AdminPagesTableProps {
  loading: boolean;
  pages: CmsPageDto[];
  onToggleStatus: (page: CmsPageDto) => void;
  onDeleteRequest: (page: CmsPageDto) => void;
}

export const AdminPagesTable: React.FC<AdminPagesTableProps> = ({
  loading,
  pages,
  onToggleStatus,
  onDeleteRequest,
}) => {
  const columns: ColumnDef<CmsPageDto>[] = [
    {
      id: 'title',
      header: 'Page Title',
      cell: ({ row }) => {
        const item = row.original;
        const title = item.translations?.en?.title || item.slug;
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center shrink-0">
              <LayoutTemplate className="w-5 h-5 text-brand-green" />
            </div>
            <div>
              <p className="font-bold text-zinc-900">{title}</p>
              <p className="text-xs text-zinc-500 font-medium">/{item.slug}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const item = row.original;
        const isPublished = item.status === 'PUBLISHED';
        return (
          <span
            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
              isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {item.status}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            <Link
              href={`/en/admin/pages/${item.id}/preview`}
              target="_blank"
              className="p-2 text-zinc-500 hover:text-brand-green bg-zinc-50 hover:bg-brand-green/10 rounded-lg transition-colors"
              title="Preview Page"
            >
              <Eye className="w-4 h-4" />
            </Link>
            
            <button
              onClick={() => onToggleStatus(item)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                item.status === 'PUBLISHED'
                  ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                  : 'text-brand-green bg-brand-green/10 hover:bg-brand-green/20'
              }`}
            >
              {item.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
            </button>
            
            <Link
              href={`/en/admin/pages/${item.id}`}
              className="p-2 text-zinc-500 hover:text-brand-green bg-zinc-50 hover:bg-brand-green/10 rounded-lg transition-colors"
              title="Edit Page"
            >
              <Edit2 className="w-4 h-4" />
            </Link>

            <button
              onClick={() => onDeleteRequest(item)}
              className="p-2 text-zinc-500 hover:text-red-600 bg-zinc-50 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Page"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={pages} loading={loading} />;
};
