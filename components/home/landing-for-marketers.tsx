const GA4_EVENTS = [
  ["view_item_list", "Shop / category page loads"],
  ["select_item", "User clicks a product card"],
  ["view_item", "Product detail page loads"],
  ["add_to_cart", "Item added to cart"],
  ["remove_from_cart", "Item removed from cart"],
  ["add_to_wishlist", "Item saved to wishlist"],
  ["view_cart", "Cart page or cart drawer opens"],
  ["begin_checkout", "Checkout page loads"],
  ["add_shipping_info", "Shipping method selected"],
  ["add_payment_info", "Payment method selected"],
  ["purchase", "Order confirmation page loads"],
] as const;

const GTM_HIGHLIGHTS = [
  {
    emoji: "📦",
    title: "Single GTM container ID",
    body: "One env variable controls all tags. Swap or add pixels — Facebook, TikTok, anything — with zero code changes.",
  },
  {
    emoji: "⚡",
    title: "dataLayer in <head>",
    body: "Initialised before GTM loads, so zero events are lost during the GTM bootstrap.",
  },
  {
    emoji: "📊",
    title: "Core Web Vitals to GA4",
    body: "LCP, CLS, INP, TTFB, and FCP as GTM events — segment by device or geography in Looker Studio.",
  },
  {
    emoji: "🛒",
    title: "Accurate purchase attribution",
    body: "Stripe sessions carry the WC order ID. The confirmation page fires purchase with correct revenue, tax, and shipping.",
  },
];

export function LandingForMarketers() {
  return (
    <section className="border-b border-border/50 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <p
            className="text-xs tracking-[0.4em] uppercase font-medium mb-3"
            style={{ color: "var(--gold)" }}
          >
            For digital marketers & analysts
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Full-funnel analytics.<br />Zero setup.
          </h2>
          <p className="text-muted-foreground max-w-xl leading-relaxed mb-10 text-sm">
            Every GA4 Enhanced Ecommerce event is implemented correctly and fires with the full{" "}
            <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">ecommerce</code>{" "}
            object — item IDs, names, prices, quantities, and transaction context. Most stores miss
            half the funnel. This one does not.
          </p>

          <div className="grid md:grid-cols-[1fr_1.4fr] gap-8 items-start">
            <div className="space-y-5">
              {GTM_HIGHLIGHTS.map(({ emoji, title, body }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="text-xl leading-none mt-0.5">{emoji}</span>
                  <div>
                    <p className="font-semibold text-sm mb-1">{title}</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/40">
                    <th className="text-left px-4 py-3 font-semibold text-xs tracking-wide uppercase text-muted-foreground">
                      GA4 event
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-xs tracking-wide uppercase text-muted-foreground">
                      When it fires
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {GA4_EVENTS.map(([event, when], i) => (
                    <tr key={event} className={i % 2 === 0 ? "bg-background" : "bg-secondary/20"}>
                      <td className="px-4 py-2.5 font-mono text-xs text-foreground/80">{event}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{when}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
