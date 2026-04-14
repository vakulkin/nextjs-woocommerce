// import { Spotify } from '@/components/ui/svgs/spotify'
// import { SupabaseFull } from '@/components/ui/svgs/supabase'
// import { Hulu } from '@/components/ui/svgs/hulu'
// import { FirebaseFull } from '@/components/ui/svgs/firebase'
// import { Beacon } from '@/components/ui/svgs/beacon'
// import { Bolt } from '@/components/ui/svgs/bolt'
// import { Claude } from '@/components/ui/svgs/claude'
// import { Figma } from '@/components/ui/svgs/figma'
// import { VercelFull } from '@/components/ui/svgs/vercel'
// import { Cisco } from '@/components/ui/svgs/cisco'

export default function LogoCloud() {
    const stack = [
        'Next.js',
        'WooCommerce',
        'Stripe',
        'TypeScript',
        'Zustand',
        'Zod',
        'Tailwind CSS',
        'Jest',
        'Google Analytics 4',
        'GTM',
    ]

    return (
        <section className="bg-background py-16">
            <div className="mx-auto max-w-5xl px-6">
                <h2 className="text-center text-lg font-medium">Built with the tools developers already rely on.</h2>
                <div className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-5">
                    {stack.map((name) => (
                        <span
                            key={name}
                            className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                            {name}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    )
}
