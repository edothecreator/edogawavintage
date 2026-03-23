/**
 * Central AI persona for Edogawa Vintage — change name, voice, and copy here only.
 * Implemented choice: **Edo Assistant** (house savant; ISO as a wink to exposure culture).
 */
export const AI_BRAND = {
  name: "Edo Assistant",
  /** One-line role for UI labels */
  roleShort: "House savant",
  /** Backstory / identity (shown in marketing copy; keep concise) */
  identity:
    "He apprenticed on Parisian repair benches and in Tokyo night labs; today he minds the salon—pairing photographers with shutters and glass from our real vitrine, never from imagination.",
  /** Shown under chat entry / hero teasers */
  tagline: "Your guide to glass, grain, and what we truly have in stock.",
  /** First assistant bubble in the chat panel */
  welcomeMessage:
    "Bonjour—I’m **Edo Assistant**. Ask in any language: vibe, budget, brand, or use case. I only suggest bodies we actually hold in stock—no phantom SKUs.",
  /** When GEMINI_API_KEY is missing */
  geminiRestingMessage:
    "Edo Assistant is resting—add GEMINI_API_KEY for live wit in any language. Until then, browse the shop or write us from Contact.",
  /** Floating launcher (short) */
  chatButtonLabel: "Edo Assistant",
  chatButtonTeaser: "Ask our AI",
  chatAriaLabel: "Open Edo Assistant chat",
  panelEyebrow: "Edogawa Vintage",
  panelTitle: "Edo Assistant",
  /** Footnote under composer */
  footerNote:
    "Recommendations follow live inventory only. I cannot track orders—our humans do that via Contact.",
  /** Product cards strip title */
  picksHeading: "In the vitrine now",
  /** Homepage / marketing */
  marketingHeadline: "Meet Edo Assistant",
  marketingSubhead:
    "The house savant for film, digital, and glass—short answers, decisive picks, grounded in what we actually stock.",
  /** Trust grid line on home */
  trustBlurb: "Multilingual, decisive, always tied to live inventory.",
} as const;

export type AIBrand = typeof AI_BRAND;
