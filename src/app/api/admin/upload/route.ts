import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { handleCloudinaryFormUpload } from "@/lib/handle-cloudinary-form-upload";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ok = await verifyAdminSession();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return handleCloudinaryFormUpload(req);
}
