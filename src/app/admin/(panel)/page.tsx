import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { tryDb } from "@/lib/db-safe";
import { formatMoney } from "@/lib/format";
import { AdminDatabaseOffline } from "@/components/admin/AdminDatabaseOffline";

export default async function AdminHomePage() {
  const snap = await tryDb(() =>
    Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.findMany({
        where: { status: { in: ["pending", "confirmed", "preparing"] } },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { items: true },
      }),
      prisma.product.findMany({
        where: {
          inStock: true,
          quantity: { lte: 2, gt: 0 },
        },
        orderBy: { quantity: "asc" },
        take: 6,
        include: { category: true },
      }),
    ]),
  );

  if (!snap.ok) {
    return (
      <div className="space-y-8">
        <AdminDatabaseOffline />
      </div>
    );
  }

  const [productCount, orderCount, revenue, pendingOrders, lowStock] = snap.data;
  const sum = revenue._sum.total ? Number(revenue._sum.total) : 0;

  return (
    <div className="space-y-12">
      <div>
        <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--ev-primary)]">Admin</p>
        <h1 className="mt-2 font-display text-3xl text-[var(--ev-text)] sm:text-4xl">Dashboard</h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--ev-text-muted)]">
          Live snapshot of catalog and fulfillment. Use the sidebar to manage products and orders in
          full.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-surface)] p-5 shadow-[var(--ev-shadow-card)]">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--ev-text-muted)]">Products</p>
          <p className="mt-2 font-display text-3xl text-[var(--ev-text)]">{productCount}</p>
          <Link
            href="/admin/products"
            className="mt-4 inline-flex text-xs font-medium uppercase tracking-[0.15em] text-[var(--ev-primary)]"
          >
            Manage catalog →
          </Link>
        </div>
        <div className="rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-surface)] p-5 shadow-[var(--ev-shadow-card)]">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--ev-text-muted)]">Orders</p>
          <p className="mt-2 font-display text-3xl text-[var(--ev-text)]">{orderCount}</p>
          <Link
            href="/admin/orders"
            className="mt-4 inline-flex text-xs font-medium uppercase tracking-[0.15em] text-[var(--ev-primary)]"
          >
            Open orders →
          </Link>
        </div>
        <div className="rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-surface)] p-5 shadow-[var(--ev-shadow-card)]">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--ev-text-muted)]">
            Lifetime revenue
          </p>
          <p className="mt-2 font-display text-3xl text-[var(--ev-primary)]">{formatMoney(sum)}</p>
          <p className="mt-4 text-xs text-[var(--ev-text-muted)]">Sum of order totals (all statuses)</p>
        </div>
        <div className="rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-surface)] p-5 shadow-[var(--ev-shadow-card)]">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--ev-text-muted)]">Quick add</p>
          <p className="mt-2 text-sm text-[var(--ev-text-muted)]">New camera listing</p>
          <Link
            href="/admin/products/new"
            className="mt-4 inline-flex w-full min-h-11 items-center justify-center rounded-[var(--ev-radius-sm)] bg-[var(--ev-primary)] px-4 text-xs font-medium uppercase tracking-[0.15em] text-[var(--ev-bg)]"
          >
            New product
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-surface)] p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-display text-xl text-[var(--ev-text)]">Active orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs uppercase tracking-[0.15em] text-[var(--ev-primary)]"
            >
              All
            </Link>
          </div>
          {pendingOrders.length === 0 ? (
            <p className="text-sm text-[var(--ev-text-muted)]">No pending pipeline orders.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {pendingOrders.map((o) => (
                <li
                  key={o.id}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--ev-border)]/60 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-[var(--ev-text)]">{o.customerName}</p>
                    <p className="text-xs text-[var(--ev-text-muted)]">
                      {o.status} · {o.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--ev-primary)]">{formatMoney(Number(o.total))}</span>
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="text-xs uppercase tracking-[0.15em] text-[var(--ev-text-muted)] hover:text-[var(--ev-text)]"
                    >
                      Open
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-surface)] p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-display text-xl text-[var(--ev-text)]">Low stock</h2>
            <Link
              href="/admin/products"
              className="text-xs uppercase tracking-[0.15em] text-[var(--ev-primary)]"
            >
              Catalog
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-[var(--ev-text-muted)]">
              No in-stock SKUs at or below 2 units.
            </p>
          ) : (
            <ul className="space-y-3 text-sm">
              {lowStock.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--ev-border)]/60 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-[var(--ev-text)]">{p.name}</p>
                    <p className="text-xs text-[var(--ev-text-muted)]">
                      {p.category.name} · {p.quantity} left
                    </p>
                  </div>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-xs uppercase tracking-[0.15em] text-[var(--ev-primary)]"
                  >
                    Edit
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
