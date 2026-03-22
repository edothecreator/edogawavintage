"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [idx, setIdx] = useState(0);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const main = images[idx] ?? images[0];
  if (!main) return null;

  const go = useCallback(
    (dir: -1 | 1) => {
      setIdx((i) => {
        const next = i + dir;
        if (next < 0) return images.length - 1;
        if (next >= images.length) return 0;
        return next;
      });
    },
    [images.length],
  );

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start || images.length < 2) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy)) return;
    go(dx < 0 ? 1 : -1);
  };

  return (
    <div className="space-y-4">
      <div
        className="ev-touch relative aspect-square overflow-hidden rounded-[var(--ev-radius)] border border-[var(--ev-border)] bg-[var(--ev-bg-elevated)] shadow-[var(--ev-shadow-card)]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={main}
          alt={alt}
          fill
          priority
          className="object-cover select-none"
          sizes="(max-width:1024px) 100vw, 50vw"
          draggable={false}
        />
        {images.length > 1 && (
          <>
            <div className="pointer-events-none absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === idx ? "w-6 bg-[var(--ev-primary)]" : "w-1.5 bg-white/35"
                  }`}
                />
              ))}
            </div>
            <p className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm sm:hidden">
              Swipe
            </p>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="-mx-1 flex gap-2 overflow-x-auto overscroll-x-contain pb-2 pt-1 [scrollbar-width:thin] snap-x snap-mandatory">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIdx(i)}
              className={`ev-touch relative size-14 shrink-0 snap-start overflow-hidden rounded-[var(--ev-radius-sm)] border-2 transition-all active:scale-95 sm:size-16 ${
                i === idx
                  ? "border-[var(--ev-primary)] shadow-[0_0_0_1px_rgba(212,181,106,0.35)]"
                  : "border-[var(--ev-border)] opacity-75"
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
