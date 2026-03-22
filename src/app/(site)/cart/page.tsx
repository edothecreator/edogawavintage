"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { useCartStore, useCartStoreHydrated } from "@/lib/cart-store";
import { DELIVERY_FEE_USD } from "@/lib/constants";
import { formatMoney, summarizeCartMoney } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const hydrated = useCartStoreHydrated();
  const lines = useCartStore((s) => s.lines);
  const remove = useCartStore((s) => s.remove);
  const setQty = useCartStore((s) => s.setQty);

  const { subtotal, currency, mixedCurrency } = useMemo(
    () => summarizeCartMoney(lines),
    [lines],
  );
  const delivery = lines.length ? DELIVERY_FEE_USD : 0;
  const total = subtotal + delivery;

  if (!hydrated) {
    return (
      <div className="ev-container py-16">
        <div className="h-40 animate-pulse rounded-[var(--ev-radius)] bg-[var(--ev-surface)]" />
      </div>
    );
  }

  return (
    <div
      className={`ev-container space-y-8 py-8 sm:space-y-10 sm:py-14 ${lines.length > 0 ? "pb-32 lg:pb-10" : ""}`}
    >
      <div>
        <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--ev-primary)]">Cart</p>
        <h1 className="mt-2 font-display text-3xl text-[var(--ev-text)] sm:text-4xl">
          Your selection
        </h1>
      </div>
      {lines.length === 0 ? (
        <div className="rounded-[var(--ev-radius)] border border-dashed border-[var(--ev-border)] bg-[var(--ev-surface)]/60 px-5 py-14 text-center sm:px-6 sm:py-16">
          <p className="font-display text-2xl text-[var(--ev-text)]">The cart is quiet</p>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--ev-text-muted)] sm:text-sm">
            Discover pieces in the shop—each one is described with care.
          </p>
          <Link href="/shop" className="mt-8 inline-block">
            <Button>Continue shopping</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <ul className="space-y-4" aria-label="Cart items">
              {lines.map((l) => (
                <li
                  key={l.productId}
                  className="flex gap-4 rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-surface)] p-4 shadow-[var(--ev-shadow-card)]"
                >
                  <div className="relative size-28 shrink-0 overflow-hidden rounded-lg bg-black/30 sm:size-32">
                    <Image
                      src={l.image}
                      alt={l.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--ev-text-muted)]">
                          {l.brand}
                        </p>
                        <Link
                          href={`/product/${l.slug}`}
                          className="ev-touch font-display text-lg text-[var(--ev-text)] active:text-[var(--ev-primary)] sm:hover:text-[var(--ev-primary)]"
                        >
                          {l.name}
                        </Link>
                      </div>
                      <div className="shrink-0 text-right sm:hidden">
                        <p className="text-base font-semibold text-[var(--ev-text)]">
                          {formatMoney(l.price * l.quantity, l.currency)}
                        </p>
                        <p className="text-xs text-[var(--ev-text-muted)]">
                          {formatMoney(l.price, l.currency)} each
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="flex flex-col gap-1 text-xs text-[var(--ev-text-muted)]">
                        <span className="uppercase tracking-[0.15em]">Quantity</span>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          max={l.maxQty}
                          value={l.quantity}
                          onChange={(e) => {
                            const n = Number(e.target.value);
                            if (!Number.isFinite(n)) return;
                            setQty(l.productId, n);
                          }}
                          onBlur={() => setQty(l.productId, l.quantity)}
                          className="ev-touch min-h-12 w-24 rounded-lg border border-[var(--ev-border)] bg-[var(--ev-bg-elevated)] px-3 text-base text-[var(--ev-text)]"
                        />
                      </label>
                      <p className="text-xs text-[var(--ev-text-muted)]">Max {l.maxQty}</p>
                      <Button type="button" variant="ghost" onClick={() => remove(l.productId)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                  <div className="hidden shrink-0 flex-col items-end justify-start text-right sm:flex">
                    <p className="text-sm font-medium text-[var(--ev-text)]">
                      {formatMoney(l.price * l.quantity, l.currency)}
                    </p>
                    <p className="mt-1 text-xs text-[var(--ev-text-muted)]">
                      {formatMoney(l.price, l.currency)} each
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <aside className="hidden space-y-4 rounded-[var(--ev-radius)] border border-[var(--ev-border-strong)] bg-[var(--ev-bg-elevated)] p-6 lg:block lg:sticky lg:top-24">
              <h2 className="font-display text-xl text-[var(--ev-text)]">Summary</h2>
              {mixedCurrency && (
                <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200/90">
                  Your cart mixes currencies. Checkout assumes USD for delivery; confirm totals with
                  our team if needed.
                </p>
              )}
              <div className="space-y-2 text-sm text-[var(--ev-text-muted)]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[var(--ev-text)]">{formatMoney(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-[var(--ev-text)]">{formatMoney(delivery, currency)}</span>
                </div>
                <div className="flex justify-between border-t border-[var(--ev-border)] pt-2 text-base font-medium text-[var(--ev-text)]">
                  <span>Total</span>
                  <span>{formatMoney(total, currency)}</span>
                </div>
              </div>
              <Link href="/checkout" className="block">
                <Button className="w-full">Proceed to checkout</Button>
              </Link>
              <Link
                href="/shop"
                className="block text-center text-xs uppercase tracking-[0.2em] text-[var(--ev-text-muted)] hover:text-[var(--ev-text)]"
              >
                Continue shopping
              </Link>
            </aside>
          </div>

          <div
            className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--ev-border-strong)] bg-[var(--ev-bg)]/95 px-4 py-3 backdrop-blur-md lg:hidden"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          >
            {mixedCurrency && (
              <p className="mb-2 text-[10px] text-amber-200/90">Mixed currencies—confirm at checkout.</p>
            )}
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-[var(--ev-text-muted)]">Total</span>
              <span className="font-display text-xl text-[var(--ev-primary)]">
                {formatMoney(total, currency)}
              </span>
            </div>
            <Link href="/checkout" className="block">
              <Button className="w-full">Proceed to checkout</Button>
            </Link>
            <Link
              href="/shop"
              className="mt-2 block py-2 text-center text-xs uppercase tracking-[0.2em] text-[var(--ev-text-muted)]"
            >
              Continue shopping
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
