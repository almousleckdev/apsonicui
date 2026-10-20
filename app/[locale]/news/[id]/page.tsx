import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { newsService } from "@/services/news";
import { NewsDetailClient } from "@/components/news";

interface NewsDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const item = await newsService.getNewsById(id, locale);

  if (!item) {
    return {
      title: "Article Not Found - APSONIC",
    };
  }

  return {
    title: `${item.title} - APSONIC`,
    description: item.excerpt,
    openGraph: {
      title: item.title,
      description: item.excerpt,
      images: [{ url: item.thumbnail }],
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id, locale } = await params;
  
  // Fetch specific article by ID from CMS API
  const item = await newsService.getNewsById(id, locale);

  if (!item) {
    notFound();
  }

  // Fetch all articles to display recommendations in the sidebar
  const allNews = await newsService.getNews(locale);
  const recommendedNews = allNews.filter((i: { id: string }) => i.id !== id).slice(0, 4);

  return <NewsDetailClient item={item} recommendedNews={recommendedNews} />;
}
