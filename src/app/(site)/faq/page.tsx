import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { tryDb } from "@/lib/db-safe";
import { DbFallbackNotice } from "@/components/site/DbFallbackNotice";

export const metadata: Metadata = {
  title: "FAQ",
};

export default async function FaqPage() {
  const faq = await tryDb(() =>
    prisma.faq.findMany({ orderBy: { sortOrder: "asc" } }),
  );
  const items = faq.ok ? faq.data : [];
  const dbDown = !faq.ok;

  return (
    <div className="ev-container max-w-3xl space-y-10 py-12 sm:py-16">
      {dbDown ? <DbFallbackNotice /> : null}
      <div>
        <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--ev-primary)]">FAQ</p>
        <h1 className="mt-2 font-display text-4xl text-[var(--ev-text)] sm:text-5xl">
          Answers, calmly
        </h1>
        <p className="mt-3 text-sm text-[var(--ev-text-muted)] sm:text-base">
          {dbDown
            ? "The database is offline—entries will appear once a hosted connection is available."
            : "Pulled from our database so updates stay centralized."}
        </p>
      </div>
      {items.length === 0 ? (
        <p className="rounded-[var(--ev-radius)] border border-dashed border-[var(--ev-border)] bg-[var(--ev-surface)]/60 px-6 py-12 text-center text-sm text-[var(--ev-text-muted)]">
          No FAQ entries to show right now.
        </p>
      ) : (
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
      )}
    </div>
  );
}
