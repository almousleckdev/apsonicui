'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminPageForm } from '@/components/admin/pages/AdminPageForm';
import { cmsPagesService } from '@/services/cms-pages';
import { useToast } from '@/components/ui/Toast';
import type { CmsPageRequest, CmsPageDto } from '@/lib/types/cms-page';

export default function EditCmsPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string, 10);
  const { toast } = useToast();
  const [initialData, setInitialData] = useState<CmsPageDto | null>(null);

  useEffect(() => {
    if (isNaN(id)) return;
    const fetchPage = async () => {
      try {
        const data = await cmsPagesService.getAdminPageById(id);
        setInitialData(data);
      } catch (err) {
        toast.error('Failed to load page data');
      }
    };
    fetchPage();
  }, [id, toast]);

  const handleSubmit = async (payload: CmsPageRequest) => {
    try {
      const page = await cmsPagesService.updatePage(id, payload);
      toast.success('Page updated successfully');
      setInitialData(page);
      return page;
    } catch (err: any) {
      toast.error(err.message || 'Failed to update page');
      throw err;
    }
  };

  if (isNaN(id)) return null;

  return (
      <>
        <div className="max-w-7xl mx-auto font-sans">
          {initialData ? (
            <AdminPageForm initialData={initialData} onSubmit={handleSubmit} isEditing={true} />
          ) : (
            <div className="py-20 text-center text-gray-500">Loading page data...</div>
          )}
        </div>
      </>
  );
}
