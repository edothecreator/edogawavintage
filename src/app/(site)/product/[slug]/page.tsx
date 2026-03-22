import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  isProductPurchasable,
  productImages,
  productIncluded,
  productSpecs,
  toProductCard,
} from "@/lib/product-types";
import { formatMoney } from "@/lib/format";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductViewTracker } from "@/components/product/ProductViewTracker";
import { ProductCard } from "@/components/product/ProductCard";
import { Badge } from "@/components/ui/Badge";
import { AddToCartPanel } from "@/components/product/AddToCartPanel";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    orderBy: { featured: "desc" },
    take: 3,
    include: { category: { select: { slug: true, name: true } } },
  });

  const images = productImages(product);
  const specs = productSpecs(product);
  const included = productIncluded(product);
  const card = toProductCard(product);
  const canBuy = isProductPurchasable(card);

  return (
    <div className="ev-container space-y-10 py-8 sm:space-y-12 sm:py-14">
      <ProductViewTracker productId={product.id} slug={product.slug} />
      <nav className="text-xs uppercase tracking-[0.2em] text-[var(--ev-text-muted)]">
        <Link href="/shop" className="hover:text-[var(--ev-text)]">
          Shop
        </Link>
        <span className="mx-2 text-[var(--ev-border)]">/</span>
        <Link
          href={`/collections/${product.category.slug}`}
          className="hover:text-[var(--ev-text)]"
        >
          {product.category.name}
        </Link>
        <span className="mx-2 text-[var(--ev-border)]">/</span>
        <span className="text-[var(--ev-text)]">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <ProductGallery images={images} alt={product.name} />
        <div className="space-y-6 lg:sticky lg:top-24">
          <div className="flex flex-wrap gap-2">
            {product.badge && <Badge>{product.badge}</Badge>}
            <Badge tone={canBuy ? "success" : "warning"}>
              {canBuy ? "In stock" : "Sold out"}
            </Badge>
            <Badge tone="muted">{product.condition}</Badge>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--ev-text-muted)]">
              {product.brand}
            </p>
            <h1 className="mt-2 font-display text-4xl text-[var(--ev-text)] sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-lg text-[var(--ev-primary)]">
              {formatMoney(Number(product.price), product.currency)}
            </p>
          </div>
          <p className="text-sm leading-relaxed text-[var(--ev-text-muted)]">
            {product.shortDescription}
          </p>
          <div id="add-to-cart" className="scroll-mt-28">
            <AddToCartPanel product={card} />
          </div>
          <div className="rounded-[var(--ev-radius-sm)] border border-[var(--ev-border)] bg-[var(--ev-surface)]/80 p-4 text-xs text-[var(--ev-text-muted)]">
            <p>
              <span className="text-[var(--ev-text)]">Delivery:</span> Calculated at checkout.
              Domestic dispatch typically 2–4 business days after human confirmation.
            </p>
            <p className="mt-2">
              <span className="text-[var(--ev-text)]">Returns:</span> See our{" "}
              <Link href="/returns" className="text-[var(--ev-primary)] underline-offset-4 hover:underline">
                return & refund policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <section className="grid gap-10 border-t border-[var(--ev-border)] pt-12 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-[var(--ev-text)]">Description</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--ev-text-muted)]">
            {product.fullDescription}
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-[var(--ev-text)]">Specifications</h2>
          <dl className="grid gap-3 text-sm">
            {Object.entries(specs).map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between gap-4 border-b border-[var(--ev-border)] pb-2"
              >
                <dt className="text-[var(--ev-text-muted)]">{k}</dt>
                <dd className="text-right text-[var(--ev-text)]">{v}</dd>
              </div>
            ))}
          </dl>
          <div>
            <h3 className="text-sm font-medium text-[var(--ev-text)]">Included</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--ev-text-muted)]">
              {included.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="space-y-6 border-t border-[var(--ev-border)] pt-12">
          <h2 className="font-display text-3xl text-[var(--ev-text)]">Related pieces</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={toProductCard(p)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
