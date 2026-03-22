import { NextResponse } from "next/server";
import { loadShippingTariffsFromDisk } from "@/lib/shipping-tariff";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const tariffs = loadShippingTariffsFromDisk();
  return NextResponse.json({ tariffs });
}
