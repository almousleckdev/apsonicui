import React from "react";
import type { Metadata } from "next";
import { newsService } from "@/services/news";
import { NewsListClient } from "@/components/news";

interface NewsListPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: NewsListPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";
  const isFr = locale === "fr";

  const title = isZh ? "新闻中心 - APSONIC" : isFr ? "Centre d'Actualités - APSONIC" : "News Center - APSONIC";
  const description = isZh
    ? "阅读APSONIC企业新闻、最新公告、技术突破以及我们在整个非洲大陆的可持续发展倡议。"
    : isFr
    ? "Découvrez les actualités d'APSONIC, les annonces officielles, les percées technologiques et nos initiatives de développement durable en Afrique."
    : "Read APSONIC corporate news, official announcements, technical breakthroughs, and sustainable development initiatives across the African continent.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function NewsListPage({ params }: NewsListPageProps) {
  const { locale } = await params;
  
  // Fetch news data dynamically from CMS API for SSR render
  const news = await newsService.getNews(locale);

  return <NewsListClient news={news} />;
}
