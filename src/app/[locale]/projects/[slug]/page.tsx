import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { Container } from "@/components/ui/Container";
import { getAdjacentProjects, getProjectBySlug, getProjects } from "@/lib/content";
import { getLocalizedValue, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { homePath, projectPath, sectionPath } from "@/lib/i18n/paths";
import { buildPageMetadata } from "@/lib/seo/metadata";

type ProjectPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.flatMap((project) => [
    { locale: "en", slug: project.slug },
    { locale: "bg", slug: project.slug },
  ]);
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  const title =
    getLocalizedValue(project.seoTitle ?? project.title, rawLocale) ||
    getLocalizedValue(project.title, rawLocale);
  const description =
    getLocalizedValue(project.seoDescription ?? project.summary, rawLocale) ||
    getLocalizedValue(project.summary, rawLocale);

  return buildPageMetadata({
    locale: rawLocale,
    title,
    description,
    path: `/projects/${project.slug}`,
    image: project.coverImage.src,
  });
}

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

        <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl text-[var(--color-ink)] sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-[var(--color-muted)]">
          {getLocalizedValue(project.projectType, locale) ? (
            <div>
              <dt className="inline">{dictionary.project.type}: </dt>
              <dd className="inline text-[var(--color-ink)]">
                {getLocalizedValue(project.projectType, locale)}
              </dd>
            </div>
          ) : null}
          {getLocalizedValue(project.location, locale) ? (
            <div>
              <dt className="inline">{dictionary.project.location}: </dt>
              <dd className="inline text-[var(--color-ink)]">
                {getLocalizedValue(project.location, locale)}
              </dd>
            </div>
          ) : null}
          {project.projectDate ? (
            <div>
              <dt className="inline">{dictionary.project.date}: </dt>
              <dd className="inline text-[var(--color-ink)]">{project.projectDate}</dd>
            </div>
          ) : null}
        </dl>

        {description ? (
          <p className="mt-8 max-w-3xl text-base leading-relaxed text-[var(--color-muted)]">
            {description}
          </p>
        ) : null}
      </Container>

      <Container>
        <ProjectGallery
          images={project.images}
          locale={locale}
          labels={{
            open: dictionary.project.openImage,
            close: dictionary.project.closeLightbox,
            previous: dictionary.project.previousImage,
            next: dictionary.project.nextImage,
            of: dictionary.project.imageOf,
          }}
        />
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
