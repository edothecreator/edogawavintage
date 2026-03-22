/**
 * Future card processing (e.g. Stripe PaymentIntents) should live here.
 * Checkout currently records paymentMethod === "card" and relies on human follow-up.
 *
 * Suggested integration shape:
 * - createPaymentIntent({ orderId, amount, currency })
 * - confirmCardPayment(clientSecret)
 * - webhooks to mark orders paid/failed
 */
export type CardPaymentIntent = {
  provider: "stripe" | "placeholder";
  clientSecret?: string;
};

export async function createCardPaymentIntent(_: {
  orderId: string;
  amount: number;
  currency: string;
}): Promise<CardPaymentIntent> {
  throw new Error("Card gateway not configured — see src/lib/payments.ts");
}
