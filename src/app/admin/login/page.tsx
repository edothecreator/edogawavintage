"use client";

import { useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Invalid password");
        return;
      }
      window.location.href = "/admin";
    } catch {
      setError("Could not sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8 rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-surface)] p-8 shadow-[var(--ev-shadow-soft)]">
        <BrandLogo className="justify-center" />
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            type="password"
            label="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Enter dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
}
