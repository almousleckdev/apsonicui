'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { cmsPagesService } from '@/services/cms-pages';
import { tokenStorage } from '@/services/token-storage';
import { useToast } from '@/components/ui/Toast';
import type { CmsPageDto } from '@/lib/types/cms-page';
import { DynamicCmsPageViewer } from '@/components/features/DynamicCmsPageViewer';
import { Monitor, Smartphone, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminPagePreview() {
  const params = useParams();
  const id = parseInt(params.id as string, 10);
  const { toast } = useToast();
  const [page, setPage] = useState<CmsPageDto | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    if (isNaN(id)) return;
    const fetchPage = async () => {
      const token = tokenStorage.getAccessToken();
      if (!token) return;
      try {
        const data = await cmsPagesService.getAdminPageById(id, token);
        setPage(data);
      } catch (err) {
        toast.error('Failed to load page for preview');
      }
    };
    fetchPage();
  }, [id, toast]);

  if (!page) {
    return <div className="min-h-screen flex items-center justify-center bg-zinc-50 font-medium text-zinc-500">Loading Preview...</div>;
  }

  return (
      <div className="min-h-screen flex flex-col bg-zinc-100">
        
        {/* Preview Top Bar */}
        <div className="h-14 bg-zinc-900 text-white flex items-center justify-between px-4 shrink-0 shadow-md relative z-50">
          <div className="flex items-center gap-4">
            <Link href={`/en/admin/pages/${id}`} className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-bold">
              <ArrowLeft className="w-4 h-4" /> Back to Editor
            </Link>
            <div className="h-4 w-px bg-zinc-700"></div>
            <span className="text-sm font-bold text-zinc-300">Previewing Draft: <span className="text-white">{page.slug}</span></span>
          </div>

          <div className="flex items-center bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'desktop' ? 'bg-zinc-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'mobile' ? 'bg-zinc-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto flex justify-center bg-zinc-200/50">
          <div className={`w-full bg-white transition-all duration-300 shadow-2xl ${viewMode === 'mobile' ? 'max-w-[400px] my-8 rounded-3xl overflow-hidden border-8 border-zinc-900 h-[800px]' : 'max-w-none'}`}>
            <div className={viewMode === 'mobile' ? 'h-full overflow-y-auto' : ''}>
              <DynamicCmsPageViewer page={page} />
            </div>
          </div>
        </div>

      </div>
  );
}
