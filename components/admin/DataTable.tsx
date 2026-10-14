'use client';

import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { EmptyState } from '@/components/ui/empty-state';
import { Loader2, LucideIcon, Inbox } from 'lucide-react';

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
}

export function DataTable<TData>({
  columns,
  data,
  loading = false,
  emptyTitle = 'No records found',
  emptyDescription,
  emptyIcon = Inbox,
  emptyActionLabel,
  onEmptyAction,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="p-16 text-center flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-zinc-100 shadow-sm font-sans">
        <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
        <p className="text-xs font-semibold text-zinc-400">Loading catalog records...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={emptyIcon}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-sm font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-600 border-collapse">
          <thead className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 uppercase tracking-wider font-bold text-[10px]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="py-4 px-6 select-none"
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-zinc-100 font-medium">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-zinc-50/80 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-4 px-6 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
