"use client";

import { Button } from "@/components/ui/Button";
import type { AppDictionary } from "@/lib/i18n/dictionaries";

type ContactFormProps = {
  dictionary: AppDictionary;
};

export function ContactForm({ dictionary }: ContactFormProps) {
  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span>{dictionary.contact.firstName} *</span>
          <input
            name="firstName"
            required
            className="border border-[var(--color-line)] bg-transparent px-3 py-3 text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-ink)]"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span>{dictionary.contact.lastName}</span>
          <input
            name="lastName"
            className="border border-[var(--color-line)] bg-transparent px-3 py-3 text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-ink)]"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm">
        <span>{dictionary.contact.email} *</span>
        <input
          name="email"
          type="email"
          required
          className="border border-[var(--color-line)] bg-transparent px-3 py-3 text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-ink)]"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span>{dictionary.contact.message}</span>
        <textarea
          name="message"
          rows={5}
          className="resize-y border border-[var(--color-line)] bg-transparent px-3 py-3 text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-ink)]"
        />
      </label>
      <p className="text-xs leading-relaxed text-[var(--color-muted)]">
        {dictionary.contact.privacyNote}
      </p>
      <div>
        <Button type="submit">{dictionary.contact.submit}</Button>
      </div>
    </form>
  );
}
