import Link from "next/link";

import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader, AdminTable } from "@/components/admin/FormFields";
import { fetchServicesForAdmin } from "@/lib/airtable/admin-queries";
import { getEnv } from "@/lib/env";

type PageProps = {
  searchParams: Promise<{ notice?: string | string[] }>;
};

export default async function AdminServicesPage({ searchParams }: PageProps) {
  const { notice } = await searchParams;
  const env = getEnv();
  if (env.CONTENT_SOURCE !== "airtable") {
    return (
      <div>
        <AdminPageHeader title="Services" />
        <p className="text-sm text-[var(--color-muted)]">Requires CONTENT_SOURCE=airtable.</p>
      </div>
    );
  }

  const services = await fetchServicesForAdmin();

  return (
    <div>
      <AdminNotice notice={notice} />
      <AdminPageHeader
        title="Services"
        action={
          <Link
            href="/admin/services/new"
            className="border border-[var(--color-ink)] px-3 py-2 text-xs tracking-[0.1em] uppercase"
          >
            New service
          </Link>
        }
      />
      <AdminTable
        headers={["Order", "Title", "Status", "Slug", ""]}
        rows={services.map((service) => [
          String(service.order),
          service.title.en,
          service.status,
          service.slug,
          <Link key={service.id} href={`/admin/services/${service.id}`} className="underline">
            Edit
          </Link>,
        ])}
      />
    </div>
  );
}
