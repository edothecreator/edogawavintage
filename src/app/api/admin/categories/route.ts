import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { databaseUnavailableJsonResponse, isDatabaseUnavailableError } from "@/lib/db-safe";
import { verifyAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json({ categories });
  } catch (e) {
    if (isDatabaseUnavailableError(e)) return databaseUnavailableJsonResponse();
    throw e;
  }
}
