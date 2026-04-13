"use client";

import { Gauge, ArrowUpRight } from "lucide-react";

export function PageSpeedButton() {
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    window.open(
      `https://developers.google.com/speed/pagespeed/insights/?url=${encodeURIComponent(window.location.href)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <a
      href="#"
      onClick={handleClick}
      title="Analyze this page in Google PageSpeed Insights"
      className="group inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-sm transition-all hover:border-border hover:text-foreground hover:shadow-md"
    >
      <Gauge className="size-3 shrink-0 text-emerald-500" />
      <span>Check This URL in Google Page Speed</span>
      <ArrowUpRight className="size-3 shrink-0 opacity-40 transition-opacity group-hover:opacity-100" />
    </a>
  );
}
