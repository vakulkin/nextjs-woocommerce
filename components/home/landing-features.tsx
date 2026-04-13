import { Check } from "lucide-react";

const FEATURES = [
  "Product catalogue with filtering & sorting",
  "Full-text search",
  "Variable products (size, colour, etc.)",
  "Wishlist",
  "Slide-out cart drawer",
  "Multi-step checkout",
  "Live shipping rate calculation",
  "Stripe payment processing",
  "Cash on delivery / other WC methods",
  "Order confirmation page",
  "Dark / light mode",
  "Mobile-first responsive design",
  "Schema.org structured data (SEO)",
  "ISR + SSG pre-rendering",
  "WebP / AVIF image optimisation",
  "Core Web Vitals reporting to GA4",
];

export function LandingFeatures() {
  return (
    <section className="border-b border-border/50 py-16 md:py-24 bg-secondary/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <p
            className="text-xs tracking-[0.4em] uppercase font-medium mb-3"
            style={{ color: "var(--gold)" }}
          >
            What&apos;s included
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">
            Everything, out of the box.
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            No plugins to configure, no integrations to wire up.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {FEATURES.map((feature) => (
            <div
              key={feature}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-sm"
            >
              <span
                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: "color-mix(in oklch, var(--gold-light) 40%, transparent)",
                }}
              >
                <Check className="h-2.5 w-2.5" style={{ color: "var(--gold)" }} />
              </span>
              <span className="leading-snug text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
