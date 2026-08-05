#!/usr/bin/env node
import bcrypt from "bcryptjs";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

async function main() {
  const fromArg = process.argv[2];
  let password = fromArg;

  if (!password) {
    const rl = createInterface({ input, output });
    password = await rl.question("Password to hash: ");
    rl.close();
  }

  if (!password) {
    console.error("Password is required.");
    process.exit(1);
  }

  const email = process.argv[3] || "admin@example.com";
  const hash = await bcrypt.hash(password, 12);
  const encoded = `bcrypt64:${Buffer.from(hash, "utf8").toString("base64")}`;

  console.log("\nRecommended (.env.local) — safe against dotenv $ expansion:\n");
  console.log(`ADMIN_EMAIL=${email}`);
  console.log(`ADMIN_PASSWORD_HASH=${encoded}`);
  console.log("\n(Optional legacy JSON form — keep single quotes if you use raw bcrypt):\n");
  console.log(`ADMIN_USERS='${JSON.stringify([{ email, passwordHash: encoded }])}'`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
