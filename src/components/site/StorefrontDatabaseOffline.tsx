import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PREVIEW_PRODUCT_SLUG } from "@/lib/db-fallback-data";

type Props = {
  /** When the DB works but the slug does not exist */
  variant?: "missing" | "unavailable";
};

export function StorefrontDatabaseOffline({ variant = "unavailable" }: Props) {
  const isMissing = variant === "missing";
  return (
    <div className="ev-container max-w-lg space-y-6 py-20 text-center sm:py-28">
      <h1 className="font-display text-3xl text-[var(--ev-text)] sm:text-4xl">
        {isMissing ? "This piece is not in the catalog" : "Catalog temporarily unavailable"}
      </h1>
      <p className="text-sm leading-relaxed text-[var(--ev-text-muted)]">
        {isMissing
          ? "We could not find this product. It may have been removed, or the catalog database is still connecting."
          : "Our inventory database could not be reached—often because SQLite file URLs do not work on serverless hosts. The rest of the site should keep working; checkout and live stock will return once you use a hosted database."}
      </p>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/shop">
          <Button>Back to shop</Button>
        </Link>
        {!isMissing ? (
          <Link href={`/product/${PREVIEW_PRODUCT_SLUG}`}>
            <Button variant="secondary">Open preview listing</Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
