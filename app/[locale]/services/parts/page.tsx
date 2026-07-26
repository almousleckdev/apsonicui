import React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ServiceDetailPage } from "@/components/service/ServiceDetailPage";
import { getLocalizedTricycleData } from "@/lib/data/service-detail-data";

// Dynamic translation-based metadata generation
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.parts" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

interface PartsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PartsPage({ params }: PartsPageProps) {
  const { locale } = await params;
  const data = getLocalizedTricycleData(locale);

  return (
    <ServiceDetailPage
      title={locale === "zh" ? "三轮车与沙滩车" : locale === "fr" ? "Tricycle & Quad" : "Tricycle & ATV"}
      data={data}
      heroImage="/products/AP150ZH-20 SPORT (1).png"
      heroColor="#09090b"
      accentColor="#1fa84f"
    />
  );
}
