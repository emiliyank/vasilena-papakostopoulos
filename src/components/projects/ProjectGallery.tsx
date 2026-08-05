"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { buildGalleryRows } from "@/components/projects/gallery-rows";
import { getLocalizedValue, type Locale } from "@/lib/i18n/config";
import type { ProjectImage } from "@/types/content";

type ProjectGalleryProps = {
  images: ProjectImage[];
  locale: Locale;
  labels: {
    open: string;
    close: string;
    previous: string;
    next: string;
    of: string;
  };
};

export function ProjectGallery({ images, locale, labels }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const rows = buildGalleryRows(images);
  const flatImages = images;

  const close = useCallback(() => {
    setActiveIndex(null);
    lastFocusRef.current?.focus();
  }, []);

  const openAt = (index: number, trigger: HTMLElement) => {
    lastFocusRef.current = trigger;
    setActiveIndex(index);
  };

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || flatImages.length === 0) return current;
      return (current - 1 + flatImages.length) % flatImages.length;
    });
  }, [flatImages.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || flatImages.length === 0) return current;
      return (current + 1) % flatImages.length;
    });
  }, [flatImages.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, close, showNext, showPrevious]);

  const activeImage = activeIndex === null ? null : flatImages[activeIndex];
  const indexedRows = rows.reduce<Array<Array<{ image: ProjectImage; index: number }>>>(
    (acc, row) => {
      const start = acc.reduce((sum, previous) => sum + previous.length, 0);
      acc.push(row.map((image, offset) => ({ image, index: start + offset })));
      return acc;
    },
    [],
  );

  return (
    <>
      <div className="space-y-4">
        {indexedRows.map((row) => (
          <div
            key={row.map((item) => item.image.id).join("-")}
            className={row.length === 2 ? "grid gap-4 sm:grid-cols-2" : "grid"}
          >
            {row.map(({ image, index }) => {
              const alt = getLocalizedValue(image.alt, locale);

              return (
                <button
                  key={image.id}
                  type="button"
                  className="group relative aspect-[4/5] overflow-hidden bg-[var(--color-surface)] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-ink)]"
                  aria-label={`${labels.open}: ${alt}`}
                  onClick={(event) => openAt(index, event.currentTarget)}
                >
                  <Image
                    src={image.src}
                    alt={alt}
                    fill
                    sizes={row.length === 2 ? "(max-width: 640px) 100vw, 50vw" : "100vw"}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {activeImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-[fade-up_0.25s_ease_both]"
          role="presentation"
          onClick={close}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="relative flex max-h-[90vh] w-full max-w-5xl flex-col gap-4 outline-none"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 text-sm text-white">
              <p id={titleId}>
                {getLocalizedValue(activeImage.alt, locale)}
                <span className="ml-3 text-white/70">
                  {(activeIndex ?? 0) + 1} {labels.of} {flatImages.length}
                </span>
              </p>
              <button
                type="button"
                className="border border-white/40 px-3 py-2 uppercase tracking-[0.12em] transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                onClick={close}
              >
                {labels.close}
              </button>
            </div>

            <div className="relative min-h-[50vh] flex-1 overflow-hidden bg-black/40">
              <Image
                src={activeImage.src}
                alt={getLocalizedValue(activeImage.alt, locale)}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                className="border border-white/40 px-4 py-2 text-sm uppercase tracking-[0.12em] text-white transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                onClick={showPrevious}
              >
                {labels.previous}
              </button>
              <button
                type="button"
                className="border border-white/40 px-4 py-2 text-sm uppercase tracking-[0.12em] text-white transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                onClick={showNext}
              >
                {labels.next}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
