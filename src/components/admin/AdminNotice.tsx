"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  ADMIN_NOTICE_MESSAGES,
  parseAdminNotice,
  type AdminNoticeKind,
} from "@/lib/admin/notices";

export function AdminNotice({ notice }: { notice?: string | string[] }) {
  const kind = parseAdminNotice(notice);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!kind) return;
    const timer = window.setTimeout(() => {
      router.replace(pathname, { scroll: false });
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [kind, pathname, router]);

  if (!kind) {
    return null;
  }

  return <AdminNoticeBanner kind={kind} />;
}

export function AdminNoticeBanner({ kind }: { kind: AdminNoticeKind }) {
  const isDelete = kind === "deleted";

  return (
    <p
      role="status"
      className={
        isDelete
          ? "mb-6 rounded-sm bg-[#f8e8e6] px-4 py-3 text-base font-semibold text-[#7a2e24]"
          : "mb-6 rounded-sm bg-[#e5efe6] px-4 py-3 text-base font-semibold text-[#1f4d2a]"
      }
    >
      {ADMIN_NOTICE_MESSAGES[kind]}
    </p>
  );
}
