"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import type { Locale } from "@/lib/i18n/config";
import type { AppDictionary } from "@/lib/i18n/dictionaries";

type ContactFormProps = {
  locale: Locale;
  dictionary: AppDictionary;
};

type FormStatus = "idle" | "submitting" | "success" | "validation" | "rate_limited" | "error";

export function ContactForm({ locale, dictionary }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [startedAt] = useState(() => Date.now());

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: String(formData.get("firstName") ?? ""),
          lastName: String(formData.get("lastName") ?? ""),
          email: String(formData.get("email") ?? ""),
          message: String(formData.get("message") ?? ""),
          website: String(formData.get("website") ?? ""),
          locale,
          startedAt,
        }),
      });

      const payload = (await response.json()) as { ok?: boolean; code?: string };
      if (response.ok && payload.ok) {
        setStatus("success");
        form.reset();
        return;
      }
      if (payload.code === "validation") {
        setStatus("validation");
        return;
      }
      if (payload.code === "rate_limited" || response.status === 429) {
        setStatus("rate_limited");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const statusMessage =
    status === "success"
      ? dictionary.contact.success
      : status === "validation"
        ? dictionary.contact.validationError
        : status === "rate_limited"
          ? dictionary.contact.rateLimited
          : status === "error"
            ? dictionary.contact.error
            : null;

  return (
    <form className="relative grid gap-5" onSubmit={onSubmit} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span>{dictionary.contact.firstName} *</span>
          <input
            name="firstName"
            required
            autoComplete="given-name"
            className="border border-[var(--color-line)] bg-transparent px-3 py-3 text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-ink)]"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span>{dictionary.contact.lastName}</span>
          <input
            name="lastName"
            autoComplete="family-name"
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
          autoComplete="email"
          className="border border-[var(--color-line)] bg-transparent px-3 py-3 text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-ink)]"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span>{dictionary.contact.message} *</span>
        <textarea
          name="message"
          rows={5}
          required
          className="resize-y border border-[var(--color-line)] bg-transparent px-3 py-3 text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-ink)]"
        />
      </label>

      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <p className="text-xs leading-relaxed text-[var(--color-muted)]">
        {dictionary.contact.privacyNote}
      </p>

      {statusMessage ? (
        <p
          role="status"
          className={
            status === "success"
              ? "rounded-sm bg-[#e5efe6] px-4 py-3 text-base font-semibold text-[#1f4d2a]"
              : "rounded-sm bg-[#f3eee8] px-4 py-3 text-sm text-[var(--color-ink)]"
          }
        >
          {statusMessage}
        </p>
      ) : null}

      <div>
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? dictionary.contact.submitting : dictionary.contact.submit}
        </Button>
      </div>
    </form>
  );
}
