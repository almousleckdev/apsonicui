'use client';

import React, { useMemo, useState } from 'react';
import { Save } from 'lucide-react';
import { NewsRichTextEditor } from '@/components/admin/news/NewsRichTextEditor';
import { AdminBackNav } from '@/components/admin/AdminBackNav';
import { CopyFromLanguage } from '@/components/admin/shared/CopyFromLanguage';
import { LanguageTabs, type AdminLang } from '@/components/admin/shared/LanguageTabs';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';
import { CONTENT_LANGS, isBlankText, LANGUAGE_NAMES, type ContentLang } from '@/lib/i18n/translation-copy';
import type { AdminKey } from '@/lib/i18n/admin/catalog';
import type { CreateNewsPayload, NewsItem } from '@/lib/types/news';
import type { UserProfileResponse } from '@/lib/types/auth';
import { CoverPhotoUploader } from './form/CoverPhotoUploader';
import { ArticleMetadataFields } from './form/ArticleMetadataFields';

interface NewsStoryFormProps {
  initialData?: NewsItem | null;
  currentUser?: UserProfileResponse | null;
  onSubmit: (payload: CreateNewsPayload) => Promise<void>;
  isEditing?: boolean;
}

/** One text per language. */
type Texts = Record<ContentLang, string>;

const CATEGORIES: Array<{ value: string; label: AdminKey }> = [
  { value: 'Corporate', label: 'news.categories.Corporate' },
  { value: 'Events', label: 'news.categories.Events' },
  { value: 'Product Launch', label: 'news.categories.Product Launch' },
  { value: 'CSR', label: 'news.categories.CSR' },
];

const texts = (en?: string, fr?: string, zh?: string): Texts => ({ en: en ?? '', fr: fr ?? '', zh: zh ?? '' });
const withText = (all: Texts, lang: ContentLang, value: string): Texts => ({ ...all, [lang]: value });

const generateSlug = (text: string) =>
  text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

const calculateReadTime = (htmlContent: string) => {
  const plainText = htmlContent.replace(/<[^>]+>/g, ' ').trim();
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(wordCount / 200));
};

/**
 * The article editor. The article is written in English first and, optionally, in French and Chinese: each language
 * has its own title, summary and body, and any of them can be started by copying another. Languages left empty show
 * the English article to visitors.
 */
export const NewsStoryForm: React.FC<NewsStoryFormProps> = ({ initialData, currentUser, onSubmit, isEditing = false }) => {
  const { t } = useAdminText();
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [lang, setLang] = useState<ContentLang>('en');
  const [titles, setTitles] = useState<Texts>(() => texts(initialData?.titleEn ?? initialData?.title, initialData?.titleFr, initialData?.titleZh));
  const [summaries, setSummaries] = useState<Texts>(() => texts(initialData?.summaryEn ?? initialData?.excerpt, initialData?.summaryFr, initialData?.summaryZh));
  const [bodies, setBodies] = useState<Texts>(() => texts(initialData?.contentHtmlEn ?? initialData?.contentHtml, initialData?.contentHtmlFr, initialData?.contentHtmlZh));
  // Bumped when a body is copied in, so the editor (which reads its content once) starts again from it.
  const [bodyCopies, setBodyCopies] = useState(0);
  const [category, setCategory] = useState(initialData?.category || 'Corporate');
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.thumbnail || '');
  const [published, setPublished] = useState(initialData?.published !== undefined ? initialData.published : true);

  /** A dot on each language tab that already has an article. */
  const written = useMemo(
    () => Object.fromEntries(CONTENT_LANGS.map((l) => [l, !isBlankText(titles[l]) && !isBlankText(bodies[l])])) as Record<ContentLang, boolean>,
    [titles, bodies],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!titles.en.trim()) {
      setLang('en');
      setErrorMsg(t('news.form.needTitle'));
      return;
    }
    if (isBlankText(bodies.en)) {
      setLang('en');
      setErrorMsg(t('news.form.needBody'));
      return;
    }

    setSaving(true);
    try {
      // The address of an existing article is kept, so links to it keep working when its title is edited.
      const slug = (isEditing && initialData?.slug) || generateSlug(titles.en) || `story-${Date.now()}`;
      // Every language is sent, empty ones included, so clearing a translation really clears it.
      const payload: CreateNewsPayload = {
        slug,
        titleEn: titles.en.trim(),
        titleFr: titles.fr.trim(),
        titleZh: titles.zh.trim(),
        summaryEn: summaries.en || titles.en.slice(0, 150),
        summaryFr: summaries.fr,
        summaryZh: summaries.zh,
        contentHtmlEn: bodies.en,
        contentHtmlFr: isBlankText(bodies.fr) ? '' : bodies.fr,
        contentHtmlZh: isBlankText(bodies.zh) ? '' : bodies.zh,
        coverImageUrl: coverImageUrl || undefined,
        category,
        authorName: currentUser?.username || initialData?.authorName || 'APSONIC Editorial',
        authorRole: currentUser?.roles?.[0]?.replace('ROLE_', '') || initialData?.authorRole || 'Official Contributor',
        authorAvatarUrl: currentUser?.avatarUrl || initialData?.authorImage || '/images/logo/apsoniclogo.png',
        published,
        readTimeMinutes: calculateReadTime(bodies.en),
      };
      await onSubmit(payload);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : t('news.form.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const language = LANGUAGE_NAMES[lang];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-3xl border border-zinc-100 shadow-sm">
        <AdminBackNav href="/admin/news" />

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500 hidden sm:inline"><T id="news.form.category" /></span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label={t('news.form.category')}
              className="px-3.5 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-800 focus:outline-none focus:border-brand-green bg-zinc-50 cursor-pointer">
              {CATEGORIES.map(({ value, label }) => <option key={value} value={value}>{t(label)}</option>)}
            </select>
          </div>

          <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 cursor-pointer">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="w-4 h-4 accent-brand-green rounded cursor-pointer" />
            <T id={published ? 'news.form.publish' : 'news.form.draft'} />
          </label>

          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-green text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-brand-green/20 hover:bg-green-700 transition-all cursor-pointer disabled:opacity-50">
            <Save className="w-3.5 h-3.5" />
            <T id={saving ? 'news.form.saving' : isEditing ? 'news.form.save' : 'news.form.publishArticle'} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        {errorMsg && <div role="alert" className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">{errorMsg}</div>}

        <div className="space-y-2 rounded-2xl bg-zinc-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-zinc-600"><T id="news.form.languageLabel" /></span>
            <LanguageTabs value={lang} onChange={(l: AdminLang) => setLang(l)} marked={written} />
          </div>
          <p className="text-2xs font-medium text-zinc-500"><T id="news.form.languageNote" /></p>
        </div>

        <ArticleMetadataFields
          lang={lang}
          title={titles[lang]}
          setTitle={(v) => setTitles((all) => withText(all, lang, v))}
          summary={summaries[lang]}
          setSummary={(v) => setSummaries((all) => withText(all, lang, v))}
          titles={titles}
          summaries={summaries}
        />

        <CoverPhotoUploader
          coverImageUrl={coverImageUrl}
          setCoverImageUrl={setCoverImageUrl}
          uploadingCover={uploadingCover}
          setUploadingCover={setUploadingCover}
          setErrorMsg={setErrorMsg}
        />

        <div className="pt-4 border-t border-zinc-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2"><T id="news.form.body" /> · {language}</label>
          <NewsRichTextEditor
            key={`${lang}-${bodyCopies}`}
            contentHtml={bodies[lang]}
            onChange={(html) => setBodies((all) => withText(all, lang, html))}
            placeholder={t('news.form.bodyPlaceholder')}
          />
          <CopyFromLanguage current={lang} values={bodies}
            onCopy={(html) => { setBodies((all) => withText(all, lang, html)); setBodyCopies((n) => n + 1); }} />
          {lang !== 'en' && isBlankText(bodies[lang]) && (
            <p className="mt-2 text-2xs font-medium text-zinc-400">{t('news.form.bodyFallback', { language })}</p>
          )}
        </div>
      </div>
    </form>
  );
};
