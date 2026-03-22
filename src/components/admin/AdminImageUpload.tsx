"use client";

import { useRef } from "react";
import { useAdminImageUpload, type AdminImageUploadTarget } from "@/hooks/useAdminImageUpload";
import { Button } from "@/components/ui/Button";

export type AdminImageUploadProps = {
  imagesText: string;
  thumbnail: string;
  onImagesTextChange: (value: string) => void;
  onThumbnailChange: (value: string) => void;
  target?: AdminImageUploadTarget;
  endpoint?: string;
  onError?: (message: string | null) => void;
  className?: string;
};

export function AdminImageUpload({
  imagesText,
  thumbnail,
  onImagesTextChange,
  onThumbnailChange,
  target = "both",
  endpoint,
  onError,
  className,
}: AdminImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, uploading, error, setError } = useAdminImageUpload({ endpoint });

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    onError?.(null);
    try {
      const url = await upload(file);
      if (target === "images" || target === "both") {
        const next =
          imagesText.trim().length === 0 ? url : `${imagesText.trim()}\n${url}`;
        onImagesTextChange(next);
      }
      if (target === "thumbnail" || target === "both") {
        if (target === "thumbnail") {
          onThumbnailChange(url);
        } else if (!thumbnail.trim()) {
          onThumbnailChange(url);
        }
      }
    } catch {
      /* message shown via hook `error` */
    }
  }

  return (
    <div
      className={
        className ??
        "rounded-[var(--ev-radius-sm)] border border-[var(--ev-border)] bg-[var(--ev-surface)] p-4 text-sm text-[var(--ev-text-muted)]"
      }
    >
      <p className="text-[var(--ev-text)]">Upload to Cloudinary (folder: cams)</p>
      <p className="mt-1 text-xs">
        Target:{" "}
        {target === "both"
          ? "append Image URLs; set Thumbnail if empty"
          : target === "images"
            ? "Image URLs only"
            : "Thumbnail only"}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="mt-2 w-full text-xs"
        disabled={uploading}
        onChange={onFileChange}
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Choose image"}
        </Button>
        {uploading ? (
          <span className="text-xs text-[var(--ev-text-muted)]">Sending to Cloudinary…</span>
        ) : null}
      </div>
      {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
