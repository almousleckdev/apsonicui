import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProductsContent } from "@/components/products/ProductsContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.products" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/products" },
  };
}

function ProductsSkeleton() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* Filter bar skeleton */}
      <div className="w-full bg-white pt-24 sm:pt-32 border-b border-gray-100 select-none">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-10 pb-6">
          {/* Breadcrumb Skeleton */}
          <div className="flex gap-2 mb-8 items-center">
            <div className="h-3 w-12 bg-gray-100 rounded-full animate-pulse" />
            <span className="text-gray-200">/</span>
            <div className="h-3 w-16 bg-gray-100 rounded-full animate-pulse" />
          </div>

          <div className="h-10 w-48 bg-gray-100 rounded-lg mb-8 animate-pulse" />
          
          {/* Filter options group skeletons */}
          <div className="space-y-5 mt-6">
            {[1, 2, 3].map((g) => (
              <div key={g} className="flex gap-6 items-center">
                <div className="h-3 w-16 bg-gray-100 rounded-full animate-pulse shrink-0" />
                <div className="flex gap-2 overflow-hidden">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-7 w-16 bg-gray-100 rounded-full animate-pulse shrink-0" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cards grid skeleton */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-10 py-12 sm:py-20">
        <div className="h-8 w-40 bg-gray-100 rounded-md mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 gap-y-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="pb-8">
              <div className="relative aspect-[1.8/1] bg-[#F2F3F5] rounded-[1.2rem] p-5 overflow-visible">
                {/* Model Label Skeleton */}
                <div className="h-5 w-24 bg-gray-200/60 rounded-md animate-pulse" />
                
                {/* Image Placeholder Skeleton */}
                <div className="absolute inset-x-10 bottom-[-10%] h-[70%] bg-gray-200/40 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}
