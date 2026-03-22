import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping & Delivery" };

export default function ShippingPage() {
  return (
    <div className="ev-container max-w-3xl space-y-6 py-12 sm:py-16">
      <h1 className="font-display text-4xl text-[var(--ev-text)]">Shipping & Delivery</h1>
      <section className="space-y-3 text-sm leading-relaxed text-[var(--ev-text-muted)]">
        <p>
          Orders are confirmed personally before dispatch. Typical domestic handling begins 2–4
          business days after confirmation unless otherwise noted.
        </p>
        <p>
          Delivery fees are calculated at checkout (flat demo fee in this build). Replace with live
          carrier quotes when integrating logistics.
        </p>
        <p>International shipping: add customs guidance and restricted item policies here.</p>
      </section>
    </div>
  );
}
