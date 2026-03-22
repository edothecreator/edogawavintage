import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { databaseUnavailableJsonResponse, isDatabaseUnavailableError } from "@/lib/db-safe";
import { verifyAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
    return NextResponse.json({
      orders: orders.map((o) => ({
        id: o.id,
        customerName: o.customerName,
        phone: o.phone,
        city: o.city,
        status: o.status,
        paymentMethod: o.paymentMethod,
        total: Number(o.total),
        createdAt: o.createdAt,
        itemCount: o.items.reduce((n, i) => n + i.quantity, 0),
      })),
    });
  } catch (e) {
    if (isDatabaseUnavailableError(e)) return databaseUnavailableJsonResponse();
    throw e;
  }
}
