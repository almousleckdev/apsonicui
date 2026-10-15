'use client';

import React from 'react';
import { EmptyHint, SectionShell, isDark, text, type SectionProps } from '../shared';
import { cn } from '@/lib/utils';

export function RichText({ section, ctx }: SectionProps) {
  const html = text(section.content, 'body', ctx.locale);
  if (!html) return <EmptyHint editing={ctx.editing}>Rich text: write your content in the panel.</EmptyHint>;
  return (
    <SectionShell section={section}>
      {/* The backend sanitises this HTML when it is saved and again when it is served. */}
      <div className={cn('prose max-w-none', isDark(section.style) && 'prose-invert [&_*]:!text-inherit')} dangerouslySetInnerHTML={{ __html: html }} />
    </SectionShell>
  );
}
