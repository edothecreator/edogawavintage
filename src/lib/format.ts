export function formatMoney(amount: number | string | { toString(): string }, currency = "USD") {
  const n = typeof amount === "number" ? amount : Number(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

/** Cart totals: single-currency display; flags mixed currencies for checkout honesty. */
export function summarizeCartMoney(
  lines: { price: number; quantity: number; currency: string }[],
): { subtotal: number; currency: string; mixedCurrency: boolean } {
  const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const currencies = new Set(lines.map((l) => (l.currency || "USD").toUpperCase()));
  const currency = currencies.size === 1 ? [...currencies][0]! : "USD";
  return { subtotal, currency, mixedCurrency: currencies.size > 1 };
}

export function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((x) => typeof x === "string") as string[];
  return [];
}

export function parseJsonRecord(value: unknown): Record<string, string> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = String(v);
    }
    return out;
  }
  return {};
}
