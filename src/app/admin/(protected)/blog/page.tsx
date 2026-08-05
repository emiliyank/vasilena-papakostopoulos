import Link from "next/link";

import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminPageHeader, AdminTable } from "@/components/admin/FormFields";
import { fetchBlogPostsForAdmin } from "@/lib/airtable/admin-queries";
import { getEnv } from "@/lib/env";

type PageProps = {
  searchParams: Promise<{ notice?: string | string[] }>;
};

export default async function AdminBlogPage({ searchParams }: PageProps) {
  const { notice } = await searchParams;
  const env = getEnv();
  if (env.CONTENT_SOURCE !== "airtable") {
    return (
      <div>
        <AdminPageHeader title="Blog" />
        <p className="text-sm text-[var(--color-muted)]">Requires CONTENT_SOURCE=airtable.</p>
      </div>
    );
  }

  const posts = await fetchBlogPostsForAdmin();

  return (
    <div>
      <AdminNotice notice={notice} />
      <AdminPageHeader
        title="Blog"
        action={
          <Link
            href="/admin/blog/new"
            className="border border-[var(--color-ink)] px-3 py-2 text-xs tracking-[0.1em] uppercase"
          >
            New post
          </Link>
        }
      />
      <AdminTable
        headers={["Published", "Title", "Status", "Slug", ""]}
        rows={posts.map((post) => [
          post.publishedAt || "—",
          post.title.en,
          post.status,
          post.slug,
          <Link key={post.id} href={`/admin/blog/${post.id}`} className="underline">
            Edit
          </Link>,
        ])}
      />
    </div>
  );
}
