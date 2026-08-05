import { Resend } from "resend";

import type { ContactFormInput } from "@/lib/email/contact-schema";
import { getEnv } from "@/lib/env";

export async function sendContactEmail(input: ContactFormInput): Promise<void> {
  const env = getEnv();
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  if (!env.CONTACT_FROM_EMAIL) {
    throw new Error("CONTACT_FROM_EMAIL is not configured");
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const fullName = [input.firstName, input.lastName].filter(Boolean).join(" ");
  const subject = `Portfolio inquiry from ${fullName}`;
  const text = [
    `Locale: ${input.locale}`,
    `Name: ${fullName}`,
    `Email: ${input.email}`,
    "",
    input.message,
  ].join("\n");

  const html = `
    <div style="font-family: Georgia, serif; color: #1c1c1a; line-height: 1.5;">
      <p><strong>Locale:</strong> ${escapeHtml(input.locale)}</p>
      <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <hr style="border: none; border-top: 1px solid #d8d8d2; margin: 24px 0;" />
      <p style="white-space: pre-wrap;">${escapeHtml(input.message)}</p>
    </div>
  `;

  const result = await resend.emails.send({
    from: env.CONTACT_FROM_EMAIL,
    to: env.CONTACT_TO_EMAIL,
    replyTo: input.email,
    subject,
    text,
    html,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
