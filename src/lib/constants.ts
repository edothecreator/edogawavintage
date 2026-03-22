export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const CONDITIONS = ["Mint", "Excellent", "Good", "Fair"] as const;

export const COLLECTION_SLUGS = [
  "new-arrivals",
  "best-sellers",
  "sold-out-archive",
] as const;
