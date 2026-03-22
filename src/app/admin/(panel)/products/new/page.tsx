import { prisma } from "@/lib/prisma";
import { tryDb } from "@/lib/db-safe";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminDatabaseOffline } from "@/components/admin/AdminDatabaseOffline";

export default async function NewProductPage() {
  const loaded = await tryDb(() =>
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  );
  if (!loaded.ok) {
    return (
      <div className="space-y-8">
        <AdminDatabaseOffline />
      </div>
    );
  }
  const categories = loaded.data;
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
