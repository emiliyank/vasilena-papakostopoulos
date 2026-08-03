import { notFound } from "next/navigation";

import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Portfolio } from "@/components/sections/Portfolio";
import { Services } from "@/components/sections/Services";
import { getProjects, getServices, getSiteSettings } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const dictionary = getDictionary(locale);
  const [settings, services, projects] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getProjects(),
  ]);

  return (
    <main>
      <Hero locale={locale} settings={settings} dictionary={dictionary} />
      <About locale={locale} settings={settings} />
      <Services locale={locale} services={services} dictionary={dictionary} />
      <Portfolio locale={locale} projects={projects} dictionary={dictionary} />
      <Contact locale={locale} settings={settings} dictionary={dictionary} />
    </main>
  );
}
