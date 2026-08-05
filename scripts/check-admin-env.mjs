#!/usr/bin/env node
/**
 * Diagnose admin env loading without printing secrets.
 * Usage: node --env-file=.env.local scripts/check-admin-env.mjs
 * Optional password argv: ... check-admin-env.mjs your-password
 */
import bcrypt from "bcryptjs";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());

function mask(value) {
  if (!value) return "(empty)";
  return `len=${value.length} starts=${JSON.stringify(value.slice(0, 3))} ends=${JSON.stringify(value.slice(-3))}`;
}

function looksLikeBcrypt(hash) {
  return typeof hash === "string" && /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(hash);
}

function decodeHash(raw) {
  if (!raw) return raw;
  if (raw.startsWith("bcrypt64:")) {
    return Buffer.from(raw.slice("bcrypt64:".length), "base64").toString("utf8");
  }
  return raw.trim().replace(/^'(.*)'$/, "$1").replace(/^"(.*)"$/, "$1");
}

const rawUsers = process.env.ADMIN_USERS;
const adminEmail = process.env.ADMIN_EMAIL;
const adminHash = process.env.ADMIN_PASSWORD_HASH;

console.log("AUTH_SECRET set:", Boolean(process.env.AUTH_SECRET));
console.log("ADMIN_USERS:", mask(rawUsers));
console.log("ADMIN_EMAIL:", adminEmail ? mask(adminEmail) : "(not set)");
console.log("ADMIN_PASSWORD_HASH:", adminHash ? mask(adminHash) : "(not set)");

let users = [];
if (adminEmail && adminHash) {
  users = [{ email: adminEmail, passwordHash: decodeHash(adminHash) }];
  console.log("Using ADMIN_EMAIL + ADMIN_PASSWORD_HASH");
} else if (rawUsers) {
  try {
    const trimmed = rawUsers.trim().replace(/^'(.*)'$/, "$1").replace(/^"(.*)"$/, "$1");
    const parsed = JSON.parse(trimmed);
    users = parsed.map((user) => ({
      ...user,
      passwordHash: decodeHash(user.passwordHash),
    }));
    console.log("ADMIN_USERS JSON parse: ok, count=", users.length);
  } catch (error) {
    console.log("ADMIN_USERS JSON parse: FAIL", error.message);
  }
}

if (users.length === 0) {
  console.log("No admin users resolved — login cannot succeed.");
  process.exit(1);
}

for (const [index, user] of users.entries()) {
  const hash = user.passwordHash ?? "";
  console.log(`user[${index}] email:`, user.email);
  console.log(`user[${index}] hash looks like bcrypt:`, looksLikeBcrypt(hash));
  console.log(`user[${index}] hash:`, mask(hash));
  if (!looksLikeBcrypt(hash)) {
    console.log("  -> Hash is corrupted or not bcrypt. Re-run: npm run admin:hash-password");
  }
}

const testPassword = process.argv[2];
if (testPassword) {
  const ok = await bcrypt.compare(testPassword, users[0].passwordHash);
  console.log("password verify against first user:", ok ? "MATCH" : "NO MATCH");
} else {
  console.log("Tip: node --env-file=.env.local scripts/check-admin-env.mjs your-password");
}
