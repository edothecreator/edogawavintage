import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/format";
import { ORDER_STATUSES } from "@/lib/constants";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";

type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link
        href="/admin/orders"
        className="text-xs uppercase tracking-[0.2em] text-[var(--ev-text-muted)] hover:text-[var(--ev-text)]"
      >
        ← Orders
      </Link>
      <div>
        <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--ev-primary)]">Order</p>
        <h1 className="mt-2 font-mono text-lg text-[var(--ev-text)]">{order.id}</h1>
      </div>
      <div className="grid gap-6 rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-surface)] p-6 sm:grid-cols-2">
        <div className="text-sm text-[var(--ev-text-muted)]">
          <p className="text-[var(--ev-text)]">{order.customerName}</p>
          <p>
            {order.address}, {order.city}
          </p>
          <p>{order.phone}</p>
          {order.note ? <p className="mt-2 italic">“{order.note}”</p> : null}
        </div>
        <div className="text-sm text-[var(--ev-text-muted)]">
          <p>
            <span className="text-[var(--ev-text)]">Payment:</span> {order.paymentMethod}
          </p>
          <p>
            <span className="text-[var(--ev-text)]">Created:</span>{" "}
            {order.createdAt.toLocaleString()}
          </p>
        </div>
      </div>
      <OrderStatusForm orderId={order.id} current={order.status} options={[...ORDER_STATUSES]} />
      <div className="rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-bg-elevated)] p-6">
        <h2 className="font-display text-xl text-[var(--ev-text)]">Line items</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {order.items.map((i) => (
            <li key={i.id} className="flex flex-wrap items-baseline justify-between gap-4 text-[var(--ev-text-muted)]">
              <span>
                <Link
                  href={`/product/${i.slug}`}
                  className="text-[var(--ev-text)] hover:text-[var(--ev-primary)]"
                  target="_blank"
                  rel="noreferrer"
                >
                  {i.name}
                </Link>{" "}
                <span className="text-[var(--ev-text)]">×{i.quantity}</span>
              </span>
              <span className="text-[var(--ev-text)]">
                {formatMoney(Number(i.price) * i.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-2 border-t border-[var(--ev-border)] pt-4 text-sm">
          <div className="flex justify-between text-[var(--ev-text-muted)]">
            <span>Subtotal</span>
            <span className="text-[var(--ev-text)]">{formatMoney(Number(order.subtotal))}</span>
          </div>
          <div className="flex justify-between text-[var(--ev-text-muted)]">
            <span>Delivery</span>
            <span className="text-[var(--ev-text)]">{formatMoney(Number(order.deliveryFee))}</span>
          </div>
          <div className="flex justify-between text-base font-medium text-[var(--ev-text)]">
            <span>Total</span>
            <span>{formatMoney(Number(order.total))}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
