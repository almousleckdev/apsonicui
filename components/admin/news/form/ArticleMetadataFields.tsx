'use client';

import React from 'react';
import { CopyFromLanguage } from '@/components/admin/shared/CopyFromLanguage';
import { useAdminText } from '@/context/AdminTextContext';
import type { ContentLang } from '@/lib/i18n/translation-copy';

interface ArticleMetadataFieldsProps {
  lang: ContentLang;
  title: string;
  setTitle: (v: string) => void;
  summary: string;
  setSummary: (v: string) => void;
  /** The title and summary in every language, for the "copy from" buttons. */
  titles: Record<ContentLang, string>;
  summaries: Record<ContentLang, string>;
}

export const ArticleMetadataFields: React.FC<ArticleMetadataFieldsProps> = ({ lang, title, setTitle, summary, setSummary, titles, summaries }) => {
  const { t } = useAdminText();
  return (
    <div className="space-y-4 font-serif">
      <div>
        <input
          type="text"
          placeholder={t('news.form.title')}
          value={title}
          lang={lang}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-4xl sm:text-5xl font-serif text-zinc-950 placeholder:text-zinc-300 focus:outline-none border-none leading-tight bg-transparent"
        />
        <CopyFromLanguage current={lang} values={titles} onCopy={setTitle} />
      </div>

      <div>
        <textarea
          rows={1}
          placeholder={t('news.form.subtitle')}
          value={summary}
          lang={lang}
          onChange={(e) => {
            setSummary(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onFocus={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          className="w-full text-xl font-serif text-zinc-500 placeholder:text-zinc-300 focus:outline-none border-none leading-relaxed resize-none overflow-hidden bg-transparent"
        />
        <CopyFromLanguage current={lang} values={summaries} onCopy={setSummary} />
      </div>
    </div>
  );
};
