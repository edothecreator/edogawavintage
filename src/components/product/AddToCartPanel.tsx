"use client";

import { useState } from "react";
import { isProductPurchasable, type ProductCardModel } from "@/lib/product-types";
import { useCartStore } from "@/lib/cart-store";
import { notifyCartItemAdded } from "@/lib/cart-feedback-store";
import { trackAddToCart } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";

export function AddToCartPanel({ product }: { product: ProductCardModel }) {
  const add = useCartStore((s) => s.add);
  const [qty, setQty] = useState(1);
  const canBuy = isProductPurchasable(product);
  const maxQ = Math.max(1, product.quantity);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <label className="flex w-full flex-col gap-2 text-sm text-[var(--ev-text-muted)] sm:w-auto">
        <span className="text-xs uppercase tracking-[0.2em]">Quantity</span>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={maxQ}
          value={qty}
          disabled={!canBuy}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!Number.isFinite(n)) return;
            setQty(Math.max(1, Math.min(maxQ, Math.floor(n))));
          }}
          onBlur={() => setQty((q) => Math.max(1, Math.min(maxQ, q)))}
          className="ev-touch min-h-12 w-full rounded-[var(--ev-radius-sm)] border border-[var(--ev-border)] bg-[var(--ev-bg-elevated)] px-4 py-3 text-base text-[var(--ev-text)] outline-none focus:border-[var(--ev-border-strong)] sm:w-28 sm:py-2 sm:text-sm"
        />
      </label>
      <Button
        type="button"
        className="w-full shadow-[0_8px_32px_rgba(212,181,106,0.18)] sm:flex-1 sm:shadow-none"
        disabled={!canBuy}
        onClick={() => {
          if (!canBuy) return;
          add({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            brand: product.brand,
            price: product.price,
            currency: product.currency,
            image: product.thumbnail,
            maxQty: product.quantity,
            inStock: product.inStock,
            quantity: qty,
          });
          trackAddToCart({ productId: product.id, slug: product.slug, quantity: qty });
          notifyCartItemAdded(product.name, qty);
        }}
      >
        Add to cart
      </Button>
    </div>
  );
}
