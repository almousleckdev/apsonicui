'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { SectionImageUpload } from '@/components/admin/products/SectionImageUpload';
import { HomeCategoryItem } from '@/lib/types/homepage';

interface LineupCategoriesEditorProps {
  categories: HomeCategoryItem[];
  onChange: (categories: HomeCategoryItem[]) => void;
}

export const LineupCategoriesEditor: React.FC<LineupCategoriesEditorProps> = ({ categories, onChange }) => {
  const addCategory = () => {
    onChange([
      ...categories,
      {
        id: `cat-${Date.now()}`,
        name: 'New Lineup',
        nameZh: '新分类',
        nameFr: 'Nouveau',
        image: '/categories/街车/AP125-27 (2.2).png',
        href: '/products',
      },
    ]);
  };

  const removeCategory = (idx: number) => {
    onChange(categories.filter((_, i) => i !== idx));
  };

  const updateCategory = <K extends keyof HomeCategoryItem>(idx: number, field: K, val: HomeCategoryItem[K]) => {
    const updated = [...categories];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange(updated);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-100 shadow-sm space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Lineup Categories Carousel (Section 3)</h2>
          <p className="text-xs text-zinc-500">Manage categories, titles, and pictures displayed in the lineup carousel.</p>
        </div>
        <button
          type="button"
          onClick={addCategory}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-green text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-green-700 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((c, i) => (
          <div key={c.id} className="border border-zinc-200/80 rounded-2xl p-4 bg-zinc-50/50 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                value={c.name}
                onChange={(e) => updateCategory(i, 'name', e.target.value)}
                placeholder="Name (EN)"
                className="px-3 py-1.5 border border-zinc-200 rounded-xl bg-white text-xs font-bold w-1/3"
              />
              <input
                type="text"
                value={c.nameZh || ''}
                onChange={(e) => updateCategory(i, 'nameZh', e.target.value)}
                placeholder="Name (ZH)"
                className="px-3 py-1.5 border border-zinc-200 rounded-xl bg-white text-xs font-bold w-1/3"
              />
              <input
                type="text"
                value={c.href || ''}
                onChange={(e) => updateCategory(i, 'href', e.target.value)}
                placeholder="Link (/products)"
                className="px-3 py-1.5 border border-zinc-200 rounded-xl bg-white text-xs w-1/4"
              />
              <button type="button" onClick={() => removeCategory(i)} className="text-red-500 hover:text-red-700 p-1.5 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <SectionImageUpload
              label="Lineup Category Picture"
              description="Photo for this category in the homepage carousel"
              value={c.image}
              onChange={(url) => updateCategory(i, 'image', url)}
              accept="image/*"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
