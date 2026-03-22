"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  quantity: number;
  image: string;
  maxQty: number;
  inStock: boolean;
};

type CartState = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, quantity: number) => void;
  clear: () => void;
};

function clampQty(q: number, max: number, inStock: boolean) {
  if (!inStock || max <= 0) return 0;
  const n = Number.isFinite(q) ? Math.floor(q) : 1;
  if (n < 1) return 1;
  return Math.min(max, n);
}

function linePurchasable(line: Pick<CartLine, "inStock" | "maxQty">) {
  return Boolean(line.inStock && line.maxQty > 0);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (line) => {
        const max = Math.max(0, Math.floor(line.maxQty));
        const inStock = Boolean(line.inStock) && max > 0;
        if (!inStock) return;

        const requested = line.quantity ?? 1;
        const qty = clampQty(requested, max, true);
        if (qty < 1) return;

        const existing = get().lines.find((l) => l.productId === line.productId);
        const entry: CartLine = {
          productId: line.productId,
          slug: line.slug,
          name: line.name,
          brand: line.brand,
          price: Number(line.price),
          currency: line.currency || "USD",
          image: line.image,
          maxQty: max,
          inStock: true,
          quantity: existing
            ? clampQty(existing.quantity + qty, max, true)
            : qty,
        };

        set({
          lines: existing
            ? get().lines.map((l) => (l.productId === line.productId ? entry : l))
            : [...get().lines, entry],
        });
      },
      remove: (productId) =>
        set({ lines: get().lines.filter((l) => l.productId !== productId) }),
      setQty: (productId, quantity) => {
        set({
          lines: get().lines.map((l) => {
            if (l.productId !== productId) return l;
            const q = clampQty(quantity, l.maxQty, linePurchasable(l));
            return { ...l, quantity: q };
          }),
        });
      },
      clear: () => set({ lines: [] }),
    }),
    {
      name: "edogawa-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lines: s.lines }),
    },
  ),
);

export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
}

/** After localStorage rehydration — avoids SSR/client cart count mismatch. */
export function useCartStoreHydrated() {
  const [hydrated, setHydrated] = useState(() =>
    typeof window === "undefined" ? false : useCartStore.persist.hasHydrated(),
  );
  useEffect(() => {
    setHydrated(useCartStore.persist.hasHydrated());
    return useCartStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);
  return hydrated;
}
