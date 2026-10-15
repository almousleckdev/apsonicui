import React, { useState } from 'react';
import { CreateCategoryPayload } from '@/services/category';
import { groupLabel, type ProductMenuGroup } from '@/lib/product-menu/groups';
import { CompactMediaField } from '@/components/admin/shared/CompactMediaField';
import { LanguageTabs, type AdminLang } from '@/components/admin/shared/LanguageTabs';

interface CategoryFormModalContentProps {
  formData: CreateCategoryPayload;
  setFormData: React.Dispatch<React.SetStateAction<CreateCategoryPayload>>;
  isEditing: boolean;
  groups: ProductMenuGroup[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const CategoryFormModalContent: React.FC<CategoryFormModalContentProps> = ({
  formData,
  setFormData,
  isEditing,
  groups,
  onSubmit,
  onCancel,
}) => {
  const [lang, setLang] = useState<AdminLang>('en');
  const nameKey = ({ en: 'nameEn', fr: 'nameFr', zh: 'nameZh' } as const)[lang];
  const NAME_PLACEHOLDER: Record<AdminLang, string> = { en: 'Street / Knight / Off-Road', fr: 'Urbaine', zh: '街车 / 骑士车 / 越野车' };

  return (
    <form
      onSubmit={(e) => {
        if (!formData.nameEn.trim()) {
          e.preventDefault();
          setLang('en'); // the English name is the required fallback
          return;
        }
        onSubmit(e);
      }} className="space-y-4 text-xs font-medium font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-zinc-700 font-bold mb-1">Slug (Identifier)</label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="e.g. street"
            className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-zinc-700 font-bold mb-1">Vehicle Category (Dropdown Group)</label>
          <select
            value={formData.parentType || 'two-wheeler'}
            onChange={(e) => setFormData({ ...formData, parentType: e.target.value })}
            className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none font-bold text-zinc-800"
          >
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {groupLabel(g, 'en')}
                {g.labelZh ? ` / ${g.labelZh}` : ''}
              </option>
            ))}
            {formData.parentType && !groups.some((g) => g.id === formData.parentType) && (
              <option value={formData.parentType}>{formData.parentType} (group removed)</option>
            )}
          </select>
        </div>
        <div>
          <label className="block text-zinc-700 font-bold mb-1">Brand</label>
          <select
            value={formData.brand || 'apsonic'}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none"
          >
            <option value="apsonic">APSONIC</option>
            <option value="apsonic-pro">APSONIC PRO</option>
          </select>
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between gap-2">
          <label htmlFor="category-name" className="block text-zinc-700 font-bold">
            Name {lang === 'en' && '*'}
          </label>
          <LanguageTabs value={lang} onChange={setLang} />
        </div>
        <input
          id="category-name"
          type="text"
          required={lang === 'en'}
          value={formData[nameKey] || ''}
          onChange={(e) => setFormData({ ...formData, [nameKey]: e.target.value })}
          placeholder={NAME_PLACEHOLDER[lang]}
          className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none"
        />
        {lang !== 'en' ? (
          <p className="mt-1 text-[11px] text-zinc-400">If empty, visitors using this language see the English name.</p>
        ) : !formData.nameEn.trim() ? (
          <p className="mt-1 text-[11px] text-zinc-400">The English name is required.</p>
        ) : null}
      </div>

      <div>
        <label className="block text-zinc-700 font-bold mb-1">Cover picture</label>
        <CompactMediaField
          value={formData.imageUrl}
          onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-zinc-700 font-bold mb-1">Display Order</label>
          <input
            type="number"
            value={formData.displayOrder || 0}
            onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            id="activeToggle"
            checked={formData.active}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            className="rounded border-zinc-300 text-brand-green focus:ring-brand-green w-4 h-4 cursor-pointer"
          />
          <label htmlFor="activeToggle" className="text-zinc-800 font-bold cursor-pointer">Active in Catalog & Dropdown</label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-brand-green hover:bg-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-brand-green/20 transition-all cursor-pointer"
        >
          {isEditing ? 'Save Changes' : 'Create Category'}
        </button>
      </div>
    </form>
  );
};
