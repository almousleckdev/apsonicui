'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Layers, Star, CheckCircle2, XCircle, ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { useAuth } from '@/hooks/useAuth';
import { canDeleteCatalog } from '@/lib/utils/permissions';
import { ProductListItem } from '@/services/product';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';

interface ProductTableProps {
  products: ProductListItem[];
  loading?: boolean;
  onToggleActive: (id: number | string, current: boolean) => void;
  onDelete: (id: number | string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  loading = false,
  onToggleActive,
  onDelete,
}) => {
  const { user } = useAuth();
  const allowDelete = canDeleteCatalog(user);
  const { t } = useAdminText();

  const columns: ColumnDef<ProductListItem>[] = [
    {
      accessorKey: 'image',
      header: () => <T id="products.columns.photo" />,
      cell: ({ row }) => {
        const prod = row.original;
        return (
          <div className="w-16 h-12 bg-zinc-100 rounded-xl overflow-hidden relative border border-zinc-200/60 flex items-center justify-center">
            {prod.image ? (
              <Image src={prod.image} alt={prod.model} fill className="object-contain p-1" sizes="64px" />
            ) : (
              <Layers className="w-4 h-4 text-zinc-400" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'model',
      header: () => <T id="products.columns.model" />,
      cell: ({ row }) => {
        const prod = row.original;
        return (
          <div>
            <div className="font-bold text-zinc-900 text-sm flex items-center gap-1.5">
              {prod.model}
              {prod.featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
            </div>
            <div className="text-3xs text-zinc-400 font-mono">{prod.slug}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'category',
      header: () => <T id="products.columns.category" />,
      cell: ({ row }) => (
        <span className="font-bold text-zinc-800">{row.original.category || row.original.categorySlug}</span>
      ),
    },
    {
      accessorKey: 'displacement',
      header: () => <T id="products.columns.displacement" />,
      cell: ({ row }) => (
        <span className="font-mono text-zinc-600">{row.original.displacement ? `${row.original.displacement} cc` : '—'}</span>
      ),
    },
    {
      accessorKey: 'brand',
      header: () => <T id="products.columns.brand" />,
      cell: ({ row }) => (
        <span className={`px-2.5 py-1 rounded-full text-3xs font-bold uppercase tracking-wider ${row.original.brand === 'apsonic-pro' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
          {row.original.brand}
        </span>
      ),
    },
    {
      accessorKey: 'active',
      header: () => <T id="products.columns.status" />,
      cell: ({ row }) => {
        const prod = row.original;
        return (
          <button
            type="button"
            onClick={() => onToggleActive(prod.id, prod.active)}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            {prod.active ? (
              <span className="flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle2 className="w-4 h-4" /> <T id="products.active" /></span>
            ) : (
              <span className="flex items-center gap-1 text-zinc-400 font-bold"><XCircle className="w-4 h-4" /> <T id="products.disabled" /></span>
            )}
          </button>
        );
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right"><T id="products.columns.actions" /></div>,
      cell: ({ row }) => {
        const prod = row.original;
        return (
          <div className="flex items-center justify-end gap-1.5">
            <Link
              href={`/products/${prod.slug || prod.id}`}
              target="_blank"
              className="p-2 hover:bg-zinc-100 text-zinc-600 rounded-xl transition-colors"
              title={t('products.viewPublic')}
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
            <Link
              href={`/admin/products/${prod.slug || prod.id}/edit`}
              className="p-2 hover:bg-zinc-100 text-zinc-600 rounded-xl transition-colors"
              title={t('products.editProduct')}
            >
              <Edit2 className="w-4 h-4" />
            </Link>
            {allowDelete && (
              <button
                type="button"
                onClick={() => onDelete(prod.id)}
                className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors cursor-pointer"
                title={t('products.deleteProduct')}
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
      data={products}
      loading={loading}
      emptyTitle={<T id="products.emptyTitle" />}
      emptyDescription={<T id="products.emptyText" />}
      emptyIcon={Layers}
    />
  );
};
