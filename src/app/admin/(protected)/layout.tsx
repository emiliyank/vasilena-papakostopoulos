import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { logoutAdmin } from "@/app/admin/actions";
import { auth } from "@/auth";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/prices", label: "Prices" },
  { href: "/admin/blog", label: "Blog" },
] as const;

type ProtectedAdminLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedAdminLayout({ children }: ProtectedAdminLayoutProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-full">
      <header className="border-b border-[var(--color-line)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-xs tracking-[0.14em] text-[var(--color-muted)] uppercase">
              Content admin
            </p>
            <p className="text-sm text-[var(--color-ink)]">{session.user.email}</p>
          </div>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="border border-[var(--color-line)] px-3 py-1.5 text-xs tracking-[0.1em] uppercase hover:border-[var(--color-ink)]"
            >
              Sign out
            </button>
          </form>
        </div>
        <nav
          aria-label="Admin"
          className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3 sm:px-6"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap px-3 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
