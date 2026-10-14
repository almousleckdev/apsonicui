'use client';

import React, { useState } from 'react';
import { SectionImageUpload } from '@/components/admin/products/SectionImageUpload';
import { HomeHeroConfig } from '@/lib/types/homepage';

interface HeroSectionEditorProps {
  hero: HomeHeroConfig;
  onChange: (hero: HomeHeroConfig) => void;
}

export const HeroSectionEditor: React.FC<HeroSectionEditorProps> = ({ hero, onChange }) => {
  const updateVideoUrl = (index: number, url: string) => {
    const nextVideos = [...(hero.videos || ['/videos/hero2.mp4', '/videos/723_1770449481.mp4'])];
    nextVideos[index] = url;
    onChange({ ...hero, videos: nextVideos });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-100 shadow-sm space-y-6 font-sans">
      <div>
        <h2 className="text-lg font-bold text-zinc-900">Hero Section (Title, Subtitle & Media Backgrounds)</h2>
        <p className="text-xs text-zinc-500">Configure the top full-screen video or image background slideshow and slogan texts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-zinc-700 font-bold text-xs mb-1">Tagline (EN)</label>
          <input
            type="text"
            value={hero.taglineEn || ''}
            onChange={(e) => onChange({ ...hero, taglineEn: e.target.value })}
            placeholder="Discover Apsonic"
            className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white text-xs font-semibold"
          />
        </div>
        <div>
          <label className="block text-zinc-700 font-bold text-xs mb-1">Title (EN)</label>
          <input
            type="text"
            value={hero.titleEn || ''}
            onChange={(e) => onChange({ ...hero, titleEn: e.target.value })}
            placeholder="Good Quality, Good Life"
            className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white text-xs font-semibold"
          />
        </div>
        <div>
          <label className="block text-zinc-700 font-bold text-xs mb-1">Subtitle (EN)</label>
          <input
            type="text"
            value={hero.subtitleEn || ''}
            onChange={(e) => onChange({ ...hero, subtitleEn: e.target.value })}
            placeholder="APSONIC Motorcycles - Built for Africa's Rugged Roads"
            className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white text-xs font-semibold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-zinc-700 font-bold text-xs mb-1">Title (ZH)</label>
          <input
            type="text"
            value={hero.titleZh || ''}
            onChange={(e) => onChange({ ...hero, titleZh: e.target.value })}
            placeholder="好质量 好生活"
            className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white text-xs font-semibold"
          />
        </div>
        <div>
          <label className="block text-zinc-700 font-bold text-xs mb-1">Subtitle (ZH)</label>
          <input
            type="text"
            value={hero.subtitleZh || ''}
            onChange={(e) => onChange({ ...hero, subtitleZh: e.target.value })}
            placeholder="APSONIC 摩托车 - 专为非洲复杂路况打造"
            className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white text-xs font-semibold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <SectionImageUpload
          label="Hero Background Media 1 (Video or High-Res Image)"
          description="Upload or set URL for first background slide"
          value={hero.videos?.[0] || ''}
          onChange={(url) => updateVideoUrl(0, url)}
          accept="video/*,image/*"
        />

        <SectionImageUpload
          label="Hero Background Media 2 (Video or High-Res Image)"
          description="Upload or set URL for second background slide"
          value={hero.videos?.[1] || ''}
          onChange={(url) => updateVideoUrl(1, url)}
          accept="video/*,image/*"
        />
      </div>
    </div>
  );
};
