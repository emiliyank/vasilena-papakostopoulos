import { z } from "zod";

import { getEnv } from "@/lib/env";

const adminUserSchema = z.object({
  email: z.string().email(),
  passwordHash: z.string().min(20),
});

export type AdminUserRecord = z.infer<typeof adminUserSchema>;

const BCRYPT_RE = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

/** Strip accidental wrapping quotes left by some env loaders. */
function stripWrappingQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

/**
 * Decode a password hash from env.
 * Prefer `bcrypt64:<base64>` so dotenv cannot corrupt `$2b$...` via expansion.
 */
export function decodePasswordHash(raw: string): string {
  const value = stripWrappingQuotes(raw);
  if (value.startsWith("bcrypt64:")) {
    return Buffer.from(value.slice("bcrypt64:".length), "base64").toString("utf8");
  }
  return value;
}

export function encodePasswordHash(bcryptHash: string): string {
  return `bcrypt64:${Buffer.from(bcryptHash, "utf8").toString("base64")}`;
}

export function isValidBcryptHash(hash: string): boolean {
  return BCRYPT_RE.test(hash);
}

export function parseAdminUsers(raw: string | undefined): AdminUserRecord[] {
  if (!raw?.trim()) {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripWrappingQuotes(raw));
  } catch {
    throw new Error("ADMIN_USERS must be valid JSON");
  }

  const result = z.array(adminUserSchema).safeParse(parsed);
  if (!result.success) {
    throw new Error(`ADMIN_USERS is invalid: ${result.error.message}`);
  }

  return result.data.map((user) => ({
    email: user.email,
    passwordHash: decodePasswordHash(user.passwordHash),
  }));
}

function getAdminUsersFromPair(): AdminUserRecord[] {
  const env = getEnv();
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD_HASH) {
    return [];
  }

  const passwordHash = decodePasswordHash(env.ADMIN_PASSWORD_HASH);
  const parsed = adminUserSchema.safeParse({
    email: env.ADMIN_EMAIL,
    passwordHash,
  });
  if (!parsed.success) {
    throw new Error(`ADMIN_EMAIL / ADMIN_PASSWORD_HASH is invalid: ${parsed.error.message}`);
  }
  return [parsed.data];
}

export function getAdminUsers(): AdminUserRecord[] {
  const fromPair = getAdminUsersFromPair();
  if (fromPair.length > 0) {
    return fromPair;
  }
  return parseAdminUsers(getEnv().ADMIN_USERS);
}

export function findAdminUserByEmail(email: string): AdminUserRecord | undefined {
  const normalized = email.trim().toLowerCase();
  return getAdminUsers().find((user) => user.email.toLowerCase() === normalized);
}
