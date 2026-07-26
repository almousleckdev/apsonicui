import { VideoHero } from "@/components/shared/video-hero";
import { RecommendedModels } from "@/components/features/recommended-models";
import { CategoryCarousel } from "@/components/features/category-carousel";
import { ServiceSupport } from "@/components/features/service-support";
import { VoicesSection } from "@/components/features/voices-section";
import { NewsSection } from "@/components/features/news-section";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { newsService } from "@/services/news";
import { locales } from "@/lib/i18n/locales";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  
  // Fetch news data on the server (Server Component) with locale fallback
  const news = await newsService.getNews(locale);

  const heroVideos = [
    "/videos/hero2.mp4",
    "/videos/723_1770449481.mp4"
  ];

  return (
    <main className="relative bg-white space-y-0 w-full min-h-screen">
      {/* 1. Header slideshow */}
      <VideoHero videos={heroVideos} interval={8000} />

      {/* 2. Bike Featured Carousel */}
      <ScrollReveal variant="fadeUp" delay={0.1}>
        <RecommendedModels />
      </ScrollReveal>

      {/* 3. Category Lineup Slider */}
      <ScrollReveal variant="fadeUp" delay={0.15}>
        <CategoryCarousel />
      </ScrollReveal>

      {/* 4. Interactive Locator */}
      <ScrollReveal variant="fadeUp" delay={0.1}>
        <ServiceSupport />
      </ScrollReveal>

      {/* 5. Client Testimonials */}
      <ScrollReveal variant="fadeUp" delay={0.1}>
        <VoicesSection />
      </ScrollReveal>

      {/* 6. Blog & News Center */}
      <ScrollReveal variant="fadeUp" delay={0.1}>
        <NewsSection news={news} limit={3} />
      </ScrollReveal>
    </main>
  );
}
