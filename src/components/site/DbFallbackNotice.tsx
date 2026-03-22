export function DbFallbackNotice() {
  return (
    <div
      role="status"
      className="border-b border-[var(--ev-border-strong)] bg-[var(--ev-surface)] px-4 py-2.5 text-center text-xs leading-snug text-[var(--ev-text-muted)]"
    >
      Live catalog database is unreachable (common on Vercel with SQLite). Showing preview content
      where available—connect a hosted Postgres URL to restore real inventory.
    </div>
  );
}
