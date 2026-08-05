import Link from "next/link";

import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader, AdminTable } from "@/components/admin/FormFields";
import { fetchProjectsForAdmin } from "@/lib/airtable/admin-queries";
import { getEnv } from "@/lib/env";

type PageProps = {
  searchParams: Promise<{ notice?: string | string[] }>;
};

export default async function AdminProjectsPage({ searchParams }: PageProps) {
  const { notice } = await searchParams;
  const env = getEnv();
  if (env.CONTENT_SOURCE !== "airtable") {
    return (
      <div>
        <AdminPageHeader title="Projects" />
        <p className="text-sm text-[var(--color-muted)]">Requires CONTENT_SOURCE=airtable.</p>
      </div>
    );
  }

  const projects = await fetchProjectsForAdmin();

  return (
    <div>
      <AdminNotice notice={notice} />
      <AdminPageHeader
        title="Projects"
        action={
          <Link
            href="/admin/projects/new"
            className="border border-[var(--color-ink)] px-3 py-2 text-xs tracking-[0.1em] uppercase"
          >
            New project
          </Link>
        }
      />
      <AdminTable
        headers={["Order", "Title", "Status", "Images", ""]}
        rows={projects.map((project) => [
          String(project.order),
          project.title.en,
          project.status,
          String(project.images.length),
          <Link key={project.id} href={`/admin/projects/${project.id}`} className="underline">
            Edit
          </Link>,
        ])}
      />
    </div>
  );
}
