"use client";

import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import type { NewsItem } from "@/lib/types/news";
import { cn } from "@/lib/utils";

interface NewsSectionProps {
  news: NewsItem[];
  limit?: number;
  className?: string;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  news = [],
  limit = 3,
  className,
}) => {
  const locale = useLocale();
  const displayItems = news.slice(0, limit);

  return (
    <section className={cn("w-full py-20 bg-white border-b border-zinc-100 relative z-10", className)}>
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-extrabold text-xs uppercase tracking-[0.25em] text-brand-green">
            {locale === "zh" ? "信息中心" : "News & Blogs"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 text-zinc-950">
            {locale === "zh" ? "了解APSONIC最新动态" : "Latest Stories & News"}
          </h2>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-zinc-100 hover:border-zinc-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5"
            >
              <Link href={`/news/${item.id}`} className="flex flex-col h-full cursor-pointer">
                {/* Thumbnail */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100">
                  <Image
                    src={item.thumbnail || "/images/logo/apsoniclogo.png"}
                    alt={item.title || "Story Thumbnail"}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur-sm text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md">
                    {item.category || "Corporate"}
                  </div>
                </div>

                {/* Card details */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Author & Date metadata */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden border border-zinc-100 shrink-0 bg-zinc-100">
                      <Image
                        src={item.authorImage || "/images/logo/apsoniclogo.png"}
                        alt={item.authorName || "Author"}
                        fill
                        unoptimized
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex flex-col">
                      <span className="text-xs font-bold text-zinc-900 leading-none truncate">
                        {item.authorName || "Apsonic News"}
                      </span>
                      <span className="flex items-center gap-1 text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-1 leading-none">
                        <Calendar className="w-2.5 h-2.5" />
                        {new Date(item.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Title & Excerpt */}
                  <h3 className="text-lg font-bold leading-snug text-zinc-900 group-hover:text-brand-green transition-colors line-clamp-2 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 mb-6">
                    {item.excerpt}
                  </p>

                  {/* CTA link */}
                  <div className="mt-auto flex items-center text-zinc-900 font-bold text-xs uppercase tracking-wider group-hover:text-brand-green transition-colors">
                    {locale === "zh" ? "阅读故事" : "Read Story"}
                    <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-16 flex justify-center">
          <Link
            href="/news"
            className="px-6 py-2.5 rounded-full border border-zinc-200 hover:border-brand-green hover:text-brand-green bg-white text-zinc-600 transition-colors text-xs font-semibold uppercase tracking-wider"
          >
            {locale === "zh" ? "查看所有新闻" : "All Stories"}
          </Link>
        </div>

      </div>
    </section>
  );
};
