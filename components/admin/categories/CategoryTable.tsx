'use client';

import React from 'react';
import Image from 'next/image';
import { ColumnDef } from '@tanstack/react-table';
import { Layers, CheckCircle2, XCircle, Edit2, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { useAuth } from '@/hooks/useAuth';
import { canDeleteCatalog } from '@/lib/utils/permissions';
import { CategoryItem } from '@/services/category';

interface CategoryTableProps {
  categories: CategoryItem[];
  loading?: boolean;
  onToggleActive: (id: number | string, current: boolean) => void;
  onEdit: (cat: CategoryItem) => void;
  onDelete: (id: number | string) => void;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  loading = false,
  onToggleActive,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();
  const allowDelete = canDeleteCatalog(user);

  const columns: ColumnDef<CategoryItem>[] = [
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) => {
        const cat = row.original;
        return (
          <div className="w-16 h-12 bg-zinc-100 rounded-xl overflow-hidden relative border border-zinc-200/60 flex items-center justify-center">
            {cat.imageUrl ? (
              <Image src={cat.imageUrl} alt={cat.nameEn || cat.name || 'Category'} fill className="object-contain p-1" sizes="64px" />
            ) : (
              <Layers className="w-4 h-4 text-zinc-400" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'nameEn',
      header: 'Category / Slug',
      cell: ({ row }) => {
        const cat = row.original;
        return (
          <div>
            <div className="font-bold text-zinc-900 text-sm">{cat.nameEn || cat.name}</div>
            <div className="text-[10px] text-zinc-400 font-mono">{cat.slug}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'brand',
      header: 'Brand',
      cell: ({ row }) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${row.original.brand === 'apsonic-pro' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
          {row.original.brand}
        </span>
      ),
    },
    {
      id: 'translations',
      header: 'Translations',
      cell: ({ row }) => {
        const cat = row.original;
        return (
          <div className="space-y-0.5 text-[11px]">
            <div><span className="text-zinc-400">FR:</span> {cat.nameFr || '—'}</div>
            <div><span className="text-zinc-400">ZH:</span> {cat.nameZh || '—'}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'displayOrder',
      header: 'Order',
      cell: ({ row }) => <span className="font-mono text-zinc-500">{row.original.displayOrder ?? 0}</span>,
    },
    {
      accessorKey: 'active',
      header: 'Status',
      cell: ({ row }) => {
        const cat = row.original;
        return (
          <button
            type="button"
            onClick={() => onToggleActive(cat.id, cat.active ?? true)}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            {cat.active ? (
              <span className="flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle2 className="w-4 h-4" /> Active</span>
            ) : (
              <span className="flex items-center gap-1 text-zinc-400 font-bold"><XCircle className="w-4 h-4" /> Disabled</span>
            )}
          </button>
        );
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const cat = row.original;
        return (
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => onEdit(cat)}
              className="p-2 hover:bg-zinc-100 text-zinc-600 rounded-xl transition-colors cursor-pointer"
              title="Edit Category"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            {allowDelete && (
              <button
                type="button"
                onClick={() => onDelete(cat.id)}
                className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors cursor-pointer"
                title="Delete Category"
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
      data={categories}
      loading={loading}
      emptyTitle="No Categories Found"
      emptyDescription="Create your first motorcycle category to organize models."
      emptyIcon={Layers}
    />
  );
};
