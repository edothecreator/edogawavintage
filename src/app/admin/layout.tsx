export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[var(--ev-bg)] text-[var(--ev-text)] antialiased">{children}</div>
  );
}
