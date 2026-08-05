export function logAdminAction(input: {
  actorEmail: string;
  action: "create" | "update" | "delete" | "upload";
  table: string;
  recordId?: string;
}) {
  console.info(
    JSON.stringify({
      type: "admin_audit",
      at: new Date().toISOString(),
      actor: input.actorEmail,
      action: input.action,
      table: input.table,
      recordId: input.recordId ?? null,
    }),
  );
}
