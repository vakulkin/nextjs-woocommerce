import { GoogleTagManager } from "@next/third-parties/google";

/**
 * Loads Google Tag Manager via @next/third-parties.
 * Set NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX in .env.local to activate.
 * GA4 is attached to the GTM container — no direct GA4 tag in code.
 */
export default function GoogleTagManagerLoader() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  if (!gtmId) return null;
  return <GoogleTagManager gtmId={gtmId} />;
}
