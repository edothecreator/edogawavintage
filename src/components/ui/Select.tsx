import type { SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & { label?: string };

export function Select({ label, id, className = "", children, ...rest }: Props) {
  const sid = id ?? rest.name;
  return (
    <label className="flex w-full flex-col gap-1.5 text-sm">
      {label && (
        <span className="text-[var(--ev-text-muted)] text-xs uppercase tracking-[0.2em]">
          {label}
        </span>
      )}
      <select
        id={sid}
        className={`ev-touch min-h-12 w-full appearance-none rounded-[var(--ev-radius-sm)] border border-[var(--ev-border)] bg-[var(--ev-bg-elevated)] px-3 py-3 text-base text-[var(--ev-text)] outline-none transition-colors focus:border-[var(--ev-border-strong)] sm:min-h-0 sm:py-2.5 sm:text-sm ${className}`}
        {...rest}
      >
        {children}
      </select>
    </label>
  );
}
