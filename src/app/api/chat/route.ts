import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AI_BRAND } from "@/lib/ai-brand";
import { tryDb } from "@/lib/db-safe";
import { parseJsonArray } from "@/lib/format";
import { toProductCard } from "@/lib/product-types";
import { enforceChatRateLimit } from "@/lib/chat-rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .max(24),
});

type CatalogItem = {
  slug: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  category: string;
  condition: string;
  shortDescription: string;
  tags: string[];
};

async function loadInStockCatalog(): Promise<CatalogItem[]> {
  const rows = await tryDb(() =>
    prisma.product.findMany({
      where: { inStock: true, quantity: { gt: 0 } },
      include: { category: { select: { slug: true } } },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    }),
  );
  if (!rows.ok) return [];
  return rows.data.map((p) => ({
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    price: Number(p.price),
    currency: p.currency,
    category: p.category.slug,
    condition: p.condition,
    shortDescription: p.shortDescription,
    tags: parseJsonArray(p.tags),
  }));
}

const replySchema = z.object({
  reply: z.string(),
  recommendedSlugs: z.array(z.string()).max(6).optional().default([]),
});

function buildSystemInstruction(catalog: CatalogItem[]): string {
  return `You are **${AI_BRAND.name}** — ${AI_BRAND.roleShort} at Edogawa Vintage, a premium vintage & digicam atelier.

IDENTITY (stay in character, briefly):
${AI_BRAND.identity}

VOICE & SHAPE:
- Friendly, stylish, human—never robotic or corporate.
- **Short by default** (about 2–5 tight sentences). Go longer only if the user clearly asks for depth.
- Decisive and warm; avoid long hedging or “I cannot” dead-ends.
- Stay positive: never preach negativity; offer a path.

INVENTORY (hard rules):
- The ONLY products that exist are objects in the JSON array \`catalog\` below (each is in stock now).
- You MUST NOT invent SKUs, prices, or items outside catalog.
- Field \`recommendedSlugs\` may ONLY contain values from catalog[].slug.

WHEN THE ASK DOESN’T MATCH ANYTHING EXACTLY:
- NEVER stop at “we don’t have that.” Always pivot.
- Choose the **closest** in-stock picks (vibe, era, film vs digital, compact vs SLR, brand family, focal “feel”, budget band).
- Explain **confidently** in one crisp beat why each pick carries the same soul as their ask.
- Populate recommendedSlugs with those closest picks (1–3) whenever possible.

STOCK & TONE:
- Prioritize in-stock recommendations; if something implied is absent, nod briefly, then steer to the nearest live alternative.
- Multilingual: mirror the user’s language for the reply text.

OFF LIMITS:
- Order tracking, shipment status, payment disputes → politely refuse and point to human support / Contact.

OUTPUT — JSON only, no markdown fences:
{ "reply": string (you may use **bold** for model names), "recommendedSlugs": string[] }

catalog:
${JSON.stringify(catalog)}`;
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid chat payload" }, { status: 400 });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return NextResponse.json(
        {
          reply: AI_BRAND.geminiRestingMessage,
          products: [],
        },
        { status: 200 },
      );
    }

    const limited = await enforceChatRateLimit(req);
    if (!limited.ok) {
      return NextResponse.json(
        { error: limited.message, code: "RATE_LIMIT" },
        {
          status: 429,
          headers: { "Retry-After": String(limited.retryAfterSec) },
        },
      );
    }

    const catalog = await loadInStockCatalog();
    const allowedSlugs = new Set(catalog.map((c) => c.slug));

    const genAI = new GoogleGenerativeAI(key);
    const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
      systemInstruction: buildSystemInstruction(catalog),
    });

    let msgs = [...parsed.data.messages];
    while (msgs.length && msgs[0].role === "assistant") {
      msgs.shift();
    }
    if (!msgs.length) {
      return NextResponse.json({ error: "Missing user message" }, { status: 400 });
    }
    const last = msgs[msgs.length - 1];
    if (last.role !== "user") {
      return NextResponse.json({ error: "Last message must be from user" }, { status: 400 });
    }

    const history = msgs.slice(0, -1).map((m) => ({
      role: m.role === "user" ? ("user" as const) : ("model" as const),
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(last.content);
    const text = result.response.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({
        reply: `${AI_BRAND.name} lost the thread—try once more with a vibe, budget, or brand? I’ll stay in stock.`,
        products: [],
      });
    }

    const out = replySchema.safeParse(data);
    if (!out.success) {
      return NextResponse.json({
        reply: `Quick reset—tell me budget or aesthetic, and I’ll pull live picks from the shelf.`,
        products: [],
      });
    }

    const slugs = out.data.recommendedSlugs.filter((s) => allowedSlugs.has(s));
    const rows = await tryDb(() =>
      slugs.length === 0
        ? Promise.resolve([])
        : prisma.product.findMany({
            where: {
              slug: { in: slugs },
              inStock: true,
              quantity: { gt: 0 },
            },
            include: { category: { select: { slug: true, name: true } } },
          }),
    );
    const products = rows.ok ? rows.data.map(toProductCard) : [];

    return NextResponse.json({
      reply: out.data.reply,
      products,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        reply: `${AI_BRAND.name} hit a snag—try again in a moment.`,
        products: [],
      },
      { status: 200 },
    );
  }
}
