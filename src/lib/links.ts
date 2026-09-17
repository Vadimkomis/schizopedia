/**
 * Support / donation configuration.
 *
 * The Donate button routes to `/donate`, which uses Schizopedia's public
 * Stripe Payment Link. Set `VITE_DONATE_URL` at build time to override the
 * checkout, or set it to an empty string to use the email fallback.
 */
export const DONATE_PATH = "/donate";

export const SUPPORT_EMAIL = "info@myclok.com";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/aFa7sNfjQ86C1vcaXJaR200";

/** Read at call time so deployment overrides remain testable. */
export function externalDonateUrl(): string {
  return import.meta.env.VITE_DONATE_URL ?? STRIPE_PAYMENT_LINK;
}

export function supportMailto(): string {
  const subject = encodeURIComponent("Supporting Schizopedia");
  const body = encodeURIComponent(
    "Hi — I'd like to support Schizopedia. Please let me know how I can contribute.",
  );
  return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
}
