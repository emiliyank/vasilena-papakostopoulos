import { absoluteUrl } from "@/lib/seo/metadata";
import type { SiteSettings } from "@/types/content";
import type { Locale } from "@/types/locale";
import { getLocalizedValue } from "@/lib/i18n/config";

export function ProfessionalServiceJsonLd({
  locale,
  settings,
}: {
  locale: Locale;
  settings: SiteSettings;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: settings.brandName,
    url: absoluteUrl(`/${locale}`),
    email: settings.email,
    telephone: settings.phone,
    areaServed: getLocalizedValue(settings.location, locale),
    sameAs: [settings.instagramUrl, settings.facebookUrl].filter(Boolean),
    description: getLocalizedValue(settings.heroSubheading, locale),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
