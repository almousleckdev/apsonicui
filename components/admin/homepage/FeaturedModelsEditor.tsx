'use client';

import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CollapsibleCard } from '@/components/admin/shared/CollapsibleCard';
import { CompactMediaField } from '@/components/admin/shared/CompactMediaField';
import { HomeFeaturedModelItem } from '@/lib/types/homepage';

interface FeaturedModelsEditorProps {
  models: HomeFeaturedModelItem[];
  onChange: (models: HomeFeaturedModelItem[]) => void;
}

type ModelColor = NonNullable<HomeFeaturedModelItem['colors']>[number];

const INPUT = 'w-full px-3 py-2 border border-zinc-200 rounded-xl bg-white text-xs';

export const FeaturedModelsEditor: React.FC<FeaturedModelsEditorProps> = ({ models, onChange }) => {
  const { t } = useAdminText();
  // A new model starts completely empty: no picture, no colours, no background. Everything is added by the editor.
  const addModel = () => {
    onChange([
      ...models,
      { id: String(Date.now()), name: '', image: '', background: '', watermark: '', href: '/products', colors: [] },
    ]);
  };

  // Edits are matched by id so they always apply to the right row.
  const updateModel = <K extends keyof HomeFeaturedModelItem>(id: string, field: K, val: HomeFeaturedModelItem[K]) =>
    onChange(models.map((m) => (m.id === id ? { ...m, [field]: val } : m)));

  const setColors = (id: string, update: (colors: ModelColor[]) => ModelColor[]) =>
    onChange(models.map((m) => (m.id === id ? { ...m, colors: update(m.colors ?? []) } : m)));

  const addColor = (m: HomeFeaturedModelItem) =>
    setColors(m.id, (colors) => [...colors, { id: `color-${Date.now()}`, name: '', hex: '#000000', image: '' }]);

  const updateColor = (modelId: string, colorId: string, patch: Partial<ModelColor>) =>
    setColors(modelId, (colors) => colors.map((c) => (c.id === colorId ? { ...c, ...patch } : c)));

  return (
    <CollapsibleCard
      title={<T id="home.models.title" />}
      summary={t('home.models.count', { count: models.length })}
      defaultOpen={false}
      actions={
        <button type="button" onClick={addModel} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-green text-white font-bold text-2xs rounded-lg hover:bg-green-700 cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> <T id="home.models.add" />
        </button>
      }
    >
      <p className="mb-3 text-2xs text-zinc-400"><T id="home.models.note" /></p>
      <ul className="divide-y divide-zinc-100">
        {models.map((m, index) => {
          const previousBackground = index > 0 ? models[index - 1].background : undefined;
          return (
          <li key={m.id} className="py-2.5">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,1fr))_auto] gap-2 items-center">
            <CompactMediaField value={m.image} onChange={(url) => updateModel(m.id, 'image', url)} />
            <input className={`${INPUT} font-bold`} value={m.name} onChange={(e) => updateModel(m.id, 'name', e.target.value)} placeholder={t('home.models.name')} aria-label={t('home.models.name')} />
            <input className={INPUT} value={m.watermark || ''} onChange={(e) => updateModel(m.id, 'watermark', e.target.value)} placeholder={t('home.models.watermark')} aria-label={t('home.models.watermark')} />
            <input className={INPUT} value={m.href || ''} onChange={(e) => updateModel(m.id, 'href', e.target.value)} placeholder={t('home.models.link')} aria-label={t('home.models.link')} />
            <button type="button" aria-label={t('home.models.remove')} onClick={() => onChange(models.filter((x) => x.id !== m.id))} className="justify-self-end p-2 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer">
              <Trash2 className="w-4 h-4" />
            </button>
            </div>
            {!m.image && (
              <p className="mt-1.5 text-2xs font-bold text-amber-600"><T id="home.models.needsPicture" /></p>
            )}
            <div className="mt-2 ml-0 lg:ml-4 space-y-1.5 border-l-2 border-zinc-100 pl-3">
              <div className="mb-2 flex items-center gap-2">
                <span className="shrink-0 text-2xs font-bold uppercase tracking-wider text-zinc-400"><T id="home.models.modelBackground" /></span>
                <div className="min-w-0 flex-1"><CompactMediaField value={m.background} onChange={(url) => updateModel(m.id, 'background', url)} allowAddress /></div>
                {previousBackground && previousBackground !== m.background && (
                  <button type="button" onClick={() => updateModel(m.id, 'background', previousBackground)} className="text-2xs font-bold text-brand-green hover:underline cursor-pointer">
                    <T id="home.models.copyBackground" />
                  </button>
                )}
                {m.background && (
                  <button type="button" onClick={() => updateModel(m.id, 'background', '')} className="text-2xs font-bold text-zinc-500 hover:text-red-500 cursor-pointer">
                    <T id="home.models.backgroundRemove" />
                  </button>
                )}
              </div>
              <p className="text-2xs font-bold uppercase tracking-wider text-zinc-400"><T id="home.models.colors" /></p>
              {(m.colors ?? []).map((c) => (
                <div key={c.id} className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1.4fr)_auto] gap-2 items-center">
                  <input type="color" value={c.hex} onChange={(e) => updateColor(m.id, c.id, { hex: e.target.value })} aria-label={t('home.models.colorHex')} className="h-8 w-8 cursor-pointer rounded-full border border-zinc-200 bg-white p-0.5" />
                  <input className={INPUT} value={c.name} onChange={(e) => updateColor(m.id, c.id, { name: e.target.value })} placeholder={t('home.models.colorName')} aria-label={t('home.models.colorName')} />
                  <CompactMediaField value={c.image} onChange={(url) => updateColor(m.id, c.id, { image: url })} />
                  <button type="button" aria-label={t('home.models.removeColor')} onClick={() => setColors(m.id, (colors) => colors.filter((x) => x.id !== c.id))} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addColor(m)} className="inline-flex items-center gap-1 text-2xs font-bold text-brand-green hover:underline cursor-pointer">
                <Plus className="w-3 h-3" /> <T id="home.models.addColor" />
              </button>
            </div>
          </li>
          );
        })}
      </ul>
    </CollapsibleCard>
  );
};
