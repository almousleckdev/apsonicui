import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales } from "@/lib/i18n/locales";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
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
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            <SiteLoader />
            <Header />
            <div className="flex-grow">{children}</div>
            <Footer />
            <ScrollToTop />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
