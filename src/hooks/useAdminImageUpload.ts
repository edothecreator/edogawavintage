"use client";

import { useCallback, useState } from "react";

export type AdminImageUploadTarget = "images" | "thumbnail" | "both";

export type UseAdminImageUploadOptions = {
  endpoint?: string;
};

async function readErrorPayload(res: Response): Promise<string> {
  const text = await res.text();
  if (!text) {
    return res.statusText || `Request failed (${res.status})`;
  }
  try {
    const data = JSON.parse(text) as { error?: string };
    if (data?.error && typeof data.error === "string") return data.error;
  } catch {
    /* not JSON */
  }
  if (text.length < 200) return text;
  return `Request failed (${res.status})`;
}

export function useAdminImageUpload(options: UseAdminImageUploadOptions = {}) {
  const endpoint = options.endpoint ?? "/api/upload";
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File): Promise<string> => {
      setError(null);
      setUploading(true);
      try {
        const fd = new FormData();
        fd.set("file", file, file.name);

        const res = await fetch(endpoint, {
          method: "POST",
          body: fd,
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          const msg = await readErrorPayload(res);
          throw new Error(msg);
        }

        let data: { url?: string; error?: string };
        try {
          data = (await res.json()) as { url?: string; error?: string };
        } catch {
          throw new Error("Invalid response from server");
        }

        if (!data.url || typeof data.url !== "string") {
          throw new Error(data.error || "No URL returned");
        }
        return data.url;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Upload failed";
        setError(msg);
        throw e;
      } finally {
        setUploading(false);
      }
    },
    [endpoint],
  );

  return { upload, uploading, error, setError };
}
