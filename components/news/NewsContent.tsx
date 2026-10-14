'use client';

import React from 'react';
import type { NewsSectionItem, NewsContentBlock } from '@/lib/types/news';
import { useLocale } from 'next-intl';
import { NewsSectionRenderer } from './NewsSectionRenderer';
import { cn } from '@/lib/utils';

interface NewsContentProps {
  contentHtml?: string;
  sections?: NewsSectionItem[];
  blocks?: NewsContentBlock[];
  className?: string;
}

export const NewsContent: React.FC<NewsContentProps> = ({ contentHtml, sections, blocks, className }) => {
  const locale = useLocale();

  // Presentation tweak only (strips legacy utility classes). This is NOT a security control: the API returns
  // HTML already sanitized by the backend allow-list (see HtmlSanitizer), and the CSP is the second layer.
  const displayHtml = React.useMemo(() => {
    if (!contentHtml) return '';
    return contentHtml
      .replace(/border border-zinc-100 shadow-xl bg-zinc-50/g, '')
      .replace(/border-zinc-100/g, '')
      .replace(/shadow-xl/g, '')
      .replace(/bg-zinc-50/g, '');
  }, [contentHtml]);

  if (displayHtml && displayHtml.trim().length > 0) {
    return (
      <div
        className={cn(
          'prose prose-zinc max-w-none text-zinc-800 leading-relaxed font-light text-base sm:text-lg',
          'prose-headings:font-extrabold prose-headings:text-zinc-950 prose-headings:tracking-tight',
          'prose-h1:text-2xl prose-h1:sm:text-4xl prose-h1:border-b prose-h1:border-zinc-100 prose-h1:pb-4',
          'prose-h2:text-xl prose-h2:sm:text-3xl prose-h2:mt-8 prose-h2:mb-4',
          'prose-a:text-brand-green prose-a:font-bold prose-a:underline hover:prose-a:text-green-700',
          'prose-video:max-w-2xl prose-video:w-full prose-video:mx-auto prose-video:block prose-video:rounded-2xl prose-video:my-8',
          'prose-blockquote:border-l-4 prose-blockquote:border-brand-green prose-blockquote:bg-zinc-50 prose-blockquote:p-6 prose-blockquote:rounded-2xl',
          '[&_img]:border-none [&_img]:shadow-none [&_img]:bg-transparent [&_img]:max-w-2xl [&_img]:w-full [&_img]:max-h-[520px] [&_img]:object-cover [&_img]:mx-auto [&_img]:block [&_img]:rounded-2xl [&_img]:my-6',
          '[&_figure]:my-8 [&_figure]:text-center',
          '[&_figcaption]:text-center [&_figcaption]:text-xs [&_figcaption]:sm:text-sm [&_figcaption]:text-zinc-500 [&_figcaption]:italic [&_figcaption]:mt-2.5 [&_figcaption]:font-sans',
          className
        )}
        dangerouslySetInnerHTML={{ __html: displayHtml }}
      />
    );
  }

  const renderSections: NewsSectionItem[] = React.useMemo(() => {
    if (sections && sections.length > 0) {
      return [...sections].sort((a, b) => (a.sectionOrder || 0) - (b.sectionOrder || 0));
    }
    if (blocks && blocks.length > 0) {
      return blocks.map((b, idx) => ({
        sectionType:
          b.type === 'image'
            ? 'IMAGE'
            : b.type === 'video'
            ? 'VIDEO'
            : 'PARAGRAPH',
        contentEn: b.content,
        contentFr: b.content,
        contentZh: b.content,
        mediaUrl: b.content,
        mediaCaptionEn: b.caption,
        sectionOrder: idx,
      }));
    }
    return [];
  }, [sections, blocks]);

  const getContent = (sec: NewsSectionItem): string => {
    if (locale === 'zh' && sec.contentZh) return sec.contentZh;
    if (locale === 'fr' && sec.contentFr) return sec.contentFr;
    return sec.contentEn || sec.contentFr || sec.contentZh || '';
  };

  const getMediaCaption = (sec: NewsSectionItem): string => {
    if (locale === 'zh' && sec.mediaCaptionZh) return sec.mediaCaptionZh;
    if (locale === 'fr' && sec.mediaCaptionFr) return sec.mediaCaptionFr;
    return sec.mediaCaptionEn || sec.mediaCaptionFr || sec.mediaCaptionZh || '';
  };

  const getLinkText = (sec: NewsSectionItem): string => {
    if (locale === 'zh' && sec.linkTextZh) return sec.linkTextZh;
    if (locale === 'fr' && sec.linkTextFr) return sec.linkTextFr;
    return sec.linkTextEn || sec.linkTextFr || sec.linkTextZh || 'Learn More';
  };

  return (
    <div className={cn('space-y-10 text-zinc-800 font-sans', className)}>
      {renderSections.map((sec, idx) => (
        <NewsSectionRenderer
          key={sec.id || idx}
          sec={sec}
          idx={idx}
          textContent={getContent(sec)}
          caption={getMediaCaption(sec)}
          linkText={getLinkText(sec)}
        />
      ))}
    </div>
  );
};
