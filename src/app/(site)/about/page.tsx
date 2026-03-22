import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="ev-container max-w-3xl space-y-8 py-12 sm:py-16">
      <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--ev-primary)]">About</p>
      <h1 className="font-display text-4xl text-[var(--ev-text)] sm:text-5xl">
        A quiet room for serious pictures
      </h1>
      <div className="space-y-4 text-sm leading-relaxed text-[var(--ev-text-muted)] sm:text-base">
        <p>
          Edogawa Vintage began as a refusal: no loud discounts, no anonymous marketplaces, no
          mystery boxes pretending to be treasure. We wanted a place where cameras are treated as
          instruments—where brassing is described with the same care as sharpness.
        </p>
        <p>
          Our curation leans cinematic: bodies that feel good at night, lenses that forgive mistakes,
          camcorders that remember family rituals. We test, we note, we photograph the evidence.
        </p>
        <p>
          This site is a living atelier: inventory changes, stories accumulate, and the concierge
          learns only from what is truly on the shelf.
        </p>
      </div>
      <Link href="/shop">
        <Button>Explore inventory</Button>
      </Link>
    </div>
  );
}
