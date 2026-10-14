'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { ActionModal } from '@/components/admin/ActionModal';
import { ColumnDef } from '@tanstack/react-table';
import {
  fetchTrashItems,
  restoreTrashItem,
  deleteTrashItemPermanently,
  clearTrash,
  TrashItem,
  TrashResourceType
} from '@/services/trash';
import { Trash2, RefreshCcw, Trash, Info } from 'lucide-react';

const TABS: { id: TrashResourceType; label: string }[] = [
  { id: 'products', label: 'Products' },
  { id: 'categories', label: 'Categories' },
  { id: 'news', label: 'News' },
  { id: 'users', label: 'Users' },
  { id: 'notifications', label: 'Notifications' },
];

export default function TrashPage() {
  const [activeTab, setActiveTab] = useState<TrashResourceType>('products');
  const [items, setItems] = useState<TrashItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [itemToRestore, setItemToRestore] = useState<TrashItem | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TrashItem | null>(null);

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchTrashItems(activeTab);
      setItems(res.data || []);
    } catch (e) {
      console.error('Failed to load trash items', e);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const confirmRestore = (item: TrashItem) => {
    setItemToRestore(item);
    setIsRestoreModalOpen(true);
  };

  const handleRestore = async () => {
    if (!itemToRestore) return;
    try {
      await restoreTrashItem(activeTab, itemToRestore.id);
      setItems(prev => prev.filter(item => item.id !== itemToRestore.id));
      setIsRestoreModalOpen(false);
    } catch (e) {
      console.error('Failed to restore item', e);
      alert('Failed to restore item. Please try again.');
    }
  };

  const confirmDelete = (item: TrashItem) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handlePermanentDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteTrashItemPermanently(activeTab, itemToDelete.id);
      setItems(prev => prev.filter(item => item.id !== itemToDelete.id));
      setIsDeleteModalOpen(false);
    } catch (e) {
      console.error('Failed to delete item', e);
      alert('Failed to delete item. Please try again.');
    }
  };

  const confirmClearTrash = () => {
    if (items.length === 0) return;
    setIsClearModalOpen(true);
  };

  const handleClearTrash = async () => {
    try {
      await clearTrash(activeTab);
      setItems([]);
      setIsClearModalOpen(false);
    } catch (e) {
      console.error('Failed to clear trash', e);
      alert('Failed to clear trash. Please try again.');
    }
  };

  const columns = useMemo<ColumnDef<TrashItem>[]>(() => [
    {
      accessorKey: 'title',
      header: 'Original Name/Title',
      cell: ({ row }) => (
        <span className="font-bold text-zinc-900">{row.original.title || `Item #${row.original.id}`}</span>
      ),
    },
    {
      accessorKey: 'deletedAt',
      header: 'Deleted At',
      cell: ({ row }) => (
        <span className="text-zinc-500">
          {row.original.deletedAt ? new Date(row.original.deletedAt).toLocaleString() : 'Unknown'}
        </span>
      ),
    },
    {
      accessorKey: 'deletedBy',
      header: 'Deleted By',
      cell: ({ row }) => (
        <span className="text-zinc-500">{row.original.deletedBy || 'System'}</span>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => confirmRestore(row.original)}
            className="p-1.5 text-zinc-400 hover:text-brand-green hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
            title="Restore"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => confirmDelete(row.original)}
            className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Permanently"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ], [activeTab]);

  return (
    <>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        <AdminPageHeader
          title="Trash Management"
          subtitle="View and restore soft-deleted items (3-month retention)"
          actionLabel={`Clear ${activeTab} Trash`}
          actionIcon={Trash}
          onActionClick={confirmClearTrash}
          onRefresh={loadData}
          isRefreshing={isLoading}
          actionVariant="danger"
        />

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-brand-green text-white shadow-md shadow-brand-green/20'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={items}
          loading={isLoading}
          emptyTitle={`No items in ${activeTab} trash`}
          emptyDescription="Deleted items will appear here and are retained for 3 months."
          emptyIcon={Info}
        />

        {/* Action Modals */}
        <ActionModal
          isOpen={isRestoreModalOpen}
          onClose={() => setIsRestoreModalOpen(false)}
          onConfirm={handleRestore}
          title="Restore Item"
          description={`Are you sure you want to restore "${itemToRestore?.title || 'this item'}"? It will be moved back to its original location.`}
          confirmLabel="Restore Item"
          variant="primary"
        />

        <ActionModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handlePermanentDelete}
          title="Delete Permanently"
          description={`Are you sure you want to permanently delete "${itemToDelete?.title || 'this item'}"? This action cannot be undone.`}
          confirmLabel="Delete Permanently"
          variant="danger"
          expectedConfirmationName="DELETE"
        />

        <ActionModal
          isOpen={isClearModalOpen}
          onClose={() => setIsClearModalOpen(false)}
          onConfirm={handleClearTrash}
          title={`Clear ${activeTab} Trash`}
          description={`Are you sure you want to permanently delete ALL items in the ${activeTab} trash? This action cannot be undone.`}
          confirmLabel={`Clear ${activeTab} Trash`}
          variant="danger"
          expectedConfirmationName="CLEAR TRASH"
        />
      </div>
    </>
  );
}
