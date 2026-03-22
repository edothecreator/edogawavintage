import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/admin-auth";
import { toProductCard } from "@/lib/product-types";

const productBody = z.object({
  slug: z.string().min(2),
  name: z.string().min(1),
  brand: z.string().min(1),
  categoryId: z.string(),
  price: z.number().nonnegative(),
  currency: z.string().default("USD"),
  condition: z.string().min(1),
  shortDescription: z.string().min(1),
  fullDescription: z.string().min(1),
  specs: z.record(z.string(), z.string()),
  includedItems: z.array(z.string()),
  images: z.array(z.string()).min(1),
  thumbnail: z.string().min(1),
  inStock: z.boolean(),
  quantity: z.number().int().min(0),
  featured: z.boolean(),
  tags: z.array(z.string()),
  badge: z.string().nullable().optional(),
});

export async function GET() {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: { select: { slug: true, name: true } } },
  });
  return NextResponse.json({ products: products.map(toProductCard) });
}

export async function POST(req: Request) {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const json = await req.json();
    const parsed = productBody.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
    }
    const d = parsed.data;
    const inStock = d.quantity <= 0 ? false : d.inStock;
    const created = await prisma.product.create({
      data: {
        slug: d.slug,
        name: d.name,
        brand: d.brand,
        categoryId: d.categoryId,
        price: new Prisma.Decimal(d.price),
        currency: d.currency,
        condition: d.condition,
        shortDescription: d.shortDescription,
        fullDescription: d.fullDescription,
        specs: d.specs as Prisma.InputJsonValue,
        includedItems: d.includedItems as Prisma.InputJsonValue,
        images: d.images as Prisma.InputJsonValue,
        thumbnail: d.thumbnail,
        inStock,
        quantity: d.quantity,
        featured: d.featured,
        tags: d.tags as Prisma.InputJsonValue,
        badge: d.badge ?? null,
      },
      include: { category: { select: { slug: true, name: true } } },
    });
    return NextResponse.json({ product: toProductCard(created) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not create product" }, { status: 500 });
  }
}
