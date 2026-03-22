"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/Button";

type Confirm = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
  paymentMethod: "card" | "cod";
  items: {
    name: string;
    slug: string;
    quantity: number;
    price: number;
    currency: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
};

export default function OrderConfirmedPage() {
  const [data, setData] = useState<Confirm | null | undefined>(undefined);

  useEffect(() => {
    const raw = sessionStorage.getItem("ev_order_confirm");
    if (!raw) {
      setData(null);
      return;
    }
    try {
      setData(JSON.parse(raw) as Confirm);
      sessionStorage.removeItem("ev_order_confirm");
    } catch {
      setData(null);
    }
  }, []);

  if (data === undefined) {
    return (
      <div className="ev-container py-20">
        <div className="mx-auto h-32 max-w-md animate-pulse rounded-[var(--ev-radius)] bg-[var(--ev-surface)]" />
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="ev-container py-20 text-center">
        <p className="font-display text-2xl text-[var(--ev-text)]">No order to display</p>
        <p className="mt-2 text-sm text-[var(--ev-text-muted)]">
          If you just completed checkout, open this page from the confirmation step again—or contact
          support with your details.
        </p>
        <Link href="/shop" className="mt-8 inline-block">
          <Button>Return to shop</Button>
        </Link>
      </div>
    );
  }

  const payLabel = data.paymentMethod === "card" ? "Card" : "Cash on delivery";

  return (
    <div className="ev-container max-w-3xl space-y-10 py-12 sm:py-16">
      <div className="space-y-3 text-center">
        <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--ev-primary)]">
          Thank you
        </p>
        <h1 className="font-display text-4xl text-[var(--ev-text)] sm:text-5xl">
          Order received
        </h1>
        <p className="text-sm leading-relaxed text-[var(--ev-text-muted)] sm:text-base">
          Our team will contact you very soon at{" "}
          <span className="text-[var(--ev-text)]">{data.phone}</span> to confirm your order, timing,
          and payment details.
        </p>
      </div>

      <div className="rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-surface)] p-6 shadow-[var(--ev-shadow-card)]">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--ev-text-muted)]">
          Order reference
        </p>
        <p className="mt-1 font-mono text-lg text-[var(--ev-primary)]">{data.id}</p>
        <div className="mt-6 grid gap-4 text-sm text-[var(--ev-text-muted)] sm:grid-cols-2">
          <div>
            <p className="text-[var(--ev-text)]">{data.customerName}</p>
            <p>
              {data.address}, {data.city}
            </p>
            <p>{data.phone}</p>
            {data.note ? <p className="mt-2 italic">“{data.note}”</p> : null}
          </div>
          <div>
            <p>
              <span className="text-[var(--ev-text)]">Payment:</span> {payLabel}
            </p>
            <p className="mt-2 text-xs">
              Card payments are prepared for future gateway integration; our staff will finalize
              securely offline.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-bg-elevated)] p-6">
        <h2 className="font-display text-xl text-[var(--ev-text)]">Items</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {data.items.map((i) => (
            <li key={i.slug + i.quantity} className="flex justify-between gap-4">
              <span className="text-[var(--ev-text-muted)]">
                {i.name}{" "}
                <span className="text-[var(--ev-text)]">×{i.quantity}</span>
              </span>
              <span className="text-[var(--ev-text)]">
                {formatMoney(i.price * i.quantity, i.currency)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-2 border-t border-[var(--ev-border)] pt-4 text-sm">
          <div className="flex justify-between text-[var(--ev-text-muted)]">
            <span>Subtotal</span>
            <span className="text-[var(--ev-text)]">{formatMoney(data.subtotal)}</span>
          </div>
          <div className="flex justify-between text-[var(--ev-text-muted)]">
            <span>Delivery</span>
            <span className="text-[var(--ev-text)]">{formatMoney(data.deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-base font-medium text-[var(--ev-text)]">
            <span>Total</span>
            <span>{formatMoney(data.total)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/shop">
          <Button variant="secondary" className="w-full sm:w-auto">
            Continue exploring
          </Button>
        </Link>
        <Link href="/contact">
          <Button variant="ghost" className="w-full sm:w-auto">
            Contact support
          </Button>
        </Link>
      </div>
    </div>
  );
}
