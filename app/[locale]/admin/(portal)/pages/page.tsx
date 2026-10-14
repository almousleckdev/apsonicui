'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ActionModal } from '@/components/admin/ActionModal';
import { cmsPagesService } from '@/services/cms-pages';
import { getPageTitle, type CmsPageDto } from '@/lib/types/cms-page';
import { AdminPagesTable } from '@/components/admin/pages/AdminPagesTable';
import { useToast } from '@/components/ui/Toast';

export default function AdminCmsPages() {
  const { toast } = useToast();
  const [pages, setPages] = useState<CmsPageDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState<CmsPageDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await cmsPagesService.getAdminPages();
      setPages(data);
    } catch (err) {
      console.error('Failed to load pages:', err);
      toast.error('Failed to load CMS pages');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const handleToggleStatus = async (item: CmsPageDto) => {
    try {
      const nextStatus = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      await cmsPagesService.updateStatus(item.id, nextStatus);
      setPages((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, status: nextStatus } : p))
      );
      toast.success(`Page "${getPageTitle(item)}" status updated to ${nextStatus}.`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update page status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await cmsPagesService.deletePage(deleteTarget.id);
      toast.success(`Page "${getPageTitle(deleteTarget)}" deleted successfully.`);
      setPages((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to delete page');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
      <>
        <div className="space-y-6 font-sans max-w-7xl mx-auto">
          <AdminPageHeader
            title="Dynamic Pages Builder"
            subtitle="Create and manage custom website pages."
            actionLabel="Create New Page"
            actionHref="/admin/pages/new"
            onRefresh={fetchPages}
            isRefreshing={loading}
          />

          <AdminPagesTable
            loading={loading}
            pages={pages}
            onToggleStatus={handleToggleStatus}
            onDeleteRequest={setDeleteTarget}
          />

          <ActionModal
            isOpen={!!deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDeleteConfirm}
            variant="danger"
            title="Confirm Delete Page"
            description={`Are you sure you want to delete "${(deleteTarget ? getPageTitle(deleteTarget) : '')}"? This action cannot be undone.`}
            confirmLabel="Delete Page"
            cancelLabel="Cancel"
            expectedConfirmationName={deleteTarget ? getPageTitle(deleteTarget) : undefined}
            isLoading={isDeleting}
          />
        </div>
      </>
  );
}
