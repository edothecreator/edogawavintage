import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "FAQ",
};

export default async function FaqPage() {
  const items = await prisma.faq.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className="ev-container max-w-3xl space-y-10 py-12 sm:py-16">
      <div>
        <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--ev-primary)]">FAQ</p>
        <h1 className="mt-2 font-display text-4xl text-[var(--ev-text)] sm:text-5xl">
          Answers, calmly
        </h1>
        <p className="mt-3 text-sm text-[var(--ev-text-muted)] sm:text-base">
          Pulled from our database so updates stay centralized.
        </p>
      </div>
      <dl className="space-y-6">
        {items.map((f) => (
          <div
            key={f.id}
            className="rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-surface)] p-5 shadow-[var(--ev-shadow-card)]"
          >
            <dt className="font-display text-lg text-[var(--ev-text)]">{f.question}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-[var(--ev-text-muted)]">{f.answer}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
