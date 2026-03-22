import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { tryDb } from "@/lib/db-safe";
import { AI_BRAND } from "@/lib/ai-brand";

function envInt(name: string, fallback: number): number {
  const v = process.env[name];
  if (!v) return fallback;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function getChatRateLimits() {
  return {
    perMinute: envInt("CHAT_RATE_LIMIT_PER_MINUTE", 12),
    perHour: envInt("CHAT_RATE_LIMIT_PER_HOUR", 80),
  };
}

function hashIp(ip: string): string {
  const salt = process.env.CHAT_RATE_IP_SALT || process.env.ADMIN_JWT_SECRET || "edogawa-chat";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 48);
}

export function getClientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) {
    const first = xf.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}

export type RateLimitResult =
  | { ok: true }
  | { ok: false; message: string; retryAfterSec: number };

/**
 * DB-backed limiter (works across Vercel instances when DATABASE_URL is shared).
 * Fails open if the database is unavailable so chat still works.
 */
export async function enforceChatRateLimit(req: Request): Promise<RateLimitResult> {
  const { perMinute, perHour } = getChatRateLimits();
  const ip = getClientIp(req);
  const ipKey = hashIp(ip);
  const now = Date.now();
  const minuteAgo = new Date(now - 60_000);
  const hourAgo = new Date(now - 3_600_000);

  const counted = await tryDb(async () => {
    await prisma.chatRequestLog.deleteMany({
      where: { createdAt: { lt: hourAgo } },
    });
    const [lastMinute, lastHour] = await Promise.all([
      prisma.chatRequestLog.count({
        where: { ipKey, createdAt: { gte: minuteAgo } },
      }),
      prisma.chatRequestLog.count({
        where: { ipKey, createdAt: { gte: hourAgo } },
      }),
    ]);
    return { lastMinute, lastHour };
  });

  if (!counted.ok) {
    return { ok: true };
  }

  const { lastMinute, lastHour } = counted.data;

  if (lastMinute >= perMinute) {
    return {
      ok: false,
      message: `Too many messages—please wait a minute before asking ${AI_BRAND.name} again.`,
      retryAfterSec: 60,
    };
  }
  if (lastHour >= perHour) {
    return {
      ok: false,
      message:
        "You’ve reached the hourly limit for the assistant. Try again in a little while—or browse the shop and contact us for urgent help.",
      retryAfterSec: 3600,
    };
  }

  const logged = await tryDb(() =>
    prisma.chatRequestLog.create({
      data: { ipKey },
    }),
  );
  if (!logged.ok) {
    return { ok: true };
  }

  return { ok: true };
}
