import type { Prisma } from "@prisma/client";

export type ProductSort = "newest" | "price-asc" | "price-desc" | "featured";

export function productListParams(sp: URLSearchParams) {
  return {
    search: sp.get("search")?.trim() ?? "",
    category: sp.get("category") ?? "",
    brand: sp.get("brand") ?? "",
    minPrice: sp.get("minPrice") ?? "",
    maxPrice: sp.get("maxPrice") ?? "",
    condition: sp.get("condition") ?? "",
    availability: sp.get("availability") ?? "all",
    sort: (sp.get("sort") as ProductSort) || "newest",
  };
}

export function buildProductWhere(sp: URLSearchParams): Prisma.ProductWhereInput {
  const p = productListParams(sp);
  const where: Prisma.ProductWhereInput = {};
  const and: Prisma.ProductWhereInput[] = [];

  if (p.search) {
    where.OR = [
      { name: { contains: p.search } },
      { brand: { contains: p.search } },
      { shortDescription: { contains: p.search } },
    ];
  }

  if (p.category) {
    where.category = { slug: p.category };
  }

  if (p.brand) {
    where.brand = p.brand;
  }

  if (p.condition) {
    where.condition = p.condition;
  }

  const price: Prisma.DecimalFilter = {};
  if (p.minPrice && !Number.isNaN(Number(p.minPrice))) {
    price.gte = Number(p.minPrice);
  }
  if (p.maxPrice && !Number.isNaN(Number(p.maxPrice))) {
    price.lte = Number(p.maxPrice);
  }
  if (Object.keys(price).length) {
    where.price = price;
  }

  if (p.availability === "in_stock") {
    and.push({ inStock: true, quantity: { gt: 0 } });
  } else if (p.availability === "sold_out") {
    and.push({
      OR: [{ inStock: false }, { quantity: { lte: 0 } }],
    });
  }

  if (and.length) {
    where.AND = and;
  }

  return where;
}

export function buildProductOrderBy(sp: URLSearchParams): Prisma.ProductOrderByWithRelationInput[] {
  const sort = (sp.get("sort") as ProductSort) || "newest";
  switch (sort) {
    case "price-asc":
      return [{ price: "asc" }];
    case "price-desc":
      return [{ price: "desc" }];
    case "featured":
      return [{ featured: "desc" }, { createdAt: "desc" }];
    default:
      return [{ createdAt: "desc" }];
  }
}

export function mergeProductWhere(
  ...parts: Prisma.ProductWhereInput[]
): Prisma.ProductWhereInput {
  const cleaned = parts.filter((p) => Object.keys(p).length > 0);
  if (cleaned.length === 0) return {};
  if (cleaned.length === 1) return cleaned[0];
  return { AND: cleaned };
}

export function collectionWhere(slug: string): Prisma.ProductWhereInput | null {
  if (slug === "new-arrivals") {
    const since = new Date();
    since.setDate(since.getDate() - 120);
    return {
      OR: [{ badge: "new" }, { createdAt: { gte: since } }],
    };
  }
  if (slug === "best-sellers") {
    return {
      OR: [{ featured: true }],
    };
  }
  if (slug === "sold-out-archive") {
    return {
      OR: [{ inStock: false }, { quantity: { lte: 0 } }],
    };
  }
  return { category: { slug } };
}
