# Edogawa Vintage

Premium, mobile-first camera e-commerce built with **Next.js 16** (App Router), **Prisma**, **Tailwind CSS 4**, optional **Google Gemini** assistant (**Edo Assistant**) grounded in **in-stock** catalog data, and city-based shipping via a root **`Tarif`** file.

## Features

- Branded storefront: home, shop, collections (digital / film / camcorders / accessories, new arrivals, best sellers, sold-out archive), product detail, cart, checkout (card placeholder + cash on delivery), order confirmation
- Trust & support: About, FAQ (DB-backed), Contact (API + form), Privacy, Terms, Shipping, Returns
- Admin: JWT cookie auth, dashboard, CRUD products with image upload to `public/uploads`, order list + status updates
- Cart: Zustand + `localStorage` persistence
- Chatbot: `/api/chat` loads in-stock catalog JSON, Gemini returns `recommendedSlugs` filtered server-side; no order tracking

## Prerequisites

- Node.js **20+**
- npm (or pnpm/yarn)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and fill in values (see **Environment variables** below).

3. **Database**

   ```bash
   npx prisma db push
   npm run db:seed
   ```

   SQLite file is created under `prisma/` (e.g. `prisma/dev.db` when `DATABASE_URL` is `file:./dev.db`).

4. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login) using `ADMIN_PASSWORD`.

5. **Production build**

   ```bash
   npm run build
   npm start
   ```

   Storefront and admin data routes use `force-dynamic` so the build does not require an existing database on the build machine; you still need `db push` + seed (or migrations) where the app runs.

## Scripts

| Script        | Description                          |
| ------------- | ------------------------------------ |
| `npm run dev` | Next.js dev server                   |
| `npm run build` | `prisma generate` + `next build`   |
| `npm start`   | Production server                    |
| `npm run db:push` | Apply schema to SQLite           |
| `npm run db:seed` | Seed categories, products, FAQ, testimonials |

## Project structure (high level)

- `src/app/(site)/` — public pages and layouts
- `src/app/admin/` — admin login + panel
- `src/app/api/` — orders, chat, admin APIs, contact
- `src/components/` — UI, product cards, chat widget, admin forms
- `src/lib/` — Prisma client, cart store, product query helpers, analytics hooks
- `prisma/schema.prisma` — Product, Order, Category, FAQ, Testimonial
- `prisma/seed.ts` — sample inventory (mix of in-stock and sold-out for testing)

## Card payments

Checkout records `paymentMethod: "card"` or `"cod"`. Card capture is intentionally deferred: extend `src/lib/payments.ts` and wire a provider (e.g. Stripe) without changing the order model.

## Analytics

`src/lib/analytics.ts` exports no-op trackers ready to swap for GA4, Plausible, PostHog, etc.

## Environment variables

| Variable | Required? | Purpose |
| -------- | --------- | ------- |
| `DATABASE_URL` | **Yes** | SQLite connection string (e.g. `file:./dev.db` — path relative to `prisma/`) |
| `ADMIN_PASSWORD` | **Yes** | Password for `/admin/login` |
| `ADMIN_JWT_SECRET` | **Yes** | Secret for signing admin session cookies (use a long random string in production) |
| `GEMINI_API_KEY` | No | Enables **Edo Assistant**; if empty, chat returns a friendly “add key” message |
| `CHAT_RATE_LIMIT_PER_MINUTE` | No | Default `12` — IP-hashed chat rate limit (needs DB) |
| `CHAT_RATE_LIMIT_PER_HOUR` | No | Default `80` |
| `CHAT_RATE_IP_SALT` | No | Extra salt for IP hashing (falls back to `ADMIN_JWT_SECRET`) |
| `GEMINI_MODEL` | No | Gemini model id (default in code: `gemini-2.0-flash`) |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL for metadata / Open Graph (default `http://localhost:3000`) |

Where to obtain keys:

- **Gemini:** [Google AI Studio](https://aistudio.google.com/apikey) → create an API key.
- **Admin secret:** generate locally, e.g. `openssl rand -base64 48` (or any secure random string ≥ 32 characters).
