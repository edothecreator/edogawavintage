type Tone = "default" | "success" | "warning" | "muted";

const tones: Record<Tone, string> = {
  default:
    "border-[var(--ev-border-strong)] bg-[rgba(201,169,98,0.12)] text-[var(--ev-primary)]",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  warning: "border-amber-500/35 bg-amber-500/10 text-amber-100",
  muted: "border-[var(--ev-border)] bg-white/5 text-[var(--ev-text-muted)]",
};

export function Badge({
  children,
  tone = "default",
  className = "",
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
