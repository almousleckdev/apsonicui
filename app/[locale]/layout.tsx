import type { Metadata } from "next";
import { Geist, Geist_Mono, Oswald, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales } from "@/lib/i18n/locales";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { SiteLoader } from "@/components/shared/site-loader";
import Providers from "../providers";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Typefaces an editor can choose for page-builder headings. They are not preloaded: a visitor's browser only
// downloads one when a page actually uses it.
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], preload: false });
const oswald = Oswald({ variable: "--font-oswald", subsets: ["latin"], preload: false });

export const metadata: Metadata = {
  title: "APSONIC - Good Quality, Good Life",
  description: "APSONIC motorcycles - High quality standard, off-road, underbone motorcycles, ATVs, and tricycles for West Africa.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${oswald.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            <SiteLoader />
            <ConditionalLayout>{children}</ConditionalLayout>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
