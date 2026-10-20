import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getFeatureCards } from "@/lib/data/service-page";
import { getLocalizedFaqs } from "@/lib/data/faq";
import { offices } from "@/lib/data/contact-page";
import { PageHero } from "@/components/shared/page-hero";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Phone, Mail, MapPin, ExternalLink, HelpCircle, ArrowRight } from "lucide-react";
import { FaqAccordion } from "./faq-accordion";

// Dynamic translation-based metadata generation
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.services" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

interface ServicesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  
  const t = await getTranslations("services");
  const cards = getFeatureCards(t);
  const faqs = getLocalizedFaqs(locale);

  return (
    <main className="min-h-screen bg-zinc-50 pb-20 select-none">
      
      {/* 1. Reusable Cinematic Hero - Made Full Height */}
      <PageHero
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        highlight={t("heroHighlight")}
        bgImage="/images/development-history.jpg"
        isFullHeight={true}
      />

      {/* 2. Borderless Feature Cards Section */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20">
          <span className="font-extrabold text-xs uppercase tracking-[0.25em] text-brand-green">
            {t("coreServices")}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mt-3 text-zinc-950 uppercase tracking-tight">
            {t("careSpares")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          {cards.map((card, index) => (
            <ScrollReveal key={card.id} variant="fadeUp" delay={0.15 * index}>
              <Link href={card.href} className="group block h-full select-none cursor-pointer">
                <div className="flex flex-col h-full bg-transparent transition-all duration-300 rounded-[32px]">
                  
                  {/* Aspect ratio frame with completely transparent container */}
                  <div className="relative w-full h-[280px] sm:h-[380px] bg-transparent overflow-hidden flex items-center justify-center">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 550px"
                      className="object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                      priority={index === 0}
                    />
                  </div>

                  <div className="pt-6 flex flex-col justify-between flex-grow text-center items-center">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-zinc-900 group-hover:text-brand-green transition-colors duration-300 tracking-tight">
                        {card.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mt-3 leading-relaxed font-semibold">
                        {card.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-900 group-hover:text-brand-green transition-colors">
                      <span>{card.ctaText}</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>

                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 3. Branch Offices Section */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 mb-28 border-t border-zinc-200/50 pt-20">
        <div className="text-center mb-16">
          <span className="font-extrabold text-xs uppercase tracking-[0.25em] text-brand-green">
            {t("branches")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-2 text-zinc-950 uppercase tracking-tight">
            {t("officialOffices")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offices.map((office, idx) => (
            <ScrollReveal key={idx} variant="fadeUp" delay={idx * 0.06}>
              <div className="bg-white rounded-3xl overflow-hidden border border-zinc-100 hover:border-zinc-200/80 transition-all duration-300 hover:shadow-xl flex flex-col h-full group">
                <div className="h-44 w-full bg-zinc-100 relative overflow-hidden">
                  {office.mapUrl ? (
                    <iframe
                      src={office.mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                      <div className="absolute inset-0 opacity-15"
                           style={{
                             backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                             backgroundSize: "20px 20px"
                           }} />
                      <MapPin className="w-8 h-8 text-brand-green animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-zinc-900 font-extrabold text-base">
                      {office.city}
                    </h4>
                    <span className="text-xs text-zinc-400 font-bold">({office.country.split(" ").slice(-1)[0]})</span>
                  </div>
                  <p className="text-zinc-500 text-xs leading-relaxed font-semibold flex-grow mb-6">
                    {office.address}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-zinc-100/60">
                    <a
                      href={`tel:${office.phone}`}
                      className="flex items-center gap-2.5 text-xs text-zinc-600 hover:text-brand-green font-medium transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {office.phone}
                    </a>
                    <a
                      href={`mailto:${office.email}`}
                      className="flex items-center gap-2.5 text-xs text-zinc-600 hover:text-brand-green font-medium transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {office.email}
                    </a>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.address + ", " + office.city + ", " + office.country)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 w-full py-2.5 rounded-xl bg-zinc-50 text-[10px] uppercase tracking-widest font-extrabold text-zinc-900 hover:bg-brand-green hover:text-white transition-all flex items-center justify-center gap-2 border border-zinc-100"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {locale === "zh" ? "获取路线" : "Get Route"}
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 4. Accordion FAQ Section */}
      <section className="max-w-[800px] mx-auto px-4 sm:px-6 mb-12">
        <ScrollReveal variant="fadeUp" delay={0.1}>
          <div className="text-center mb-12">
            <HelpCircle className="w-10 h-10 text-brand-green mx-auto mb-4" />
            <h2 className="text-3xl font-black text-zinc-950 uppercase tracking-wide">
              {t("faq")}
            </h2>
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest mt-1.5">
              {t("faqSubtitle")}
            </p>
          </div>
          <FaqAccordion items={faqs} />
        </ScrollReveal>
      </section>

    </main>
  );
}
