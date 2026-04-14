import React from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'

const tableData = [
    {
        feature: 'Catalogue & Search',
        items: [
            {
                feature: 'Product catalogue with filtering & sorting',
                text: 'Filter, sort, and paginate products using the WooCommerce Store API with ISR-backed pages.',
                status: true,
            },
            {
                feature: 'Full-text search',
                text: 'Search across titles, descriptions, and SKUs with instant client-side results.',
                status: true,
            },
            {
                feature: 'Variable products (size, colour, etc.)',
                text: 'Variation resolution at the Next.js layer using Store API data; no theme changes required.',
                status: true,
            },
        ],
    },
    {
        feature: 'Shopping Experience',
        items: [
            {
                feature: 'Wishlist',
                text: 'Save favourites across sessions using client state and guest cart session nonces.',
                status: true,
            },
            {
                feature: 'Slide-out cart drawer',
                text: 'Fast add-to-cart UI with an in-page cart preview that doesn\'t interrupt browsing.',
                status: true,
            },
            {
                feature: 'Multi-step checkout',
                text: 'Guided shipping and payment steps implemented with Server Actions for secure server-side work.',
                status: true,
            },
            {
                feature: 'Live shipping rate calculation',
                text: 'Fetch real-time shipping methods and costs from WooCommerce during checkout.',
                status: true,
            },
        ],
    },
    {
        feature: 'Payments & Orders',
        items: [
            {
                feature: 'Stripe payment processing',
                text: 'Hosted Stripe Checkout with webhook order sync to ensure reliable payment confirmation.',
                status: true,
            },
            {
                feature: 'Cash on delivery / other WC payment methods',
                text: 'Supports WooCommerce-native payment methods alongside Stripe for flexibility.',
                status: true,
            },
            {
                feature: 'Order confirmation page',
                text: 'Detailed order summary and a GA4 purchase event fired on confirmation for accurate attribution.',
                status: true,
            },
        ],
    },
    {
        feature: 'Performance & SEO',
        items: [
            {
                feature: 'Dark / light mode',
                text: 'User-selectable themes with persistence and accessible defaults.',
                status: true,
            },
            {
                feature: 'Mobile-first responsive design',
                text: 'Optimised layout and images for mobile devices, prioritising Core Web Vitals.',
                status: true,
            },
            {
                feature: 'Schema.org structured data (SEO)',
                text: 'JSON-LD product and website schema included to improve search visibility and rich results.',
                status: true,
            },
        ],
    },
]

export default function PricingComparator() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center mb-12">
                    <h2 className="text-balance text-3xl font-semibold md:text-4xl">Everything included, nothing held back</h2>
                    <p className="text-muted-foreground mt-4">Every feature you need to run a production storefront — out of the box.</p>
                </div>
                <div className="w-full overflow-auto lg:overflow-visible">
                    <table className="w-[200vw] border-separate border-spacing-x-3 md:w-full dark:[--color-muted:var(--color-zinc-900)]">
                        <thead className="bg-background sticky top-0">
                            <tr className="*:py-4 *:text-left *:font-medium">
                                <th className="lg:w-2/5"><span className="text-base font-medium">Feature Set</span></th>
                                <th className="bg-muted rounded-t-(--radius) space-y-3 px-4">
                                    <span className="block">Included</span>
                                    <Button size="sm" render={<Link href="/shop" />} nativeButton={false}>Explore Demo</Button>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-caption text-sm">
                            {tableData.map((category, cIndex) => (
                                <React.Fragment key={`cat-${cIndex}`}>
                                    <tr className="*:pb-3 *:pt-8">
                                        <td className="flex items-center gap-2 font-medium">
                                            <Sparkles className="size-4" />
                                            <span>{category.feature}</span>
                                        </td>
                                        <td className="bg-muted border-none px-4"></td>
                                    </tr>

                                    {category.items.map((item, iIndex) => (
                                        <tr key={`item-${cIndex}-${iIndex}`} className="*:border-b *:py-3">
                                            <td className="text-muted-foreground align-top">
                                                <div className="font-medium">{item.feature}</div>
                                            </td>
                                            <td className="bg-muted border-none px-4">
                                                <div className="-mb-3 border-b py-3 flex items-center gap-3">
                                                    {item.status === true ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            className="size-4">
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    ) : item.status === false ? (
                                                        <span className="text-destructive">✕</span>
                                                    ) : (
                                                        <span className="text-muted-foreground">—</span>
                                                    )}

                                                    {item.text && <span className="text-sm">{item.text}</span>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                            <tr className="*:py-6">
                                <td></td>
                                <td className="bg-muted rounded-b-(--radius) border-none px-4"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}
