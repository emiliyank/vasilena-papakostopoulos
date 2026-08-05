import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProfessionalServiceJsonLd } from "@/components/seo/ProfessionalServiceJsonLd";
import { getSiteSettings } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildPageMetadata } from "@/lib/seo/metadata";

const display = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  display: "swap",
});

const body = Source_Sans_3({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "bg" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    return {};
  }
  const dictionary = getDictionary(rawLocale);
  return {
    ...buildPageMetadata({
      locale: rawLocale,
      title: dictionary.meta.siteTitle,
      description: dictionary.meta.siteDescription,
    }),
    icons: {
      icon: [{ url: "/brand/logo.png", type: "image/png" }],
      apple: [{ url: "/brand/logo.png" }],
      shortcut: ["/brand/logo.png"],
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const dictionary = getDictionary(locale);
  const settings = await getSiteSettings();

  return (
    <html lang={locale} className={`${display.variable} ${body.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <ProfessionalServiceJsonLd locale={locale} settings={settings} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--color-bg)] focus:px-4 focus:py-2 focus:text-[var(--color-ink)]"
        >
          {dictionary.nav.skipToContent}
        </a>
        <Header
          locale={locale}
          brandName={settings.brandName}
          logo={settings.logo}
          dictionary={dictionary}
          surveyUrl={settings.surveyUrl}
        />
        <div id="main-content" className="flex-1">
          {children}
        </div>
        <Footer locale={locale} settings={settings} dictionary={dictionary} />
      </body>
    </html>
  );
}
