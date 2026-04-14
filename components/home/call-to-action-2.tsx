import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

export default function CallToAction() {
    return (
        <section className="bg-background @container py-24">
            <div className="mx-auto max-w-2xl px-6">
                <Card
                    variant="outline"
                    className="p-8 md:p-12">
                    <div className="text-muted-foreground mb-6 text-sm font-medium">Open Source</div>
                    <h2 className="text-balance font-serif text-3xl font-medium md:text-4xl">Ready to Go Headless?</h2>
                    <p className="text-muted-foreground mt-4 max-w-md text-balance">Clone the repository, configure your WooCommerce and Stripe credentials, and have a production-ready storefront running in minutes.</p>
                    <Link
                        href="https://github.com/vakulkin/nextjs-woocommerce"
                        className={cn(buttonVariants({ size: 'default' }), 'mt-8 gap-2 inline-flex')}
                    >
                        View on GitHub <ArrowRight className="size-4" />
                    </Link>
                </Card>
            </div>
        </section>
    )
}
