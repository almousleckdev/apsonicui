"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { NewsCard } from "./NewsCard";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import { STAGGER_CONTAINER, ENTERPRISE_EASE } from "@/lib/constants/animations";
import type { NewsItem } from "@/lib/types/news";

interface NewsListClientProps {
  news: NewsItem[];
}

export const NewsListClient: React.FC<NewsListClientProps> = ({ news }) => {
  const locale = useLocale();

  const featuredNews = news[0];
  const otherNews = news.slice(1);
  const recommendedNews = news.slice(0, 3);

  // Labels map
  const labels: Record<string, Record<string, string>> = {
    zh: {
      center: "Apsonic 新闻中心",
      titleStart: "信息",
      titleEnd: "中心",
      subtitle: "了解发动机技术的最新突破、社区倡议和整个非洲大陆的企业里程碑。",
      latest: "最新更新",
      featured: "精选故事",
      readAll: "阅读全文",
      noNews: "暂无最新动态，请稍后再试。"
    },
    en: {
      center: "Apsonic News Center",
      titleStart: "News",
      titleEnd: "Hub",
      subtitle: "Discover the latest updates, technology breakthroughs, community support, and corporate milestones across the continent.",
      latest: "Latest Updates",
      featured: "Featured Story",
      readAll: "Read Article",
      noNews: "No news stories available at this moment. Please check back later."
    },
    fr: {
      center: "Centre d'Actualités Apsonic",
      titleStart: "Actualités",
      titleEnd: "Apsonic",
      subtitle: "Découvrez les dernières avancées technologiques, le soutien aux communautés et les jalons de l'entreprise sur le continent.",
      latest: "Dernières Mises à Jour",
      featured: "Histoire Vedette",
      readAll: "Lire l'Article",
      noNews: "Aucune actualité disponible pour le moment. Veuillez revenir plus tard."
    }
  };

  const t = labels[locale] || labels.en;

  if (news.length === 0) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center pt-32">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-black text-zinc-900 mb-4">{t.center}</h1>
          <p className="text-zinc-500 text-sm mb-6">{t.noNews}</p>
          <Link href="/">
            <Button variant="outline" className="rounded-full px-6 text-xs uppercase tracking-wider font-bold">
              {locale === "zh" ? "返回首页" : locale === "fr" ? "Retour à l'accueil" : "Go Home"}
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Enterprise Hero Section */}
      <div className="relative pt-36 pb-20 bg-zinc-50 overflow-hidden border-b border-zinc-100">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-[0.03] pointer-events-none">
          <div className="w-full h-full bg-brand-green skew-x-12 translate-x-1/2" />
        </div>
        <div className="mx-auto max-w-[1360px] w-full px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: ENTERPRISE_EASE }}
              className="inline-block text-brand-green font-bold text-xs uppercase tracking-[0.2em] mb-4"
            >
              {t.center}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: ENTERPRISE_EASE }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black text-zinc-950 mb-6 leading-tight"
            >
              {t.titleStart} <span className="text-brand-green">{t.titleEnd}</span>.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: ENTERPRISE_EASE }}
              className="text-sm sm:text-base lg:text-lg text-zinc-500 font-light leading-relaxed max-w-2xl"
            >
              {t.subtitle}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Main content body */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-[1360px] w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row-reverse gap-16">
            {/* Sidebar */}
            <aside className="w-full lg:w-1/3 space-y-12 lg:sticky lg:top-24 h-fit">
              <ScrollReveal variant="fadeUp" delay={0.2}>
                <h3 className="text-lg font-bold text-zinc-950 mb-6 flex items-center gap-3">
                  <span className="w-8 h-1 bg-brand-green rounded-full" />
                  {t.latest}
                </h3>
                <div className="space-y-6">
                  {recommendedNews.map((item) => (
                    <Link key={item.id} href={`/news/${item.id}`} className="group flex gap-4 cursor-pointer">
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border border-zinc-100 shadow-sm bg-zinc-50">
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          sizes="80px"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <span className="text-[9px] text-brand-green font-bold uppercase tracking-widest mb-1">
                          {item.category}
                        </span>
                        <h4 className="text-xs font-bold text-zinc-900 line-clamp-2 group-hover:text-brand-green transition-colors leading-snug">
                          {item.title}
                        </h4>
                        <span className="text-[9px] text-zinc-400 mt-1">
                          {new Date(item.date).toLocaleDateString(locale === "zh" ? "zh-CN" : locale === "fr" ? "fr-FR" : "en-US")}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </ScrollReveal>
            </aside>

            {/* Main Content */}
            <div className="w-full lg:w-2/3">
              {featuredNews && (
                <ScrollReveal variant="fadeUp" delay={0.15} className="mb-16 pb-16 border-b border-zinc-100">
                  <Link href={`/news/${featuredNews.id}`} className="group cursor-pointer block">
                    <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-xl border border-zinc-100 mb-8 bg-zinc-100">
                      <Image
                        src={featuredNews.thumbnail}
                        alt={featuredNews.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 800px"
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute top-6 left-6 flex gap-2">
                        <span className="bg-brand-green text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                          {t.featured}
                        </span>
                      </div>
                    </div>
                    <div className="max-w-3xl">
                      <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 mb-3 group-hover:text-brand-green transition-colors leading-tight">
                        {featuredNews.title}
                      </h2>
                      <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                        {featuredNews.excerpt}
                      </p>
                      <Button variant="outline" className="rounded-full px-8 text-xs uppercase tracking-wider font-bold">
                        {t.readAll}
                      </Button>
                    </div>
                  </Link>
                </ScrollReveal>
              )}

              {otherNews.length > 0 && (
                <motion.div
                  variants={STAGGER_CONTAINER}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.05 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16"
                >
                  {otherNews.map((item, index) => (
                    <NewsCard key={item.id} item={item} index={index} className="h-full" />
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
