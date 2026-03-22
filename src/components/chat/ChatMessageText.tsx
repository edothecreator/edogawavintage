"use client";

/**
 * Renders assistant/user text; treats **segments** like markdown bold (Gemini often uses this).
 */
export function ChatMessageText({
  content,
  variant,
}: {
  content: string;
  variant: "user" | "assistant";
}) {
  const parts = content.split(/(\*\*[\s\S]+?\*\*)/g);

  return (
    <p className="whitespace-pre-wrap break-words">
      {parts.map((part, i) => {
        const m = part.match(/^\*\*([\s\S]+)\*\*$/);
        if (m) {
          return (
            <strong
              key={i}
              className={
                variant === "user"
                  ? "font-bold text-[var(--ev-bg)]"
                  : "font-bold text-[var(--ev-primary)]"
              }
            >
              {m[1]}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}
