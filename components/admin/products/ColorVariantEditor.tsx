import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ProductColorPayload } from '@/services/product';
import { SectionImageUpload } from './SectionImageUpload';

interface ColorVariantEditorProps {
  colors: ProductColorPayload[];
  onChange: (colors: ProductColorPayload[]) => void;
}

export const ColorVariantEditor: React.FC<ColorVariantEditorProps> = ({
  colors,
  onChange,
}) => {
  const addColor = () => {
    onChange([
      ...colors,
      { colorName: 'New Color', hexCode: '#FFFFFF', imageUrl: '', displayOrder: colors.length + 1 },
    ]);
  };

  const removeColor = (idx: number) => {
    onChange(colors.filter((_, i) => i !== idx));
  };

  const updateColor = <K extends keyof ProductColorPayload>(idx: number, field: K, val: ProductColorPayload[K]) => {
    const updated = [...colors];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-zinc-900 font-bold text-xs">Color Variants</label>
          <p className="text-[11px] text-zinc-500">Configure motorcycle paint colors and matching photos.</p>
        </div>
        <button
          type="button"
          onClick={addColor}
          className="px-3.5 py-1.5 bg-emerald-50 text-brand-green border border-brand-green/30 hover:bg-emerald-100 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> + Add Color
        </button>
      </div>

      {colors.map((c, i) => (
        <div key={i} className="border border-zinc-200/80 rounded-2xl p-4 bg-zinc-50/50 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={c.hexCode || '#ffffff'}
                onChange={(e) => updateColor(i, 'hexCode', e.target.value)}
                className="w-8 h-8 rounded-lg border border-zinc-200 cursor-pointer"
              />
              <input
                type="text"
                value={c.colorName}
                onChange={(e) => updateColor(i, 'colorName', e.target.value)}
                placeholder="Color Name (e.g. Red)"
                className="px-3 py-1.5 border border-zinc-200 rounded-xl bg-white text-xs font-bold"
              />
            </div>
            <button type="button" onClick={() => removeColor(i)} className="text-red-500 hover:text-red-700 p-1.5 cursor-pointer">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <SectionImageUpload
            label="Variant Motorcycle Picture"
            description="Motorcycle photo matching this color choice"
            value={c.imageUrl}
            onChange={(url) => updateColor(i, 'imageUrl', url)}
          />
        </div>
      ))}
    </div>
  );
};
