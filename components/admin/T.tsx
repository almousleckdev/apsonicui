'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useAdminText } from '@/context/AdminTextContext';
import type { AdminKey } from '@/lib/i18n/admin/catalog';

interface Props {
  id: AdminKey;
  values?: Record<string, string | number>;
  /** "inline": 中文 English side by side. "stack": the English version under the Chinese one (headings, navigation). */
  layout?: 'inline' | 'stack';
  className?: string;
}

/**
 * A label in Chinese and English. Both are always in the markup; the display mode (a CSS attribute on <html>) hides
 * the one a person does not want, so switching needs no re-render and the server output is the same either way.
 */
export function T({ id, values, layout = 'inline', className }: Props) {
  const { parts } = useAdminText();
  const text = parts(id, values);
  return (
    <span className={cn('admin-bi', layout === 'stack' && 'admin-stack', className)}>
      <span className="admin-zh" lang="zh">{text.zh}</span>
      <span className="admin-en" lang="en">{text.en}</span>
    </span>
  );
}

/** A text that arrives from the server in English (section and field names of the page builder), shown in both languages. */
export function TServer({ text, layout = 'inline', className }: { text: string; layout?: 'inline' | 'stack'; className?: string }) {
  const { server } = useAdminText();
  const bilingual = server(text);
  return (
    <span className={cn('admin-bi', layout === 'stack' && 'admin-stack', className)}>
      <span className="admin-zh" lang="zh">{bilingual.zh}</span>
      <span className="admin-en" lang="en">{bilingual.en}</span>
    </span>
  );
}
