import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="ev-container max-w-3xl space-y-6 py-12 sm:py-16">
      <h1 className="font-display text-4xl text-[var(--ev-text)]">Privacy Policy</h1>
      <p className="text-sm text-[var(--ev-text-muted)]">Last updated: March 2026 (placeholder)</p>
      <section className="space-y-3 text-sm leading-relaxed text-[var(--ev-text-muted)]">
        <h2 className="font-display text-xl text-[var(--ev-text)]">Data we collect</h2>
        <p>
          Checkout collects name, phone, address, and order details required to fulfill purchases.
          Analytics hooks are stubbed for future integration.
        </p>
        <h2 className="font-display text-xl text-[var(--ev-text)]">How we use data</h2>
        <p>
          Order data is used for fulfillment and customer contact. Monsieur Iso (our shop assistant)
          sends prompts to
          Google Gemini—do not include payment card numbers or government IDs in chat.
        </p>
        <h2 className="font-display text-xl text-[var(--ev-text)]">Retention</h2>
        <p>Replace this section with your jurisdictional requirements and retention schedule.</p>
      </section>
    </div>
  );
}
