"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          message: fd.get("message"),
        }),
      });
      setSent(true);
      form.reset();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ev-container grid gap-12 py-12 sm:py-16 lg:grid-cols-2">
      <div>
        <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--ev-primary)]">
          Contact
        </p>
        <h1 className="mt-2 font-display text-4xl text-[var(--ev-text)] sm:text-5xl">
          Human support
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--ev-text-muted)] sm:text-base">
          For availability checks, condition photos, or pairing advice beyond Edo Assistant, reach
          our team directly.
        </p>
        <div className="mt-8 space-y-2 text-sm text-[var(--ev-text-muted)]">
          <p>
            <span className="text-[var(--ev-text)]">Email:</span> concierge@edogawa-vintage.example
          </p>
          <p>
            <a
              href="https://instagram.com/edogawa.iid"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--ev-primary)] underline-offset-4 hover:underline"
            >
              Instagram (placeholder)
            </a>
          </p>
          <p>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--ev-primary)] underline-offset-4 hover:underline"
            >
              WhatsApp (placeholder)
            </a>
          </p>
        </div>
      </div>
      <div className="rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-surface)] p-6 shadow-[var(--ev-shadow-card)]">
        {sent ? (
          <p className="text-sm text-[var(--ev-text-muted)]">
            Thank you—your note is logged. This demo endpoint does not send email yet; wire your
            provider in <code className="text-[var(--ev-primary)]">/api/contact</code>.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <Input name="name" label="Name" required />
            <Input name="email" type="email" label="Email" required />
            <Textarea name="message" label="Message" required />
            <Button type="submit" disabled={loading}>
              {loading ? "Sending…" : "Send message"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
