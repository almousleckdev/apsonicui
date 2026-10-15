'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { resolveStyle } from '@/lib/page-builder/style';
import { safeColor } from '@/lib/page-builder/colors';
import { bool, pick, styleProps, type SectionProps } from '../shared';

const SIZES = { sm: 'h-6', md: 'h-12', lg: 'h-20', xl: 'h-32' } as const;

export function Spacer({ section, ctx }: SectionProps) {
  const c = section.content;
  const r = resolveStyle(section.style);
  const own = styleProps(r);
  const line = bool(c, 'showLine', false);
  return (
    <div className={cn('flex items-center', SIZES[pick(c.size, ['sm', 'md', 'lg', 'xl'] as const, 'md')], own.className,
      ctx.editing && !line && 'bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,rgba(0,0,0,0.04)_6px,rgba(0,0,0,0.04)_12px)]')} style={own.style} aria-hidden>
      {line && <hr className="mx-auto w-full max-w-6xl border-0 border-t-2 px-4" style={{ borderColor: safeColor(c.lineColor) ?? '#d4d4d8' }} />}
    </div>
  );
}
