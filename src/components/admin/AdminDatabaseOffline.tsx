export function AdminDatabaseOffline() {
  return (
    <div className="rounded-[var(--ev-radius)] border border-[var(--ev-border-strong)] bg-[var(--ev-surface)] p-8 text-center shadow-[var(--ev-shadow-card)]">
      <h1 className="font-display text-2xl text-[var(--ev-text)]">Database unreachable</h1>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[var(--ev-text-muted)]">
        Admin and orders need a database the server can open on every request. SQLite with{" "}
        <code className="text-[var(--ev-text)]">file:./dev.db</code> usually fails on Vercel
        serverless. Provision hosted Postgres, set <code className="text-[var(--ev-text)]">DATABASE_URL</code>, run{" "}
        <code className="text-[var(--ev-text)]">prisma migrate deploy</code>, then redeploy.
      </p>
    </div>
  );
}
