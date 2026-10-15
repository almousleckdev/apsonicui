import React, { useState } from 'react';
import { SectionImageUpload } from './SectionImageUpload';
import { ColorVariantEditor } from './ColorVariantEditor';
import { SpecBannerEditor } from './SpecBannerEditor';
import { TechSpecEditor } from './TechSpecEditor';
import { CategoryItem } from '@/services/category';
import { CreateProductPayload } from '@/services/product';
import { FileText, Image as ImageIcon } from 'lucide-react';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';

interface ProductFormContentProps {
  formData: CreateProductPayload;
  setFormData: React.Dispatch<React.SetStateAction<CreateProductPayload>>;
  categories: CategoryItem[];
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

export const ProductFormContent: React.FC<ProductFormContentProps> = ({
  formData,
  setFormData,
  categories,
  isEditing,
  onSubmit,
}) => {
  const { t } = useAdminText();
  const [activeTab, setActiveTab] = useState<'basic' | 'sections' | 'colors' | 'specs'>('basic');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [specMode, setSpecMode] = useState<'image' | 'table'>(
    Boolean(formData.aestheticBgImage && (!formData.specs || formData.specs.length === 0))
      ? 'image'
      : 'table'
  );

  const handleModelNameChange = (val: string) => {
    setFormData((prev) => {
      const updated = { ...prev, modelName: val };
      if (!isSlugManuallyEdited && !isEditing) {
        updated.slug = slugify(val);
      }
      return updated;
    });
  };

  return (
    <form id="product-form" onSubmit={onSubmit} className="space-y-6 text-xs font-medium font-sans">
      {/* Form Tabs */}
      <div className="flex border-b border-zinc-200 pb-3 gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('basic')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${activeTab === 'basic' ? 'bg-brand-green text-white shadow-sm' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
        >
          <T id="products.form.tabs.basic" />
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${activeTab === 'sections' ? 'bg-brand-green text-white shadow-sm' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
        >
          <T id="products.form.tabs.sections" />
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('colors')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${activeTab === 'colors' ? 'bg-brand-green text-white shadow-sm' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
        >
          <T id="products.form.tabs.colors" />
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('specs')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${activeTab === 'specs' ? 'bg-brand-green text-white shadow-sm' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
        >
          <T id="products.form.tabs.specs" />
        </button>
      </div>

      {/* Tab 1: Basic Info */}
      {activeTab === 'basic' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-700 font-bold mb-1"><T id="products.form.modelName" /></label>
              <input
                type="text"
                required
                value={formData.modelName}
                onChange={(e) => handleModelNameChange(e.target.value)}
                placeholder={t('products.form.modelPlaceholder')}
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-700 font-bold mb-1"><T id="products.form.slug" /></label>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => {
                  setIsSlugManuallyEdited(true);
                  setFormData((prev) => ({ ...prev, slug: e.target.value }));
                }}
                placeholder={t('products.form.slugPlaceholder')}
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-zinc-700 font-bold mb-1"><T id="products.form.category" /></label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameEn || c.name} ({c.brand})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-zinc-700 font-bold mb-1"><T id="products.form.brand" /></label>
              <select
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none"
              >
                <option value="apsonic">APSONIC</option>
                <option value="apsonic-pro">APSONIC PRO</option>
              </select>
            </div>
            <div>
              <label className="block text-zinc-700 font-bold mb-1"><T id="products.form.displacement" /></label>
              <input
                type="number"
                value={formData.displacement || ''}
                onChange={(e) => setFormData({ ...formData, displacement: Number(e.target.value) })}
                placeholder="110"
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <SectionImageUpload
            label={<T id="products.form.cover" />}
            description={<T id="products.form.coverHint" />}
            value={formData.coverImageUrl}
            onChange={(url) => setFormData({ ...formData, coverImageUrl: url })}
          />

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-zinc-300 text-brand-green"
              />
              <T id="products.form.featured" />
            </label>
            <label className="flex items-center gap-2 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded border-zinc-300 text-brand-green"
              />
              <T id="products.form.activeInCatalogue" />
            </label>
          </div>
        </div>
      )}

      {/* Tab 2: Detail Section Pictures */}
      {activeTab === 'sections' && (
        <div className="space-y-4">
          <SectionImageUpload
            label={<T id="products.form.hero" />}
            description={<T id="products.form.heroHint" />}
            value={formData.heroImageUrl}
            onChange={(url) => setFormData({ ...formData, heroImageUrl: url })}
          />

          <SectionImageUpload
            label={<T id="products.form.performance" />}
            description={<T id="products.form.performanceHint" />}
            value={formData.performanceImageUrl}
            onChange={(url) => setFormData({ ...formData, performanceImageUrl: url })}
          />

          <SpecBannerEditor
            banners={formData.specBanners || []}
            onChange={(banners) => setFormData({ ...formData, specBanners: banners })}
          />
        </div>
      )}

      {/* Tab 3: Colors & Variants */}
      {activeTab === 'colors' && (
        <div>
          <ColorVariantEditor
            colors={formData.colors || []}
            onChange={(colors) => setFormData({ ...formData, colors })}
          />
        </div>
      )}

      {/* Tab 4: Tech Specs (Mutually Exclusive: Spec Sheet Image OR Structured Table) */}
      {activeTab === 'specs' && (
        <div className="space-y-6">
          <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 space-y-3">
            <label className="block text-zinc-900 font-bold text-xs"><T id="products.form.specMode" /></label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setSpecMode('image');
                  setFormData((prev) => ({ ...prev, specs: [] }));
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  specMode === 'image'
                    ? 'bg-brand-green text-white shadow-sm'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span><T id="products.form.specImage" /></span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSpecMode('table');
                  setFormData((prev) => ({ ...prev, aestheticBgImage: '' }));
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  specMode === 'table'
                    ? 'bg-brand-green text-white shadow-sm'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span><T id="products.form.specTable" /></span>
              </button>
            </div>
            <p className="text-2xs text-zinc-500">
              <T id="products.form.specHint" />
            </p>
          </div>

          {specMode === 'image' ? (
            <SectionImageUpload
              label={<T id="products.form.specImageLabel" />}
              description={<T id="products.form.specImageHint" />}
              value={formData.aestheticBgImage || ''}
              onChange={(url) => setFormData({ ...formData, aestheticBgImage: url, specs: [] })}
            />
          ) : (
            <TechSpecEditor
              specs={formData.specs || []}
              onChange={(specs) => setFormData({ ...formData, specs, aestheticBgImage: '' })}
            />
          )}
        </div>
      )}
    </form>
  );
};
export const ProductFormModalContent = ProductFormContent;
