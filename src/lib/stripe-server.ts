import Stripe from "stripe";

// Server-side Stripe instance — never import in client components
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

// Demo mode: if secret key is a placeholder, return mock data
export const isDemoMode = !process.env.STRIPE_SECRET_KEY ||
  process.env.STRIPE_SECRET_KEY.includes("placeholder") ||
  process.env.STRIPE_SECRET_KEY.includes("demo");
