import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

/** True when Prisma cannot reach or open the database (typical on Vercel + SQLite). */
export function isDatabaseUnavailableError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  if (error instanceof Prisma.PrismaClientRustPanicError) return true;
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // https://www.prisma.io/docs/orm/reference/error-reference
    return ["P1000", "P1001", "P1002", "P1003", "P1011", "P1017"].includes(error.code);
  }
  return false;
}

export type DbResult<T> =
  | { ok: true; data: T }
  | { ok: false; unavailable: true };

/**
 * Run a Prisma (or DB) operation; on connection/init failures return `{ ok: false }` instead of throwing.
 * Other errors still propagate (bugs, validation, etc.).
 */
export async function tryDb<T>(run: () => Promise<T>): Promise<DbResult<T>> {
  try {
    const data = await run();
    return { ok: true, data };
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      console.error("[db] unavailable:", error);
      return { ok: false, unavailable: true };
    }
    throw error;
  }
}

export async function withDb<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  const r = await tryDb(run);
  return r.ok ? r.data : fallback;
}

export function databaseUnavailableJsonResponse(status = 503) {
  return NextResponse.json(
    {
      error: "Database temporarily unavailable",
      code: "DB_OFFLINE",
    },
    { status },
  );
}
