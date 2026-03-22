import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import {
  DEMO_CATEGORIES,
  DEMO_TESTIMONIALS,
  demoFeaturedProducts,
  demoFreshProducts,
} from "@/lib/db-fallback-data";
import { tryDb } from "@/lib/db-safe";
import { toProductCard } from "@/lib/product-types";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DbFallbackNotice } from "@/components/site/DbFallbackNotice";

export default async function HomePage() {
  const home = await tryDb(() =>
    Promise.all([
      prisma.product.findMany({
        where: { featured: true },
        orderBy: { updatedAt: "desc" },
        take: 3,
        include: { category: { select: { slug: true, name: true } } },
      }),
      prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
        include: { category: { select: { slug: true, name: true } } },
      }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" }, take: 3 }),
    ]),
  );

  const dbDown = !home.ok;
  const [featured, fresh, categories, testimonials] = home.ok
    ? home.data
    : [demoFeaturedProducts(), demoFreshProducts(), DEMO_CATEGORIES, DEMO_TESTIMONIALS];

  return (
    <div className="flex flex-col">
      {dbDown ? <DbFallbackNotice /> : null}
      <section className="relative overflow-hidden border-b border-[var(--ev-border)]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=2000&q=80"
            alt=""
            fill
            priority
            className="object-cover opacity-[0.42] scale-105 motion-safe:animate-[ev-float_22s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--ev-bg)] via-[var(--ev-veil)] to-[var(--ev-bg)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(212,181,106,0.12),transparent_65%)]" />
        </div>
        <div className="ev-container relative flex min-h-[82vh] flex-col justify-end gap-10 pb-20 pt-28 sm:min-h-[78vh] sm:pb-24 sm:pt-36">
          <div className="max-w-3xl space-y-7 animate-[ev-fade_0.9s_ease-out_both]">
            <Badge tone="muted">Tokyo · Paris · slow shutter</Badge>
            <h1 className="font-display text-[2.35rem] leading-[1.05] text-[var(--ev-text)] sm:text-6xl lg:text-[4.25rem] lg:leading-[1.02]">
              A camera universe
              <span className="mt-2 block bg-gradient-to-r from-[var(--ev-primary)] via-[#f0e6c8] to-[var(--ev-primary-dim)] bg-clip-text text-transparent sm:mt-3">
                for deliberate frames
              </span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-[var(--ev-text-muted)] sm:text-lg sm:leading-relaxed">
              Edogawa Vintage is a premium atelier for instruments with history—digital, film,
              camcorders, and glass—each tested, graded honestly, and presented with reverence.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/shop">
                <Button className="w-full sm:w-auto">Enter the shop</Button>
              </Link>
              <Link href="/collections/new-arrivals">
                <Button variant="secondary" className="w-full sm:w-auto">
                  New arrivals
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {["Inspected & bench-tested", "Condition clarity", "Human confirmation"].map((t) => (
              <div
                key={t}
                className="rounded-[var(--ev-radius-sm)] border border-[var(--ev-border)] bg-[var(--ev-surface)]/70 px-4 py-3 text-xs uppercase tracking-[0.22em] text-[var(--ev-text-muted)] backdrop-blur-md"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ev-container space-y-10 py-16 sm:py-20">
        <SectionTitle
          eyebrow="Signature wall"
          title="Featured instruments"
          subtitle="Pieces that define our taste—fast glass, quiet shutters, and bodies with patina that tells the truth."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.id} product={toProductCard(p)} />
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--ev-border)] bg-[var(--ev-bg-elevated)] py-16 sm:py-20">
        <div className="ev-container space-y-10">
          <SectionTitle
            eyebrow="Fresh on the shelf"
            title="New arrivals"
            subtitle="Recently catalogued—quantities are real, not theatrical."
          />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {fresh.map((p) => (
              <ProductCard key={p.id} product={toProductCard(p)} />
            ))}
          </div>
          <div className="flex justify-center">
            <Link href="/collections/new-arrivals">
              <Button variant="secondary">View all new arrivals</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="ev-container space-y-10 py-16 sm:py-20">
        <SectionTitle
          eyebrow="Rooms to wander"
          title="Categories"
          subtitle="Choose your doorway—each collection is maintained with the same obsessive calm."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/collections/${c.slug}`}
              className="group relative overflow-hidden rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-surface)] p-6 shadow-[var(--ev-shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--ev-border-strong)]"
            >
              <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--ev-primary)]">
                Collection
              </p>
              <p className="mt-3 font-display text-2xl text-[var(--ev-text)] group-hover:text-[var(--ev-primary)]">
                {c.name}
              </p>
              <p className="mt-2 text-sm text-[var(--ev-text-muted)]">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--ev-border)] bg-[var(--ev-surface)]/40 py-16 sm:py-20">
        <div className="ev-container grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--ev-primary)]">
              Why Edogawa
            </p>
            <h2 className="font-display text-3xl text-[var(--ev-text)] sm:text-4xl">
              Trust built from glass, brass, and transparency
            </h2>
            <p className="text-sm leading-relaxed text-[var(--ev-text-muted)] sm:text-base">
              We photograph the imperfections that matter and omit the theater that does not. Every
              checkout is confirmed by a human. Delivery notes are clear. Returns are governed by
              policy, not mood.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/faq">
                <Button variant="secondary">Read the FAQ</Button>
              </Link>
              <Link href="/shipping">
                <Button variant="ghost">Shipping policy</Button>
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { t: "Verified function", d: "Shutter, sensor, transport—checked to context." },
              { t: "Honest grading", d: "Mint to Fair, with notes you can rely on." },
              { t: "Concierge AI", d: "Multilingual guidance grounded in live inventory." },
              { t: "Quiet service", d: "No hype—just careful humans behind each order." },
            ].map((x) => (
              <div
                key={x.t}
                className="rounded-[var(--ev-radius-sm)] border border-[var(--ev-border)] bg-[var(--ev-bg)]/80 p-4"
              >
                <p className="text-sm font-medium text-[var(--ev-text)]">{x.t}</p>
                <p className="mt-2 text-xs text-[var(--ev-text-muted)]">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ev-container py-16 sm:py-20">
        <div className="overflow-hidden rounded-[var(--ev-radius)] border border-[var(--ev-border-strong)] bg-[radial-gradient(circle_at_20%_20%,rgba(201,169,98,0.18),transparent_45%),var(--ev-surface)] p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--ev-primary)]">
                Concierge
              </p>
              <h3 className="font-display text-3xl text-[var(--ev-text)]">
                Multilingual assistant, grounded in what we actually stock
              </h3>
              <p className="text-sm leading-relaxed text-[var(--ev-text-muted)]">
                Ask about film stocks, travel kits, or the right body for night markets. The concierge
                only recommends in-stock pieces—never hallucinated SKUs.
              </p>
            </div>
            <div className="rounded-[var(--ev-radius-sm)] border border-[var(--ev-border)] bg-[var(--ev-bg)]/80 p-6 text-sm text-[var(--ev-text-muted)]">
              <p className="text-[var(--ev-text)]">“I need a quiet street camera under $2000.”</p>
              <p className="mt-3">
                The widget bottom-right opens a calm, branded panel—try it in your own language.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ev-container space-y-10 pb-20">
        <SectionTitle
          eyebrow="Voices"
          title="Collectors & makers"
          subtitle="Placeholder testimonials seeded in the database—swap for real quotes anytime."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="flex flex-col justify-between rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-surface)] p-6 shadow-[var(--ev-shadow-card)]"
            >
              <blockquote className="text-sm leading-relaxed text-[var(--ev-text-muted)]">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 text-xs uppercase tracking-[0.2em] text-[var(--ev-primary)]">
                {t.author}
                {t.role ? <span className="text-[var(--ev-text-muted)]"> — {t.role}</span> : null}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="flex flex-col items-center gap-4 rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-bg-elevated)] px-6 py-12 text-center">
          <h3 className="font-display text-3xl text-[var(--ev-text)]">Ready when you are</h3>
          <p className="max-w-lg text-sm text-[var(--ev-text-muted)]">
            Browse the shop, save to cart, and checkout with card or cash on delivery—our team
            follows up personally.
          </p>
          <Link href="/shop">
            <Button>Start browsing</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
