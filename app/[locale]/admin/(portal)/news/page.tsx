'use client';

import React, { useState, useMemo } from 'react';
import { useRemoteList } from '@/hooks/queries/useRemoteList';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ActionModal } from '@/components/admin/ActionModal';
import { newsService } from '@/services/news';
import type { NewsItem } from '@/lib/types/news';
import { AdminNewsFilterBar } from '@/components/admin/news/AdminNewsFilterBar';
import { AdminNewsTable } from '@/components/admin/news/AdminNewsTable';
import { useToast } from '@/components/ui/Toast';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';

export default function AdminNewsPage() {
  const { toast } = useToast();
  const { t } = useAdminText();
  const { data: newsList, setData: setNewsList, loading, refetch: fetchNews } = useRemoteList<NewsItem>(
    ['admin', 'news'],
    () => newsService.getAdminNewsList(),
    () => toast.error(t('news.loadFailed'))
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  const handleTogglePublish = async (item: NewsItem) => {
    try {
      const nextStatus = !item.published;
      await newsService.togglePublish(item.id, nextStatus);
      setNewsList((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, published: nextStatus } : n))
      );
      toast.success(t(nextStatus ? 'news.publishedToast' : 'news.draftToast', { title: item.title }));
    } catch (err) {
      console.error(err);
      toast.error(t('news.statusFailed'));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await newsService.deleteNews(deleteTarget.id);
      toast.success(t('news.deletedToast', { title: deleteTarget.title }));
      setNewsList((prev) => prev.filter((n) => n.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : t('news.deleteFailed'));
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredNews = useMemo(() => {
    return newsList.filter((item) => {
      const matchQuery =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.authorName && item.authorName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCat =
        selectedCategory === 'ALL' ||
        item.category.toUpperCase() === selectedCategory.toUpperCase();
      return matchQuery && matchCat;
    });
  }, [newsList, searchQuery, selectedCategory]);

  return (
      <>
        <div className="space-y-6 font-sans max-w-7xl mx-auto">
          {/* Unified Admin Page Header */}
          <AdminPageHeader
            title={<T id="news.title" layout="stack" />}
            subtitle={<T id="news.subtitle" />}
            actionLabel={<T id="news.create" />}
            actionHref="/admin/news/new"
            onRefresh={fetchNews}
            isRefreshing={loading}
          />

          {/* Filters & Search Row */}
          <AdminNewsFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* News Articles TanStack Data Table */}
          <AdminNewsTable
            loading={loading}
            newsList={filteredNews}
            onTogglePublish={handleTogglePublish}
            onDeleteRequest={setDeleteTarget}
          />

          {/* Reusable ActionModal for Delete Confirmation with Typed Title Verification */}
          <ActionModal
            isOpen={!!deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDeleteConfirm}
            variant="danger"
            title={t('news.confirmDelete')}
            description={t('news.confirmDeleteText', { title: deleteTarget?.title ?? '' })}
            confirmLabel={<T id="news.deleteConfirm" />}
            expectedConfirmationName={deleteTarget?.title}
            isLoading={isDeleting}
          />
        </div>
      </>
  );
}
