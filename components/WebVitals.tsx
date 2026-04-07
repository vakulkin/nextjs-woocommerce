"use client";

import { useReportWebVitals } from "next/web-vitals";
import { reportWebVitals } from "@/lib/utils/gtm-events";

/**
 * Reports Core Web Vitals (LCP, CLS, INP, TTFB, FCP) to GTM dataLayer.
 * Must be rendered inside the <body> after GoogleTagManagerLoader.
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    reportWebVitals(metric);
  });
  return null;
}
