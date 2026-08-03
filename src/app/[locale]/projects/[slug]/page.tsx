import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { getAdjacentProjects, getProjectBySlug } from "@/lib/content";
import { getLocalizedValue, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { homePath, projectPath, sectionPath } from "@/lib/i18n/paths";

type ProjectPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const project = await getProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const { previous, next } = await getAdjacentProjects(slug);
  const title = getLocalizedValue(project.title, locale);
  const description = getLocalizedValue(project.description, locale);

  return (
    <main className="pb-20">
      <Container className="py-10 sm:py-14">
        <Link
          href={sectionPath(locale, "portfolio")}
          className="text-xs tracking-[0.12em] uppercase text-[var(--color-muted)] transition-opacity hover:opacity-70"
        >
          {dictionary.project.backToPortfolio}
        </Link>

        <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)] sm:text-6xl">
          {title}
        </h1>

        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-[var(--color-muted)]">
          <div>
            <dt className="inline">{dictionary.project.type}: </dt>
            <dd className="inline text-[var(--color-ink)]">
              {getLocalizedValue(project.projectType, locale)}
            </dd>
          </div>
          <div>
            <dt className="inline">{dictionary.project.location}: </dt>
            <dd className="inline text-[var(--color-ink)]">
              {getLocalizedValue(project.location, locale)}
            </dd>
          </div>
          <div>
            <dt className="inline">{dictionary.project.date}: </dt>
            <dd className="inline text-[var(--color-ink)]">{project.projectDate}</dd>
          </div>
        </dl>

        <p className="mt-8 max-w-3xl text-base leading-relaxed text-[var(--color-muted)]">
          {description}
        </p>
      </Container>

      <Container className="space-y-4">
        {(() => {
          const rows: (typeof project.images)[] = [];
          let index = 0;
          while (index < project.images.length) {
            const current = project.images[index];
            if (current.layoutSpan === "half") {
              const nextHalf = project.images[index + 1];
              if (nextHalf?.layoutSpan === "half") {
                rows.push([current, nextHalf]);
                index += 2;
                continue;
              }
            }
            rows.push([current]);
            index += 1;
          }

          return rows.map((row) => (
            <div
              key={row.map((image) => image.id).join("-")}
              className={row.length === 2 ? "grid gap-4 sm:grid-cols-2" : "grid"}
            >
              {row.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-[4/5] overflow-hidden bg-[var(--color-surface)]"
                >
                  <Image
                    src={image.src}
                    alt={getLocalizedValue(image.alt, locale)}
                    fill
                    sizes={row.length === 2 ? "(max-width: 640px) 100vw, 50vw" : "100vw"}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ));
        })()}
      </Container>

      <Container className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-line)] pt-8 text-sm">
        {previous ? (
          <Link href={projectPath(locale, previous.slug)} className="hover:opacity-70">
            ← {dictionary.project.previous}: {getLocalizedValue(previous.title, locale)}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={projectPath(locale, next.slug)} className="hover:opacity-70">
            {dictionary.project.next}: {getLocalizedValue(next.title, locale)} →
          </Link>
        ) : (
          <Link href={homePath(locale)} className="hover:opacity-70">
            {dictionary.nav.home}
          </Link>
        )}
      </Container>
    </main>
  );
}
