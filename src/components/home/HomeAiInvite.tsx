"use client";

import { AI_BRAND } from "@/lib/ai-brand";
import { EV_OPEN_AI_CHAT } from "@/lib/chat-events";
import { Button } from "@/components/ui/Button";

export function HomeAiInvite() {
  function openChat() {
    window.dispatchEvent(new CustomEvent(EV_OPEN_AI_CHAT));
  }

  return (
    <div className="relative overflow-hidden rounded-[var(--ev-radius)] border border-[var(--ev-border-strong)] bg-[radial-gradient(ellipse_90%_80%_at_50%_0%,rgba(212,181,106,0.2),transparent_55%),var(--ev-surface)] p-8 shadow-[var(--ev-shadow-card)] sm:p-12">
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[var(--ev-primary)]/10 blur-3xl motion-safe:animate-[ev-chat-ambient_8s_ease-in-out_infinite] motion-reduce:animate-none"
        aria-hidden
      />
      <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-4">
          <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--ev-primary)]">
            {AI_BRAND.marketingHeadline}
          </p>
          <h3 className="font-display text-3xl text-[var(--ev-text)] sm:text-4xl">
            {AI_BRAND.name}
          </h3>
          <p className="text-sm font-medium text-[var(--ev-primary)]">{AI_BRAND.tagline}</p>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--ev-text-muted)] sm:text-base">
            {AI_BRAND.marketingSubhead}
          </p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <Button type="button" className="w-full sm:w-auto" onClick={openChat}>
              Chat with {AI_BRAND.name}
            </Button>
            <p className="text-xs text-[var(--ev-text-muted)]">
              Also available anytime via the floating button — same calm panel, any language.
            </p>
          </div>
        </div>
        <div className="rounded-[var(--ev-radius-sm)] border border-[var(--ev-border)] bg-[var(--ev-bg)]/85 p-6 backdrop-blur-sm">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--ev-text-muted)]">
            Try asking
          </p>
          <p className="mt-4 font-display text-lg text-[var(--ev-text)]">
            “Quiet chrome compact for night markets—under $900.”
          </p>
          <p className="mt-3 text-sm text-[var(--ev-text-muted)]">
            Short answers, closest in-stock soul-matches, and never a hallucinated SKU.
          </p>
        </div>
      </div>
    </div>
  );
}
