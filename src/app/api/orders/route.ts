import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isDatabaseUnavailableError, tryDb } from "@/lib/db-safe";
import { getFeeForCity, loadShippingTariffsFromDisk } from "@/lib/shipping-tariff";
import { trackPurchase } from "@/lib/analytics";

const lineSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

const bodySchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(6),
  address: z.string().min(4),
  city: z.string().min(2),
  note: z.string().optional(),
  paymentMethod: z.enum(["card", "cod"]),
  items: z.array(lineSchema).min(1),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid checkout data" }, { status: 400 });
    }
    const { customerName, phone, address, city, note, paymentMethod, items } = parsed.data;

    const tariffs = loadShippingTariffsFromDisk();
    const shippingFee = getFeeForCity(tariffs, city);
    if (shippingFee === null) {
      return NextResponse.json(
        { error: "Choose a valid city from the shipping list." },
        { status: 400 },
      );
    }

    const productIds = [...new Set(items.map((i) => i.productId))];
    const loaded = await tryDb(() =>
      prisma.product.findMany({
        where: { id: { in: productIds } },
      }),
    );
    if (!loaded.ok) {
      return NextResponse.json(
        { error: "Checkout is temporarily unavailable—the catalog database is offline." },
        { status: 503 },
      );
    }
    const products = loaded.data;
    const byId = new Map(products.map((p) => [p.id, p]));

    let subtotal = new Prisma.Decimal(0);
    const orderItems: {
      productId: string;
      name: string;
      slug: string;
      price: Prisma.Decimal;
      quantity: number;
      image: string | null;
    }[] = [];

    for (const line of items) {
      const p = byId.get(line.productId);
      if (!p) {
        return NextResponse.json({ error: "Unknown product in cart" }, { status: 400 });
      }
      if (!p.inStock || p.quantity < line.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${p.name}` },
          { status: 409 },
        );
      }
      const lineTotal = new Prisma.Decimal(p.price).mul(line.quantity);
      subtotal = subtotal.add(lineTotal);
      orderItems.push({
        productId: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        quantity: line.quantity,
        image: p.thumbnail,
      });
    }

    const deliveryFee = new Prisma.Decimal(shippingFee);
    const total = subtotal.add(deliveryFee);

    const order = await prisma.$transaction(async (tx) => {
      for (const line of items) {
        const p = byId.get(line.productId)!;
        const nextQty = p.quantity - line.quantity;
        await tx.product.update({
          where: { id: p.id },
          data: {
            quantity: nextQty,
            inStock: nextQty > 0,
          },
        });
      }

      return tx.order.create({
        data: {
          customerName,
          phone,
          address,
          city,
          note: note ?? null,
          paymentMethod: paymentMethod === "card" ? "card" : "cod",
          subtotal,
          deliveryFee,
          total,
          status: "pending",
          items: {
            create: orderItems.map((i) => ({
              productId: i.productId,
              name: i.name,
              slug: i.slug,
              price: i.price,
              quantity: i.quantity,
              image: i.image,
            })),
          },
        },
        include: { items: true },
      });
    });

    trackPurchase(order.id, Number(order.total));

    return NextResponse.json({
      id: order.id,
      total: Number(order.total),
      deliveryFee: Number(order.deliveryFee),
      paymentMethod: order.paymentMethod,
    });
  } catch (e) {
    if (isDatabaseUnavailableError(e)) {
      return NextResponse.json(
        { error: "Checkout is temporarily unavailable—the catalog database is offline." },
        { status: 503 },
      );
    }
    console.error(e);
    return NextResponse.json({ error: "Could not place order" }, { status: 500 });
  }
}
