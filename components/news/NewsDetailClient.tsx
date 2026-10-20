"use client";

import React from "react";
import Image from "next/image";
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
    <main className="min-h-screen bg-white font-sans">
      {/* Enterprise Style Hero for Article with top header clearance */}
      <div className="relative min-h-[500px] h-[65vh] w-full overflow-hidden bg-zinc-950 pt-20 sm:pt-24 flex items-end">
        <Image
          src={item.thumbnail || "/images/logo/apsoniclogo.png"}
          alt={item.title || "Article Banner"}
          fill
          priority
          loading="eager"
          unoptimized
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/40" />

        <div className="relative z-10 mx-auto max-w-[1360px] w-full px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="flex flex-wrap gap-3 mb-4 sm:mb-6">
              <span className="bg-brand-green text-white px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-brand-green/20">
                <Tag className="w-3.5 h-3.5" /> {item.category || "Corporate"}
              </span>
              <span className="text-white px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/10">
                <Calendar className="text-brand-green w-3.5 h-3.5" />{" "}
                {item.date
                  ? new Date(item.date).toLocaleDateString(
                      locale === "zh" ? "zh-CN" : locale === "fr" ? "fr-FR" : "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )
                  : "Recent"}
              </span>
              {item.authorName && (
                <span className="text-white px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/10">
                  <User className="text-brand-green w-3.5 h-3.5" /> {item.authorName}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-snug sm:leading-tight mb-4 sm:mb-6 font-serif">
              {item.title}
            </h1>

            {/* Author Detail Row */}
            <div className="flex items-center gap-3.5 py-4 border-t border-white/15">
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden border-2 border-brand-green shadow-xl shrink-0 bg-zinc-900">
                <Image
                  src={item.authorImage || "/images/logo/apsoniclogo.png"}
                  alt={item.authorName || "Author"}
                  fill
                  unoptimized
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-white font-bold text-sm sm:text-base mb-0.5">{item.authorName || "APSONIC Team"}</p>
                <p className="text-zinc-400 text-[9px] uppercase tracking-[0.2em] font-extrabold">
                  {item.authorRole ||
                    (locale === "zh"
                      ? "官方贡献者"
                      : locale === "fr"
                      ? "Contributeur Officiel"
                      : "Official Contributor")}
                </p>
              </div>
            </div>
          </motion.div>
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
                  className="rounded-full border-zinc-200 text-zinc-600 hover:text-brand-green hover:border-brand-green px-6 text-xs uppercase tracking-wider font-bold cursor-pointer"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />{" "}
                  {locale === "zh"
                    ? "所有文章"
                    : locale === "fr"
                    ? "Toutes les histoires"
                    : "All Stories"}
                </Button>
              </div>

              <article className="prose prose-lg max-w-none text-zinc-700 font-light leading-relaxed">
                <NewsContent contentHtml={item.contentHtml} sections={item.sections} blocks={item.content} />
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
                      {recommendedNews.map((rec) => (
                        <div
                          key={rec.id}
                          onClick={() => router.push(`/news/${rec.id}`)}
                          className="group cursor-pointer flex gap-4 items-center bg-zinc-50/50 hover:bg-zinc-50 p-3 rounded-2xl border border-zinc-100 transition-all"
                        >
                          <div className="relative h-20 w-24 rounded-xl overflow-hidden shrink-0 bg-zinc-900">
                            <Image
                              src={rec.thumbnail || "/images/logo/apsoniclogo.png"}
                              alt={rec.title}
                              fill
                              unoptimized
                              sizes="96px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-brand-green uppercase tracking-wider block mb-1">
                              {rec.category || "News"}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-zinc-900 line-clamp-2 group-hover:text-brand-green transition-colors">
                              {rec.title}
                            </h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
};
