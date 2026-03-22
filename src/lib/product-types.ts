import type { Category, Product } from "@prisma/client";
import { parseJsonArray, parseJsonRecord } from "./format";

export type ProductCardModel = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  condition: string;
  shortDescription: string;
  thumbnail: string;
  /** Database flag — item is offered as available (admin may still set qty 0). */
  inStock: boolean;
  quantity: number;
  featured: boolean;
  badge: string | null;
  tags: string[];
  categorySlug: string;
  categoryName: string;
};

/** True when the item can be sold right now (API and cart use the same rule). */
export function isProductPurchasable(p: Pick<ProductCardModel, "inStock" | "quantity">) {
  return Boolean(p.inStock && p.quantity > 0);
}

export function toProductCard(
  p: Product & { category: Pick<Category, "slug" | "name"> },
): ProductCardModel {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    price: Number(p.price),
    currency: p.currency,
    condition: p.condition,
    shortDescription: p.shortDescription,
    thumbnail: p.thumbnail,
    inStock: Boolean(p.inStock),
    quantity: p.quantity,
    featured: p.featured,
    badge: p.badge,
    tags: parseJsonArray(p.tags),
    categorySlug: p.category.slug,
    categoryName: p.category.name,
  };
}

export function productImages(p: Product): string[] {
  const fromJson = parseJsonArray(p.images);
  if (fromJson.length) return fromJson;
  return p.thumbnail ? [p.thumbnail] : [];
}

export function productSpecs(p: Product): Record<string, string> {
  return parseJsonRecord(p.specs);
}

export function productIncluded(p: Product): string[] {
  return parseJsonArray(p.includedItems);
}
