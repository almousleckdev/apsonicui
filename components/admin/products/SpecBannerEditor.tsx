import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ProductSpecBannerPayload } from '@/services/product';
import { SectionImageUpload } from './SectionImageUpload';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';

interface SpecBannerEditorProps {
  banners: ProductSpecBannerPayload[];
  onChange: (banners: ProductSpecBannerPayload[]) => void;
}

export const SpecBannerEditor: React.FC<SpecBannerEditorProps> = ({
  banners,
  onChange,
}) => {
  const { t } = useAdminText();
  const addBanner = () => {
    onChange([
      ...banners,
      {
        title: `Section ${banners.length + 3} Specification`,
        description: '',
        imageUrl: '',
        metricLabel: '',
        metricValue: '',
        metricUnit: '',
        displayOrder: banners.length + 1,
      },
    ]);
  };

  const removeBanner = (idx: number) => {
    onChange(banners.filter((_, i) => i !== idx));
  };

  const updateBanner = <K extends keyof ProductSpecBannerPayload>(idx: number, field: K, val: ProductSpecBannerPayload[K]) => {
    const updated = [...banners];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-zinc-900 font-bold text-xs">
            <T id="products.banner.title" />
          </label>
          <p className="text-2xs text-zinc-500">
            <T id="products.banner.hint" />
          </p>
        </div>
        <button
          type="button"
          onClick={addBanner}
          className="px-3.5 py-1.5 bg-emerald-50 text-brand-green border border-brand-green/30 hover:bg-emerald-100 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> <T id="products.banner.add" />
        </button>
      </div>

      {banners.map((b, i) => (
        <div key={i} className="border border-zinc-200/80 rounded-2xl p-4 bg-zinc-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={b.title}
              onChange={(e) => updateBanner(i, 'title', e.target.value)}
              placeholder={t('products.banner.sectionTitle')}
              className="px-3 py-1.5 border border-zinc-200 rounded-xl bg-white text-xs font-bold w-1/2"
            />
            <button type="button" onClick={() => removeBanner(i)} aria-label={t('products.banner.remove')} title={t('products.banner.remove')} className="text-red-500 hover:text-red-700 p-1.5 cursor-pointer">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <SectionImageUpload
            label={<T id="products.banner.picture" />}
            description={<T id="products.banner.pictureHint" />}
            value={b.imageUrl}
            onChange={(url) => updateBanner(i, 'imageUrl', url)}
          />
        </div>
      ))}
    </div>
  );
};
