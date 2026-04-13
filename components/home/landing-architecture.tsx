import { cn } from "@/lib/utils";
import { Database, Layers, CreditCard } from "lucide-react";

const LAYERS = [
  {
    icon: Database,
    label: "WooCommerce",
    sublabel: "Your data & admin",
    items: [
      "Products & inventory",
      "Orders & fulfilment",
      "Shipping rates",
      "All your existing plugins",
    ],
    note: "Nothing changes — stays exactly where it is",
    highlight: false,
  },
  {
    icon: Layers,
    label: "Next.js 16",
    sublabel: "The new frontend",
    items: [
      "React Server Components",
      "ISR / SSG pre-rendering",
      "Server Actions for mutations",
      "Global CDN delivery",
    ],
    note: "This template replaces your WordPress theme",
    highlight: true,
  },
  {
    icon: CreditCard,
    label: "Stripe Checkout",
    sublabel: "Payments",
    items: [
      "PCI-compliant hosted checkout",
      "3D Secure support",
      "Webhook → WC order sync",
      "Test mode ready",
    ],
    note: "Trusted checkout experience for customers",
    highlight: false,
  },
] as const;

export function LandingArchitecture() {
  return (
    <section className="border-b border-border/50 py-16 md:py-24 bg-secondary/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.4em] uppercase font-medium mb-3" style={{ color: "var(--gold)" }}>
            Architecture
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            How it fits together
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
            Three focused layers — each doing one job well, none duplicating the other.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {LAYERS.map(({ icon: Icon, label, sublabel, items, note, highlight }) => (
            <div
              key={label}
              className={cn(
                "relative rounded-xl border p-6",
                highlight
                  ? "border-[var(--gold)]/40 bg-[var(--gold-light)]/10 shadow-sm"
                  : "border-border bg-card"
              )}
            >
              {highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                    style={{ background: "var(--gold)" }}
                  >
                    This template
                  </span>
                </div>
              )}

              <div
                className="flex h-10 w-10 items-center justify-center rounded-full mb-4"
                style={{ background: "color-mix(in oklch, var(--gold-light) 30%, transparent)" }}
              >
                <Icon className="h-5 w-5" style={{ color: "var(--gold)" }} />
              </div>

              <p className="font-heading font-bold text-lg mb-0.5">{label}</p>
              <p className="text-xs text-muted-foreground mb-4">{sublabel}</p>

              <ul className="space-y-2 text-sm mb-4">
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-muted-foreground">
                    <span
                      className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ background: "var(--gold)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <p
                className="text-xs font-medium mt-4 pt-4 border-t border-border/50"
                style={{ color: "var(--gold-muted)" }}
              >
                {note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
