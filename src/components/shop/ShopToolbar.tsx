"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { CONDITIONS } from "@/lib/constants";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

type BrandOpt = { brand: string };

export function ShopToolbar({
  brands,
  categories,
}: {
  brands: BrandOpt[];
  categories: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, startTransition] = useTransition();

  const current = useMemo(() => {
    return {
      search: sp.get("search") ?? "",
      category: sp.get("category") ?? "",
      brand: sp.get("brand") ?? "",
      minPrice: sp.get("minPrice") ?? "",
      maxPrice: sp.get("maxPrice") ?? "",
      condition: sp.get("condition") ?? "",
      availability: sp.get("availability") ?? "all",
      sort: sp.get("sort") ?? "newest",
    };
  }, [sp]);

  const spSignature = sp.toString();

  const [searchDraft, setSearchDraft] = useState(current.search);
  const [minDraft, setMinDraft] = useState(current.minPrice);
  const [maxDraft, setMaxDraft] = useState(current.maxPrice);

  useEffect(() => {
    setSearchDraft(sp.get("search") ?? "");
    setMinDraft(sp.get("minPrice") ?? "");
    setMaxDraft(sp.get("maxPrice") ?? "");
  }, [sp, spSignature]);

  const push = useCallback(
    (next: Record<string, string>) => {
      const params = new URLSearchParams(sp.toString());
      for (const [k, v] of Object.entries(next)) {
        if (!v) params.delete(k);
        else params.set(k, v);
      }
      startTransition(() => {
        const q = params.toString();
        router.push(q ? `${pathname}?${q}` : pathname);
      });
    },
    [pathname, router, sp],
  );

  const applyTextFilters = useCallback(() => {
    push({
      search: searchDraft.trim(),
      minPrice: minDraft.trim(),
      maxPrice: maxDraft.trim(),
    });
  }, [push, searchDraft, minDraft, maxDraft]);

  return (
    <div className="space-y-4 rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-surface)] p-4 shadow-[var(--ev-shadow-card)] sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <div className="space-y-2 sm:col-span-2 xl:col-span-1 2xl:col-span-1">
          <Input
            label="Search"
            placeholder="Name, brand…"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyTextFilters();
            }}
            onBlur={() => {
              if (searchDraft.trim() !== current.search) push({ search: searchDraft.trim() });
            }}
          />
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:hidden"
            disabled={pending}
            onClick={applyTextFilters}
          >
            Apply search
          </Button>
        </div>
        <Select
          label="Category"
          value={current.category}
          onChange={(e) => push({ category: e.target.value })}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select
          label="Brand"
          value={current.brand}
          onChange={(e) => push({ brand: e.target.value })}
        >
          <option value="">All brands</option>
          {brands.map((b) => (
            <option key={b.brand} value={b.brand}>
              {b.brand}
            </option>
          ))}
        </Select>
        <Select
          label="Condition"
          value={current.condition}
          onChange={(e) => push({ condition: e.target.value })}
        >
          <option value="">Any</option>
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select
          label="Availability"
          value={current.availability}
          onChange={(e) => push({ availability: e.target.value })}
        >
          <option value="all">All</option>
          <option value="in_stock">In stock</option>
          <option value="sold_out">Sold out</option>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Input
          label="Min price"
          type="number"
          min={0}
          inputMode="decimal"
          value={minDraft}
          onChange={(e) => setMinDraft(e.target.value)}
          onBlur={() => {
            if (minDraft !== current.minPrice) push({ minPrice: minDraft.trim() });
          }}
        />
        <Input
          label="Max price"
          type="number"
          min={0}
          inputMode="decimal"
          value={maxDraft}
          onChange={(e) => setMaxDraft(e.target.value)}
          onBlur={() => {
            if (maxDraft !== current.maxPrice) push({ maxPrice: maxDraft.trim() });
          }}
        />
        <Select
          label="Sort"
          value={current.sort}
          onChange={(e) => push({ sort: e.target.value })}
        >
          <option value="newest">Newest</option>
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low → high</option>
          <option value="price-desc">Price: high → low</option>
        </Select>
        <div className="flex flex-col justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            className="w-full md:hidden"
            disabled={pending}
            onClick={applyTextFilters}
          >
            Apply price & search
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={pending}
            onClick={() => startTransition(() => router.push(pathname))}
          >
            Reset filters
          </Button>
        </div>
      </div>
      <p className="text-xs text-[var(--ev-text-muted)] md:hidden">
        Category, brand, and sort apply instantly. Tap{" "}
        <span className="text-[var(--ev-text)]">Apply</span> after typing search or prices.
      </p>
    </div>
  );
}
