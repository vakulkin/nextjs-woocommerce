'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Code2, HelpCircle, LineChart } from 'lucide-react'

const faqCategories = [
    {
        title: 'Getting Started',
        icon: HelpCircle,
        items: [
            {
                id: 'gs-1',
                question: 'What is headless WooCommerce?',
                answer: 'WooCommerce runs silently in the background managing products, inventory, and orders, while Next.js delivers the entire customer-facing storefront. Your existing WooCommerce admin, plugins, and data stay in place — you\'re only replacing the PHP theme.',
            },
            {
                id: 'gs-2',
                question: 'Do I need to replace my WooCommerce store?',
                answer: 'No. Your existing WooCommerce admin, product catalogue, and order history are untouched. This frontend connects to WooCommerce via the Store API.',
            },
            {
                id: 'gs-3',
                question: 'What WordPress plugins are required?',
                answer: 'Only WooCommerce itself. The storefront uses the built-in WooCommerce Store API, so no extra REST API plugins are needed.',
            },
        ],
    },
    {
        title: 'Technical',
        icon: Code2,
        items: [
            {
                id: 't-1',
                question: 'How are Stripe and WooCommerce credentials kept secure?',
                answer: 'All API keys are server-side environment variables and never included in the client bundle. The Next.js layer acts as a proxy — the browser never touches WooCommerce or Stripe credentials directly.',
            },
            {
                id: 't-2',
                question: 'How does cart state work for guest shoppers?',
                answer: 'The WooCommerce Store API issues a nonce per cart session. The Next.js app stores this nonce server-side and includes it in every cart mutation, enabling persistent guest carts without authentication.',
            },
            {
                id: 't-3',
                question: 'How are variable products handled?',
                answer: 'Variation resolution happens at the Next.js layer using data from the WooCommerce Store API. No WordPress theme customisation is needed.',
            },
        ],
    },
    {
        title: 'Analytics',
        icon: LineChart,
        items: [
            {
                id: 'a-1',
                question: 'What GA4 events are tracked out of the box?',
                answer: 'All 11 GA4 Enhanced Ecommerce events: view_item_list, select_item, view_item, add_to_cart, remove_from_cart, add_to_wishlist, view_cart, begin_checkout, add_shipping_info, add_payment_info, and purchase — each with a full itemized ecommerce object.',
            },
            {
                id: 'a-2',
                question: 'Do I need a developer to add tracking pixels?',
                answer: 'No. Add Facebook Pixel, TikTok Pixel, or any other tag via GTM configuration — zero code changes required. The dataLayer is initialised before GTM loads, so no events are lost during bootstrap.',
            },
        ],
    },
]

export default function FAQs() {
    return (
        <section className="bg-background @container py-24">
            <div className="mx-auto max-w-2xl px-6">
                <div className="text-center">
                    <h2 className="text-balance font-serif text-4xl font-medium">Common Questions</h2>
                    <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">Everything you need to know about going headless with WooCommerce.</p>
                </div>
                <div className="mt-12 space-y-3">
                    {faqCategories.map((category) => (
                        <Card
                            key={category.title}
                            variant="outline"
                            className="p-5">
                            <div className="mb-4 flex items-center gap-2">
                                <category.icon className="text-muted-foreground size-4" />
                                <h3 className="text-foreground font-medium">{category.title}</h3>
                            </div>
                            <Accordion>
                                {category.items.map((item) => (
                                    <AccordionItem
                                        key={item.id}
                                        value={item.id}
                                        className="border-dashed last:border-b-0">
                                        <AccordionTrigger className="cursor-pointer py-3 text-sm font-medium hover:no-underline">{item.question}</AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-muted-foreground pb-1 text-sm">{item.answer}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </Card>
                    ))}
                </div>
                <p className="text-muted-foreground mt-8 text-center text-sm">
                    Have more questions?{' '}
                    <Link
                        href="https://github.com/vakulkin/nextjs-woocommerce"
                        className="text-primary font-medium hover:underline">
                        View the README on GitHub
                    </Link>
                </p>
            </div>
        </section>
    )
}
