"use client";

import Link from "next/link";
import { useCartFeedbackStore } from "@/lib/cart-feedback-store";

/**
 * Fixed confirmation after add-to-cart — optimized for real phones (thumb zone, safe areas).
 */
export function CartAddedToast() {
  const open = useCartFeedbackStore((s) => s.open);
  const productName = useCartFeedbackStore((s) => s.productName);
  const quantity = useCartFeedbackStore((s) => s.quantity);
  const dismiss = useCartFeedbackStore((s) => s.dismiss);

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed left-0 right-0 z-[85] flex justify-center px-4 animate-[ev-toast-in_0.38s_cubic-bezier(0.22,1,0.36,1)_both]"
      style={{
        bottom: "max(6.75rem, calc(env(safe-area-inset-bottom, 0px) + 5.5rem))",
        paddingLeft: "max(1rem, env(safe-area-inset-left, 0px))",
        paddingRight: "max(1rem, env(safe-area-inset-right, 0px))",
      }}
    >
      <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-[var(--ev-border-strong)] bg-[var(--ev-bg)]/95 p-4 shadow-[var(--ev-shadow-soft)] backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--ev-primary)]">
              Added to cart
            </p>
            <p className="mt-1.5 font-display text-lg leading-snug text-[var(--ev-text)]">
              {productName}
            </p>
            {quantity > 1 ? (
              <p className="mt-1 text-sm text-[var(--ev-text-muted)]">Quantity · {quantity}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="ev-touch flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--ev-border)] text-lg leading-none text-[var(--ev-text-muted)] transition-colors active:bg-[var(--ev-surface)]"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
        <Link
          href="/cart"
          className="ev-touch mt-4 flex min-h-12 items-center justify-center rounded-[var(--ev-radius-sm)] bg-[var(--ev-primary)] text-sm font-semibold uppercase tracking-[0.15em] text-[var(--ev-bg)]"
        >
          View cart
        </Link>
      </div>
    </div>
  );
}
