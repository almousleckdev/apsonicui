'use client';

import React from 'react';
import {
  Heading,
  AlignLeft,
  Image as ImageIcon,
  Video as VideoIcon,
  Quote as QuoteIcon,
  AlertCircle,
  Link as LinkIcon,
  ChevronUp,
  ChevronDown,
  Trash2,
} from 'lucide-react';
import type { NewsSectionItem, SectionType } from '@/lib/types/news';
import { cn } from '@/lib/utils';

interface SectionItemCardProps {
  sec: NewsSectionItem;
  idx: number;
  totalCount: number;
  activeLang: 'EN' | 'FR' | 'ZH';
  onUpdate: (updatedFields: Partial<NewsSectionItem>) => void;
  onMove: (direction: 'UP' | 'DOWN') => void;
  onRemove: () => void;
}

const SECTION_TYPE_ICONS: Record<SectionType, React.ReactNode> = {
  HEADER: <Heading className="w-4 h-4 text-blue-500" />,
  PARAGRAPH: <AlignLeft className="w-4 h-4 text-zinc-600" />,
  IMAGE: <ImageIcon className="w-4 h-4 text-emerald-500" />,
  VIDEO: <VideoIcon className="w-4 h-4 text-red-500" />,
  QUOTE: <QuoteIcon className="w-4 h-4 text-purple-500" />,
  CALLOUT: <AlertCircle className="w-4 h-4 text-amber-500" />,
  LINK_BUTTON: <LinkIcon className="w-4 h-4 text-indigo-500" />,
};

export const SectionItemCard: React.FC<SectionItemCardProps> = ({
  sec,
  idx,
  totalCount,
  activeLang,
  onUpdate,
  onMove,
  onRemove,
}) => {
  const getContent = () => {
    if (activeLang === 'ZH') return sec.contentZh || '';
    if (activeLang === 'FR') return sec.contentFr || '';
    return sec.contentEn || '';
  };

  const handleContentChange = (val: string) => {
    if (activeLang === 'ZH') onUpdate({ contentZh: val });
    else if (activeLang === 'FR') onUpdate({ contentFr: val });
    else onUpdate({ contentEn: val });
  };

  const getCaption = () => {
    if (activeLang === 'ZH') return sec.mediaCaptionZh || '';
    if (activeLang === 'FR') return sec.mediaCaptionFr || '';
    return sec.mediaCaptionEn || '';
  };

  const handleCaptionChange = (val: string) => {
    if (activeLang === 'ZH') onUpdate({ mediaCaptionZh: val });
    else if (activeLang === 'FR') onUpdate({ mediaCaptionFr: val });
    else onUpdate({ mediaCaptionEn: val });
  };

  return (
    <div className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow relative space-y-3 font-sans">
      {/* Header: Badge & Move/Delete Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-zinc-100 rounded-lg">{SECTION_TYPE_ICONS[sec.sectionType]}</div>
          <span className="font-bold text-xs uppercase tracking-wider text-zinc-900">
            Section #{idx + 1}: {sec.sectionType}
          </span>
          <span className="text-[10px] font-bold text-brand-green bg-green-50 px-2 py-0.5 rounded border border-green-200">
            {activeLang} Editing
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={idx === 0}
            onClick={() => onMove('UP')}
            className="p-1.5 text-zinc-400 hover:text-zinc-800 disabled:opacity-30 rounded hover:bg-zinc-100"
            title="Move Up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={idx === totalCount - 1}
            onClick={() => onMove('DOWN')}
            className="p-1.5 text-zinc-400 hover:text-zinc-800 disabled:opacity-30 rounded hover:bg-zinc-100"
            title="Move Down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 text-red-400 hover:text-red-600 rounded hover:bg-red-50 ml-1"
            title="Delete Section"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Header Type */}
      {sec.sectionType === 'HEADER' && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-zinc-600">Heading Level:</label>
            {(['H1', 'H2', 'H3'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onUpdate({ headingLevel: lvl })}
                className={cn(
                  'px-2.5 py-1 text-xs font-bold rounded-md border transition-all',
                  sec.headingLevel === lvl
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-600'
                )}
              >
                {lvl}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder={`Header Text (${activeLang})...`}
            value={getContent()}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold focus:outline-none focus:border-brand-green"
          />
        </div>
      )}

      {/* Paragraph Type */}
      {sec.sectionType === 'PARAGRAPH' && (
        <textarea
          rows={4}
          placeholder={`Paragraph Content (${activeLang})...`}
          value={getContent()}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium focus:outline-none focus:border-brand-green leading-relaxed"
        />
      )}

      {/* Image / Video Type */}
      {(sec.sectionType === 'IMAGE' || sec.sectionType === 'VIDEO') && (
        <div className="space-y-3">
          <input
            type="url"
            placeholder={`${sec.sectionType === 'IMAGE' ? 'Image URL' : 'Video URL (YouTube or MP4)'}...`}
            value={sec.mediaUrl || ''}
            onChange={(e) => onUpdate({ mediaUrl: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium focus:outline-none focus:border-brand-green"
          />
          <input
            type="text"
            placeholder={`Media Caption (${activeLang})...`}
            value={getCaption()}
            onChange={(e) => handleCaptionChange(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs italic focus:outline-none focus:border-brand-green"
          />
        </div>
      )}

      {/* Quote Type */}
      {sec.sectionType === 'QUOTE' && (
        <textarea
          rows={3}
          placeholder={`Quote Text (${activeLang})...`}
          value={getContent()}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 bg-purple-50/50 text-xs italic font-serif focus:outline-none focus:border-purple-500"
        />
      )}

      {/* Callout Type */}
      {sec.sectionType === 'CALLOUT' && (
        <textarea
          rows={3}
          placeholder={`Notice / Callout Box Text (${activeLang})...`}
          value={getContent()}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-amber-200 bg-amber-50/50 text-xs font-medium focus:outline-none focus:border-amber-500"
        />
      )}
    </div>
  );
};
