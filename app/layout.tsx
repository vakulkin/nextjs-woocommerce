import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { CartStoreInitializer } from "@/components/cart-store-initializer";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import GoogleTagManagerLoader from "@/components/GoogleTagManager";
import { WebVitals } from "@/components/WebVitals";
import { PageView } from "@/components/PageView";
import { JsonLdScript } from "@/components/ui/json-ld-script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://luxuryaroma.com"
  ),
  title: {
    default: "LuxuryAroma — Premium Fragrances",
    template: "%s | LuxuryAroma",
  },
  description:
    "Discover premium fragrances crafted for the discerning connoisseur at LuxuryAroma.",
  openGraph: {
    type: "website",
    siteName: "LuxuryAroma",
    locale: "en_US",
    title: {
      default: "LuxuryAroma — Premium Fragrances",
      template: "%s | LuxuryAroma",
    },
    description:
      "Discover premium fragrances crafted for the discerning connoisseur at LuxuryAroma.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@luxuryaroma",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      {/* Initialize window.dataLayer before any client component mounts so
          sendGTMEvent calls are never lost, even before GTM script loads. */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: "window.dataLayer=window.dataLayer||[];" }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartStoreInitializer />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
            {/* GTM via @next/third-parties — loads after hydration */}
            <GoogleTagManagerLoader />
            <WebVitals />
            <Suspense>
              <PageView />
            </Suspense>
            <JsonLdScript
              data={{
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "LuxuryAroma",
                url: process.env.NEXT_PUBLIC_SITE_URL ?? "",
                description: "Premium fragrances crafted for the discerning connoisseur.",
              }}
            />
        </ThemeProvider>
      </body>
    </html>
  );
}
