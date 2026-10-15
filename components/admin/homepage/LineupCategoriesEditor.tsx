'use client';

import { CopyFromLanguage } from '@/components/admin/shared/CopyFromLanguage';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';
import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CollapsibleCard } from '@/components/admin/shared/CollapsibleCard';
import { CompactMediaField } from '@/components/admin/shared/CompactMediaField';
import { LanguageTabs, type AdminLang } from '@/components/admin/shared/LanguageTabs';
import { HomeCategoryItem } from '@/lib/types/homepage';

interface LineupCategoriesEditorProps {
  categories: HomeCategoryItem[];
  onChange: (categories: HomeCategoryItem[]) => void;
}

const NAME_FIELD: Record<AdminLang, 'name' | 'nameFr' | 'nameZh'> = { en: 'name', fr: 'nameFr', zh: 'nameZh' };
const INPUT = 'w-full px-3 py-2 border border-zinc-200 rounded-xl bg-white text-xs';

export const LineupCategoriesEditor: React.FC<LineupCategoriesEditorProps> = ({ categories, onChange }) => {
  const { t } = useAdminText();
  const [lang, setLang] = useState<AdminLang>('en');

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

  const updateCategory = <K extends keyof HomeCategoryItem>(id: string, field: K, val: HomeCategoryItem[K]) =>
    onChange(categories.map((c) => (c.id === id ? { ...c, [field]: val } : c)));

  const field = NAME_FIELD[lang];

  return (
    <CollapsibleCard
      title={<T id="home.lineup.title" />}
      summary={t('home.lineup.count', { count: categories.length })}
      defaultOpen={false}
      actions={
        <>
          <LanguageTabs value={lang} onChange={setLang} />
          <button type="button" onClick={addCategory} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-green text-white font-bold text-2xs rounded-lg hover:bg-green-700 cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> <T id="home.lineup.add" />
          </button>
        </>
      }
    >
      {lang !== 'en' && <p className="mb-2 text-2xs text-zinc-400"><T id="home.lineup.emptyFallback" /></p>}
      <ul className="divide-y divide-zinc-100">
        {categories.map((c) => (
          <li key={c.id} className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-2 items-center py-2.5">
            <CompactMediaField value={c.image} onChange={(url) => updateCategory(c.id, 'image', url)} />
            <div>
              <input className={`${INPUT} font-bold`} value={c[field] || ''} onChange={(e) => updateCategory(c.id, field, e.target.value)} placeholder={t(`home.lineup.name.${lang}`)} aria-label={t(`home.lineup.name.${lang}`)} />
              <CopyFromLanguage current={lang} values={{ en: c.name, fr: c.nameFr, zh: c.nameZh }} onCopy={(text) => updateCategory(c.id, field, text)} />
            </div>
            <input className={INPUT} value={c.href || ''} onChange={(e) => updateCategory(c.id, 'href', e.target.value)} placeholder={t('home.models.link')} aria-label={t('home.models.link')} />
            <button type="button" aria-label={t('home.lineup.remove')} onClick={() => onChange(categories.filter((x) => x.id !== c.id))} className="justify-self-end p-2 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer">
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </CollapsibleCard>
  );
};
