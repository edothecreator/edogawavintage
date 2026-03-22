"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCartStore, useCartStoreHydrated } from "@/lib/cart-store";
import { formatMoney, summarizeCartMoney } from "@/lib/format";
import { trackBeginCheckout } from "@/lib/analytics";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

type Pay = "card" | "cod";

type TariffRow = { city: string; fee: number };

export default function CheckoutPage() {
  const router = useRouter();
  const hydrated = useCartStoreHydrated();
  const lines = useCartStore((s) => s.lines);
  const clear = useCartStore((s) => s.clear);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [pay, setPay] = useState<Pay>("cod");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tariffs, setTariffs] = useState<TariffRow[] | null>(null);
  const [tariffsError, setTariffsError] = useState<string | null>(null);

  const { subtotal, currency, mixedCurrency } = useMemo(
    () => summarizeCartMoney(lines),
    [lines],
  );

  const delivery = useMemo(() => {
    if (!lines.length || !city) return 0;
    const row = tariffs?.find((t) => t.city === city);
    return row?.fee ?? 0;
  }, [lines.length, city, tariffs]);

  const total = subtotal + delivery;

  const loadTariffs = useCallback(async () => {
    try {
      const res = await fetch("/api/shipping-tariffs", { cache: "no-store" });
      const data = (await res.json()) as { tariffs?: TariffRow[] };
      if (!res.ok || !Array.isArray(data.tariffs)) {
        setTariffsError("Could not load shipping cities. Refresh or try again shortly.");
        setTariffs([]);
        return;
      }
      if (data.tariffs.length === 0) {
        setTariffsError("Shipping list is empty—add cities to the Tarif file at the project root.");
        setTariffs([]);
        return;
      }
      setTariffs(data.tariffs);
      setTariffsError(null);
    } catch {
      setTariffsError("Could not load shipping cities.");
      setTariffs([]);
    }
  }, []);

  useEffect(() => {
    void loadTariffs();
  }, [loadTariffs]);

  useEffect(() => {
    if (hydrated && lines.length) trackBeginCheckout(total);
  }, [hydrated, lines.length, total]);

  if (!hydrated) {
    return (
      <div className="ev-container py-16">
        <div className="h-40 animate-pulse rounded-[var(--ev-radius)] bg-[var(--ev-surface)]" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="ev-container py-16 text-center">
        <p className="font-display text-2xl text-[var(--ev-text)]">Your cart is empty</p>
        <Link href="/shop" className="mt-6 inline-block">
          <Button>Back to shop</Button>
        </Link>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !phone.trim() || !city.trim() || !address.trim()) {
      setError("Please complete all required fields, including city.");
      return;
    }
    if (!tariffs?.some((t) => t.city === city)) {
      setError("Choose a valid city from the list.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          note: note.trim() || undefined,
          paymentMethod: pay === "card" ? "card" : "cod",
          items: lines.map((l) => ({
            productId: l.productId,
            quantity: l.quantity,
          })),
        }),
      });
      const data = (await res.json()) as {
        id?: string;
        error?: string;
        deliveryFee?: number;
        total?: number;
      };
      if (!res.ok) {
        setError(data.error || "Could not place order.");
        return;
      }
      const serverDelivery =
        typeof data.deliveryFee === "number" ? data.deliveryFee : delivery;
      const serverTotal = typeof data.total === "number" ? data.total : total;
      const confirmation = {
        id: data.id as string,
        customerName: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        note: note.trim(),
        paymentMethod: pay,
        items: lines.map((l) => ({
          name: l.name,
          slug: l.slug,
          quantity: l.quantity,
          price: l.price,
          currency: l.currency,
        })),
        subtotal,
        deliveryFee: serverDelivery,
        total: serverTotal,
      };
      sessionStorage.setItem("ev_order_confirm", JSON.stringify(confirmation));
      clear();
      router.push("/order/confirmed");
    } catch {
      setError("Network error—please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ev-container grid gap-8 pb-32 pt-8 sm:gap-10 sm:py-14 lg:grid-cols-[1fr_380px] lg:items-start lg:pb-10">
      <div>
        <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--ev-primary)]">
          Checkout
        </p>
        <h1 className="mt-2 font-display text-3xl text-[var(--ev-text)] sm:text-4xl">
          Details & payment
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--ev-text-muted)] sm:text-sm">
          We confirm every order personally. Card payments are structured for future gateway
          integration—today, our team finalizes payment offline after confirmation.
        </p>
        <div className="mt-6 rounded-[var(--ev-radius-sm)] border border-[var(--ev-border)] bg-[var(--ev-surface)] p-4 lg:hidden">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--ev-text-muted)]">
            Order total
          </p>
          <p className="mt-1 font-display text-2xl text-[var(--ev-primary)]">
            {formatMoney(total, currency)}
          </p>
          <div className="mt-2 space-y-1 text-xs text-[var(--ev-text-muted)]">
            <div className="flex justify-between gap-4">
              <span>Subtotal</span>
              <span className="text-[var(--ev-text)]">{formatMoney(subtotal, currency)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Shipping</span>
              <span className="text-[var(--ev-text)]">
                {city ? formatMoney(delivery, currency) : "—"}
              </span>
            </div>
          </div>
          <p className="mt-1 text-xs text-[var(--ev-text-muted)]">{lines.length} line item(s)</p>
        </div>
        <form id="checkout-form" onSubmit={submit} className="mt-8 space-y-6">
          {tariffsError && (
            <p className="rounded-[var(--ev-radius-sm)] border border-amber-500/35 bg-amber-950/20 px-4 py-3 text-sm text-amber-100/90">
              {tariffsError}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" required value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Select
            label="City (shipping zone)"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={!tariffs?.length}
          >
            <option value="">Select your city</option>
            {(tariffs ?? []).map((t) => (
              <option key={t.city} value={t.city}>
                {t.city} — {formatMoney(t.fee, currency)}
              </option>
            ))}
          </Select>
          <Input
            label="Street address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Textarea label="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
          <fieldset className="space-y-2 rounded-[var(--ev-radius-sm)] border border-[var(--ev-border)] bg-[var(--ev-surface)] p-4">
            <legend className="px-1 text-xs uppercase tracking-[0.25em] text-[var(--ev-text-muted)]">
              Payment method
            </legend>
            <label className="ev-touch flex min-h-[52px] cursor-pointer items-center gap-4 rounded-lg px-2 py-2 text-[15px] text-[var(--ev-text)] active:bg-[var(--ev-bg-elevated)] sm:text-sm">
              <input
                type="radio"
                name="pay"
                className="h-5 w-5 shrink-0 accent-[var(--ev-primary)]"
                checked={pay === "card"}
                onChange={() => setPay("card")}
              />
              Card (finalized with our team)
            </label>
            <label className="ev-touch flex min-h-[52px] cursor-pointer items-center gap-4 rounded-lg px-2 py-2 text-[15px] text-[var(--ev-text)] active:bg-[var(--ev-bg-elevated)] sm:text-sm">
              <input
                type="radio"
                name="pay"
                className="h-5 w-5 shrink-0 accent-[var(--ev-primary)]"
                checked={pay === "cod"}
                onChange={() => setPay("cod")}
              />
              Cash on delivery
            </label>
          </fieldset>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="hidden w-full lg:inline-flex lg:w-auto" disabled={loading}>
            {loading ? "Placing order…" : "Place order"}
          </Button>
        </form>
      </div>
      <aside className="hidden space-y-4 rounded-[var(--ev-radius)] border border-[var(--ev-border-strong)] bg-[var(--ev-bg-elevated)] p-6 lg:block lg:sticky lg:top-24">
        <h2 className="font-display text-xl text-[var(--ev-text)]">Order summary</h2>
        {mixedCurrency && (
          <p className="text-xs text-amber-200/85">
            Mixed currencies in cart—totals shown in {currency}; our team will confirm exact
            amounts.
          </p>
        )}
        <ul className="space-y-3 text-sm text-[var(--ev-text-muted)]">
          {lines.map((l) => (
            <li key={l.productId} className="flex justify-between gap-4">
              <span>
                {l.name}{" "}
                <span className="text-[var(--ev-text-muted)]">×{l.quantity}</span>
              </span>
              <span className="text-[var(--ev-text)]">
                {formatMoney(l.price * l.quantity, l.currency)}
              </span>
            </li>
          ))}
        </ul>
        <div className="space-y-2 border-t border-[var(--ev-border)] pt-4 text-sm">
          <div className="flex justify-between text-[var(--ev-text-muted)]">
            <span>Subtotal</span>
            <span className="text-[var(--ev-text)]">{formatMoney(subtotal, currency)}</span>
          </div>
          <div className="flex justify-between text-[var(--ev-text-muted)]">
            <span>Shipping</span>
            <span className="text-[var(--ev-text)]">
              {city ? formatMoney(delivery, currency) : "—"}
            </span>
          </div>
          <div className="flex justify-between text-base font-medium text-[var(--ev-text)]">
            <span>Total</span>
            <span>{formatMoney(total, currency)}</span>
          </div>
        </div>
      </aside>

      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--ev-border-strong)] bg-[var(--ev-bg)]/95 px-4 py-3 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        {mixedCurrency && (
          <p className="mb-2 text-[10px] text-amber-200/90">Mixed currencies—confirm at checkout.</p>
        )}
        <div className="mb-2 space-y-1 text-xs text-[var(--ev-text-muted)]">
          <div className="flex justify-between gap-4">
            <span>Subtotal</span>
            <span className="text-[var(--ev-text)]">{formatMoney(subtotal, currency)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Shipping</span>
            <span className="text-[var(--ev-text)]">
              {city ? formatMoney(delivery, currency) : "—"}
            </span>
          </div>
        </div>
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-[var(--ev-text-muted)]">Total</span>
          <span className="font-display text-xl text-[var(--ev-primary)]">
            {formatMoney(total, currency)}
          </span>
        </div>
        <Button type="submit" form="checkout-form" className="w-full" disabled={loading}>
          {loading ? "Placing order…" : "Place order"}
        </Button>
      </div>
    </div>
  );
}
