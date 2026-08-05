import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  type?: "text" | "email" | "url" | "number" | "date" | "password";
  required?: boolean;
  hint?: string;
};

export function TextField({
  label,
  name,
  defaultValue = "",
  type = "text",
  required,
  hint,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
        {required ? <span className="text-red-700"> *</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="w-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
      />
      {hint ? <p className="text-xs text-[var(--color-muted)]">{hint}</p> : null}
    </div>
  );
}

type TextAreaProps = {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  required?: boolean;
  hint?: string;
};

export function TextArea({
  label,
  name,
  defaultValue = "",
  rows = 4,
  required,
  hint,
}: TextAreaProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
        {required ? <span className="text-red-700"> *</span> : null}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        required={required}
        className="w-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
      />
      {hint ? <p className="text-xs text-[var(--color-muted)]">{hint}</p> : null}
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  options: Array<{ value: string; label: string }>;
};

export function SelectField({ label, name, defaultValue, options }: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="w-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function BilingualFields({
  label,
  enName,
  bgName,
  enDefault = "",
  bgDefault = "",
  multiline,
  rows = 4,
  required,
}: {
  label: string;
  enName: string;
  bgName: string;
  enDefault?: string;
  bgDefault?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}) {
  return (
    <fieldset className="space-y-3 border border-[var(--color-line)] p-4">
      <legend className="px-1 text-sm font-medium">{label}</legend>
      <div className="grid gap-4 md:grid-cols-2">
        {multiline ? (
          <>
            <TextArea label="English" name={enName} defaultValue={enDefault} rows={rows} required={required} />
            <TextArea label="Bulgarian" name={bgName} defaultValue={bgDefault} rows={rows} required={required} />
          </>
        ) : (
          <>
            <TextField label="English" name={enName} defaultValue={enDefault} required={required} />
            <TextField label="Bulgarian" name={bgName} defaultValue={bgDefault} required={required} />
          </>
        )}
      </div>
    </fieldset>
  );
}

export function StatusSelect({ defaultValue = "draft" }: { defaultValue?: string }) {
  return (
    <SelectField
      label="Status"
      name="status"
      defaultValue={defaultValue}
      options={[
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
        { value: "archived", label: "Archived" },
      ]}
    />
  );
}

export function FormMessage({ error, success }: { error?: string; success?: string }) {
  if (error) {
    return (
      <p
        className="rounded-sm bg-[#f8e8e6] px-4 py-3 text-base font-semibold text-[#7a2e24]"
        role="alert"
      >
        {error}
      </p>
    );
  }
  if (success) {
    return (
      <p
        className="rounded-sm bg-[#e5efe6] px-4 py-3 text-base font-semibold text-[#1f4d2a]"
        role="status"
      >
        {success}
      </p>
    );
  }
  return null;
}

export function FormActions({ children }: { children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-[var(--color-line)] pt-6">
      <button
        type="submit"
        className="bg-[var(--color-ink)] px-4 py-2 text-sm tracking-[0.08em] text-[var(--color-bg)] uppercase"
      >
        Save
      </button>
      {children}
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl">{title}</h1>
        {description ? <p className="mt-2 text-sm text-[var(--color-muted)]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function AdminTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto border border-[var(--color-line)]">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[var(--color-surface)] text-xs tracking-[0.08em] text-[var(--color-muted)] uppercase">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-[var(--color-line)]">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
