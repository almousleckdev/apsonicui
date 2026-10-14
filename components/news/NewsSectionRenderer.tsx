'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Quote, AlertCircle, ExternalLink } from 'lucide-react';
import type { NewsSectionItem } from '@/lib/types/news';

interface NewsSectionRendererProps {
  sec: NewsSectionItem;
  idx: number;
  textContent: string;
  caption: string;
  linkText: string;
}

export const NewsSectionRenderer: React.FC<NewsSectionRendererProps> = ({
  sec,
  idx,
  textContent,
  caption,
  linkText,
}) => {
  const renderFormattedParagraph = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const label = match[1];
      const url = match[2];
      parts.push(
        <a
          key={match.index}
          href={url}
          target={url.startsWith('http') ? '_blank' : '_self'}
          rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="text-brand-green underline decoration-brand-green/40 hover:decoration-brand-green font-semibold transition-colors inline-flex items-center gap-0.5"
        >
          <span>{label}</span>
          {url.startsWith('http') && <ExternalLink className="w-3 h-3 inline" />}
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.05 * (idx % 4), duration: 0.5 }}
      className="font-sans"
    >
      {/* 1. Headings */}
      {sec.sectionType === 'HEADER' && (
        <div className="my-6">
          {sec.headingLevel === 'H1' && (
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight leading-tight border-b border-zinc-100 pb-4">
              {textContent}
            </h1>
          )}
          {sec.headingLevel === 'H2' && (
            <h2 className="text-xl sm:text-3xl font-bold text-zinc-900 tracking-tight leading-tight mt-8 mb-3 flex items-center gap-3">
              <span className="w-2 h-7 bg-brand-green rounded-full shrink-0" />
              <span>{textContent}</span>
            </h2>
          )}
          {(!sec.headingLevel || sec.headingLevel === 'H3') && (
            <h3 className="text-lg sm:text-2xl font-bold text-zinc-900 tracking-tight leading-snug mt-6 mb-2">
              {textContent}
            </h3>
          )}
        </div>
      )}

      {/* 2. Paragraph */}
      {sec.sectionType === 'PARAGRAPH' && (
        <p className="text-base sm:text-lg text-zinc-700 leading-relaxed max-w-3xl font-light">
          {renderFormattedParagraph(textContent)}
        </p>
      )}

      {/* 3. Image */}
      {sec.sectionType === 'IMAGE' && sec.mediaUrl && (
        <figure className="my-8 text-center">
          <div className="relative aspect-[16/9] max-w-2xl mx-auto overflow-hidden rounded-2xl group">
            <Image
              src={sec.mediaUrl}
              alt={sec.mediaAltText || caption || 'APSONIC Article Image'}
              fill
              unoptimized
              sizes="(max-width: 1200px) 100vw, 700px"
              className="object-cover"
            />
          </div>
          {caption && (
            <figcaption className="mt-2.5 text-center text-xs sm:text-sm text-zinc-500 italic max-w-2xl mx-auto font-sans">
              {caption}
            </figcaption>
          )}
        </figure>
      )}

      {/* 4. Video */}
      {sec.sectionType === 'VIDEO' && sec.mediaUrl && (
        <div className="my-8">
          <div className="relative aspect-video max-w-2xl mx-auto rounded-2xl overflow-hidden bg-black shadow-xl border border-zinc-800 group">
            {sec.mediaUrl.endsWith('.mp4') || sec.mediaUrl.startsWith('/videos') ? (
              <video
                src={sec.mediaUrl}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <iframe
                src={sec.mediaUrl.replace('watch?v=', 'embed/')}
                title="Video Content"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
          {caption && (
            <p className="mt-2.5 text-center text-xs sm:text-sm text-zinc-500 italic max-w-2xl mx-auto">
              {caption}
            </p>
          )}
        </div>
      )}

      {/* 5. Quote */}
      {sec.sectionType === 'QUOTE' && (
        <blockquote className="my-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-green-50/60 to-emerald-50/30 border-l-4 border-brand-green max-w-3xl relative">
          <Quote className="w-8 h-8 text-brand-green/20 absolute top-4 right-4" />
          <p className="text-base sm:text-xl font-medium text-zinc-800 italic leading-relaxed relative z-10">
            &ldquo;{textContent}&rdquo;
          </p>
        </blockquote>
      )}

      {/* 6. Callout */}
      {sec.sectionType === 'CALLOUT' && (
        <div className="my-8 p-5 sm:p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-amber-900 max-w-3xl flex items-start gap-4 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed font-medium">
            {renderFormattedParagraph(textContent)}
          </div>
        </div>
      )}

      {/* 7. Link Button */}
      {sec.sectionType === 'LINK_BUTTON' && sec.linkUrl && (
        <div className="my-8 text-center sm:text-left">
          <a
            href={sec.linkUrl}
            target={sec.linkUrl.startsWith('http') ? '_blank' : '_self'}
            rel={sec.linkUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-green text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-green/20 hover:bg-green-700 transition-all hover:scale-105"
          >
            <span>{linkText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </motion.div>
  );
};
