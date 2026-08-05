import type { Metadata } from "next";

import { getEnv } from "@/lib/env";
import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";

function siteUrl() {
  return getEnv().SITE_URL.replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl()}${normalized}`;
}

export function localizedPath(locale: Locale, path = ""): string {
  const suffix = path && path !== "/" ? (path.startsWith("/") ? path : `/${path}`) : "";
  return `/${locale}${suffix}`;
}

export function buildPageMetadata({
  locale,
  title,
  description,
  path = "",
  image,
}: {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const canonicalPath = localizedPath(locale, path);
  const canonical = absoluteUrl(canonicalPath);
  const languages = Object.fromEntries(
    locales.map((item) => [item, absoluteUrl(localizedPath(item, path))]),
  );

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ...languages,
        "x-default": absoluteUrl(localizedPath("en", path)),
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: locale === "bg" ? "bg_BG" : "en_US",
      alternateLocale: locale === "bg" ? ["en_US"] : ["bg_BG"],
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
  };
}
