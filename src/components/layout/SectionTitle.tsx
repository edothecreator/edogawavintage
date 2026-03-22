export function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p className="mb-3 text-[10px] uppercase tracking-[0.45em] text-[var(--ev-primary)]">
          {eyebrow}
        </p>
      )}
      <div className="mx-auto mb-4 h-px w-12 bg-gradient-to-r from-transparent via-[var(--ev-primary)]/60 to-transparent" />
      <h2 className="font-display text-3xl tracking-tight text-[var(--ev-text)] sm:text-4xl md:text-[2.35rem]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-sm leading-relaxed text-[var(--ev-text-muted)] sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
