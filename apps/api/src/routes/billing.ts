import { Router } from "express";
import Stripe from "stripe";
import { env } from "../config/env.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const billingRouter = Router();

const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  : null;

billingRouter.post("/checkout-session", requireAuth, async (req, res) => {
  if (!stripe) return res.status(501).json({ error: "StripeNotConfigured" });
  const { userId } = req as AuthedRequest;

  // NOTE: Replace with real product/price ids and customer mapping.
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Premium" },
          recurring: { interval: "month" },
          unit_amount: 999
        },
        quantity: 1
      }
    ],
    success_url: "https://example.com/success",
    cancel_url: "https://example.com/cancel",
    metadata: { userId }
  });

  return res.json({ url: session.url });
});

export async function billingWebhookHandler(req: any, res: any) {
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) return res.status(501).end();
  const sig = req.header("stripe-signature");
  if (!sig) return res.status(400).end();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return res.status(400).end();
  }

  // TODO: persist subscription status for userId in metadata
  if (event.type === "checkout.session.completed") {
    // noop
  }

  return res.json({ received: true });
}
