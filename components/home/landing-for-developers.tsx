const STACK = [
  ["Next.js 16", "App Router, RSC, Server Actions"],
  ["React", "Server & Client components"],
  ["TypeScript", "Strict, end-to-end"],
  ["Zustand", "Cart, checkout, wishlist state"],
  ["Zod", "Runtime validation at every boundary"],
  ["Tailwind CSS 4", "Utility-first, design tokens"],
  ["Stripe", "Checkout + webhook integration"],
  ["Jest + RTL", "Unit & component test suite"],
] as const;

const TECH_NOTES = [
  {
    title: "React Server Components throughout",
    body: "Product pages, shop pages, and related products are RSCs — no client JS shipped for read-only content.",
  },
  {
    title: "Server Actions for all mutations",
    body: "Cart add/remove, checkout submission, and coupon redemption use Server Actions — no REST API routes to maintain.",
  },
  {
    title: "Custom guest-cart session handling",
    body: "WooCommerce nonce / cart token managed server-side with httpOnly cookies. No credentials exposed to the browser.",
  },
  {
    title: "Zod at every server boundary",
    body: "All WooCommerce API responses and user inputs are parsed with Zod schemas before use. No silent runtime surprises.",
  },
];

const CODE = `# 1. Clone & install
git clone https://github.com/antonvakulov/nextjs-woocommerce.git
cd nextjs-woocommerce && pnpm install

# 2. Configure environment
cp .env.example .env.local
# → set NEXT_PUBLIC_WORDPRESS_URL, WC_CONSUMER_KEY/SECRET,
#   STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_GTM_ID

# 3. Run in development
pnpm dev        # http://localhost:3000

# 4. Run the test suite
pnpm test       # Jest + React Testing Library`;

export function LandingForDevelopers() {
  return (
    <section className="border-b border-border/50 py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase opacity-50 font-medium mb-3">
            For developers & WooCommerce specialists
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Modern stack. Zero compromise.
          </h2>
          <p className="opacity-70 max-w-xl leading-relaxed mb-10 text-sm">
            No WordPress theme. No page builder. WordPress is purely the data and admin layer — this
            template handles all rendering, routing, state, and payments.
          </p>

          {/* Stack grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {STACK.map(([tech, desc]) => (
              <div
                key={tech}
                className="rounded-lg border border-primary-foreground/15 bg-primary-foreground/5 p-4"
              >
                <p className="font-semibold text-sm mb-1">{tech}</p>
                <p className="text-xs opacity-60 leading-snug">{desc}</p>
              </div>
            ))}
          </div>

          {/* Technical highlights */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {TECH_NOTES.map(({ title, body }) => (
              <div
                key={title}
                className="rounded-lg border border-primary-foreground/10 bg-primary-foreground/5 p-4"
              >
                <p className="font-semibold text-sm mb-1">{title}</p>
                <p className="text-xs opacity-60 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          {/* Quick-start code */}
          <div className="rounded-xl overflow-hidden border border-primary-foreground/20">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-primary-foreground/15 bg-primary-foreground/5">
              <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground/20" />
              <span className="ml-2 text-xs opacity-50 font-mono">bash — quick start</span>
            </div>
            <pre className="p-5 text-xs font-mono leading-relaxed opacity-80 overflow-x-auto whitespace-pre">
              {CODE}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
