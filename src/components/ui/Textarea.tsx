import type { TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string };

export function Textarea({ label, id, className = "", ...rest }: Props) {
  const tid = id ?? rest.name;
  return (
    <label className="flex w-full flex-col gap-1.5 text-sm">
      {label && (
        <span className="text-[var(--ev-text-muted)] text-xs uppercase tracking-[0.2em]">
          {label}
        </span>
      )}
      <textarea
        id={tid}
        rows={4}
        className={`ev-touch w-full resize-y rounded-[var(--ev-radius-sm)] border border-[var(--ev-border)] bg-[var(--ev-bg-elevated)] px-3 py-3 text-base text-[var(--ev-text)] placeholder:text-[var(--ev-text-muted)]/70 outline-none transition-colors focus:border-[var(--ev-border-strong)] sm:py-2.5 sm:text-sm ${className}`}
        {...rest}
      />
    </label>
  );
}
