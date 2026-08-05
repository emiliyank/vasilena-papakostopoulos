type EmptyStateProps = {
  title: string;
  body: string;
};

export function EmptyState({ title, body }: EmptyStateProps) {
  return (
    <div className="mt-12 border border-[var(--color-line)] bg-[var(--color-surface)] px-6 py-10">
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
        {title}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-muted)]">{body}</p>
    </div>
  );
}
