import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isDatabaseUnavailableError } from "@/lib/db-safe";
import { buildProductOrderBy, buildProductWhere } from "@/lib/product-query";
import { toProductCard } from "@/lib/product-types";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const where = buildProductWhere(sp);
    const orderBy = buildProductOrderBy(sp);
    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: { category: { select: { slug: true, name: true } } },
    });
    return NextResponse.json({ products: products.map(toProductCard) });
  } catch (e) {
    if (isDatabaseUnavailableError(e)) {
      return NextResponse.json({ products: [], dbUnavailable: true });
    }
    console.error(e);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}
