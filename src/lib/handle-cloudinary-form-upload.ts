import { NextResponse } from "next/server";
import { uploadBufferToCamsFolder } from "@/lib/cloudinary";

const MAX_BYTES = 12 * 1024 * 1024;

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/svg+xml",
  "image/heic",
  "image/heif",
]);

function looksLikeImageMagic(buf: Buffer): boolean {
  if (buf.length < 12) return false;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true;
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return true;
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46) return true;
  if (buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70) return true;
  return false;
}

export async function handleCloudinaryFormUpload(req: Request): Promise<Response> {
  try {
    const ct = req.headers.get("content-type") ?? "";
    if (!ct.toLowerCase().includes("multipart/form-data")) {
      return NextResponse.json(
        { error: 'Expected multipart/form-data with field "file"' },
        { status: 400 },
      );
    }

    let form: FormData;
    try {
      form = await req.formData();
    } catch (e) {
      console.error("[upload] formData()", e);
      return NextResponse.json(
        { error: "Could not read upload body (multipart parse failed)" },
        { status: 400 },
      );
    }

    const entry = form.get("file");
    if (!entry || !(entry instanceof Blob)) {
      return NextResponse.json(
        { error: 'Missing or invalid form field "file" (must be a file)' },
        { status: 400 },
      );
    }

    const buf = Buffer.from(await entry.arrayBuffer());
    if (buf.length === 0) {
      return NextResponse.json({ error: "Empty file" }, { status: 400 });
    }
    if (buf.length > MAX_BYTES) {
      return NextResponse.json(
        { error: `File too large (max ${MAX_BYTES / (1024 * 1024)}MB)` },
        { status: 400 },
      );
    }

    const mime = (entry.type || "").toLowerCase().split(";")[0].trim();
    const knownImage = mime && IMAGE_TYPES.has(mime);
    const unknownOrBinary = !mime || mime === "application/octet-stream";
    if (!knownImage) {
      if (!unknownOrBinary || !looksLikeImageMagic(buf)) {
        return NextResponse.json({ error: "File must be an image" }, { status: 400 });
      }
    }

    const originalFilename =
      entry instanceof File && entry.name ? entry.name : "upload";

    const url = await uploadBufferToCamsFolder(buf, { originalFilename });
    return NextResponse.json({ url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    console.error("[upload]", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
