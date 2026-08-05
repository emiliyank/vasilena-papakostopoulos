"use client";

import type { ReactNode } from "react";

export function AccordionEditLink({
  targetId,
  children,
}: {
  targetId: string;
  children: ReactNode;
}) {
  return (
    <a
      href={`#${targetId}`}
      className="underline"
      onClick={() => {
        const el = document.getElementById(targetId);
        if (el instanceof HTMLDetailsElement) {
          el.open = true;
        }
      }}
    >
      {children}
    </a>
  );
}

export function AdminAccordionItem({
  id,
  title,
  children,
  defaultOpen = false,
}: {
  id: string;
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      id={id}
      className="border border-[var(--color-line)] bg-[var(--color-surface)] open:bg-[var(--color-bg)]"
      {...(defaultOpen ? { open: true } : {})}
    >
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-3">
          <span>{title}</span>
          <span className="text-xs tracking-[0.08em] text-[var(--color-muted)] uppercase">
            Edit
          </span>
        </span>
      </summary>
      <div className="space-y-4 border-t border-[var(--color-line)] px-4 py-4">{children}</div>
    </details>
  );
}
