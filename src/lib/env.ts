import { z } from "zod";

const emptyToUndefined = (value: string | undefined) =>
  value && value.trim().length > 0 ? value.trim() : undefined;

const envSchema = z
  .object({
    SITE_URL: z.string().url().default("http://localhost:3000"),
    CONTENT_SOURCE: z.enum(["mock", "airtable"]).default("mock"),
    AIRTABLE_PAT: z.string().optional().transform(emptyToUndefined),
    AIRTABLE_BASE_ID: z.string().optional().transform(emptyToUndefined),
    AIRTABLE_TABLE_PROJECTS: z.string().default("Projects"),
    AIRTABLE_TABLE_PROJECT_IMAGES: z.string().default("Project Images"),
    AIRTABLE_TABLE_SERVICES: z.string().default("Services"),
    AIRTABLE_TABLE_BLOG_POSTS: z.string().default("Blog Posts"),
    AIRTABLE_TABLE_PRICES: z.string().default("Prices"),
    AIRTABLE_TABLE_SITE_SETTINGS: z.string().default("Site Settings"),
    AIRTABLE_REVALIDATE_SECONDS: z.coerce.number().int().positive().default(600),
    AIRTABLE_FALLBACK_TO_MOCK: z
      .enum(["true", "false"])
      .default("true")
      .transform((value) => value === "true"),
    RESEND_API_KEY: z.string().optional().transform(emptyToUndefined),
    CONTACT_TO_EMAIL: z.string().email().default("e.kadiyski@gmail.com"),
    CONTACT_FROM_EMAIL: z.string().optional().transform(emptyToUndefined),
    NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional().transform(emptyToUndefined),
    NEXT_PUBLIC_CLARITY_PROJECT_ID: z.string().optional().transform(emptyToUndefined),
  })
  .superRefine((env, ctx) => {
    if (env.CONTENT_SOURCE === "airtable") {
      if (!env.AIRTABLE_PAT) {
        ctx.addIssue({
          code: "custom",
          path: ["AIRTABLE_PAT"],
          message: "AIRTABLE_PAT is required when CONTENT_SOURCE=airtable",
        });
      }
      if (!env.AIRTABLE_BASE_ID) {
        ctx.addIssue({
          code: "custom",
          path: ["AIRTABLE_BASE_ID"],
          message: "AIRTABLE_BASE_ID is required when CONTENT_SOURCE=airtable",
        });
      }
    }
  });

export type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse({
    SITE_URL: process.env.SITE_URL,
    CONTENT_SOURCE: process.env.CONTENT_SOURCE,
    AIRTABLE_PAT: process.env.AIRTABLE_PAT,
    AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID,
    AIRTABLE_TABLE_PROJECTS: process.env.AIRTABLE_TABLE_PROJECTS,
    AIRTABLE_TABLE_PROJECT_IMAGES: process.env.AIRTABLE_TABLE_PROJECT_IMAGES,
    AIRTABLE_TABLE_SERVICES: process.env.AIRTABLE_TABLE_SERVICES,
    AIRTABLE_TABLE_BLOG_POSTS: process.env.AIRTABLE_TABLE_BLOG_POSTS,
    AIRTABLE_TABLE_PRICES: process.env.AIRTABLE_TABLE_PRICES,
    AIRTABLE_TABLE_SITE_SETTINGS: process.env.AIRTABLE_TABLE_SITE_SETTINGS,
    AIRTABLE_REVALIDATE_SECONDS: process.env.AIRTABLE_REVALIDATE_SECONDS,
    AIRTABLE_FALLBACK_TO_MOCK: process.env.AIRTABLE_FALLBACK_TO_MOCK,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_CLARITY_PROJECT_ID: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
  });

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment configuration: ${details}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

export function resetEnvCacheForTests() {
  cachedEnv = null;
}
