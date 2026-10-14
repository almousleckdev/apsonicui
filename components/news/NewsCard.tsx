"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import type { NewsItem } from "@/lib/types/news";
import { cn } from "@/lib/utils";
import { ANIMATION_VARIANTS } from "@/lib/constants/animations";

interface NewsCardProps {
  item: NewsItem;
  index?: number;
  className?: string;
  light?: boolean;
  variant?: "default" | "overlay";
}

export const NewsCard: React.FC<NewsCardProps> = ({
  item,
  index = 0,
  className,
  light = false,
  variant = "default",
}) => {
  const locale = useLocale();
  const targetHref = `/news/${item.slug || item.id}`;

  if (variant === "overlay") {
    return (
      <motion.div
        variants={ANIMATION_VARIANTS.scaleIn}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "relative h-[400px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg shadow-gray-200",
          className,
        )}
      >
        <Link href={targetHref} className="absolute inset-0">
          <Image
            src={item.thumbnail || "/images/logo/apsoniclogo.png"}
            alt={item.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
          <div className="absolute bottom-0 left-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <span className="text-white text-xs font-bold uppercase tracking-widest mb-2 block">
              {item.category || "Corporate"}
            </span>
            <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
              {item.title}
            </h3>
            <p className="text-gray-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {item.excerpt}
            </p>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={ANIMATION_VARIANTS.fadeUp}
      transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-zinc-100 hover:border-zinc-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2",
        className,
      )}
    >
      <Link href={targetHref} className="flex flex-col h-full cursor-pointer">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100">
          <Image
            src={item.thumbnail || "/images/logo/apsoniclogo.png"}
            alt={item.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-brand-green text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-brand-green/20">
            {item.category || "Corporate"}
          </div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          {/* Author & Date info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative h-8 w-8 rounded-full overflow-hidden border border-zinc-100 shrink-0">
              <Image
                src={item.authorImage || "/images/logo/apsoniclogo.png"}
                alt={item.authorName || "Author"}
                fill
                unoptimized
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-zinc-900 leading-none mb-0.5 truncate">
                {item.authorName || "APSONIC Team"}
              </span>
              <div className="flex items-center gap-1.5 text-zinc-400 text-[9px] uppercase tracking-widest leading-none">
                <Calendar className="text-zinc-400 size-3" />
                {item.date ? new Date(item.date).toLocaleDateString(locale === "zh" ? "zh-CN" : locale === "fr" ? "fr-FR" : "en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }) : "Recent"}
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold leading-tight group-hover:text-brand-green transition-colors line-clamp-2 flex-grow text-zinc-900">
            {item.title}
          </h3>
          <p className="mt-4 text-xs line-clamp-2 leading-relaxed text-zinc-500 font-light">
            {item.excerpt}
          </p>
          <div className="mt-6 flex items-center text-zinc-900 font-bold text-xs uppercase tracking-wider group-hover:text-brand-green group-hover:gap-3 transition-all">
            {locale === "zh" ? "阅读故事" : locale === "fr" ? "Lire l'histoire" : "Read Story"} 
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
