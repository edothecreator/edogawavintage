"use client";

import { useEffect } from "react";
import { trackProductView } from "@/lib/analytics";

export function ProductViewTracker({ productId, slug }: { productId: string; slug: string }) {
  useEffect(() => {
    trackProductView(productId, slug);
  }, [productId, slug]);
  return null;
}
