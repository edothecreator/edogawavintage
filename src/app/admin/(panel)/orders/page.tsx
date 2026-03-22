import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/format";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--ev-primary)]">
          Fulfillment
        </p>
        <h1 className="mt-2 font-display text-3xl text-[var(--ev-text)]">Orders</h1>
      </div>
      <div className="overflow-x-auto rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-surface)]">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--ev-border)] text-[10px] uppercase tracking-[0.2em] text-[var(--ev-text-muted)]">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-[var(--ev-border)]/60">
                <td className="px-4 py-3 font-mono text-xs text-[var(--ev-text-muted)]">
                  {o.id.slice(0, 8)}…
                </td>
                <td className="px-4 py-3 text-[var(--ev-text)]">{o.customerName}</td>
                <td className="px-4 py-3 text-[var(--ev-text-muted)]">{o.city}</td>
                <td className="px-4 py-3 text-[var(--ev-text-muted)]">{o.status}</td>
                <td className="px-4 py-3 text-[var(--ev-text-muted)]">{o.paymentMethod}</td>
                <td className="px-4 py-3 text-[var(--ev-primary)]">
                  {formatMoney(Number(o.total))}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="text-xs uppercase tracking-[0.15em] text-[var(--ev-primary)]"
                  >
                    Open
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
