"use client";

import type { FormEvent } from "react";

type ConfirmDeleteFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  recordId: string;
  label: string;
  confirmMessage: string;
  className?: string;
};

export function ConfirmDeleteForm({
  action,
  recordId,
  label,
  confirmMessage,
  className = "mt-6",
}: ConfirmDeleteFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(confirmMessage)) {
      event.preventDefault();
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit} className={className}>
      <input type="hidden" name="id" value={recordId} />
      <button type="submit" className="border border-red-700 px-4 py-2 text-sm text-red-800">
        {label}
      </button>
    </form>
  );
}
