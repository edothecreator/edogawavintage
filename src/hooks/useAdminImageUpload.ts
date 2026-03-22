"use client";

import { useCallback, useState } from "react";

export type AdminImageUploadTarget = "images" | "thumbnail" | "both";

export type UseAdminImageUploadOptions = {
  endpoint?: string;
};

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
        fd.set("file", file);
        const res = await fetch(endpoint, {
          method: "POST",
          body: fd,
          credentials: "include",
        });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }
        if (!data.url) {
          throw new Error("No URL returned");
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
