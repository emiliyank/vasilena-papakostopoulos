import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/FormFields";
import {
  fetchBlogPostsForAdmin,
  fetchPricesForAdmin,
  fetchProjectsForAdmin,
  fetchServicesForAdmin,
  fetchSiteSettingsForAdmin,
} from "@/lib/airtable/admin-queries";
import { getEnv } from "@/lib/env";

export default async function AdminDashboardPage() {
  const env = getEnv();
  if (env.CONTENT_SOURCE !== "airtable") {
    return (
      <div>
        <AdminPageHeader title="Dashboard" />
        <p className="border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm">
          Admin editing requires <code>CONTENT_SOURCE=airtable</code> and a write-capable Airtable
          PAT. Switch the content source to manage live records.
        </p>
      </div>
    );
  }

  const [settings, services, projects, prices, posts] = await Promise.all([
    fetchSiteSettingsForAdmin(),
    fetchServicesForAdmin(),
    fetchProjectsForAdmin(),
    fetchPricesForAdmin(),
    fetchBlogPostsForAdmin(),
  ]);

  const cards = [
    { label: "Site settings", value: settings ? "Configured" : "Missing", href: "/admin/settings" },
    { label: "Services", value: String(services.length), href: "/admin/services" },
    { label: "Projects", value: String(projects.length), href: "/admin/projects" },
    { label: "Prices", value: String(prices.length), href: "/admin/prices" },
    { label: "Blog posts", value: String(posts.length), href: "/admin/blog" },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Manage Airtable-backed content. Public pages only show Published records."
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              className="block border border-[var(--color-line)] bg-[var(--color-surface)] px-5 py-6 transition-opacity hover:opacity-80"
            >
              <p className="text-xs tracking-[0.12em] text-[var(--color-muted)] uppercase">
                {card.label}
              </p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-3xl">{card.value}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
