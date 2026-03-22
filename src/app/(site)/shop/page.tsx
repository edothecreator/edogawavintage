import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import {
  DEMO_CATEGORIES,
  demoBrandsForToolbar,
  demoProductsWithCardCategory,
} from "@/lib/db-fallback-data";
import { tryDb } from "@/lib/db-safe";
import { buildProductOrderBy, buildProductWhere } from "@/lib/product-query";
import { toProductCard } from "@/lib/product-types";
import { ShopToolbar } from "@/components/shop/ShopToolbar";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { DbFallbackNotice } from "@/components/site/DbFallbackNotice";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function toURLSearchParams(sp: Record<string, string | string[] | undefined>) {
  const url = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") url.set(k, v);
    else if (Array.isArray(v) && v[0]) url.set(k, v[0]);
  }
  return url;
}

export default async function ShopPage({ searchParams }: Props) {
  const raw = await searchParams;
  const url = toURLSearchParams(raw);
  const where = buildProductWhere(url);
  const orderBy = buildProductOrderBy(url);
  const shop = await tryDb(() =>
    Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        include: { category: { select: { slug: true, name: true } } },
      }),
      prisma.product.findMany({
        distinct: ["brand"],
        select: { brand: true },
        orderBy: { brand: "asc" },
      }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]),
  );

  const dbDown = !shop.ok;
  const [products, brands, categories] = shop.ok
    ? shop.data
    : [demoProductsWithCardCategory(), demoBrandsForToolbar(), DEMO_CATEGORIES];

  const cards = products.map(toProductCard);

  return (
    <div className="ev-container space-y-8 py-8 sm:space-y-10 sm:py-14">
      {dbDown ? <DbFallbackNotice /> : null}
      <SectionTitle
        eyebrow="Boutique inventory"
        title="Shop the atelier"
        subtitle="Search, filter, and sort our live catalog—every piece is described with the honesty it deserves."
      />
      <Suspense
        fallback={
          <div className="h-44 animate-pulse rounded-[var(--ev-radius)] bg-[var(--ev-surface)]" />
        }
      >
        <ShopToolbar brands={brands} categories={categories} />
      </Suspense>
      {cards.length === 0 ? (
        <div className="rounded-[var(--ev-radius)] border border-dashed border-[var(--ev-border)] bg-[var(--ev-surface)]/60 px-6 py-16 text-center">
          <p className="font-display text-2xl text-[var(--ev-text)]">No pieces match</p>
          <p className="mt-2 text-sm text-[var(--ev-text-muted)]">
            Try widening filters or explore new arrivals.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
