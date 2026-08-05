export type AdminNoticeKind = "saved" | "deleted";

export function parseAdminNotice(value: string | string[] | undefined): AdminNoticeKind | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "saved" || raw === "deleted") {
    return raw;
  }
  return null;
}

/** Build an admin path with a flash notice query param. */
export function withAdminNotice(path: string, notice: AdminNoticeKind): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}notice=${notice}`;
}

export const ADMIN_NOTICE_MESSAGES: Record<AdminNoticeKind, string> = {
  saved: "Changes saved successfully.",
  deleted: "Item deleted successfully.",
};
