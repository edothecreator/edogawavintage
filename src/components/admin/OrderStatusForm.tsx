"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export function OrderStatusForm({
  orderId,
  current,
  options,
}: {
  orderId: string;
  current: string;
  options: string[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus(current);
  }, [current]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={save}
      className="flex flex-col gap-4 rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-surface)] p-6 sm:flex-row sm:items-end"
    >
      <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
        {options.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </Select>
      <Button type="submit" disabled={loading || status === current}>
        {loading ? "Saving…" : "Update status"}
      </Button>
    </form>
  );
}
