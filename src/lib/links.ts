/**
 * Support / donation configuration.
 *
 * The Donate button always routes to the in-app `/donate` page (so it never
 * dead-ends on a 404). To enable a real outbound donation, set the
 * `VITE_DONATE_URL` env var to a live processor link (Stripe payment link,
 * Ko-fi, Open Collective, GitHub Sponsors, …) at build time — the donate page
 * then shows a "Donate now" button pointing to it. Until then it offers a
 * contact route so no click leads nowhere.
 */
export const DONATE_PATH = "/donate";

export const SUPPORT_EMAIL = "info@myclok.com";

/** The configured outbound donation URL, or "" when none is set. Read at call
 *  time (not import time) so the value is env-driven and testable. */
export function externalDonateUrl(): string {
  return import.meta.env.VITE_DONATE_URL ?? "";
}

export function supportMailto(): string {
  const subject = encodeURIComponent("Supporting Schizopedia");
  const body = encodeURIComponent(
    "Hi — I'd like to support Schizopedia. Please let me know how I can contribute.",
  );
  return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
}
