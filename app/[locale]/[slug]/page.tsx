import { notFound } from 'next/navigation';
import { cmsPagesService } from '@/services/cms-pages';
import { DynamicCmsPageViewer } from '@/components/features/DynamicCmsPageViewer';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { Metadata } from 'next';
import { CmsPageDto, Locale } from '@/lib/types/cms-page';

interface CmsPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CmsPageProps): Promise<Metadata> {
  try {
    const { locale, slug } = await params;
    const pageData = await cmsPagesService.getPublicPageBySlug(slug);
    if (!pageData || !pageData.publishedSnapshot) return {};

    const snapshot = pageData.publishedSnapshot as CmsPageDto;
    const currentTranslation = snapshot.translations?.[locale] || snapshot.translations?.['en'] || {};

    return {
      title: currentTranslation.seoTitle || currentTranslation.title,
      description: currentTranslation.seoDescription,
    };
  } catch (e) {
    return {};
  }
}

async function loadPublishedSnapshot(slug: string): Promise<CmsPageDto | null> {
  try {
    const pageData = await cmsPagesService.getPublicPageBySlug(slug);
    if (!pageData || pageData.status !== 'PUBLISHED' || !pageData.publishedSnapshot) {
      return null;
    }
    return pageData.publishedSnapshot as CmsPageDto;
  } catch (error) {
    console.error('Error fetching CMS page:', error);
    return null;
  }
}

export default async function CmsDynamicPage({ params }: CmsPageProps) {
  const { slug } = await params;
  const snapshot = await loadPublishedSnapshot(slug);

  // Outside any try/catch: notFound() works by throwing, and must not be swallowed.
  if (!snapshot) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col font-sans">
      <Header />

      {/* We pass the serialized snapshot directly to the pure React viewer */}
      <DynamicCmsPageViewer page={snapshot} />

      <Footer />
    </main>
  );
}
