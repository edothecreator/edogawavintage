import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string };

export function Input({ label, hint, id, className = "", ...rest }: Props) {
  const inputId = id ?? rest.name;
  return (
    <label className="flex w-full flex-col gap-1.5 text-sm">
      {label && (
        <span className="text-[var(--ev-text-muted)] text-xs uppercase tracking-[0.2em]">
          {label}
        </span>
      )}
      <input
        id={inputId}
        className={`ev-touch min-h-12 w-full rounded-[var(--ev-radius-sm)] border border-[var(--ev-border)] bg-[var(--ev-bg-elevated)] px-3 py-3 text-base text-[var(--ev-text)] placeholder:text-[var(--ev-text-muted)]/70 outline-none transition-colors focus:border-[var(--ev-border-strong)] sm:min-h-0 sm:py-2.5 sm:text-sm ${className}`}
        {...rest}
      />
      {hint && <span className="text-xs text-[var(--ev-text-muted)]">{hint}</span>}
    </label>
  );
}
