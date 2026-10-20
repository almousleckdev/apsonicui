'use client';

import React, { useState, useMemo } from 'react';
import { useRemoteList } from '@/hooks/queries/useRemoteList';
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
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';
import { useToast } from '@/components/ui/Toast';
import type { AdminKey } from '@/lib/i18n/admin/catalog';

const TABS: { id: TrashResourceType; label: AdminKey }[] = [
  { id: 'pages', label: 'trash.tabs.pages' },
  { id: 'products', label: 'trash.tabs.products' },
  { id: 'categories', label: 'trash.tabs.categories' },
  { id: 'news', label: 'trash.tabs.news' },
  { id: 'users', label: 'trash.tabs.users' },
  { id: 'notifications', label: 'trash.tabs.notifications' },
  { id: 'navigation', label: 'trash.tabs.navigation' },
];

export default function TrashPage() {
  const [activeTab, setActiveTab] = useState<TrashResourceType>('products');
  const { t } = useAdminText();
  const { toast } = useToast();
  const tabName = t(TABS.find((tab) => tab.id === activeTab)!.label);

  // Modal states
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [itemToRestore, setItemToRestore] = useState<TrashItem | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TrashItem | null>(null);

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const { data: items, setData: setItems, loading: isLoading, refetch: loadData } = useRemoteList<TrashItem>(
    ['admin', 'trash', activeTab],
    async () => (await fetchTrashItems(activeTab)).data ?? [],
    (e) => console.error('Failed to load trash items', e)
  );

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
      toast.error(t('trash.restoreFailed'));
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
      toast.error(t('trash.deleteFailed'));
    }
  };

  const confirmClearTrash = () => {
    if (items.length === 0) return;
    setIsClearModalOpen(true);
  };

  const handleClearTrash = async () => {
    try {
      await clearTrash(activeTab);
      setItems(() => []);
      setIsClearModalOpen(false);
    } catch (e) {
      console.error('Failed to clear trash', e);
      toast.error(t('trash.clearFailed'));
    }
  };

  const columns = useMemo<ColumnDef<TrashItem>[]>(() => [
    {
      accessorKey: 'title',
      header: () => <T id="trash.columns.name" />,
      cell: ({ row }) => (
        <span className="font-bold text-zinc-900">{row.original.title || t('trash.item', { id: row.original.id })}</span>
      ),
    },
    {
      accessorKey: 'deletedAt',
      header: () => <T id="trash.columns.deletedAt" />,
      cell: ({ row }) => (
        <span className="text-zinc-500">
          {row.original.deletedAt ? new Date(row.original.deletedAt).toLocaleString() : t('trash.unknown')}
        </span>
      ),
    },
    {
      accessorKey: 'deletedBy',
      header: () => <T id="trash.columns.deletedBy" />,
      cell: ({ row }) => (
        <span className="text-zinc-500">{row.original.deletedBy || t('trash.system')}</span>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right"><T id="trash.columns.actions" /></div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => confirmRestore(row.original)}
            className="p-1.5 text-zinc-400 hover:text-brand-green hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
            title={t('trash.restore')}
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => confirmDelete(row.original)}
            className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title={t('trash.deletePermanently')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ], [t]);

  return (
    <>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        <AdminPageHeader
          title={<T id="trash.title" layout="stack" />}
          subtitle={<T id="trash.subtitle" />}
          actionLabel={t('trash.clear', { type: tabName })}
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
                <T id={tab.label} />
              </button>
            );
          })}
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={items}
          loading={isLoading}
          emptyTitle={t('trash.emptyTitle', { type: tabName })}
          emptyDescription={<T id="trash.emptyText" />}
          emptyIcon={Info}
        />

        {/* Action Modals */}
        <ActionModal
          isOpen={isRestoreModalOpen}
          onClose={() => setIsRestoreModalOpen(false)}
          onConfirm={handleRestore}
          title={t('trash.restoreTitle')}
          description={t('trash.restoreText', { title: itemToRestore?.title || t('trash.thisItem') })}
          confirmLabel={<T id="trash.restore" />}
          variant="primary"
        />

        <ActionModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handlePermanentDelete}
          title={t('trash.deleteTitle')}
          description={t('trash.deleteText', { title: itemToDelete?.title || t('trash.thisItem') })}
          confirmLabel={<T id="trash.deletePermanently" />}
          variant="danger"
          expectedConfirmationName="DELETE"
        />

        <ActionModal
          isOpen={isClearModalOpen}
          onClose={() => setIsClearModalOpen(false)}
          onConfirm={handleClearTrash}
          title={t('trash.clearTitle', { type: tabName })}
          description={t('trash.clearText', { type: tabName })}
          confirmLabel={t('trash.clear', { type: tabName })}
          variant="danger"
          expectedConfirmationName="CLEAR TRASH"
        />
      </div>
    </>
  );
}
