'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CollapsibleCard } from '@/components/admin/shared/CollapsibleCard';
import { CompactMediaField } from '@/components/admin/shared/CompactMediaField';
import { HomeFeaturedModelItem } from '@/lib/types/homepage';

interface FeaturedModelsEditorProps {
  models: HomeFeaturedModelItem[];
  onChange: (models: HomeFeaturedModelItem[]) => void;
}

const INPUT = 'w-full px-3 py-2 border border-zinc-200 rounded-xl bg-white text-xs';

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

  // Edits are matched by id so they always apply to the right row.
  const updateModel = <K extends keyof HomeFeaturedModelItem>(id: string, field: K, val: HomeFeaturedModelItem[K]) =>
    onChange(models.map((m) => (m.id === id ? { ...m, [field]: val } : m)));

  return (
    <CollapsibleCard
      title="Featured models"
      summary={`${models.length} model${models.length === 1 ? '' : 's'}`}
      defaultOpen={false}
      actions={
        <button type="button" onClick={addModel} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-green text-white font-bold text-[11px] rounded-lg hover:bg-green-700 cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Add model
        </button>
      }
    >
      <p className="mb-3 text-[11px] text-zinc-400">Model names are product names, so they are the same in English, French and Chinese.</p>
      <ul className="divide-y divide-zinc-100">
        {models.map((m) => (
          <li key={m.id} className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,1fr))_auto] gap-2 items-center py-2.5">
            <CompactMediaField value={m.image} onChange={(url) => updateModel(m.id, 'image', url)} />
            <input className={`${INPUT} font-bold`} value={m.name} onChange={(e) => updateModel(m.id, 'name', e.target.value)} placeholder="Model name" aria-label="Model name" />
            <input className={INPUT} value={m.watermark || ''} onChange={(e) => updateModel(m.id, 'watermark', e.target.value)} placeholder="Watermark" aria-label="Watermark" />
            <input className={INPUT} value={m.href || ''} onChange={(e) => updateModel(m.id, 'href', e.target.value)} placeholder="Link (/products)" aria-label="Link" />
            <button type="button" aria-label="Remove model" onClick={() => onChange(models.filter((x) => x.id !== m.id))} className="justify-self-end p-2 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer">
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </CollapsibleCard>
  );
};
