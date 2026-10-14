'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import type { SectionType } from '@/lib/types/news';

interface SectionTypeSelectorProps {
  onAddSection: (type: SectionType) => void;
}

const SECTION_TYPES: { type: SectionType; label: string; bg: string; text: string; border: string }[] = [
  { type: 'HEADER', label: '标题 Header', bg: 'bg-blue-50 hover:bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  { type: 'PARAGRAPH', label: '正文 Paragraph', bg: 'bg-zinc-100 hover:bg-zinc-200', text: 'text-zinc-800', border: 'border-zinc-200' },
  { type: 'IMAGE', label: '配图 Image', bg: 'bg-emerald-50 hover:bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  { type: 'VIDEO', label: '视频 Video', bg: 'bg-red-50 hover:bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  { type: 'QUOTE', label: '引言 Quote', bg: 'bg-purple-50 hover:bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  { type: 'CALLOUT', label: '高亮框 Notice', bg: 'bg-amber-50 hover:bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
];

export const SectionTypeSelector: React.FC<SectionTypeSelectorProps> = ({ onAddSection }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 font-sans">
      {SECTION_TYPES.map((st) => (
        <button
          key={st.type}
          type="button"
          onClick={() => onAddSection(st.type)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 ${st.bg} ${st.text} rounded-xl text-xs font-bold border ${st.border} transition-colors cursor-pointer`}
        >
          <Plus className="w-3.5 h-3.5" /> {st.label}
        </button>
      ))}
    </div>
  );
};
