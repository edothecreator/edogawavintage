"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useCartStore, useCartStoreHydrated } from "@/lib/cart-store";
import { useCartFeedbackStore } from "@/lib/cart-feedback-store";

const primaryLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/collections/digital-cameras", label: "Digital" },
  { href: "/collections/film-cameras", label: "Film" },
  { href: "/collections/camcorders", label: "Camcorders" },
  { href: "/collections/accessories", label: "Accessories" },
];

const secondaryLinks = [
  { href: "/collections/new-arrivals", label: "New arrivals" },
  { href: "/collections/best-sellers", label: "Best sellers" },
  { href: "/collections/sold-out-archive", label: "Sold-out archive" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const hydrated = useCartStoreHydrated();
  const lines = useCartStore((s) => s.lines);
  const count = hydrated ? lines.reduce((n, l) => n + l.quantity, 0) : 0;
  const cartBump = useCartFeedbackStore((s) => s.bump);

  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const t = window.setTimeout(() => closeRef.current?.focus(), 10);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <header
      className="sticky top-0 z-[70] border-b border-[var(--ev-border)] bg-[var(--ev-bg)]/92 backdrop-blur-md"
      style={{ paddingTop: "max(0px, env(safe-area-inset-top))" }}
    >
      <div className="ev-container flex min-h-16 items-center justify-between gap-3 sm:min-h-[4.25rem] sm:gap-4">
        <BrandLogo />
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          {primaryLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[11px] uppercase tracking-[0.2em] text-[var(--ev-text-muted)] transition-colors hover:text-[var(--ev-text)]"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/about"
            className="text-[11px] uppercase tracking-[0.2em] text-[var(--ev-text-muted)] transition-colors hover:text-[var(--ev-text)]"
          >
            About
          </Link>
          <Link
            href="/faq"
            className="text-[11px] uppercase tracking-[0.2em] text-[var(--ev-text-muted)] transition-colors hover:text-[var(--ev-text)]"
          >
            FAQ
          </Link>
          <Link
            href="/contact"
            className="text-[11px] uppercase tracking-[0.2em] text-[var(--ev-text-muted)] transition-colors hover:text-[var(--ev-text)]"
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/cart"
            className="ev-touch relative inline-flex min-h-12 min-w-12 items-center justify-center rounded-[var(--ev-radius-sm)] border border-[var(--ev-border)] bg-[var(--ev-surface)] text-[11px] uppercase tracking-[0.18em] text-[var(--ev-text)] transition-colors active:scale-95 hover:border-[var(--ev-border-strong)] sm:min-h-11 sm:min-w-11"
          >
            Cart
            {count > 0 && (
              <span
                key={cartBump}
                className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--ev-primary)] px-1 text-[10px] font-semibold text-[var(--ev-bg)] shadow-[0_0_12px_rgba(212,181,106,0.45)]"
                style={
                  cartBump > 0
                    ? { animation: "ev-cart-badge-pop 0.5s ease-out" }
                    : undefined
                }
                aria-hidden
              >
                {count > 9 ? "9+" : count}
              </span>
            )}
            {count > 0 && <span className="sr-only">{count} items in cart</span>}
          </Link>
          <button
            type="button"
            className="ev-touch inline-flex min-h-12 min-w-12 flex-col items-center justify-center gap-1.5 rounded-[var(--ev-radius-sm)] border border-[var(--ev-border)] bg-[var(--ev-surface)] active:scale-95 lg:hidden"
            aria-expanded={open}
            aria-controls={open ? menuId : undefined}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`block h-0.5 w-5 bg-[var(--ev-text)] transition-transform duration-200 ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-[var(--ev-text)] transition-opacity duration-200 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-[var(--ev-text)] transition-transform duration-200 ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[71] bg-black/65 backdrop-blur-[2px] transition-opacity lg:hidden"
            aria-label="Close menu"
            onClick={close}
          />
          <div
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="fixed inset-y-0 right-0 z-[72] flex w-[min(100%,22.5rem)] flex-col border-l border-[var(--ev-border-strong)] bg-[var(--ev-bg)] shadow-[var(--ev-shadow-soft)] animate-[ev-slide-in_0.28s_ease-out_both] lg:hidden"
            style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
          >
            <div className="flex items-center justify-between border-b border-[var(--ev-border)] px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--ev-primary)]">
                Navigate
              </p>
              <button
                ref={closeRef}
                type="button"
                className="rounded-md px-3 py-2 text-xs uppercase tracking-[0.2em] text-[var(--ev-text-muted)] transition-colors hover:bg-[var(--ev-surface)] hover:text-[var(--ev-text)]"
                onClick={close}
              >
                Close
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4" aria-label="Mobile">
              <p className="mb-2 px-3 text-[10px] uppercase tracking-[0.28em] text-[var(--ev-text-muted)]">
                Shop
              </p>
              {primaryLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  className="ev-touch flex min-h-[52px] items-center rounded-xl px-4 text-[15px] font-medium tracking-wide text-[var(--ev-text)] transition-colors active:bg-[var(--ev-surface)]"
                >
                  {l.label}
                </Link>
              ))}
              <p className="mb-2 mt-6 px-3 text-[10px] uppercase tracking-[0.28em] text-[var(--ev-text-muted)]">
                Discover
              </p>
              {secondaryLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  className="ev-touch flex min-h-[48px] items-center rounded-xl px-4 text-[15px] text-[var(--ev-text-muted)] transition-colors active:bg-[var(--ev-surface)] active:text-[var(--ev-text)]"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-[var(--ev-border)] p-4">
              <Link
                href="/cart"
                onClick={close}
                className="ev-touch flex min-h-[52px] items-center justify-center rounded-[var(--ev-radius-sm)] border border-[var(--ev-border-strong)] bg-[var(--ev-surface)] text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ev-text)] active:scale-[0.99]"
              >
                View cart{count > 0 ? ` (${count})` : ""}
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
