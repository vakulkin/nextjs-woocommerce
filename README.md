# Headless WooCommerce Storefront · Next.js 16

> A production-grade, headless e-commerce storefront that connects **Next.js** on the frontend to **WooCommerce** on the backend — delivering the performance and reliability of the world's most popular e-commerce engine.


---


## Table of Contents

- [What Is This?](#what-is-this)
- [For Business & Product Owners](#for-business--product-owners)
- [For Digital Marketers & Analysts](#for-digital-marketers--analysts)
- [For Developers & WooCommerce Specialists](#for-developers--woocommerce-specialists)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)

---

## What Is This?

This is a **headless WooCommerce storefront** — WooCommerce runs silently in the background managing products, inventory, orders, and shipping, while Next.js powers the entire customer experience: browsing, search, cart, checkout, and order confirmation.

The result: a fast, modern shopping experience without abandoning the WooCommerce ecosystem your team already knows.

**Key capabilities at a glance:**

| Feature | Implementation |
|---|---|
| Product catalog & search | WooCommerce Store API + ISR |
| Cart & checkout | Zustand + Server Actions + WC Store API |
| Payments | Stripe Checkout + webhook order sync |
| Analytics | Full GA4 Enhanced Ecommerce via GTM |
| Performance | React, ISR, SSG, Next/Image, Web Vitals |
| Testing | Jest + React Testing Library |
| Type safety | TypeScript + Zod |


## For Developers & WooCommerce Specialists

This project is a modern, headless WooCommerce storefront built with Next.js. It uses React Server Components for product and shop pages, Server Actions for all cart and checkout mutations, and Zustand for state management (cart, checkout, wishlist). All WooCommerce API credentials and Stripe keys remain server-side for security.

**Key technical highlights:**
- WooCommerce Store API for all product, cart, and checkout operations
- Stripe Checkout integration with webhook order status sync
- Custom nonce/session handling for guest carts
- Full GA4 Enhanced Ecommerce analytics via GTM
- Zod validation at all server boundaries
- No WordPress theme or page builder dependencies; WordPress is only the data/admin layer

**Stack:** Next.js, React, Zustand, Zod, Stripe, Jest, Tailwind CSS, TypeScript, WooCommerce

**Required WordPress plugins:** WooCommerce

**Variable products:** Resolved at the Next.js layer, no theme customization needed

**Testing:** Jest + React Testing Library

---

## For Business & Product Owners

### Why Headless WooCommerce?

Traditional WooCommerce stores serve every page from PHP — the database query, the HTML render, and the asset delivery all happen on the same server for every visitor. Under load, this creates bottlenecks, and performance degrades directly.

This architecture separates the concerns:

| Concern | Handled by | Benefit |
|---|---|---|
| Product & order data | WooCommerce / WordPress | Familiar admin, existing plugins, no data migration |
| Page delivery | Next.js on CDN edge | Pages served in milliseconds, globally |
| Checkout & payments | Stripe Checkout | PCI-compliant, trusted by customers, handles 3DS |
| Analytics | GTM + GA4 | Full funnel data, no third-party plugin needed |

### Performance at a Glance

- Most product pages are pre-rendered and served from the CDN — **no server round-trip for the first load**
- Images are automatically resized, converted to WebP/AVIF, and lazy-loaded via `next/image`
- Fonts are self-hosted with subsetting to eliminate layout shift (CLS = 0)
- Core Web Vitals (LCP, CLS, INP) are measured in real sessions and reported to your GA4 property automatically

### Feature Set

| Feature | Status |
|---|---|
| Product catalogue with filtering & sorting | ✅ |
| Full-text search | ✅ |
| Variable products (size, colour, etc.) | ✅ |
| Wishlist | ✅ |
| Slide-out cart drawer | ✅ |
| Multi-step checkout | ✅ |
| Live shipping rate calculation | ✅ |
| Stripe payment processing | ✅ |
| Cash on delivery / other WC payment methods | ✅ |
| Order confirmation page | ✅ |
| Dark / light mode | ✅ |
| Mobile-first responsive design | ✅ |
| Schema.org structured data (SEO) | ✅ |

### Scalability

The storefront is **stateless** — it holds no user data itself. You can run as many instances as needed behind a load balancer. WooCommerce handles inventory and order state. Stripe handles payment state. The frontend scales horizontally with zero configuration.

---

## For Digital Marketers & Analysts

This storefront ships with a **complete GA4 Enhanced Ecommerce implementation out of the box** — most e-commerce sites miss half the funnel events or implement them incorrectly. This one does not.

### Events Implemented

| GA4 Event | When it fires |
|---|---|
| `view_item_list` | Shop/category page loads |
| `select_item` | User clicks a product card |
| `view_item` | Product detail page loads |
| `add_to_cart` | Item added to cart |
| `remove_from_cart` | Item removed from cart |
| `add_to_wishlist` | Item added to wishlist |
| `view_cart` | Cart page / cart drawer opens |
| `begin_checkout` | Checkout page loads |
| `add_shipping_info` | Shipping method selected |
| `add_payment_info` | Payment method selected |
| `purchase` | Order confirmation page loads |

Every event includes the full `ecommerce` object: item IDs, names, categories, prices, quantities, currency, and the appropriate transaction/list context.

### GTM Integration

- A single GTM container ID in `.env` controls all tracking — no code changes needed to swap tags or add pixels
- The `dataLayer` is initialized in `<head>` before GTM loads, so **zero events are lost** during the GTM bootstrap
- Adding Facebook Pixel, TikTok Pixel, or any other tag is purely a GTM configuration task — no developer involvement needed
- Server-side GTM can be configured by pointing the GTM loader script to your sGTM endpoint

### Web Vitals Reporting

Every real user session reports LCP, CLS, INP, TTFB, and FCP as GTM events. This means you can **segment Core Web Vitals by device, geography, or traffic source** directly in GA4 or Looker Studio — no additional tooling needed.

### Remarketing & Attribution

Stripe checkout sessions carry the WooCommerce order ID in metadata, and the WooCommerce order confirmation page fires the GA4 `purchase` event with the correct revenue, tax, and shipping values — giving your attribution models accurate data.

---


## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 10+
- A running WordPress + WooCommerce instance (local or remote)
- Stripe account (test mode is fine)

### 1. Clone & install

```bash
git clone https://github.com/antonvakulov/nextjs-woocommerce.git
cd nextjs-woocommerce
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` — see [Environment Variables](#environment-variables) below.

### 3. Run in development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Run tests

```bash
pnpm test
```

---

## Environment Variables

```env
# WordPress / WooCommerce
NEXT_PUBLIC_WORDPRESS_URL=https://your-wp-site.com
WC_CONSUMER_KEY=ck_...
WC_CONSUMER_SECRET=cs_...

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Analytics
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
