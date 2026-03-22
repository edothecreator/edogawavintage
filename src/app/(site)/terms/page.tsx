import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <div className="ev-container max-w-3xl space-y-6 py-12 sm:py-16">
      <h1 className="font-display text-4xl text-[var(--ev-text)]">Terms & Conditions</h1>
      <p className="text-sm text-[var(--ev-text-muted)]">Placeholder — consult legal counsel.</p>
      <section className="space-y-3 text-sm leading-relaxed text-[var(--ev-text-muted)]">
        <p>
          By using Edogawa Vintage you agree to accurate checkout information, acceptance of
          described condition grades, and compliance with local import regulations for camera gear.
        </p>
        <p>
          Vintage items may carry cosmetic wear; operational notes on product pages form part of
          the agreement of sale.
        </p>
      </section>
    </div>
  );
}
