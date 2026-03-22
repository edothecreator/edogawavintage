import type { Metadata } from "next";

export const metadata: Metadata = { title: "Returns & Refunds" };

export default function ReturnsPage() {
  return (
    <div className="ev-container max-w-3xl space-y-6 py-12 sm:py-16">
      <h1 className="font-display text-4xl text-[var(--ev-text)]">Returns & Refunds</h1>
      <section className="space-y-3 text-sm leading-relaxed text-[var(--ev-text-muted)]">
        <p>
          Vintage optics and bodies may be non-returnable except where required by law. Document
          your policy for defective-on-arrival, mis-described items, and cooling-off periods.
        </p>
        <p>
          This demo store provides structure only—replace with enforceable terms for your region.
        </p>
      </section>
    </div>
  );
}
