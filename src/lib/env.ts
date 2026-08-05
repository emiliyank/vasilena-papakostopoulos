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
    AUTH_SECRET: z.string().optional().transform(emptyToUndefined),
    ADMIN_USERS: z.string().optional().transform(emptyToUndefined),
    ADMIN_EMAIL: z.string().optional().transform(emptyToUndefined),
    ADMIN_PASSWORD_HASH: z.string().optional().transform(emptyToUndefined),
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

    const hasAdminUsers = Boolean(env.ADMIN_USERS);
    const hasAdminPair = Boolean(env.ADMIN_EMAIL || env.ADMIN_PASSWORD_HASH);
    if ((hasAdminUsers || hasAdminPair) && !env.AUTH_SECRET) {
      ctx.addIssue({
        code: "custom",
        path: ["AUTH_SECRET"],
        message: "AUTH_SECRET is required when admin credentials are set",
      });
    }
    if (env.ADMIN_EMAIL && !env.ADMIN_PASSWORD_HASH) {
      ctx.addIssue({
        code: "custom",
        path: ["ADMIN_PASSWORD_HASH"],
        message: "ADMIN_PASSWORD_HASH is required when ADMIN_EMAIL is set",
      });
    }
    if (env.ADMIN_PASSWORD_HASH && !env.ADMIN_EMAIL) {
      ctx.addIssue({
        code: "custom",
        path: ["ADMIN_EMAIL"],
        message: "ADMIN_EMAIL is required when ADMIN_PASSWORD_HASH is set",
      });
    }
    if (env.ADMIN_EMAIL) {
      const emailCheck = z.string().email().safeParse(env.ADMIN_EMAIL);
      if (!emailCheck.success) {
        ctx.addIssue({
          code: "custom",
          path: ["ADMIN_EMAIL"],
          message: "ADMIN_EMAIL must be a valid email",
        });
      }
    }
    if (env.ADMIN_USERS) {
      try {
        const parsed = JSON.parse(
          env.ADMIN_USERS.trim().replace(/^'(.*)'$/, "$1").replace(/^"(.*)"$/, "$1"),
        );
        if (!Array.isArray(parsed)) {
          ctx.addIssue({
            code: "custom",
            path: ["ADMIN_USERS"],
            message: "ADMIN_USERS must be a JSON array",
          });
        }
      } catch {
        ctx.addIssue({
          code: "custom",
          path: ["ADMIN_USERS"],
          message: "ADMIN_USERS must be valid JSON",
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
    AUTH_SECRET: process.env.AUTH_SECRET,
    ADMIN_USERS: process.env.ADMIN_USERS,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
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
