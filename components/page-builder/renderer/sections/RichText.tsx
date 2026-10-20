'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { resolveStyle } from '@/lib/page-builder/style';
import { EmptyHint, SectionShell, pick, text, type SectionProps } from '../shared';

const ALIGN = { left: 'text-left', center: 'text-center', right: 'text-right' } as const;

export function RichText({ section, ctx }: SectionProps) {
  const html = text(section.content, 'body', ctx.locale);
  const dark = resolveStyle(section.style).dark;
  if (!html) return <EmptyHint editing={ctx.editing}>Rich text: write your content in the panel.</EmptyHint>;
  return (
    <SectionShell section={section}>
      {/* The backend sanitises this HTML when it is saved and again when it is served. */}
      <div className={cn('prose max-w-none', ALIGN[pick(section.content.align, ['left', 'center', 'right'] as const, 'left')],
        section.content.size === 'lg' && 'prose-lg', dark && 'prose-invert [&_*]:!text-inherit')} dangerouslySetInnerHTML={{ __html: html }} />
    </SectionShell>
  );
}
