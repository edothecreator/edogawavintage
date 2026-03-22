import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--ev-primary)]">Catalog</p>
        <h1 className="mt-2 font-display text-3xl text-[var(--ev-text)]">New product</h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
