"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackPageView } from "@/lib/utils/gtm-events";

/**
 * Fires a `page_view` event into GTM dataLayer on every client-side navigation.
 * GTM's own `gtm.js` event covers the initial hard load; this covers SPA navigations.
 */
export function PageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastUrl = useRef<string | null>(null);

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    if (url === lastUrl.current) return;
    lastUrl.current = url;
    trackPageView(url);
  }, [pathname, searchParams]);

  return null;
}
