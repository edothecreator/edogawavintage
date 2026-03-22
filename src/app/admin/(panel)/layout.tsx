import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

export const dynamic = "force-dynamic";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-[var(--ev-border)] bg-[var(--ev-bg-elevated)] lg:border-b-0 lg:border-r">
        <div
          className="flex flex-col gap-6 p-4 sm:p-6"
          style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
        >
          <BrandLogo withWordmark />
          <nav
            className="-mx-1 flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
            aria-label="Admin"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="ev-touch shrink-0 rounded-lg px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--ev-text-muted)] transition-colors active:bg-[var(--ev-surface)] lg:w-full lg:py-2.5 lg:text-left"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <AdminLogoutButton />
        </div>
      </aside>
      <div
        className="min-w-0 p-4 sm:p-10"
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
      >
        {children}
      </div>
    </div>
  );
}
