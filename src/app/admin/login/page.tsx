import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LoginForm } from "@/app/admin/login/LoginForm";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-full flex-col items-center justify-center px-6 py-16">
      <h1 className="mb-2 font-[family-name:var(--font-display)] text-4xl">Admin</h1>
      <p className="mb-10 text-sm text-[var(--color-muted)]">Sign in to manage site content</p>
      <LoginForm />
    </main>
  );
}
