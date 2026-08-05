#!/usr/bin/env node

/**
 * Print configured Next.js redirects for manual verification against REDIRECTS.md.
 * Usage: npm run audit:redirects
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const configSource = readFileSync(join(root, "next.config.ts"), "utf8");
const redirectsDoc = readFileSync(join(root, "REDIRECTS.md"), "utf8");

const projectSlugs = [
  ...configSource.matchAll(/"(form|balance|rhythm|variations|scale|heritage|unity|potential)"/g),
].map((match) => match[1]);
const blogSlugs = [...configSource.matchAll(/"([a-z0-9-]+)"/g)]
  .map((match) => match[1])
  .filter(
    (slug) =>
      slug.includes("where-do-we-start") ||
      slug.includes("interior-design") ||
      slug.includes("interior-styling") ||
      slug.includes("how-the-process"),
  );

const uniqueProjects = [...new Set(projectSlugs)];
const uniqueBlogs = [...new Set(blogSlugs)];

console.log("Project redirects:");
for (const slug of uniqueProjects) {
  console.log(
    `  /portfolio/portfolio-collections/portfolio/${slug} → /en/projects/${slug}`,
  );
}

console.log("\nBlog redirects:");
console.log("  /portfolio/blog → /en/blog");
for (const slug of uniqueBlogs) {
  console.log(`  /portfolio/post/${slug} → /en/blog/${slug}`);
}

console.log("\nOther:");
console.log("  /portfolio → /en");
console.log("  /vassilena-papakost-1/services-4 → /en/prices");

const inventoryLines = redirectsDoc
  .split("\n")
  .filter((line) => line.includes("`/portfolio") || line.includes("`/vassilena"));
console.log(`\nREDIRECTS.md table rows mentioning portfolio/prices paths: ${inventoryLines.length}`);
console.log("Compare the lists above with REDIRECTS.md before launch.");
