'use client';

import React from 'react';
import { str, type SectionProps } from '../shared';

const SIZES: Record<string, string> = { sm: 'h-6', md: 'h-12', lg: 'h-20', xl: 'h-32' };

export function Spacer({ section, ctx }: SectionProps) {
  const size = SIZES[str(section.content, 'size')] ?? SIZES.md;
  return <div className={`${size} ${ctx.editing ? 'bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,rgba(0,0,0,0.04)_6px,rgba(0,0,0,0.04)_12px)]' : ''}`} aria-hidden />;
}
