import { Card } from '@/components/ui/defaultcard'
import { BarChart3, CreditCard, Database, ShieldCheck, ShoppingCart, Code2 } from 'lucide-react'
import * as React from 'react'

export default function IntegrationsSection() {
    return (
        <section>
            <div className="py-32">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="text-center">
                        <h2 className="text-balance text-3xl font-semibold md:text-4xl">Built on the tools you already trust</h2>
                        <p className="text-muted-foreground mt-6">The stack is intentionally boring — proven, well-documented, and easy to hand off to any developer.</p>
                    </div>

                    <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <IntegrationCard
                            icon={<Code2 className="size-10" />}
                            title="Next.js 16"
                            description="App Router, React Server Components, Server Actions, ISR, and edge-ready deployment out of the box."
                        />

                        <IntegrationCard
                            icon={<ShoppingCart className="size-10" />}
                            title="WooCommerce"
                            description="All product, cart, order, and shipping data via the WooCommerce Store API. No theme or page-builder dependency."
                        />

                        <IntegrationCard
                            icon={<CreditCard className="size-10" />}
                            title="Stripe"
                            description="PCI-compliant hosted checkout with 3D Secure, plus webhook-driven order sync back to WooCommerce."
                        />

                        <IntegrationCard
                            icon={<BarChart3 className="size-10" />}
                            title="Google Analytics 4"
                            description="Full Enhanced Ecommerce implementation via GTM — all 11 funnel events with a complete itemized dataLayer."
                        />

                        <IntegrationCard
                            icon={<Database className="size-10" />}
                            title="Zustand"
                            description="Lightweight client state for cart, checkout flow, and wishlist with nonce-based guest session sync."
                        />

                        <IntegrationCard
                            icon={<ShieldCheck className="size-10" />}
                            title="Zod"
                            description="Runtime schema validation at every Server Action boundary — safe against malformed API responses."
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

const IntegrationCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => {
    return (
        <Card className="p-6">
            <div className="relative">
                <div className="text-muted-foreground">{icon}</div>

                <div className="space-y-2 py-6">
                    <h3 className="text-base font-medium">{title}</h3>
                    <p className="text-muted-foreground text-sm">{description}</p>
                </div>
            </div>
        </Card>
    )
}
