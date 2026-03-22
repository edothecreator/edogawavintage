import Link from "next/link";

const cols = [
  {
    title: "Explore",
    links: [
      { href: "/shop", label: "Shop all" },
      { href: "/collections/new-arrivals", label: "New arrivals" },
      { href: "/collections/best-sellers", label: "Best sellers" },
      { href: "/collections/sold-out-archive", label: "Sold-out archive" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-auto border-t border-[var(--ev-border)] bg-[var(--ev-bg-elevated)]/95 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--ev-primary)]/25 to-transparent" />
      <div className="ev-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <p className="font-display text-xl tracking-[0.28em] text-[var(--ev-text)]">EDOGAWA</p>
          <p className="text-sm leading-relaxed text-[var(--ev-text-muted)]">
            A premium vintage camera universe—curated instruments, honest condition notes, and a
            calm place to choose your next frame.
          </p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-[var(--ev-text-muted)]">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--ev-primary)]"
            >
              Instagram
            </a>
            <span className="text-[var(--ev-border)]">/</span>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--ev-primary)]"
            >
              WhatsApp
            </a>
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title} className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--ev-primary)]">{c.title}</p>
            <ul className="space-y-2 text-sm text-[var(--ev-text-muted)]">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-[var(--ev-text)]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--ev-border)] py-6">
        <p className="ev-container text-center text-xs text-[var(--ev-text-muted)]">
          © {new Date().getFullYear()} Edogawa Vintage. Crafted for photographers who still listen
          for the shutter.
        </p>
      </div>
    </footer>
  );
}
