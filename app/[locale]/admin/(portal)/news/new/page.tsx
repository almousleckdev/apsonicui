'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NewsStoryForm } from '@/components/admin/news/NewsStoryForm';
import { newsService } from '@/services/news';
import { authService } from '@/services/auth-service';
import type { CreateNewsPayload } from '@/lib/types/news';
import type { UserProfileResponse } from '@/lib/types/auth';

export default function CreateNewsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfileResponse | null>(null);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const u = await authService.getCurrentUser();
        if (u) setCurrentUser(u);
      } catch (err) {
        console.warn('Could not fetch logged-in user profile:', err);
      }
    }
    loadCurrentUser();
  }, []);

  const handleSubmit = async (payload: CreateNewsPayload) => {
    await newsService.createNews(payload);
    router.push('/admin/news');
  };

  return (
    <>
      <div className="space-y-6 font-sans max-w-5xl mx-auto pb-16">
        <NewsStoryForm
          currentUser={currentUser}
          onSubmit={handleSubmit}
          isEditing={false}
        />
      </div>
    </>
  );
}
