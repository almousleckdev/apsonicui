'use client';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';
import { ActionModal } from "@/components/admin/ActionModal";

import React, { useState, useEffect } from 'react';
import { HeroSectionEditor } from '@/components/admin/homepage/HeroSectionEditor';
import { FeaturedModelsEditor } from '@/components/admin/homepage/FeaturedModelsEditor';
import { LineupCategoriesEditor } from '@/components/admin/homepage/LineupCategoriesEditor';
import { TestimonialsEditor } from '@/components/admin/homepage/TestimonialsEditor';
import { useToast } from '@/components/ui/Toast';
import { validateTestimonials } from '@/lib/homepage/testimonials';
import { homepageService } from '@/services/homepage-service';
import { HomePageConfig, DEFAULT_HOMEPAGE_CONFIG } from '@/lib/types/homepage';
import { Save, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AdminHomePage() {
  const [config, setConfig] = useState<HomePageConfig>(DEFAULT_HOMEPAGE_CONFIG);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useAdminText();
  // Problems are only shown after a first attempt to save, so a fresh "Add Testimonial" row is not red straight away.
  const [showTestimonialErrors, setShowTestimonialErrors] = useState(false);
  const testimonialErrors = validateTestimonials(config.testimonials);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const cfg = await homepageService.getHomepageConfig();
        setConfig(cfg);
      } catch (error) {
        console.error("Failed to load config", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(testimonialErrors).length > 0) {
      setShowTestimonialErrors(true);
      toast.error(t('home.testimonialsIncomplete'));
      document.getElementById('testimonials-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    try {
      await homepageService.saveHomepageConfig(config);
      setShowTestimonialErrors(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('home.saveFailed'));
    }
  };

  const [showResetModal, setShowResetModal] = useState(false);

  const handleReset = () => {
    setShowResetModal(true);
  };

  const confirmReset = async () => {
    try {
      const def = await homepageService.resetToDefault();
      setConfig(def);
      setShowResetModal(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('home.resetFailed'));
    }
  };

  if (loading) {
    return <><div className="p-8 text-center text-zinc-500 font-medium"><T id="home.loading" /></div></>;
  }

  return (
    <>
      <form onSubmit={handleSave} className="space-y-3 font-sans max-w-5xl mx-auto pb-12">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-4 py-3 rounded-2xl border border-zinc-100 shadow-sm">
          <div>
            <h1 className="text-base font-extrabold text-zinc-900 tracking-tight"><T id="home.title" layout="stack" /></h1>
            <p className="text-2xs text-zinc-500 font-medium"><T id="home.subtitle" /></p>
          </div>

          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 px-3.5 py-2.5 rounded-xl border border-emerald-200/60 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-brand-green" /> <T id="home.saved" />
              </span>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-2xs uppercase tracking-wider rounded-lg transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> <T id="home.reset" />
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green text-white font-bold text-2xs uppercase tracking-wider rounded-lg hover:bg-green-700 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> <T id="home.save" />
            </button>
          </div>
        </div>

        {/* 1. Hero Section Management */}
        <HeroSectionEditor hero={config.hero} onChange={(hero) => setConfig({ ...config, hero })} />

        {/* 2. Featured Models Section Management */}
        <FeaturedModelsEditor models={config.recommendedModels} onChange={(recommendedModels) => setConfig({ ...config, recommendedModels })} />

        {/* 3. Category Lineup Section Management */}
        <LineupCategoriesEditor categories={config.categories} onChange={(categories) => setConfig({ ...config, categories })} />

        {/* 4. Testimonials ("Community - Voices of the Continent") */}
        <TestimonialsEditor
          testimonials={config.testimonials}
          onChange={(update) => setConfig((current) => ({ ...current, testimonials: update(current.testimonials) }))}
          visible={config.visibility.showVoices}
          onVisibleChange={(showVoices) => setConfig((current) => ({ ...current, visibility: { ...current.visibility, showVoices } }))}
          errors={testimonialErrors}
          showErrors={showTestimonialErrors}
        />

        <ActionModal
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
          onConfirm={confirmReset}
          variant="danger"
          title={t('home.resetTitle')}
          description={t('home.resetText')}
          confirmLabel={<T id="home.resetConfirm" />}
          expectedConfirmationName="RESET"
        />
      </form>
    </>
  );
}
