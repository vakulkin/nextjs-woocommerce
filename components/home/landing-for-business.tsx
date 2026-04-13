import { Check } from "lucide-react";

const PERF_ROWS = [
  [
    "Page delivery",
    "PHP renders on every request — server under load, every visitor waits",
    "Pre-rendered HTML served instantly from the CDN edge",
  ],
  [
    "Traffic spikes",
    "Server degrades, queues back up, uptime at risk",
    "Stateless frontend scales horizontally with zero configuration",
  ],
  [
    "Images",
    "WordPress serves original sizes, often unoptimised",
    "Automatically resized to WebP/AVIF and lazy-loaded",
  ],
  [
    "Fonts",
    "Third-party CDN requests cause layout shift (CLS)",
    "Self-hosted and subsetted — CLS = 0",
  ],
  [
    "Web Vitals",
    "Measured only if you set up a separate tool",
    "LCP, CLS, INP reported to GA4 automatically from real sessions",
  ],
  [
    "WooCommerce data",
    "All products, orders, plugins, admin remain untouched",
    "All products, orders, plugins, admin remain untouched ✓",
  ],
] as const;

export function LandingForBusiness() {
  return (
    <section className="border-b border-border/50 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <p
            className="text-xs tracking-[0.4em] uppercase font-medium mb-3"
            style={{ color: "var(--gold)" }}
          >
            For business & product owners
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Same WooCommerce. Far better performance.
          </h2>
          <p className="text-muted-foreground max-w-xl leading-relaxed mb-10 text-sm">
            You keep every product, every plugin, every order — your team keeps the WooCommerce admin
            they already know. The only thing that changes is what your customers experience.
          </p>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  <th className="text-left px-5 py-3 font-semibold text-xs tracking-wide uppercase text-muted-foreground w-[22%]">
                    Concern
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-xs tracking-wide uppercase text-muted-foreground w-[39%]">
                    Traditional WooCommerce
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-xs tracking-wide uppercase text-muted-foreground">
                    This storefront
                  </th>
                </tr>
              </thead>
              <tbody>
                {PERF_ROWS.map(([concern, before, after], i) => (
                  <tr key={concern} className={i % 2 === 0 ? "bg-background" : "bg-secondary/20"}>
                    <td className="px-5 py-3.5 font-medium text-foreground/80 align-top">{concern}</td>
                    <td className="px-5 py-3.5 text-muted-foreground align-top">{before}</td>
                    <td className="px-5 py-3.5 align-top">
                      <span className="flex items-start gap-2">
                        <Check
                          className="h-3.5 w-3.5 mt-0.5 shrink-0"
                          style={{ color: "var(--gold)" }}
                        />
                        {after}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
