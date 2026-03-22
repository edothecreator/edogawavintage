/**
 * Analytics-ready hooks — replace implementations with your provider later
 * (e.g. GA4, Plausible, PostHog).
 */

export function trackProductView(_productId: string, _slug: string) {
  /* TODO: analytics.productView */
}

export function trackAddToCart(_payload: { productId: string; slug: string; quantity: number }) {
  /* TODO: analytics.addToCart */
}

export function trackBeginCheckout(_value: number) {
  /* TODO: analytics.beginCheckout */
}

export function trackPurchase(_orderId: string, _value: number) {
  /* TODO: analytics.purchase */
}

export function trackChatOpen() {
  /* TODO: analytics.chatOpen */
}

export function trackChatMessage(_role: "user" | "assistant") {
  /* TODO: analytics.chatMessage */
}
