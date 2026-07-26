"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsContent } from "./NewsContent";
import type { NewsItem } from "@/lib/types/news";

interface NewsDetailClientProps {
  item: NewsItem;
  recommendedNews: NewsItem[];
}

export const NewsDetailClient: React.FC<NewsDetailClientProps> = ({
  item,
  recommendedNews,
}) => {
  const router = useRouter();
  const locale = useLocale();

  return (
    <main className="min-h-screen bg-white">
      {/* Enterprise Style Hero for Article */}
      <div className="relative h-[65vh] w-full overflow-hidden bg-zinc-950">
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/40 to-transparent" />

        <div className="absolute inset-0 flex items-end pb-12 sm:pb-16">
          <div className="mx-auto max-w-[1360px] w-full px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex flex-wrap gap-3 mb-6 sm:mb-8">
                <span className="bg-brand-green text-white px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-brand-green/20">
                  <Tag className="w-3.5 h-3.5" /> {item.category}
                </span>
                <span className="text-white px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/10">
                  <Calendar className="text-brand-green w-3.5 h-3.5" />{" "}
                  {new Date(item.date).toLocaleDateString(locale === "zh" ? "zh-CN" : locale === "fr" ? "fr-FR" : "en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                {item.authorName && (
                  <span className="text-white px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/10">
                    <User className="text-brand-green w-3.5 h-3.5" /> {item.authorName}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight mb-6 sm:mb-8">
                {item.title}
              </h1>

              {/* Author Detail Row */}
              <div className="flex items-center gap-4 py-5 border-t border-white/10">
                <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-brand-green shadow-xl shrink-0">
                  <Image
                    src={item.authorImage || "/images/about-hero.png"}
                    alt={item.authorName || "Author"}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-white font-bold text-base mb-0.5">{item.authorName}</p>
                  <p className="text-zinc-400 text-[9px] uppercase tracking-[0.2em] font-extrabold">
                    {locale === "zh" ? "官方贡献者" : locale === "fr" ? "Contributeur Officiel" : "Official Contributor"}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main content body */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-[1360px] w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 sm:gap-16">
            {/* Main Reading Content */}
            <div className="w-full lg:w-2/3">
              <div className="mb-12">
                <Button
                  onClick={() => router.push("/news")}
                  variant="outline"
                  className="rounded-full border-zinc-200 text-zinc-600 hover:text-brand-green hover:border-brand-green px-6 text-xs uppercase tracking-wider font-bold"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" /> {locale === "zh" ? "所有文章" : locale === "fr" ? "Toutes les histoires" : "All Stories"}
                </Button>
              </div>

              <article className="prose prose-lg max-w-none text-zinc-700 font-light leading-relaxed">
                <NewsContent blocks={item.content} />
              </article>
            </div>

            {/* Sidebar - Right Side */}
            <aside className="w-full lg:w-1/3">
              <div className="lg:sticky lg:top-24 space-y-12">
                {recommendedNews.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-zinc-950 mb-6 flex items-center gap-3">
                      <span className="w-8 h-1 bg-brand-green rounded-full" />
                      {locale === "zh" ? "最新更新" : locale === "fr" ? "Mises à jour" : "Latest Updates"}
                    </h3>
                    <div className="space-y-6">
                      {recommendedNews.map((newsItem) => (
                        <Link key={newsItem.id} href={`/news/${newsItem.id}`} className="group flex gap-4 cursor-pointer">
                          <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border border-zinc-100 shadow-sm bg-zinc-50">
                            <Image
                              src={newsItem.thumbnail}
                              alt={newsItem.title}
                              fill
                              sizes="80px"
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>
                          <div className="flex flex-col justify-center min-w-0">
                            <span className="text-[9px] text-brand-green font-bold uppercase tracking-widest mb-1">
                              {newsItem.category}
                            </span>
                            <h4 className="text-xs font-bold text-zinc-900 line-clamp-2 group-hover:text-brand-green transition-colors leading-snug">
                              {newsItem.title}
                            </h4>
                            <span className="text-[9px] text-zinc-400 mt-1 leading-none">
                              {new Date(newsItem.date).toLocaleDateString(locale === "zh" ? "zh-CN" : locale === "fr" ? "fr-FR" : "en-US")}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Corporate CTA */}
                <div className="p-8 rounded-3xl bg-zinc-50 border border-zinc-100">
                  <h4 className="text-base font-bold text-zinc-950 mb-3">APSONIC</h4>
                  <p className="text-xs text-zinc-500 mb-5 leading-relaxed font-light">
                    {locale === "zh" 
                      ? "了解更多关于我们在非洲的使命和全球影响。" 
                      : locale === "fr"
                      ? "En savoir plus sur notre mission en Afrique et notre impact mondial."
                      : "Learn more about our mission in Africa and our global impact."}
                  </p>
                  <Link href="/about">
                    <Button variant="outline" className="w-full rounded-xl border-zinc-200 text-xs font-bold uppercase tracking-wider">
                      {locale === "zh" ? "关于我们" : locale === "fr" ? "Notre Histoire" : "Our Story"}
                    </Button>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
};
