import { NextResponse } from "next/server";
import { uploadBufferToCamsFolder } from "@/lib/cloudinary";
import { parseMultipartFileWithMulterMemory } from "@/lib/parse-multipart-multer-memory";

const MAX_BYTES = 12 * 1024 * 1024;

export async function handleCloudinaryFormUpload(req: Request): Promise<Response> {
  try {
    const rawBody = Buffer.from(await req.arrayBuffer());
    if (rawBody.length === 0) {
      return NextResponse.json({ error: "Empty body" }, { status: 400 });
    }
    if (rawBody.length > MAX_BYTES) {
      return NextResponse.json(
        { error: `File too large (max ${MAX_BYTES / (1024 * 1024)}MB)` },
        { status: 400 },
      );
    }

    let parsed: { buffer: Buffer; originalname: string; mimetype: string };
    try {
      parsed = await parseMultipartFileWithMulterMemory(req, rawBody);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Invalid multipart upload";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (!parsed.mimetype.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    const url = await uploadBufferToCamsFolder(parsed.buffer, {
      originalFilename: parsed.originalname,
    });
    return NextResponse.json({ url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    console.error("[upload]", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
