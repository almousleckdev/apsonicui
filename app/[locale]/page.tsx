import { VideoHero } from "@/components/shared/video-hero";
import { RecommendedModels } from "@/components/features/recommended-models";
import { CategoryCarousel } from "@/components/features/category-carousel";
import { ServiceSupport } from "@/components/features/service-support";
import { VoicesSection } from "@/components/features/voices-section";
import { NewsSection } from "@/components/features/news-section";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { newsService } from "@/services/news";
import { homepageService } from "@/services/homepage-service";
import { locales } from "@/lib/i18n/locales";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  
  // Fetch news data on the server with locale fallback
  const news = await newsService.getNews(locale);
  // Fetch CMS config on the server
  const config = await homepageService.getHomepageConfig();

  return (
    <main className="relative bg-white space-y-0 w-full min-h-screen">
      {/* 1. Header slideshow */}
      <VideoHero initialConfig={config.hero} />

      {/* 2. Bike Featured Carousel */}
      <ScrollReveal variant="fadeUp" delay={0.1}>
        <RecommendedModels initialConfig={config.recommendedModels} />
      </ScrollReveal>

      {/* 3. Category Lineup Slider */}
      <ScrollReveal variant="fadeUp" delay={0.15}>
        <CategoryCarousel initialConfig={config.categories} />
      </ScrollReveal>

      {/* 4. Interactive Locator */}
      <ScrollReveal variant="fadeUp" delay={0.1}>
        <ServiceSupport />
      </ScrollReveal>

      {/* 5. Client Testimonials (managed in the admin: Home Page > Testimonials) */}
      {config.visibility.showVoices && (
        <ScrollReveal variant="fadeUp" delay={0.1}>
          <VoicesSection initialConfig={config.testimonials} />
        </ScrollReveal>
      )}

      {/* 6. Blog & News Center */}
      <ScrollReveal variant="fadeUp" delay={0.1}>
        <NewsSection news={news} limit={3} />
      </ScrollReveal>
    </main>
  );
}
