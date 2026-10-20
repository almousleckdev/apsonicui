import React, { useState } from 'react';
import { CreateCategoryPayload } from '@/services/category';
import { groupLabel, type ProductMenuGroup } from '@/lib/product-menu/groups';
import { CompactMediaField } from '@/components/admin/shared/CompactMediaField';
import { LanguageTabs, type AdminLang } from '@/components/admin/shared/LanguageTabs';
import { CopyFromLanguage } from '@/components/admin/shared/CopyFromLanguage';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';

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
  const { t } = useAdminText();
  const [lang, setLang] = useState<AdminLang>('en');
  const [attempted, setAttempted] = useState(false);
  const missingImage = attempted && !formData.imageUrl?.trim();
  const nameKey = ({ en: 'nameEn', fr: 'nameFr', zh: 'nameZh' } as const)[lang];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setAttempted(true);
        if (!formData.nameEn.trim()) {
          setLang('en'); // the English name is the required fallback
          return;
        }
        if (!formData.imageUrl?.trim()) return;
        onSubmit(e);
      }} className="space-y-4 text-xs font-medium font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-zinc-700 font-bold mb-1"><T id="categories.form.slug" /></label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder={t('categories.form.slugPlaceholder')}
            className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-zinc-700 font-bold mb-1"><T id="categories.form.group" /></label>
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
              <option value={formData.parentType}>{t('categories.form.groupGone', { id: formData.parentType })}</option>
            )}
          </select>
        </div>
        <div>
          <label className="block text-zinc-700 font-bold mb-1"><T id="categories.form.brand" /></label>
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
            <T id="categories.form.name" />{lang === 'en' && ' *'}
          </label>
          <LanguageTabs value={lang} onChange={setLang} />
        </div>
        <input
          id="category-name"
          type="text"
          required={lang === 'en'}
          value={formData[nameKey] || ''}
          onChange={(e) => setFormData({ ...formData, [nameKey]: e.target.value })}
          placeholder={t(`categories.form.namePlaceholder.${lang}`)}
          className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none"
        />
        <CopyFromLanguage current={lang} values={{ en: formData.nameEn, fr: formData.nameFr, zh: formData.nameZh }}
          onCopy={(text) => setFormData((prev) => ({ ...prev, [nameKey]: text }))} />
        {lang !== 'en' ? (
          <p className="mt-1 text-2xs text-zinc-400"><T id="categories.groupForm.hintOther" /></p>
        ) : !formData.nameEn.trim() ? (
          <p className="mt-1 text-2xs text-zinc-400"><T id="categories.form.englishRequired" /></p>
        ) : null}
      </div>

      <div>
        <label className="block text-zinc-700 font-bold mb-1"><T id="categories.form.cover" /> *</label>
        <CompactMediaField
          value={formData.imageUrl}
          onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
        />
        {missingImage && <p role="alert" className="mt-1 text-2xs font-medium text-red-600"><T id="categories.form.coverRequired" /></p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-zinc-700 font-bold mb-1"><T id="categories.form.order" /></label>
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
          <label htmlFor="activeToggle" className="text-zinc-800 font-bold cursor-pointer"><T id="categories.form.active" /></label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
        >
          <T id="common.cancel" />
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-brand-green hover:bg-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-brand-green/20 transition-all cursor-pointer"
        >
          <T id={isEditing ? 'categories.form.save' : 'categories.form.create'} />
        </button>
      </div>
    </form>
  );
};
