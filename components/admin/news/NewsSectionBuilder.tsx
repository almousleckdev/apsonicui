'use client';

import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import type { NewsSectionItem, SectionType } from '@/lib/types/news';
import { cn } from '@/lib/utils';
import { SectionTypeSelector } from './sections/SectionTypeSelector';
import { SectionItemCard } from './sections/SectionItemCard';

interface NewsSectionBuilderProps {
  sections: NewsSectionItem[];
  onChange: (sections: NewsSectionItem[]) => void;
}

export const NewsSectionBuilder: React.FC<NewsSectionBuilderProps> = ({ sections, onChange }) => {
  const [activeLang, setActiveLang] = useState<'EN' | 'FR' | 'ZH'>('EN');

  const addSection = (type: SectionType) => {
    const newSec: NewsSectionItem = {
      sectionType: type,
      headingLevel: type === 'HEADER' ? 'H2' : undefined,
      contentEn: '',
      contentFr: '',
      contentZh: '',
      mediaUrl: type === 'IMAGE' || type === 'VIDEO' ? '' : undefined,
      mediaCaptionEn: '',
      mediaCaptionFr: '',
      mediaCaptionZh: '',
      sectionOrder: sections.length,
    };
    onChange([...sections, newSec]);
  };

  const updateSection = (index: number, updatedFields: Partial<NewsSectionItem>) => {
    const next = [...sections];
    next[index] = { ...next[index], ...updatedFields };
    onChange(next);
  };

  const removeSection = (index: number) => {
    const next = sections.filter((_, idx) => idx !== index);
    onChange(next.map((sec, idx) => ({ ...sec, sectionOrder: idx })));
  };

  const moveSection = (index: number, direction: 'UP' | 'DOWN') => {
    if ((direction === 'UP' && index === 0) || (direction === 'DOWN' && index === sections.length - 1)) {
      return;
    }
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    const next = [...sections];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    onChange(next.map((sec, idx) => ({ ...sec, sectionOrder: idx })));
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Builder Toolbar & Language Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-zinc-900 text-white rounded-2xl border border-zinc-800 shadow-md">
        <div>
          <h3 className="text-sm font-bold tracking-tight">文章多段落构建器</h3>
          <p className="text-[10px] text-zinc-400">Multi-Section Block Builder</p>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1.5 bg-zinc-800 p-1 rounded-xl border border-zinc-700">
          <Globe className="w-3.5 h-3.5 text-brand-green ml-2 mr-1" />
          {(['EN', 'FR', 'ZH'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLang(lang)}
              className={cn(
                'px-3 py-1 text-xs font-bold rounded-lg transition-all',
                activeLang === lang
                  ? 'bg-brand-green text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              )}
            >
              {lang === 'EN' ? 'English' : lang === 'FR' ? 'Français' : '中文'}
            </button>
          ))}
        </div>
      </div>

      {/* Add Section Type Buttons */}
      <SectionTypeSelector onAddSection={addSection} />

      {/* Sections List */}
      {sections.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
          <p className="text-sm font-semibold text-zinc-500">暂无内容段落，请点击上方按钮添加段落。</p>
          <p className="text-xs text-zinc-400 mt-1">No content sections added yet. Click above to add headers, text, images, or videos.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((sec, idx) => (
            <SectionItemCard
              key={sec.id || idx}
              sec={sec}
              idx={idx}
              totalCount={sections.length}
              activeLang={activeLang}
              onUpdate={(updated) => updateSection(idx, updated)}
              onMove={(dir) => moveSection(idx, dir)}
              onRemove={() => removeSection(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
