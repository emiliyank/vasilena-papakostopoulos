import { NextResponse } from "next/server";

import { contactFormSchema } from "@/lib/email/contact-schema";
import { isRateLimited } from "@/lib/email/rate-limit";
import { sendContactEmail } from "@/lib/email/send-contact";

const MIN_FILL_MS = 2500;

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: "invalid_json" }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, code: "validation" }, { status: 400 });
  }

  const data = parsed.data;
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  if (Date.now() - data.startedAt < MIN_FILL_MS) {
    return NextResponse.json({ ok: false, code: "rate_limited" }, { status: 429 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(`${ip}:${data.email.toLowerCase()}`)) {
    return NextResponse.json({ ok: false, code: "rate_limited" }, { status: 429 });
  }

  try {
    await sendContactEmail(data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] send failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ ok: false, code: "provider" }, { status: 502 });
  }
}
