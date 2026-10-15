'use client';

import React, { useState } from 'react';
import { CollapsibleCard } from '@/components/admin/shared/CollapsibleCard';
import { CompactMediaField } from '@/components/admin/shared/CompactMediaField';
import { LanguageTabs, suffixOf, type AdminLang } from '@/components/admin/shared/LanguageTabs';
import { HomeHeroConfig } from '@/lib/types/homepage';

interface HeroSectionEditorProps {
  hero: HomeHeroConfig;
  onChange: (hero: HomeHeroConfig) => void;
}

const FIELDS = [
  { key: 'tagline', label: 'Tagline', placeholder: { en: 'Discover Apsonic', fr: 'Découvrir Apsonic', zh: '探索品牌' } },
  { key: 'title', label: 'Title', placeholder: { en: 'Good Quality, Good Life', fr: 'Bonne qualité pour une meilleure vie', zh: '好质量 好生活' } },
  { key: 'subtitle', label: 'Subtitle', placeholder: { en: "Built for Africa's rugged roads", fr: "Conçue pour les routes d'Afrique", zh: '专为非洲复杂路况打造' } },
] as const;

const INPUT = 'w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white text-xs font-semibold';

export const HeroSectionEditor: React.FC<HeroSectionEditorProps> = ({ hero, onChange }) => {
  const [lang, setLang] = useState<AdminLang>('en');
  const suffix = suffixOf(lang);

  const updateVideoUrl = (index: number, url: string) => {
    const nextVideos = [...(hero.videos || ['/videos/hero2.mp4', '/videos/723_1770449481.mp4'])];
    nextVideos[index] = url;
    onChange({ ...hero, videos: nextVideos });
  };

  return (
    <CollapsibleCard
      title="Hero"
      summary={hero.titleEn}
      actions={<LanguageTabs value={lang} onChange={setLang} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {FIELDS.map((f) => {
          const key = `${f.key}${suffix}` as keyof HomeHeroConfig;
          return (
            <label key={f.key} className="text-[11px] font-bold text-zinc-600">
              {f.label}
              <input
                type="text"
                value={(hero[key] as string | undefined) || ''}
                onChange={(e) => onChange({ ...hero, [key]: e.target.value })}
                placeholder={f.placeholder[lang]}
                className={INPUT}
              />
            </label>
          );
        })}
      </div>
      {lang !== 'en' && <p className="mt-2 text-[11px] text-zinc-400">Empty fields show the English text to visitors.</p>}

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-zinc-50 pt-3">
        <CompactMediaField label="Background 1 (video or image)" value={hero.videos?.[0]} onChange={(u) => updateVideoUrl(0, u)} accept="video/*,image/*" />
        <CompactMediaField label="Background 2 (video or image)" value={hero.videos?.[1]} onChange={(u) => updateVideoUrl(1, u)} accept="video/*,image/*" />
      </div>
    </CollapsibleCard>
  );
};
