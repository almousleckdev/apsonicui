'use client';

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CmsPageSectionDto, Locale } from '@/lib/types/cms-page';
import { GripVertical, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { SectionImageUpload } from '../products/SectionImageUpload';

interface SortableSectionCardProps {
  id: string | number;
  section: CmsPageSectionDto;
  activeLocale: Locale;
  onRemove: () => void;
  onUpdate: (config: any) => void;
}

export const SortableSectionCard: React.FC<SortableSectionCardProps> = ({ id, section, activeLocale, onRemove, onUpdate }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const [expanded, setExpanded] = useState(true);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const config = section.configuration || {};
  const translations = config.translations || { en: {}, fr: {}, zh: {} };
  const currentTranslation = translations[activeLocale] || {};

  const updateTranslation = (key: string, value: string) => {
    onUpdate({
      ...config,
      translations: {
        ...translations,
        [activeLocale]: {
          ...currentTranslation,
          [key]: value
        }
      }
    });
  };

  const updateGlobal = (key: string, value: any) => {
    onUpdate({
      ...config,
      [key]: value
    });
  };

  const renderSectionEditor = () => {
    switch (section.sectionType) {
      case 'HERO':
        return (
          <div className="space-y-4">
            <SectionImageUpload
              label="Background Image / Video"
              value={config.backgroundImage}
              onChange={(v) => updateGlobal('backgroundImage', v)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-900 mb-1">Headline</label>
                <input
                  type="text"
                  value={currentTranslation.title || ''}
                  onChange={(e) => updateTranslation('title', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-brand-green"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-900 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={currentTranslation.subtitle || ''}
                  onChange={(e) => updateTranslation('subtitle', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-brand-green"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-900 mb-1">CTA Text</label>
                <input
                  type="text"
                  value={currentTranslation.ctaText || ''}
                  onChange={(e) => updateTranslation('ctaText', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-brand-green"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-900 mb-1">CTA Link</label>
                <input
                  type="text"
                  value={config.ctaLink || ''}
                  onChange={(e) => updateGlobal('ctaLink', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-brand-green"
                />
              </div>
            </div>
          </div>
        );
      case 'IMAGE_TEXT':
        return (
          <div className="space-y-4">
            <div className="flex gap-4 items-center mb-2">
              <label className="text-xs font-bold text-zinc-900">Layout Style:</label>
              <select
                value={config.layout || 'image-left'}
                onChange={(e) => updateGlobal('layout', e.target.value)}
                className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-medium outline-none"
              >
                <option value="image-left">Image Left, Text Right</option>
                <option value="text-left">Text Left, Image Right</option>
              </select>
            </div>
            <SectionImageUpload
              label="Section Image"
              value={config.image}
              onChange={(v) => updateGlobal('image', v)}
            />
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-900 mb-1">Heading</label>
                <input
                  type="text"
                  value={currentTranslation.title || ''}
                  onChange={(e) => updateTranslation('title', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-brand-green"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-900 mb-1">Description (Text)</label>
                <textarea
                  value={currentTranslation.description || ''}
                  onChange={(e) => updateTranslation('description', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-brand-green min-h-[100px]"
                />
              </div>
            </div>
          </div>
        );
      case 'VIDEO':
        return (
          <div className="space-y-4">
            <SectionImageUpload
              label="Video File / External Link"
              value={config.videoUrl}
              onChange={(v) => updateGlobal('videoUrl', v)}
              accept="video/*"
            />
            <SectionImageUpload
              label="Thumbnail Poster"
              value={config.thumbnail}
              onChange={(v) => updateGlobal('thumbnail', v)}
            />
            <div>
                <label className="block text-xs font-bold text-zinc-900 mb-1">Video Title / Caption</label>
                <input
                  type="text"
                  value={currentTranslation.title || ''}
                  onChange={(e) => updateTranslation('title', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-brand-green"
                />
              </div>
          </div>
        );
      case 'RICH_TEXT':
        return (
          <div className="space-y-4">
             <div>
                <label className="block text-xs font-bold text-zinc-900 mb-1">Content (HTML allowed)</label>
                <textarea
                  value={currentTranslation.content || ''}
                  onChange={(e) => updateTranslation('content', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-brand-green min-h-[150px] font-mono"
                />
              </div>
          </div>
        )
      default:
        return <div className="text-sm text-zinc-500">Visual editor for {section.sectionType} not fully implemented yet. Please use the generic layout.</div>;
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between p-3 bg-zinc-50 border-b border-zinc-200/80">
        <div className="flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-grab p-1 hover:bg-zinc-200 rounded text-zinc-400 hover:text-zinc-700">
            <GripVertical className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-zinc-900">{section.sectionType.replace('_', ' ')}</span>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setExpanded(!expanded)} className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 rounded-lg">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button type="button" onClick={onRemove} className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div className="p-5">
          {renderSectionEditor()}
        </div>
      )}
    </div>
  );
};
