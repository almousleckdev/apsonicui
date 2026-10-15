'use client';

import { CopyFromLanguage } from '@/components/admin/shared/CopyFromLanguage';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';
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
  { key: 'tagline', label: 'home.hero.tagline', placeholder: 'home.hero.placeholders.tagline' },
  { key: 'title', label: 'home.hero.heading', placeholder: 'home.hero.placeholders.title' },
  { key: 'subtitle', label: 'home.hero.subtitle', placeholder: 'home.hero.placeholders.subtitle' },
] as const;

const INPUT = 'w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white text-xs font-semibold';

export const HeroSectionEditor: React.FC<HeroSectionEditorProps> = ({ hero, onChange }) => {
  const { t } = useAdminText();
  const [lang, setLang] = useState<AdminLang>('en');
  const suffix = suffixOf(lang);

  const updateVideoUrl = (index: number, url: string) => {
    const nextVideos = [...(hero.videos || ['/videos/hero2.mp4', '/videos/723_1770449481.mp4'])];
    nextVideos[index] = url;
    onChange({ ...hero, videos: nextVideos });
  };

  return (
    <CollapsibleCard
      title={<T id="home.hero.title" />}
      summary={hero.titleEn}
      actions={<LanguageTabs value={lang} onChange={setLang} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {FIELDS.map((f) => {
          const key = `${f.key}${suffix}` as keyof HomeHeroConfig;
          return (
            <label key={f.key} className="text-2xs font-bold text-zinc-600">
              <T id={f.label} />
              <input
                type="text"
                value={(hero[key] as string | undefined) || ''}
                onChange={(e) => onChange({ ...hero, [key]: e.target.value })}
                placeholder={t(`${f.placeholder}.${lang}`)}
                className={INPUT}
              />
              <CopyFromLanguage current={lang} values={{ en: hero[`${f.key}En` as keyof HomeHeroConfig] as string | undefined, fr: hero[`${f.key}Fr` as keyof HomeHeroConfig] as string | undefined, zh: hero[`${f.key}Zh` as keyof HomeHeroConfig] as string | undefined }}
                onCopy={(text) => onChange({ ...hero, [key]: text })} />
            </label>
          );
        })}
      </div>
      {lang !== 'en' && <p className="mt-2 text-2xs text-zinc-400"><T id="home.hero.emptyFallback" /></p>}

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-zinc-50 pt-3">
        <CompactMediaField label={t('home.hero.background1')} value={hero.videos?.[0]} onChange={(u) => updateVideoUrl(0, u)} accept="video/*,image/*" />
        <CompactMediaField label={t('home.hero.background2')} value={hero.videos?.[1]} onChange={(u) => updateVideoUrl(1, u)} accept="video/*,image/*" />
      </div>
    </CollapsibleCard>
  );
};
