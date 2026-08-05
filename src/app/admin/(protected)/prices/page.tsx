import Link from "next/link";

import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader, AdminTable } from "@/components/admin/FormFields";
import { fetchPricesForAdmin } from "@/lib/airtable/admin-queries";
import { getEnv } from "@/lib/env";

type PageProps = {
  searchParams: Promise<{ notice?: string | string[] }>;
};

export default async function AdminPricesPage({ searchParams }: PageProps) {
  const { notice } = await searchParams;
  const env = getEnv();
  if (env.CONTENT_SOURCE !== "airtable") {
    return (
      <div>
        <AdminPageHeader title="Prices" />
        <p className="text-sm text-[var(--color-muted)]">Requires CONTENT_SOURCE=airtable.</p>
      </div>
    );
  }

  const prices = await fetchPricesForAdmin();

  return (
    <div>
      <AdminNotice notice={notice} />
      <AdminPageHeader
        title="Prices"
        action={
          <Link
            href="/admin/prices/new"
            className="border border-[var(--color-ink)] px-3 py-2 text-xs tracking-[0.1em] uppercase"
          >
            New package
          </Link>
        }
      />
      <AdminTable
        headers={["Order", "Name", "Price", "Status", ""]}
        rows={prices.map((price) => [
          String(price.order),
          price.name.en,
          price.priceDisplay.en,
          price.status,
          <Link key={price.id} href={`/admin/prices/${price.id}`} className="underline">
            Edit
          </Link>,
        ])}
      />
    </div>
  );
}
