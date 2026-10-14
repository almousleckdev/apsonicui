'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { SectionImageUpload } from '@/components/admin/products/SectionImageUpload';
import { HomeFeaturedModelItem } from '@/lib/types/homepage';

interface FeaturedModelsEditorProps {
  models: HomeFeaturedModelItem[];
  onChange: (models: HomeFeaturedModelItem[]) => void;
}

export const FeaturedModelsEditor: React.FC<FeaturedModelsEditorProps> = ({ models, onChange }) => {
  const addModel = () => {
    onChange([
      ...models,
      {
        id: String(Date.now()),
        name: 'AP110-A PLUS',
        image: '/categories/弯梁车/AP110-A PLUS(白).png',
        watermark: 'APSONIC',
        href: '/products',
        colors: [
          { id: 'white', name: '珍珠白', hex: '#FFFFFF', image: '/categories/弯梁车/AP110-A PLUS(白).png' },
          { id: 'red', name: '激情红', hex: '#E31D1A', image: '/categories/弯梁车/AP110-A PLUS(红).png' },
        ],
      },
    ]);
  };

  const removeModel = (idx: number) => {
    onChange(models.filter((_, i) => i !== idx));
  };

  const updateModel = (idx: number, field: keyof HomeFeaturedModelItem, val: any) => {
    const updated = [...models];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange(updated);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-100 shadow-sm space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Featured Models Showcase (Section 2)</h2>
          <p className="text-xs text-zinc-500">Manage motorcycle models, names, and images displayed in the interactive showcase slider.</p>
        </div>
        <button
          type="button"
          onClick={addModel}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-green text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-green-700 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Model
        </button>
      </div>

      <div className="space-y-4">
        {models.map((m, i) => (
          <div key={m.id} className="border border-zinc-200/80 rounded-2xl p-4 bg-zinc-50/50 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <input
                type="text"
                value={m.name}
                onChange={(e) => updateModel(i, 'name', e.target.value)}
                placeholder="Model Name (e.g. AP125-30 ALOBA)"
                className="px-3 py-1.5 border border-zinc-200 rounded-xl bg-white text-xs font-bold w-1/3"
              />
              <input
                type="text"
                value={m.watermark || ''}
                onChange={(e) => updateModel(i, 'watermark', e.target.value)}
                placeholder="Watermark (APSONIC)"
                className="px-3 py-1.5 border border-zinc-200 rounded-xl bg-white text-xs w-1/3"
              />
              <input
                type="text"
                value={m.href || ''}
                onChange={(e) => updateModel(i, 'href', e.target.value)}
                placeholder="Target URL (/products)"
                className="px-3 py-1.5 border border-zinc-200 rounded-xl bg-white text-xs w-1/4"
              />
              <button type="button" onClick={() => removeModel(i)} className="text-red-500 hover:text-red-700 p-1.5 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <SectionImageUpload
              label="Model Photo"
              description="Upload or update main showcase image for this model"
              value={m.image}
              onChange={(url) => updateModel(i, 'image', url)}
              accept="image/*"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
