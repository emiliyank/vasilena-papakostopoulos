"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";

import { FormMessage } from "@/components/admin/FormFields";
import type { ActionState } from "@/lib/admin/actions";

const initial: ActionState = {};

export function AdminForm({
  action,
  children,
  encType,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  children: ReactNode;
  encType?: string;
}) {
  const [state, formAction] = useActionState(action, initial);

  return (
    <form action={formAction} encType={encType} className="space-y-6">
      <FormMessage error={state.error} success={state.success} />
      {children}
    </form>
  );
}
