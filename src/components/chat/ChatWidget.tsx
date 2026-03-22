"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProductCardModel } from "@/lib/product-types";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { trackChatMessage, trackChatOpen } from "@/lib/analytics";
import { ChatMessageText } from "@/components/chat/ChatMessageText";

type Msg = { role: "user" | "assistant"; content: string; products?: ProductCardModel[] };

function ChatRecommendationCard({
  p,
  onNavigate,
}: {
  p: ProductCardModel;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={`/product/${p.slug}`}
      onClick={() => onNavigate?.()}
      className="ev-touch flex min-h-[52px] gap-3 rounded-[var(--ev-radius-sm)] border border-[var(--ev-border)] bg-[var(--ev-bg-elevated)] p-3 transition-colors active:bg-[var(--ev-surface-hover)]"
    >
      <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-black/40">
        <Image src={p.thumbnail} alt={p.name} fill className="object-cover" sizes="56px" />
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <p className="truncate text-[10px] uppercase tracking-[0.2em] text-[var(--ev-text-muted)]">
          {p.brand}
        </p>
        <p className="truncate text-sm font-medium text-[var(--ev-text)]">{p.name}</p>
        <p className="text-sm text-[var(--ev-primary)]">{formatMoney(p.price, p.currency)}</p>
      </div>
    </Link>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Welcome to Edogawa Vintage. Ask in any language about film, digital, lenses—or tell me your budget and style and I will suggest **only** what we have in stock.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);
    trackChatMessage("user");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = (await res.json()) as {
        reply?: string;
        products?: ProductCardModel[];
        error?: string;
      };
      const reply =
        data.reply ||
        data.error ||
        "I could not reach the assistant. Please try again.";
      setMessages((m) => [
        ...m,
        { role: "assistant", content: reply, products: data.products },
      ]);
      trackChatMessage("assistant");
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Connection issue—please check your network and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          trackChatOpen();
        }}
        className="ev-touch fixed z-[80] flex min-h-[52px] items-center gap-2 rounded-full border border-[var(--ev-border-strong)] bg-[var(--ev-surface)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ev-text)] shadow-[var(--ev-shadow-soft)] transition-transform active:scale-95 max-[380px]:right-3 max-[380px]:text-[10px]"
        style={{
          bottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))",
          right: "max(1.25rem, env(safe-area-inset-right, 0px))",
        }}
      >
        Concierge
      </button>
      {open && (
        <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Concierge chat">
          <button
            type="button"
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px] sm:bg-black/50 sm:backdrop-blur-none"
            aria-label="Close chat"
            onClick={close}
          />
          <div className="pointer-events-none absolute inset-0 flex items-end justify-center sm:items-center sm:justify-end sm:p-8">
            <div
              className="pointer-events-auto flex max-h-[min(92dvh,820px)] w-full max-w-md flex-col overflow-hidden rounded-t-[1.35rem] border border-[var(--ev-border-strong)] border-b-0 bg-[var(--ev-bg)] shadow-[var(--ev-shadow-soft)] animate-[ev-fade_0.3s_ease-out_both] sm:max-h-[min(560px,85vh)] sm:rounded-[var(--ev-radius)] sm:border-b"
              style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex items-center justify-between border-b border-[var(--ev-border)] px-4 py-4 sm:py-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--ev-primary)]">
                  Edogawa
                </p>
                <p className="font-display text-xl sm:text-lg">Concierge</p>
              </div>
              <button
                type="button"
                className="ev-touch min-h-12 min-w-12 rounded-lg text-xs uppercase tracking-[0.2em] text-[var(--ev-text-muted)] transition-colors hover:bg-white/5"
                onClick={close}
              >
                Close
              </button>
            </div>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-y-contain px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[min(92%,20rem)] rounded-[var(--ev-radius-sm)] px-3.5 py-3 text-[15px] leading-relaxed sm:max-w-[92%] sm:text-sm ${
                      m.role === "user"
                        ? "bg-[var(--ev-primary)] text-[var(--ev-bg)]"
                        : "border border-[var(--ev-border)] bg-[var(--ev-surface)] text-[var(--ev-text)]"
                    }`}
                  >
                    <ChatMessageText
                      content={m.content}
                      variant={m.role === "user" ? "user" : "assistant"}
                    />
                    {m.products && m.products.length > 0 && (
                      <div className="mt-3 space-y-2 border-t border-[var(--ev-border)] pt-3">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--ev-text-muted)]">
                          In stock now
                        </p>
                        {m.products.map((p) => (
                          <ChatRecommendationCard key={p.id} p={p} onNavigate={close} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <p className="text-sm text-[var(--ev-text-muted)] sm:text-xs">
                  Composing a careful reply…
                </p>
              )}
              <div ref={endRef} />
            </div>
            <div className="border-t border-[var(--ev-border)] p-3 sm:p-3">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
                  placeholder="Ask anything…"
                  className="ev-touch min-h-[52px] flex-1 rounded-[var(--ev-radius-sm)] border border-[var(--ev-border)] bg-[var(--ev-bg-elevated)] px-3 text-base text-[var(--ev-text)] outline-none focus:border-[var(--ev-border-strong)] sm:min-h-11 sm:text-sm"
                />
                <Button type="button" className="shrink-0 px-5" onClick={send} disabled={loading}>
                  Send
                </Button>
              </div>
              <p className="mt-2 text-[10px] leading-snug text-[var(--ev-text-muted)]">
                Recommendations use live inventory only. I cannot track orders—contact support for
                that.
              </p>
            </div>
          </div>
          </div>
        </div>
      )}
    </>
  );
}
