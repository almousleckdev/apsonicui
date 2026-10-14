'use client';

import React, { useState } from 'react';
import { NewsRichTextEditor } from '@/components/admin/news/NewsRichTextEditor';
import { AdminBackNav } from '@/components/admin/AdminBackNav';
import type { CreateNewsPayload, NewsItem } from '@/lib/types/news';
import type { UserProfileResponse } from '@/lib/types/auth';
import { CoverPhotoUploader } from './form/CoverPhotoUploader';
import { ArticleMetadataFields } from './form/ArticleMetadataFields';
import { Save } from 'lucide-react';

interface NewsStoryFormProps {
  initialData?: NewsItem | null;
  currentUser?: UserProfileResponse | null;
  onSubmit: (payload: CreateNewsPayload) => Promise<void>;
  isEditing?: boolean;
}

export const NewsStoryForm: React.FC<NewsStoryFormProps> = ({
  initialData,
  currentUser,
  onSubmit,
  isEditing = false,
}) => {
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.titleEn || initialData?.title || '');
  const [summary, setSummary] = useState(initialData?.summaryEn || initialData?.excerpt || '');
  const [contentHtml, setContentHtml] = useState(initialData?.contentHtmlEn || initialData?.contentHtml || '');
  const [category, setCategory] = useState(initialData?.category || 'Corporate');
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.thumbnail || '');
  const [published, setPublished] = useState(initialData?.published !== undefined ? initialData.published : true);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const calculateReadTime = (htmlContent: string) => {
    const plainText = htmlContent.replace(/<[^>]+>/g, ' ').trim();
    const wordCount = plainText ? plainText.split(/\s+/).length : 0;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg('Please enter an article title.');
      return;
    }
    if (!contentHtml.trim() || contentHtml === '<p></p>') {
      setErrorMsg('Article content cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      const slug = generateSlug(title) || `story-${Date.now()}`;
      const estimatedReadTime = calculateReadTime(contentHtml);
      const authorName = currentUser?.username || initialData?.authorName || 'APSONIC Editorial';

      const payload: CreateNewsPayload = {
        slug,
        titleEn: title,
        titleFr: title,
        titleZh: title,
        summaryEn: summary || title.slice(0, 150),
        summaryFr: summary || title.slice(0, 150),
        summaryZh: summary || title.slice(0, 150),
        contentHtmlEn: contentHtml,
        contentHtmlFr: contentHtml,
        contentHtmlZh: contentHtml,
        coverImageUrl: coverImageUrl || undefined,
        category,
        authorName,
        authorRole: currentUser?.roles?.[0]?.replace('ROLE_', '') || initialData?.authorRole || 'Official Contributor',
        authorAvatarUrl: currentUser?.avatarUrl || initialData?.authorImage || '/images/logo/apsoniclogo.png',
        published,
        readTimeMinutes: estimatedReadTime,
      };

      await onSubmit(payload);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save story.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      {/* Shared Header with standard AdminBackNav */}
      <div className="flex items-center justify-between bg-white p-4 sm:p-6 rounded-3xl border border-zinc-100 shadow-sm">
        <AdminBackNav href="/admin/news" />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500 hidden sm:inline">Category:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-800 focus:outline-none focus:border-brand-green bg-zinc-50 cursor-pointer"
            >
              <option value="Corporate">Corporate</option>
              <option value="Events">Events</option>
              <option value="Product Launch">Product Launch</option>
              <option value="CSR">CSR</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 accent-brand-green rounded cursor-pointer"
            />
            <span>{published ? 'Publish' : 'Draft'}</span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-green text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-brand-green/20 hover:bg-green-700 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Article'}</span>
          </button>
        </div>
      </div>

      {/* Editor Content Box */}
      <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        <ArticleMetadataFields
          title={title}
          setTitle={setTitle}
          summary={summary}
          setSummary={setSummary}
        />

        <CoverPhotoUploader
          coverImageUrl={coverImageUrl}
          setCoverImageUrl={setCoverImageUrl}
          uploadingCover={uploadingCover}
          setUploadingCover={setUploadingCover}
          setErrorMsg={setErrorMsg}
        />

        <div className="pt-4 border-t border-zinc-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Article Body Content
          </label>
          <NewsRichTextEditor
            contentHtml={contentHtml}
            onChange={setContentHtml}
            placeholder="Write your article content here..."
          />
        </div>
      </div>
    </form>
  );
};
