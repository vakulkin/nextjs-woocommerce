import { CreditCard, Fingerprint, MonitorSmartphone, Server, ShoppingCart, Zap } from 'lucide-react'

export default function Features() {
    return (
        <section className="relative overflow-hidden py-12 md:py-20 mt-24">
            {/* Decorative background blobs */}
            <div className="pointer-events-none -z-10 absolute inset-0 aria-hidden">
                <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/4 h-[420px] w-[900px] bg-gradient-to-r from-[var(--gold-light)]/30 via-purple-300/20 to-transparent opacity-80 blur-3xl rounded-full" />
                <div className="absolute right-0 bottom-0 h-[360px] w-[640px] bg-gradient-to-l from-secondary/30 to-transparent opacity-60 blur-2xl rounded-full" />
            </div>

            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-balance text-4xl font-medium lg:text-5xl">Everything a headless storefront needs</h2>
                    <p>React Server Components for product pages, Server Actions for cart mutations, Zustand for state — and WooCommerce stays unchanged.</p>
                </div>

                <div className="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4" />
                            <h3 className="text-sm font-medium">ISR &amp; Static Pages</h3>
                        </div>
                        <p className="text-sm">Product pages pre-rendered at build or on-demand; stale-while-revalidate keeps the catalog fresh.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="size-4" />
                            <h3 className="text-sm font-medium">WooCommerce Store API</h3>
                        </div>
                        <p className="text-sm">All product, cart, and checkout operations via the WC Store API — no theme or page-builder dependency.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Fingerprint className="size-4" />
                            <h3 className="text-sm font-medium">Server-Side Secrets</h3>
                        </div>
                        <p className="text-sm">Stripe and WooCommerce credentials stay server-side, never included in the client bundle.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Server className="size-4" />
                            <h3 className="text-sm font-medium">React Server Components</h3>
                        </div>
                        <p className="text-sm">Product and shop pages run as RSCs — zero client JS for product data fetching.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <CreditCard className="size-4" />
                            <h3 className="text-sm font-medium">Stripe Checkout</h3>
                        </div>
                        <p className="text-sm">PCI-compliant payments with the hosted checkout and automatic webhook order sync to WooCommerce.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <MonitorSmartphone className="size-4" />
                            <h3 className="text-sm font-medium">Mobile-First Design</h3>
                        </div>
                        <p className="text-sm">Responsive dark/light theme, Core Web Vitals optimised, with self-hosted fonts and next/image.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
