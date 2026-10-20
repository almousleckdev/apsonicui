import { notFound } from "next/navigation";
import { ProductHero } from "@/components/products/detail/ProductHero";
import { ProductKeyFeatures } from "@/components/products/detail/ProductKeyFeatures";
import { ProductStorySplit } from "@/components/products/detail/ProductStorySplit";
import { ProductSpecBanner } from "@/components/products/detail/ProductSpecBanner";
import { ProductTechSpecs } from "@/components/products/detail/ProductTechSpecs";
import { productService } from "@/services/product";
import { getProductDetailContent } from "@/lib/data/product-detail";
import type { ProductDetailData } from "@/lib/data/product-detail";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

/**
 * Resolves product detail content from live backend API with fallback to static mock data.
 */
async function resolveProductDetail(
  id: string,
  locale: string
): Promise<ProductDetailData | null> {
  try {
    const liveDetail = await productService.getProductDetail(id, locale);
    if (liveDetail) {
      // 1. Hero Section
      const hero = {
        headlineLines: [
          { text: liveDetail.modelName, color: 'brand' as const },
          { text: 'POWER & RELIABILITY', color: 'white' as const },
        ],
        left: liveDetail.coverImageUrl || "/categories/弯梁车/AP110-A PLUS(白).png",
        middle: liveDetail.coverImageUrl || "/categories/弯梁车/AP110-A PLUS(白).png",
        right: liveDetail.coverImageUrl || "/categories/弯梁车/AP110-A PLUS(白).png",
        rider: liveDetail.heroImageUrl || liveDetail.coverImageUrl || "/products/details/producdetailhero.jpg",
      };

      // 2. Key Features Section
      const keyFeatures = [
        {
          title: "Superior Performance & Stability",
          image: liveDetail.performanceImageUrl || "/products/details/performance.jpg",
          layout: "below" as const,
        },
      ];

      // 3. Color Variants Section (placed right after Key Features Picture)
      const storySplit = {
        title: liveDetail.modelName,
        description: `${liveDetail.modelName} — Built for reliability, optimal fuel economy, and exceptional durability across all terrains.`,
        background: "/images/products/detail/aloba/split-bg.png",
        variants: liveDetail.colors?.length > 0
          ? liveDetail.colors.map((c) => ({
              id: String(c.id || c.colorName),
              colorLabel: c.colorName,
              dotColor: c.hexCode,
              image: c.imageUrl,
            }))
          : [
              { id: "def-white", colorLabel: "White", dotColor: "#FFFFFF", image: liveDetail.coverImageUrl || "/categories/弯梁车/AP110-A PLUS(白).png" },
            ],
      };

      // 4. Middle Specification Section Banners (Section 3, 4, 5...)
      const defaultBanners = [
        { id: "b-1", background: "/products/details/thirdsection.jpg", align: "left" as const, titleLines: ["REINFORCED CHASSIS"], description: "Heavy duty frame built for durability" },
        { id: "b-2", background: "/products/details/fourthsection.jpg", align: "left" as const, titleLines: ["EXTENDED CARRIER"], description: "High load rear carrier for transport" },
        { id: "b-3", background: "/products/details/fivessection.jpg", align: "left" as const, titleLines: ["COMBUSTION ENGINE"], description: "Fuel efficient high torque engine" },
      ];

      const specBanners = liveDetail.specBanners?.length > 0
        ? liveDetail.specBanners.map((b, i) => ({
            id: String(b.id || i),
            background: b.imageUrl || defaultBanners[i % defaultBanners.length].background,
            align: "left" as const,
            titleLines: [b.title || `SPECIFICATION ${i + 1}`],
            description: b.description || "",
            metric: b.metricLabel ? {
              label: b.metricLabel,
              value: Number(b.metricValue) || 0,
              unit: b.metricUnit || "",
            } : undefined,
          }))
        : defaultBanners;

      // 5. Technical Specifications Table (Key Metrics + Full Specs)
      const techSpecs = {
        keySpecs: liveDetail.specs?.filter((s) => s.isKeyMetric).map((s) => ({
          label: s.specKey,
          value: Number(s.specValue) || 0,
          unit: s.unit,
        })) || [
          { label: "MAX SPEED", value: 95, unit: "KM/H" },
          { label: "FUEL TANK CAPACITY", value: 4.5, unit: "L" },
          { label: "N.W", value: 98, unit: "KG" },
          { label: "GROUND CLEARANCE", value: 150, unit: "MM" },
        ],
        fullSpecs: liveDetail.specs?.length > 0
          ? liveDetail.specs.map((s) => ({
              label: s.specKey,
              value: s.unit ? `${s.specValue} ${s.unit}` : s.specValue,
            }))
          : [
              { label: "DISPLACEMENT(ML)", value: `${liveDetail.displacement || 110} ML` },
              { label: "Wheelbase(MM)", value: "1225 MM" },
              { label: "BORE(MM)XSTROKE(MM)", value: "50.0 x 55.6 MM" },
              { label: "L(MM)XW(MM)XH(MM)", value: "1920 x 700 x 1080 MM" },
              { label: "COMPRESSION RATIO", value: "9.0:1" },
              { label: "MIN GROUND CLEARANCE(MM)", value: "150 MM" },
              { label: "MAX POWER(KW/RPM)", value: "5.5 / 7500 KW/RPM" },
              { label: "N.W(KG)", value: "98 KG" },
              { label: "MAX TORQUE(N.m/RPM)", value: "7.8 / 5500 N.m/RPM" },
              { label: "BRAKE", value: "Disc / Drum" },
              { label: "TYRE SIZE", value: "2.50-17 / 2.75-17" },
              { label: "IGNITION", value: "CDI" },
              { label: "STARTER", value: "Electric / Kick" },
              { label: "CLUTCH TYPE", value: "Semi-Automatic / 4-Speed" },
            ],
      };

      // 6. User Reviews List
      const reviews = liveDetail.reviews?.length > 0
        ? liveDetail.reviews.map((r) => ({
            id: String(r.id),
            author: r.authorName,
            comment: r.comment,
            content: r.comment,
            date: r.reviewDate || "2026",
            rating: r.rating || 5,
          }))
        : [
            {
              id: "1",
              author: "Ibrahim K.",
              comment: "Extremely reliable motorcycle with unbeatable fuel economy.",
              content: "Extremely reliable motorcycle with unbeatable fuel economy.",
              date: "2026",
              rating: 5,
            },
          ];

      return {
        id: liveDetail.slug,
        hero,
        keyFeatures,
        storySplit,
        banners: specBanners,
        specBanners,
        aestheticDesign: {
          title: liveDetail.aestheticTitle || "Aesthetic Design",
          subtitle: liveDetail.aestheticSubtitle || "Modern & Sleek",
          backgroundImage: liveDetail.aestheticBgImage || liveDetail.coverImageUrl,
          firstImage: liveDetail.aestheticImage1 || liveDetail.coverImageUrl,
          secondImage: liveDetail.aestheticImage2 || liveDetail.coverImageUrl,
          images: [liveDetail.coverImageUrl],
        },
        reviews,
        techSpecs,
      };
    }
  } catch (err) {
    console.warn("[resolveProductDetail] Live API fetch failed, falling back to static:", err);
  }

  return getProductDetailContent(id);
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id, locale } = await params;
  const content = await resolveProductDetail(id, locale);

  if (!content) {
    notFound();
  }

  return (
    <main className="bg-zinc-950 min-h-screen">
      {/* 1. Hero Section: Top Full-Bleed Parallax Picture */}
      <ProductHero content={content.hero} productId={content.id} />

      {/* 2. Key Features Section: Performance Full-Bleed Picture */}
      <ProductKeyFeatures content={content.keyFeatures} />

      {/* 3. Colors & Variants Section (Before Specification Section Banners) */}
      <ProductStorySplit content={content.storySplit} productId={content.id} />

      {/* 4. Section 3, 4, 5 Full-Bleed Picture Banners */}
      {content.specBanners.map((banner, i: number) => (
        <ProductSpecBanner key={banner.id || i} content={banner} productId={content.id} index={i} />
      ))}

      {/* 5. Last Section: Typed Product Technical Specifications Grid Table */}
      {content.techSpecs && (
        <ProductTechSpecs content={content.techSpecs} />
      )}
    </main>
  );
}
