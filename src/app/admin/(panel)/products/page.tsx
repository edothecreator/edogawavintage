import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { tryDb } from "@/lib/db-safe";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { AdminDatabaseOffline } from "@/components/admin/AdminDatabaseOffline";

export default async function AdminProductsPage() {
  const loaded = await tryDb(() =>
    prisma.product.findMany({
      orderBy: { updatedAt: "desc" },
      include: { category: true },
    }),
  );

  if (!loaded.ok) {
    return (
      <div className="space-y-8">
        <AdminDatabaseOffline />
      </div>
    );
  }

  const products = loaded.data;

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--ev-primary)]">
            Catalog
          </p>
          <h1 className="mt-2 font-display text-3xl text-[var(--ev-text)]">Products</h1>
          <p className="mt-2 max-w-lg text-sm text-[var(--ev-text-muted)]">
            Edit listings, stock, and media. Upload images from the product form—they are stored under{" "}
            <code className="text-[var(--ev-text)]">/public/uploads</code>.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button>New product</Button>
        </Link>
      </div>
      <div className="overflow-x-auto rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-surface)] shadow-[var(--ev-shadow-card)]">
        <table className="min-w-[720px] w-full text-left text-sm">
          <thead className="border-b border-[var(--ev-border)] text-[10px] uppercase tracking-[0.2em] text-[var(--ev-text-muted)]">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-[var(--ev-border)]/60">
                <td className="px-4 py-3">
                  <div className="relative h-14 w-14 overflow-hidden rounded-md border border-[var(--ev-border)] bg-black/30">
                    <Image
                      src={p.thumbnail}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                </td>
                <td className="max-w-[200px] px-4 py-3">
                  <p className="truncate font-medium text-[var(--ev-text)]">{p.name}</p>
                  <p className="truncate text-xs text-[var(--ev-text-muted)]">{p.slug}</p>
                </td>
                <td className="px-4 py-3 text-[var(--ev-text-muted)]">{p.brand}</td>
                <td className="px-4 py-3 text-[var(--ev-text-muted)]">{p.category.name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-[var(--ev-primary)]">
                  {formatMoney(Number(p.price), p.currency)}
                </td>
                <td className="px-4 py-3 text-[var(--ev-text-muted)]">
                  {p.inStock && p.quantity > 0 ? (
                    <span className="text-[var(--ev-text)]">{p.quantity} in stock</span>
                  ) : (
                    <span className="text-amber-200/80">Sold out</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-[var(--ev-text-muted)]">
                  {p.featured ? <span className="mr-2 text-[var(--ev-primary)]">Featured</span> : null}
                  {p.badge ? <span>{p.badge}</span> : null}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-xs uppercase tracking-[0.15em] text-[var(--ev-primary)]"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
