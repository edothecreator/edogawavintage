"use client";

import Image from "next/image";
import Link from "next/link";
import { isProductPurchasable, type ProductCardModel } from "@/lib/product-types";
import { formatMoney } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";
import { notifyCartItemAdded } from "@/lib/cart-feedback-store";
import { trackAddToCart } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function ProductCard({ product }: { product: ProductCardModel }) {
  const add = useCartStore((s) => s.add);
  const canBuy = isProductPurchasable(product);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-surface)] shadow-[var(--ev-shadow-card)] ring-1 ring-transparent transition-all duration-500 active:scale-[0.99] sm:hover:-translate-y-1.5 sm:hover:border-[var(--ev-border-strong)] sm:hover:shadow-[var(--ev-shadow-soft)] sm:hover:ring-[var(--ev-border-strong)]/40">
      <div className="relative aspect-square overflow-hidden bg-[var(--ev-bg-elevated)]">
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.badge && <Badge>{product.badge}</Badge>}
          {!canBuy && <Badge tone="warning">Sold out</Badge>}
          {canBuy && product.quantity <= 2 && (
            <Badge tone="muted">Only {product.quantity} left</Badge>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5 sm:gap-3 sm:p-5">
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--ev-text-muted)]">
            {product.brand}
          </p>
          <Link
            href={`/product/${product.slug}`}
            className="ev-touch font-display text-xl leading-snug text-[var(--ev-text)] transition-colors active:text-[var(--ev-primary)] sm:text-lg sm:hover:text-[var(--ev-primary)]"
          >
            {product.name}
          </Link>
          <p className="line-clamp-2 text-[15px] leading-relaxed text-[var(--ev-text-muted)] sm:text-sm">
            {product.shortDescription}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--ev-text-muted)]">
              {product.condition}
            </p>
            <p className="font-display text-xl text-[var(--ev-primary)]">
              {formatMoney(product.price, product.currency)}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
            <Button
              type="button"
              disabled={!canBuy}
              className="w-full shadow-[0_8px_32px_rgba(212,181,106,0.15)] sm:w-auto sm:shadow-none"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
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
                  quantity: 1,
                });
                trackAddToCart({
                  productId: product.id,
                  slug: product.slug,
                  quantity: 1,
                });
                notifyCartItemAdded(product.name, 1);
              }}
            >
              Add to cart
            </Button>
            <Link
              href={`/product/${product.slug}`}
              className="ev-touch py-2 text-center text-sm text-[var(--ev-text-muted)] underline-offset-4 active:text-[var(--ev-text)] sm:text-right sm:text-xs sm:hover:text-[var(--ev-text)] sm:hover:underline"
            >
              View details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
