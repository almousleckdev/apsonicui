'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageForm } from '@/components/admin/pages/AdminPageForm';
import { cmsPagesService } from '@/services/cms-pages';
import { tokenStorage } from '@/services/token-storage';
import { useToast } from '@/components/ui/Toast';
import type { CmsPageRequest } from '@/lib/types/cms-page';

export default function CreateCmsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (payload: CmsPageRequest) => {
    const token = tokenStorage.getAccessToken();
    if (!token) return;
    try {
      const page = await cmsPagesService.createPage(payload, token);
      toast.success('Page created successfully');
      router.push(`/en/admin/pages/${page.id}`);
      return page;
    } catch (err: any) {
      toast.error(err.message || 'Failed to create page');
      throw err;
    }
  };

  return (
      <>
        <div className="max-w-7xl mx-auto font-sans">
          <AdminPageForm onSubmit={handleSubmit} isEditing={false} />
        </div>
      </>
  );
}
