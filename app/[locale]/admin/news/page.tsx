'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import zhMessages from '@/messages/zh.json';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ActionModal } from '@/components/admin/ActionModal';
import { newsService } from '@/services/news';
import { tokenStorage } from '@/services/token-storage';
import type { NewsItem } from '@/lib/types/news';
import { AdminNewsFilterBar } from '@/components/admin/news/AdminNewsFilterBar';
import { AdminNewsTable } from '@/components/admin/news/AdminNewsTable';
import { useToast } from '@/components/ui/Toast';

export default function AdminNewsPage() {
  const { toast } = useToast();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const token = tokenStorage.getAccessToken() || undefined;
      const data = await newsService.getAdminNewsList(token);
      setNewsList(data);
    } catch (err) {
      console.error('Failed to load news list:', err);
      toast.error('Failed to load news articles');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleTogglePublish = async (item: NewsItem) => {
    const token = tokenStorage.getAccessToken();
    if (!token) return;
    try {
      const nextStatus = !item.published;
      await newsService.togglePublish(item.id, nextStatus, token);
      setNewsList((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, published: nextStatus } : n))
      );
      toast.success(`Article "${item.title}" ${nextStatus ? 'published' : 'saved as draft'}.`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update publish status');
    }
  };

  const handleDeleteConfirm = async () => {
    const token = tokenStorage.getAccessToken();
    if (!deleteTarget || !token) return;
    setIsDeleting(true);
    try {
      await newsService.deleteNews(deleteTarget.id, token);
      toast.success(`Article "${deleteTarget.title}" deleted successfully.`);
      setNewsList((prev) => prev.filter((n) => n.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Failed to delete news article');
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
    <NextIntlClientProvider locale="zh" messages={zhMessages}>
      <AdminLayout>
        <div className="space-y-6 font-sans max-w-7xl mx-auto">
          {/* Unified Admin Page Header */}
          <AdminPageHeader
            title="News & Articles Management"
            subtitle="Publish and organize brand stories, product launches, and press releases."
            actionLabel="Create Article"
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
            title="Confirm Delete Article"
            description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
            confirmLabel="Delete Article"
            cancelLabel="Cancel"
            expectedConfirmationName={deleteTarget?.title}
            isLoading={isDeleting}
          />
        </div>
      </AdminLayout>
    </NextIntlClientProvider>
  );
}
