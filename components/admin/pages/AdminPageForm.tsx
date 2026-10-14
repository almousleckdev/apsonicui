'use client';

import React, { useState, useEffect } from 'react';
import { AdminBackNav } from '@/components/admin/AdminBackNav';
import { Save, Eye, Globe } from 'lucide-react';
import type { CmsPageRequest, CmsPageDto, CmsPageSectionDto, PageStatus, Locale, CmsPageTranslationDto } from '@/lib/types/cms-page';
import { useToast } from '@/components/ui/Toast';
import { PageBuilderCanvas } from './PageBuilderCanvas';

interface AdminPageFormProps {
  initialData?: CmsPageDto;
  onSubmit: (payload: CmsPageRequest) => Promise<CmsPageDto | void>;
  isEditing?: boolean;
}

const DEFAULT_TRANSLATION: CmsPageTranslationDto = { title: '', navLabel: '', seoTitle: '', seoDescription: '' };

export const AdminPageForm: React.FC<AdminPageFormProps> = ({
  initialData,
  onSubmit,
  isEditing = false,
}) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  // Master State
  const [activeLocale, setActiveLocale] = useState<Locale>('en');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState<PageStatus>('DRAFT');
  const [navVisibility, setNavVisibility] = useState(false);
  const [navPosition, setNavPosition] = useState('HEADER_MAIN');
  const [navOrder, setNavOrder] = useState(0);
  
  const [translations, setTranslations] = useState<Record<string, CmsPageTranslationDto>>({
    en: { ...DEFAULT_TRANSLATION },
    fr: { ...DEFAULT_TRANSLATION },
    zh: { ...DEFAULT_TRANSLATION }
  });
  
  const [sections, setSections] = useState<CmsPageSectionDto[]>([]);

  useEffect(() => {
    if (initialData) {
      setSlug(initialData.slug);
      setStatus(initialData.status);
      setNavVisibility(initialData.navVisibility);
      setNavPosition(initialData.navPosition || 'HEADER_MAIN');
      setNavOrder(initialData.navOrder || 0);
      setSections(initialData.sections || []);
      
      if (initialData.translations) {
        setTranslations({
          en: initialData.translations.en || { ...DEFAULT_TRANSLATION },
          fr: initialData.translations.fr || { ...DEFAULT_TRANSLATION },
          zh: initialData.translations.zh || { ...DEFAULT_TRANSLATION }
        });
      }
    }
  }, [initialData]);

  const handleTranslationChange = (key: keyof CmsPageTranslationDto, value: string) => {
    setTranslations(prev => ({
      ...prev,
      [activeLocale]: {
        ...prev[activeLocale],
        [key]: value
      }
    }));
  };

  const submitForm = async (targetStatus: PageStatus) => {
    if (!translations.en.title || !slug) {
      toast.error('English Title and Slug are required.');
      return;
    }
    
    setSaving(true);
    try {
      const payload: CmsPageRequest = {
        slug,
        status: targetStatus,
        navVisibility,
        navPosition,
        navOrder,
        translations,
        sections: sections.map((sec, i) => ({ ...sec, sectionOrder: i })),
      };
      
      await onSubmit(payload);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    if (!initialData?.id) {
      toast.error('Please save as draft first before previewing.');
      return;
    }
    window.open(`/en/admin/pages/${initialData.id}/preview`, '_blank');
  };

  const activeTranslation = translations[activeLocale] || DEFAULT_TRANSLATION;

  return (
    <div className="space-y-6 pb-32">
      {/* Global Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm sticky top-4 z-40">
        <div>
          <AdminBackNav href="/admin/pages" />
          <div className="flex items-center gap-3 mt-2">
            <h1 className="text-xl font-bold text-zinc-900">
              {isEditing ? `Editing: ${translations.en.title || slug}` : 'Create New Page'}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${status === 'PUBLISHED' ? 'bg-brand-green/10 text-brand-green' : 'bg-amber-100 text-amber-700'}`}>
              {status}
            </span>
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => submitForm('DRAFT')}
            disabled={saving}
            className="px-4 py-2 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 text-sm font-bold rounded-xl transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>
          
          <button
            onClick={handlePreview}
            className="px-4 py-2 bg-zinc-900 text-white hover:bg-zinc-800 text-sm font-bold rounded-xl transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
          
          <button
            onClick={() => submitForm('PUBLISHED')}
            disabled={saving}
            className="px-5 py-2 bg-brand-green text-white hover:bg-emerald-700 text-sm font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <Globe className="w-4 h-4" /> Publish Live
          </button>
        </div>
      </div>

      {/* Language Switcher Tabs */}
      <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl w-fit">
        {(['en', 'fr', 'zh'] as Locale[]).map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => setActiveLocale(loc)}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeLocale === loc 
                ? 'bg-white text-zinc-900 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50'
            }`}
          >
            {loc === 'en' ? 'English' : loc === 'fr' ? 'Français' : '中文'}
          </button>
        ))}
      </div>

      {/* Page Settings & SEO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 mb-4">Page Information</h2>
          
          <div>
            <label className="block text-sm font-bold text-zinc-900 mb-1.5">Page Title ({activeLocale.toUpperCase()})</label>
            <input 
              type="text" 
              value={activeTranslation.title}
              onChange={(e) => handleTranslationChange('title', e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all text-sm"
              placeholder="e.g. About Us"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-900 mb-1.5">URL Slug</label>
            <div className="flex items-center">
              <span className="px-4 py-2.5 bg-zinc-100 border border-r-0 border-zinc-200 rounded-l-xl text-zinc-500 text-sm font-medium">/</span>
              <input 
                type="text" 
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-r-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all text-sm"
                placeholder="about-us"
              />
            </div>
          </div>
        </div>

        {/* SEO & Navigation */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 mb-4">SEO & Navigation</h2>
          
          <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200/80">
            <input
              type="checkbox"
              id="navVisibility"
              checked={navVisibility}
              onChange={(e) => setNavVisibility(e.target.checked)}
              className="w-4 h-4 text-brand-green rounded focus:ring-brand-green"
            />
            <label htmlFor="navVisibility" className="text-sm font-bold text-zinc-900 cursor-pointer">
              Show in Website Navigation
            </label>
          </div>

          {navVisibility && (
            <div>
              <label className="block text-sm font-bold text-zinc-900 mb-1.5">Navigation Label ({activeLocale.toUpperCase()})</label>
              <input 
                type="text" 
                value={activeTranslation.navLabel}
                onChange={(e) => handleTranslationChange('navLabel', e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all text-sm"
                placeholder="Label in menu (defaults to title)"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-zinc-900 mb-1.5">SEO Description ({activeLocale.toUpperCase()})</label>
            <textarea 
              value={activeTranslation.seoDescription}
              onChange={(e) => handleTranslationChange('seoDescription', e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all text-sm min-h-[80px]"
              placeholder="Meta description for search engines..."
            />
          </div>
        </div>
      </div>

      {/* Sections Canvas */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-zinc-900 mb-6">Page Content Sections</h2>
        <PageBuilderCanvas 
          sections={sections} 
          setSections={setSections} 
          activeLocale={activeLocale} 
        />
      </div>
    </div>
  );
};
