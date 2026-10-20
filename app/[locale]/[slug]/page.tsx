import { notFound, permanentRedirect } from 'next/navigation';
import { connection } from 'next/server';
import type { Metadata } from 'next';
import { pagesService } from '@/services/pages';
import { PageRenderer } from '@/components/page-builder/renderer/PageRenderer';
import { buildPageMetadata } from '@/lib/page-builder/seo';
import { defaultLocale, isSupportedLocale } from '@/lib/i18n/locales';
import type { Locale } from '@/lib/page-builder/types';

interface CmsPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const asLocale = (value: string): Locale => (isSupportedLocale(value) ? value : defaultLocale);

export async function generateMetadata({ params }: CmsPageProps): Promise<Metadata> {
  await connection();
  const { locale, slug } = await params;
  const page = await pagesService.getPublic(slug);
  return page?.document ? buildPageMetadata(page.document, asLocale(locale)) : {};
}

/**
 * Public CMS page. Only the published copy is ever requested; drafts are not reachable from here. Rendered per
 * request so a publish or unpublish takes effect immediately.
 */
export default async function CmsDynamicPage({ params }: CmsPageProps) {
  await connection();
  const { locale, slug } = await params;
  const page = await pagesService.getPublic(slug);

  // notFound() and permanentRedirect() work by throwing: keep them outside any try/catch.
  if (!page) notFound();
  if (page.redirectSlug) {
    permanentRedirect(locale === defaultLocale ? `/${page.redirectSlug}` : `/${locale}/${page.redirectSlug}`);
  }
  if (!page.document) notFound();

  return (
    <main className="w-full">
      <PageRenderer document={page.document} locale={asLocale(locale)} />
    </main>
  );
}
