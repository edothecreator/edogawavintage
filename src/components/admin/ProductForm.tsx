"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Category, Product } from "@prisma/client";
import { CONDITIONS } from "@/lib/constants";
import { productImages, productIncluded, productSpecs } from "@/lib/product-types";
import { parseJsonArray } from "@/lib/format";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

function specsToLines(specs: Record<string, string>) {
  return Object.entries(specs)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

function linesToSpecs(text: string) {
  const out: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const k = line.slice(0, idx).trim();
    const v = line.slice(idx + 1).trim();
    if (k) out[k] = v;
  }
  return out;
}

type Props = {
  categories: Category[];
  initial?: Product;
};

export function ProductForm({ categories, initial }: Props) {
  const router = useRouter();
  const editing = Boolean(initial);

  const defaults = useMemo(() => {
    if (!initial) {
      return {
        slug: "",
        name: "",
        brand: "",
        categoryId: categories[0]?.id ?? "",
        price: 0,
        currency: "USD",
        condition: CONDITIONS[1],
        shortDescription: "",
        fullDescription: "",
        specsText: "",
        includedText: "",
        imagesText: "",
        thumbnail: "",
        inStock: true,
        quantity: 1,
        featured: false,
        tagsText: "",
        badge: "",
      };
    }
    return {
      slug: initial.slug,
      name: initial.name,
      brand: initial.brand,
      categoryId: initial.categoryId,
      price: Number(initial.price),
      currency: initial.currency,
      condition: initial.condition,
      shortDescription: initial.shortDescription,
      fullDescription: initial.fullDescription,
      specsText: specsToLines(productSpecs(initial)),
      includedText: productIncluded(initial).join("\n"),
      imagesText: productImages(initial).join("\n"),
      thumbnail: initial.thumbnail,
      inStock: initial.inStock,
      quantity: initial.quantity,
      featured: initial.featured,
      tagsText: parseJsonArray(initial.tags).join(", "),
      badge: initial.badge ?? "",
    };
  }, [categories, initial]);

  const [slug, setSlug] = useState(defaults.slug);
  const [name, setName] = useState(defaults.name);
  const [brand, setBrand] = useState(defaults.brand);
  const [categoryId, setCategoryId] = useState(defaults.categoryId);
  const [price, setPrice] = useState(defaults.price);
  const [currency, setCurrency] = useState(defaults.currency);
  const [condition, setCondition] = useState(defaults.condition);
  const [shortDescription, setShortDescription] = useState(defaults.shortDescription);
  const [fullDescription, setFullDescription] = useState(defaults.fullDescription);
  const [specsText, setSpecsText] = useState(defaults.specsText);
  const [includedText, setIncludedText] = useState(defaults.includedText);
  const [imagesText, setImagesText] = useState(defaults.imagesText);
  const [thumbnail, setThumbnail] = useState(defaults.thumbnail);
  const [inStock, setInStock] = useState(defaults.inStock);
  const [quantity, setQuantity] = useState(defaults.quantity);
  const [featured, setFeatured] = useState(defaults.featured);
  const [tagsText, setTagsText] = useState(defaults.tagsText);
  const [badge, setBadge] = useState(defaults.badge);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (quantity <= 0) setInStock(false);
  }, [quantity]);

  async function uploadFile(file: File) {
    const fd = new FormData();
    fd.set("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: fd,
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url as string;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const images = imagesText
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (!images.length || !thumbnail.trim()) {
      setError("Provide at least one image URL and a thumbnail.");
      return;
    }
    const payload = {
      slug: slug.trim(),
      name: name.trim(),
      brand: brand.trim(),
      categoryId,
      price,
      currency: currency.trim() || "USD",
      condition,
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      specs: linesToSpecs(specsText),
      includedItems: includedText
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean),
      images,
      thumbnail: thumbnail.trim(),
      inStock,
      quantity,
      featured,
      tags: tagsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      badge: badge.trim() || null,
    };

    setLoading(true);
    try {
      const res = await fetch(
        editing ? `/api/admin/products/${initial!.id}` : "/api/admin/products",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Save failed");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    if (!initial || !confirm("Delete this product?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${initial.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        setError("Could not delete");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />
        <Select
          label="Category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Input
          type="number"
          label="Price"
          value={price}
          min={0}
          step={0.01}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />
        <Input label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
        <Select
          label="Condition"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        >
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Input
          type="number"
          label="Quantity"
          value={quantity}
          min={0}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>
      <label className="flex items-center gap-3 text-sm text-[var(--ev-text)]">
        <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
        In stock flag
      </label>
      <label className="flex items-center gap-3 text-sm text-[var(--ev-text)]">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
        />
        Featured
      </label>
      <Input
        label="Badge (optional)"
        value={badge}
        onChange={(e) => setBadge(e.target.value)}
        placeholder="new, rare…"
      />
      <Input
        label="Tags (comma separated)"
        value={tagsText}
        onChange={(e) => setTagsText(e.target.value)}
        placeholder="new, bestseller"
      />
      <Textarea
        label="Short description"
        value={shortDescription}
        onChange={(e) => setShortDescription(e.target.value)}
        required
      />
      <Textarea
        label="Full description"
        value={fullDescription}
        onChange={(e) => setFullDescription(e.target.value)}
        required
        rows={6}
      />
      <Textarea
        label="Specifications (one per line, Key: Value)"
        value={specsText}
        onChange={(e) => setSpecsText(e.target.value)}
        rows={6}
      />
      <Textarea
        label="Included items (one per line)"
        value={includedText}
        onChange={(e) => setIncludedText(e.target.value)}
        rows={4}
      />
      <Textarea
        label="Image URLs (one per line)"
        value={imagesText}
        onChange={(e) => setImagesText(e.target.value)}
        rows={4}
        required
      />
      <Input
        label="Thumbnail URL"
        value={thumbnail}
        onChange={(e) => setThumbnail(e.target.value)}
        required
      />
      <div className="rounded-[var(--ev-radius-sm)] border border-[var(--ev-border)] bg-[var(--ev-surface)] p-4 text-sm text-[var(--ev-text-muted)]">
        <p className="text-[var(--ev-text)]">Upload image</p>
        <input
          type="file"
          accept="image/*"
          className="mt-2 w-full text-xs"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            try {
              const url = await uploadFile(f);
              setImagesText((t) => (t ? `${t.trim()}\n${url}` : url));
              if (!thumbnail) setThumbnail(url);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Upload failed");
            }
          }}
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save product"}
        </Button>
        {editing && (
          <Button type="button" variant="danger" disabled={loading} onClick={onDelete}>
            Delete
          </Button>
        )}
      </div>
    </form>
  );
}
