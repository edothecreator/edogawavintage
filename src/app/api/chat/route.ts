import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { parseJsonArray } from "@/lib/format";
import { toProductCard } from "@/lib/product-types";

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
  const rows = await prisma.product.findMany({
    where: { inStock: true, quantity: { gt: 0 } },
    include: { category: { select: { slug: true } } },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  return rows.map((p) => ({
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

export async function POST(req: Request) {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return NextResponse.json(
        {
          reply:
            "The concierge is resting—add GEMINI_API_KEY to enable multilingual assistance. Meanwhile, browse the shop or contact us for guidance.",
          products: [],
        },
        { status: 200 },
      );
    }

    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid chat payload" }, { status: 400 });
    }

    const catalog = await loadInStockCatalog();
    const allowedSlugs = new Set(catalog.map((c) => c.slug));

    const genAI = new GoogleGenerativeAI(key);
    const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.35,
      },
      systemInstruction: `You are the Edogawa Vintage concierge—a premium camera boutique assistant.

STRICT RULES:
- You MUST NOT invent store inventory. The ONLY products that exist in our store are in the JSON array "catalog" below.
- When the user asks for recommendations, budgets, comparisons, or "what should I buy", you MUST choose recommendedSlugs ONLY from catalog[].slug values that appear in that array.
- If nothing in catalog fits, set recommendedSlugs to [] and clearly say we do not have a suitable in-stock item at the moment (in the user's language).
- Never claim we stock an item unless its slug is in catalog.
- Exclude sold-out or unavailable items—they are not present in catalog (catalog is in-stock only).
- Do NOT provide order tracking, order status, or shipment details. If asked, politely refuse and invite the customer to contact human support via the Contact page.
- You MAY answer general camera education (film vs digital, lenses, exposure, genres) normally.
- Match the user's language when replying.

OUTPUT: JSON only with shape:
{ "reply": string (can use **bold** sparingly), "recommendedSlugs": string[] }

catalog:
${JSON.stringify(catalog)}`,
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
        reply:
          "I had trouble shaping that answer. Could you rephrase your question? I can still help with cameras and our in-stock pieces.",
        products: [],
      });
    }

    const out = replySchema.safeParse(data);
    if (!out.success) {
      return NextResponse.json({
        reply:
          "Let me try again in a moment—our boutique assistant stumbled. Ask again with your budget or style preference.",
        products: [],
      });
    }

    const slugs = out.data.recommendedSlugs.filter((s) => allowedSlugs.has(s));
    const products =
      slugs.length === 0
        ? []
        : (
            await prisma.product.findMany({
              where: {
                slug: { in: slugs },
                inStock: true,
                quantity: { gt: 0 },
              },
              include: { category: { select: { slug: true, name: true } } },
            })
          ).map(toProductCard);

    return NextResponse.json({
      reply: out.data.reply,
      products,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        reply: "Something went wrong reaching the assistant. Please try again shortly.",
        products: [],
      },
      { status: 200 },
    );
  }
}
