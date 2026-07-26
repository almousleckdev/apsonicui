import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales } from "@/lib/i18n/locales";
import { getKnownProductDetailIds, getProductDetailContent } from "@/lib/data/product-detail";
import {
  ProductHero,
  ProductKeyFeatures,
  ProductStorySplit,
  ProductSpecBanner,
  ProductAestheticDesign,
  ProductReviews,
  ProductTechSpecs,
} from "@/components/products/detail";

interface ProductDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export function generateStaticParams() {
  const ids = getKnownProductDetailIds();
  const paramsList: Array<{ id: string; locale: string }> = [];
  
  locales.forEach((locale) => {
    ids.forEach((id) => {
      paramsList.push({ id, locale });
    });
  });
  
  return paramsList;
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const content = getProductDetailContent(id);

  if (!content) {
    return { title: "Product Not Found" };
  }

  const headline = content.hero.headlineLines.map((line) => line.text).join(" ");
  return {
    title: `${headline} - APSONIC`,
    description: content.storySplit.description,
    openGraph: {
      title: `${headline} | APSONIC`,
      description: content.storySplit.description,
      images: [{ url: content.hero.middle }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const content = getProductDetailContent(id);

  if (!content) {
    notFound();
  }

  return (
    <main className="bg-zinc-950 min-h-screen">
      <ProductHero content={content.hero} productId={content.id} />
      <ProductKeyFeatures content={content.keyFeatures} />
      <ProductStorySplit content={content.storySplit} productId={content.id} />
      {content.specBanners.map((banner, i) => (
        <ProductSpecBanner key={banner.id} content={banner} productId={content.id} index={i} />
      ))}
      {content.aestheticDesign && (
        <ProductAestheticDesign content={content.aestheticDesign} productId={content.id} />
      )}
      {content.reviews && (
        <ProductReviews reviews={content.reviews} />
      )}
      {content.techSpecs && (
        <ProductTechSpecs content={content.techSpecs} />
      )}
    </main>
  );
}
