import React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ServiceDetailPage } from "@/components/service/ServiceDetailPage";
import { getLocalizedTwoWheelerData } from "@/lib/data/service-detail-data";

// Dynamic translation-based metadata generation
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.locations" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

interface LocationsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocationsPage({ params }: LocationsPageProps) {
  const { locale } = await params;
  const data = getLocalizedTwoWheelerData(locale);
  const detailT = await getTranslations("serviceDetail");

  return (
    <ServiceDetailPage
      title={locale === "zh" ? "两轮车支持" : locale === "fr" ? "Support Deux Roues" : "Two-Wheeler Support"}
      data={data}
      heroImage="/products/AP250GY (1).png"
      heroColor="#09090b"
      accentColor="#1fa84f"
    />
  );
}
