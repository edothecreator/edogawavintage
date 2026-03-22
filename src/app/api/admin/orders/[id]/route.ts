import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { databaseUnavailableJsonResponse, isDatabaseUnavailableError } from "@/lib/db-safe";
import { verifyAdminSession } from "@/lib/admin-auth";
const patchSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "preparing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
});

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await ctx.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      order: {
        ...order,
        subtotal: Number(order.subtotal),
        deliveryFee: Number(order.deliveryFee),
        total: Number(order.total),
        items: order.items.map((i) => ({
          ...i,
          price: Number(i.price),
        })),
      },
    });
  } catch (e) {
    if (isDatabaseUnavailableError(e)) return databaseUnavailableJsonResponse();
    throw e;
  }
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await ctx.params;
    const json = await req.json();
    const parsed = patchSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const updated = await prisma.order.update({
      where: { id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json({ order: updated });
  } catch (e) {
    if (isDatabaseUnavailableError(e)) return databaseUnavailableJsonResponse();
    throw e;
  }
}
