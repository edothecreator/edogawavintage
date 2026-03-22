import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--ev-primary)] text-[var(--ev-bg)] hover:bg-[var(--ev-primary-dim)] shadow-[0_14px_44px_rgba(212,181,106,0.24)]",
  secondary:
    "border border-[var(--ev-border-strong)] bg-[var(--ev-surface)] text-[var(--ev-text)] hover:bg-[var(--ev-surface-hover)]",
  ghost: "text-[var(--ev-text-muted)] hover:text-[var(--ev-text)] hover:bg-white/5",
  danger: "bg-red-500/90 text-white hover:bg-red-600",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
  asChild?: boolean;
};

export function Button({
  variant = "primary",
  className = "",
  children,
  type = "button",
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={`ev-touch inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--ev-radius-sm)] px-5 py-3 text-[15px] font-medium tracking-wide transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 sm:min-h-11 sm:px-4 sm:py-2.5 sm:text-sm ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
