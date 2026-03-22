import { v2 as cloudinary } from "cloudinary";

let configured = false;

export function configureCloudinary(): void {
  if (configured) return;
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "Missing Cloudinary env: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET",
    );
  }
  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
  });
  configured = true;
}

export async function uploadBufferToCamsFolder(
  buffer: Buffer,
  options?: { originalFilename?: string },
): Promise<string> {
  configureCloudinary();
  const base =
    options?.originalFilename
      ?.replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 80) ?? "upload";
  const publicId = `${base}_${Date.now()}`;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "cams",
        resource_type: "image",
        public_id: publicId,
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        const url = result?.secure_url;
        if (!url) {
          reject(new Error("Cloudinary returned no secure_url"));
          return;
        }
        resolve(url);
      },
    );
    stream.end(buffer);
  });
}
