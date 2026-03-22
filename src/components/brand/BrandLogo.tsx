import Link from "next/link";

type Props = { className?: string; withWordmark?: boolean };

export function BrandLogo({ className = "", withWordmark = true }: Props) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2 rounded-md focus-visible:outline-none ${className}`}
    >
      <span
        aria-hidden
        className="relative flex h-9 w-9 items-center justify-center rounded-[10px] border border-[var(--ev-border-strong)] bg-[var(--ev-surface)] shadow-[var(--ev-shadow-card)] transition-transform duration-300 group-hover:-translate-y-0.5"
      >
        <span className="absolute inset-0 rounded-[10px] bg-[radial-gradient(circle_at_30%_20%,rgba(201,169,98,0.35),transparent_55%)]" />
        <span className="font-display text-lg font-semibold tracking-[0.2em] text-[var(--ev-primary)]">
          E
        </span>
      </span>
      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg tracking-[0.18em] text-[var(--ev-text)] sm:text-xl">
            EDOGAWA
          </span>
          <span className="text-[10px] uppercase tracking-[0.45em] text-[var(--ev-text-muted)]">
            Vintage
          </span>
        </span>
      )}
    </Link>
  );
}
