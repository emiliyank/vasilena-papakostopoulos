import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { getLocalizedValue, type Locale } from "@/lib/i18n/config";
import type { AppDictionary } from "@/lib/i18n/dictionaries";
import { projectPath } from "@/lib/i18n/paths";
import type { Project } from "@/types/content";

type PortfolioProps = {
  locale: Locale;
  projects: Project[];
  dictionary: AppDictionary;
};

export function Portfolio({ locale, projects, dictionary }: PortfolioProps) {
  return (
    <section id="portfolio" className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-ink)] sm:text-5xl">
            {dictionary.portfolio.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)]">
            {dictionary.portfolio.intro}
          </p>
        </div>

        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const title = getLocalizedValue(project.title, locale);
            const summary = getLocalizedValue(project.summary, locale);
            const alt = getLocalizedValue(project.coverImage.alt, locale);

            return (
              <li key={project.id}>
                <Link
                  href={projectPath(locale, project.slug)}
                  className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-ink)]"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-surface)]">
                    <Image
                      src={project.coverImage.src}
                      alt={alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
                      {title}
                    </h3>
                    <p className="line-clamp-3 text-sm leading-relaxed text-[var(--color-muted)]">
                      {summary}
                    </p>
                    <span className="inline-block pt-1 text-xs tracking-[0.12em] uppercase text-[var(--color-ink)]">
                      {dictionary.portfolio.viewProject}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
