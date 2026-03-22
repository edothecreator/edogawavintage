import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  DEMO_CATEGORIES,
  demoBrandsForToolbar,
} from "@/lib/db-fallback-data";
import { tryDb } from "@/lib/db-safe";
import { COLLECTION_SLUGS } from "@/lib/constants";
import {
  buildProductOrderBy,
  buildProductWhere,
  collectionWhere,
  mergeProductWhere,
} from "@/lib/product-query";
import { toProductCard } from "@/lib/product-types";
import { ShopToolbar } from "@/components/shop/ShopToolbar";
import { ProductCard } from "@/components/product/ProductCard";
import { DbFallbackNotice } from "@/components/site/DbFallbackNotice";

type Props = {
  params: Promise<{ slug: string }>;
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

const titles: Record<string, string> = {
  "new-arrivals": "New arrivals",
  "best-sellers": "Best sellers",
  "sold-out-archive": "Sold-out archive",
};

export default async function CollectionPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const isSpecial = (COLLECTION_SLUGS as readonly string[]).includes(slug);

  const catResult = await tryDb(() => prisma.category.findUnique({ where: { slug } }));
  if (!catResult.ok) {
    const cw = collectionWhere(slug);
    if (!cw) notFound();
    return (
      <div className="ev-container space-y-8 py-8 sm:space-y-10 sm:py-14">
        <DbFallbackNotice />
        <div className="max-w-2xl space-y-3">
          <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--ev-primary)]">
            {isSpecial ? "Curated set" : "Collection"}
          </p>
          <h1 className="font-display text-4xl text-[var(--ev-text)] sm:text-5xl">
            {titles[slug] ?? "Collection"}
          </h1>
          <p className="text-sm leading-relaxed text-[var(--ev-text-muted)] sm:text-base">
            We could not load this collection while the database is offline. Try the shop preview or
            connect Postgres and redeploy.
          </p>
        </div>
        <Suspense
          fallback={
            <div className="h-44 animate-pulse rounded-[var(--ev-radius)] bg-[var(--ev-surface)]" />
          }
        >
          <ShopToolbar brands={demoBrandsForToolbar()} categories={DEMO_CATEGORIES} />
        </Suspense>
        <div className="rounded-[var(--ev-radius)] border border-dashed border-[var(--ev-border)] bg-[var(--ev-surface)]/60 px-6 py-16 text-center">
          <p className="font-display text-2xl text-[var(--ev-text)]">Collection unavailable</p>
          <p className="mt-2 text-sm text-[var(--ev-text-muted)]">
            No live data—browse the shop for preview listings instead.
          </p>
        </div>
      </div>
    );
  }

  const category = catResult.data;
  if (!category && !isSpecial) notFound();

  const cw = collectionWhere(slug);
  if (!cw) notFound();

  const raw = await searchParams;
  const url = toURLSearchParams(raw);
  const where = mergeProductWhere(cw, buildProductWhere(url));
  const orderBy = buildProductOrderBy(url);

  const listResult = await tryDb(() =>
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

  const dbDown = !listResult.ok;
  const [products, brands, categories] = listResult.ok
    ? listResult.data
    : [[], demoBrandsForToolbar(), DEMO_CATEGORIES];

  const heading = titles[slug] ?? category?.name ?? "Collection";
  const eyebrow = isSpecial ? "Curated set" : category?.name ?? "Collection";

  return (
    <div className="ev-container space-y-8 py-8 sm:space-y-10 sm:py-14">
      {dbDown ? <DbFallbackNotice /> : null}
      <div className="max-w-2xl space-y-3">
        <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--ev-primary)]">
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl text-[var(--ev-text)] sm:text-5xl">{heading}</h1>
        <p className="text-sm leading-relaxed text-[var(--ev-text-muted)] sm:text-base">
          {category?.description ??
            "Pieces selected for rhythm, rarity, and the way they feel in the hand."}
        </p>
      </div>
      <Suspense
        fallback={
          <div className="h-44 animate-pulse rounded-[var(--ev-radius)] bg-[var(--ev-surface)]" />
        }
      >
        <ShopToolbar brands={brands} categories={categories} />
      </Suspense>
      {products.length === 0 ? (
        <div className="rounded-[var(--ev-radius)] border border-dashed border-[var(--ev-border)] bg-[var(--ev-surface)]/60 px-6 py-16 text-center">
          <p className="font-display text-2xl text-[var(--ev-text)]">Nothing here yet</p>
          <p className="mt-2 text-sm text-[var(--ev-text-muted)]">
            Adjust filters or return to the full shop.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={toProductCard(p)} />
          ))}
        </div>
      )}
    </div>
  );
}
