import type { Metadata } from 'next';
import { PreviewClient } from './PreviewClient';

// A preview is private working material: never indexed, never cached.
export const metadata: Metadata = {
  title: 'Preview',
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

export default async function PreviewPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  return <PreviewClient pageId={Number(id)} locale={locale} />;
}
