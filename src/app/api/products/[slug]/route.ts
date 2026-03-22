import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toProductCard, productImages, productIncluded, productSpecs } from "@/lib/product-types";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await ctx.params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({
      product: {
        ...toProductCard(product),
        fullDescription: product.fullDescription,
        images: productImages(product),
        specs: productSpecs(product),
        included: productIncluded(product),
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load product" }, { status: 500 });
  }
}
