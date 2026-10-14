import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ProductSpecPayload } from '@/services/product';

interface TechSpecEditorProps {
  specs: ProductSpecPayload[];
  onChange: (specs: ProductSpecPayload[]) => void;
}

const DEFAULT_SPEC_SUGGESTIONS = [
  { key: 'MAX SPEED', value: '95', unit: 'KM/H', isKey: true },
  { key: 'FUEL TANK CAPACITY', value: '4.5', unit: 'L', isKey: true },
  { key: 'N.W', value: '98', unit: 'KG', isKey: true },
  { key: 'GROUND CLEARANCE', value: '150', unit: 'MM', isKey: true },
  { key: 'DISPLACEMENT(ML)', value: '109.7', unit: 'ML', isKey: false },
  { key: 'Wheelbase(MM)', value: '1225', unit: 'MM', isKey: false },
  { key: 'BORE(MM)XSTROKE(MM)', value: '50.0 x 55.6', unit: 'MM', isKey: false },
  { key: 'L(MM)XW(MM)XH(MM)', value: '1920 x 700 x 1080', unit: 'MM', isKey: false },
  { key: 'COMPRESSION RATIO', value: '9.0:1', unit: '', isKey: false },
  { key: 'MIN GROUND CLEARANCE(MM)', value: '150', unit: 'MM', isKey: false },
  { key: 'MAX POWER(KW/RPM)', value: '5.5 / 7500', unit: 'KW/RPM', isKey: false },
  { key: 'N.W(KG)', value: '98', unit: 'KG', isKey: false },
  { key: 'MAX TORQUE(N.m/RPM)', value: '7.8 / 5500', unit: 'N.m/RPM', isKey: false },
  { key: 'BRAKE', value: 'Disc / Drum', unit: '', isKey: false },
  { key: 'TYRE SIZE', value: '2.50-17 / 2.75-17', unit: '', isKey: false },
  { key: 'IGNITION', value: 'CDI', unit: '', isKey: false },
  { key: 'STARTER', value: 'Electric / Kick', unit: '', isKey: false },
  { key: 'CLUTCH TYPE', value: 'Semi-Automatic / 4-Speed', unit: '', isKey: false },
];

export const TechSpecEditor: React.FC<TechSpecEditorProps> = ({
  specs,
  onChange,
}) => {
  const addSpec = (isKeyMetric = false) => {
    onChange([
      ...specs,
      {
        specKey: '',
        specValue: '',
        specGroup: isKeyMetric ? 'KEY_METRIC' : 'ENGINE',
        unit: '',
        isKeyMetric,
        displayOrder: specs.length + 1,
      },
    ]);
  };

  const populateDefaults = () => {
    const formatted: ProductSpecPayload[] = DEFAULT_SPEC_SUGGESTIONS.map((s, idx) => ({
      specKey: s.key,
      specValue: s.value,
      specGroup: s.isKey ? 'KEY_METRIC' : 'ENGINE',
      unit: s.unit,
      isKeyMetric: s.isKey,
      displayOrder: idx + 1,
    }));
    onChange(formatted);
  };

  const removeSpec = (idx: number) => {
    onChange(specs.filter((_, i) => i !== idx));
  };

  const updateSpec = (idx: number, field: keyof ProductSpecPayload, val: any) => {
    const updated = [...specs];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <label className="block text-zinc-900 font-bold text-xs">Technical Specifications Table</label>
          <p className="text-[11px] text-zinc-500">Type key metrics and detailed engineering spec rows.</p>
        </div>
        <div className="flex items-center gap-2">
          {specs.length === 0 && (
            <button
              type="button"
              onClick={populateDefaults}
              className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Fill Template Specs
            </button>
          )}
          <button
            type="button"
            onClick={() => addSpec(true)}
            className="px-3 py-1.5 bg-emerald-50 text-brand-green border border-brand-green/30 hover:bg-emerald-100 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> + Key Metric
          </button>
          <button
            type="button"
            onClick={() => addSpec(false)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> + Spec Row
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {specs.map((s, i) => (
          <div key={i} className="flex items-center gap-2 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/80">
            <input
              type="text"
              value={s.specKey}
              onChange={(e) => updateSpec(i, 'specKey', e.target.value)}
              placeholder="Specification Name (e.g. MAX SPEED, Wheelbase)"
              className="flex-1 px-3 py-1.5 border border-zinc-200 rounded-lg bg-white text-xs font-bold focus:outline-none"
            />
            <input
              type="text"
              value={s.specValue}
              onChange={(e) => updateSpec(i, 'specValue', e.target.value)}
              placeholder="Value (e.g. 95, 1225)"
              className="flex-1 px-3 py-1.5 border border-zinc-200 rounded-lg bg-white text-xs focus:outline-none"
            />
            <input
              type="text"
              value={s.unit || ''}
              onChange={(e) => updateSpec(i, 'unit', e.target.value)}
              placeholder="Unit (KM/H, MM)"
              className="w-24 px-2.5 py-1.5 border border-zinc-200 rounded-lg bg-white text-xs focus:outline-none"
            />
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-700 px-2 cursor-pointer bg-white py-1.5 border border-zinc-200 rounded-lg">
              <input
                type="checkbox"
                checked={s.isKeyMetric || false}
                onChange={(e) => updateSpec(i, 'isKeyMetric', e.target.checked)}
                className="rounded border-zinc-300 text-brand-green focus:ring-brand-green"
              />
              Top Metric
            </label>
            <button type="button" onClick={() => removeSpec(i)} className="text-red-500 hover:text-red-700 p-1.5 cursor-pointer">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
