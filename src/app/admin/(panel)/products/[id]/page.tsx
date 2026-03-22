import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { tryDb } from "@/lib/db-safe";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminDatabaseOffline } from "@/components/admin/AdminDatabaseOffline";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const loaded = await tryDb(() =>
    Promise.all([
      prisma.product.findUnique({ where: { id } }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]),
  );
  if (!loaded.ok) {
    return (
      <div className="space-y-8">
        <AdminDatabaseOffline />
      </div>
    );
  }
  const [product, categories] = loaded.data;
  if (!product) notFound();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--ev-primary)]">Catalog</p>
        <h1 className="mt-2 font-display text-3xl text-[var(--ev-text)]">Edit product</h1>
      </div>
      <ProductForm categories={categories} initial={product} />
    </div>
  );
}
