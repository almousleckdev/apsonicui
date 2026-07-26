import React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/shared/page-hero";
import { ContactForm } from "@/components/contact/ContactForm";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

// Dynamic translation-based metadata generation
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.contact" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const t = await getTranslations("contact");

  return (
    <main className="min-h-screen bg-white pb-24 select-none">
      {/* Reusable Page Hero */}
      <PageHero
        title={t("heroTitle")}
        highlight={t("heroTitleHighlight")}
        subtitle={t("heroDescription")}
        bgImage="/images/about-hero.png"
      />

      {/* Form Container */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-20">
        <div className="max-w-2xl mx-auto">
          
          <ScrollReveal variant="fadeUp" delay={0.2}>
            <div className="mb-12 text-center">
              <span className="font-extrabold text-[10px] uppercase tracking-[0.2em] text-brand-green block">
                {t("formSectionSubtitle")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black mt-2 text-zinc-950 uppercase tracking-wide">
                {t("formSectionTitle")}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-semibold mt-3 max-w-md mx-auto">
                {t("formSectionDescription")}
              </p>
            </div>

            <ContactForm />
          </ScrollReveal>

        </div>
      </div>
    </main>
  );
}
