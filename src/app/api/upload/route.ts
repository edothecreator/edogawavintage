import { verifyAdminSession } from "@/lib/admin-auth";
import { handleCloudinaryFormUpload } from "@/lib/handle-cloudinary-form-upload";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const ok = await verifyAdminSession();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return handleCloudinaryFormUpload(req);
}
