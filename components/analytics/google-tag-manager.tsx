import Script from "next/script";

/**
 * Loads the GTM container script (afterInteractive).
 * The dataLayer init snippet lives in app/layout.tsx <head> so it runs
 * synchronously — before any dataLayer.push() calls during hydration.
 * Set NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX in .env.local to activate.
 */
export default function GoogleTagManagerLoader() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  if (!gtmId) return null;
  return (
    <Script
      id="gtm"
      src={`/gtm/gtm.js?id=${gtmId}`}
      strategy="afterInteractive"
    />
  );
}
