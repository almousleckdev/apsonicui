'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { NewsStoryForm } from '@/components/admin/news/NewsStoryForm';
import { newsService } from '@/services/news';
import { authService } from '@/services/auth-service';
import type { CreateNewsPayload, NewsItem } from '@/lib/types/news';
import type { UserProfileResponse } from '@/lib/types/auth';
import { Loader2 } from 'lucide-react';

interface EditNewsPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function EditNewsPage({ params }: EditNewsPageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<NewsItem | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfileResponse | null>(null);

  useEffect(() => {
    async function loadArticle() {
      setLoading(true);
      try {
        const [item, u] = await Promise.all([
          newsService.getNewsById(id, 'en'),
          authService.getCurrentUser().catch(() => null),
        ]);

        if (item) {
          setInitialData(item);
        } else {
          router.push('/admin/news');
        }
        if (u) setCurrentUser(u);
      } catch (err) {
        console.error('Failed to load article:', err);
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [id, router]);

  const handleSubmit = async (payload: CreateNewsPayload) => {
    await newsService.updateNews(id, payload);
    router.push('/admin/news');
  };

  return (
    <>
      <div className="space-y-6 font-sans max-w-5xl mx-auto pb-16">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <Loader2 className="w-6 h-6 text-brand-green animate-spin" />
            <span className="text-xs font-bold text-zinc-500">Loading Article Data...</span>
          </div>
        ) : (
          <NewsStoryForm
            initialData={initialData}
            currentUser={currentUser}
            onSubmit={handleSubmit}
            isEditing={true}
          />
        )}
      </div>
    </>
  );
}
