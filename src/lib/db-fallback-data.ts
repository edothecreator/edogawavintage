import { Prisma } from "@prisma/client";
import type { Category, Product, Testimonial } from "@prisma/client";

/** Stable slug for a full product detail page when the real DB is offline (shop/home also list these). */
export const PREVIEW_PRODUCT_SLUG = "preview-leica-q3-monochrome";

const stockPhoto = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=82`;

export const DEMO_DIGITAL_CATEGORY: Category = {
  id: "demo-cat-digital",
  slug: "digitalcameras",
  name: "Digital cameras",
  description: "Preview category—connect a hosted database to load your real catalog.",
};

export const DEMO_FILM_CATEGORY: Category = {
  id: "demo-cat-film",
  slug: "filmcameras",
  name: "Film cameras",
  description: "Preview category—connect a hosted database to load your real catalog.",
};

export const DEMO_CATEGORIES: Category[] = [DEMO_DIGITAL_CATEGORY, DEMO_FILM_CATEGORY];

function demoProduct(
  row: Omit<Product, "price" | "createdAt" | "updatedAt"> & { price: number },
): Product {
  return {
    ...row,
    price: new Prisma.Decimal(row.price),
    createdAt: new Date("2024-06-01T00:00:00.000Z"),
    updatedAt: new Date("2024-06-01T00:00:00.000Z"),
  };
}

const thumbLeica = stockPhoto("photo-1516035069371-29a1b244cc32");
const thumbFuji = stockPhoto("photo-1502920917128-1aa500764cb9");

const DEMO_LEICA = demoProduct({
  id: "demo-prod-leica-q3",
  slug: PREVIEW_PRODUCT_SLUG,
  name: "Leica Q3 Monochrome (preview)",
  brand: "Leica",
  categoryId: DEMO_DIGITAL_CATEGORY.id,
  price: 6295,
  currency: "USD",
  condition: "Excellent",
  shortDescription:
    "Sample listing while the database is offline—your real inventory appears after Postgres is connected.",
  fullDescription:
    "This page is a static preview. On production with SQLite on Vercel, the engine often cannot open the file; migrate to a hosted Postgres URL and run prisma migrate deploy.\n\nWhen live, this area shows your full description, inspection notes, and provenance.",
  specs: {
    Mode: "Preview",
    Sensor: "60MP full-frame B&W (example)",
    Lens: "Summilux 28mm f/1.7 ASPH (fixed)",
  } as Product["specs"],
  includedItems: ["Preview placeholder", "Replace with real box contents after DB connect"] as Product["includedItems"],
  images: [thumbLeica, stockPhoto("photo-1495121605193-baddb60c292d")] as Product["images"],
  thumbnail: thumbLeica,
  inStock: true,
  quantity: 1,
  featured: true,
  tags: ["preview", "demo"] as Product["tags"],
  badge: "Preview",
});

const DEMO_FUJI = demoProduct({
  id: "demo-prod-x100",
  slug: "preview-fujifilm-x100vi",
  name: "Fujifilm X100VI (preview)",
  brand: "Fujifilm",
  categoryId: DEMO_DIGITAL_CATEGORY.id,
  price: 1699,
  currency: "USD",
  condition: "Mint",
  shortDescription: "Second preview item for grids when the catalog database is unreachable.",
  fullDescription: "Static preview only.",
  specs: { Mode: "Preview", Sensor: "40.2MP APS-C (example)" } as Product["specs"],
  includedItems: ["Body", "Lens cap"] as Product["includedItems"],
  images: [thumbFuji] as Product["images"],
  thumbnail: thumbFuji,
  inStock: true,
  quantity: 3,
  featured: true,
  tags: ["preview"] as Product["tags"],
  badge: null,
});

export type ProductWithCardCategory = Product & { category: Pick<Category, "slug" | "name"> };

export function demoProductsWithCardCategory(): ProductWithCardCategory[] {
  return [
    {
      ...DEMO_LEICA,
      category: { slug: DEMO_DIGITAL_CATEGORY.slug, name: DEMO_DIGITAL_CATEGORY.name },
    },
    {
      ...DEMO_FUJI,
      category: { slug: DEMO_DIGITAL_CATEGORY.slug, name: DEMO_DIGITAL_CATEGORY.name },
    },
  ];
}

export function demoFeaturedProducts(): ProductWithCardCategory[] {
  return demoProductsWithCardCategory().filter((p) => p.featured);
}

export function demoFreshProducts(): ProductWithCardCategory[] {
  return demoProductsWithCardCategory();
}

export function demoBrandsForToolbar(): { brand: string }[] {
  return [{ brand: "Fujifilm" }, { brand: "Leica" }];
}

export function demoProductDetailBySlug(
  slug: string,
): (Product & { category: Category }) | null {
  const list = demoProductsWithCardCategory();
  const row = list.find((p) => p.slug === slug);
  if (!row) return null;
  const cat =
    row.categoryId === DEMO_DIGITAL_CATEGORY.id ? DEMO_DIGITAL_CATEGORY : DEMO_FILM_CATEGORY;
  const { category: _c, ...rest } = row;
  return { ...rest, category: cat };
}

export const DEMO_TESTIMONIALS: Testimonial[] = [
  {
    id: "demo-test-1",
    quote:
      "Preview quote—your real testimonials load from the database once a hosted connection is configured.",
    author: "Placeholder collector",
    role: "Preview",
    sortOrder: 0,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    id: "demo-test-2",
    quote: "The site stays online; only inventory data waits on Postgres.",
    author: "Edogawa Vintage",
    role: "System",
    sortOrder: 1,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
  },
];
