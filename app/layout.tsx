import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { CartStoreInitializer } from "@/components/cart-store-initializer";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import GoogleTagManagerLoader from "@/components/analytics/google-tag-manager";
import { WebVitals } from "@/components/analytics/web-vitals";
import { JsonLdScript } from "@/components/analytics/json-ld-script";
import { t } from "@/lib/i18n";
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
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  title: {
    default: t('brand.name'),
    template: "%s | " + t('brand.name'),
  },
  description:
    t('brand.description'),
  openGraph: {
    type: "website",
    siteName: t('brand.name'),
    locale: "en_US",
    title: {
      default: t('brand.name') + " — " + t('brand.tagline'),
      template: "%s | " + t('brand.name'),
    },
    description:
      t('brand.description')
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={t('lang')}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,l){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});})(window,'dataLayer');`,
            }}
          />
        )}
        <GoogleTagManagerLoader />
        <WebVitals />
        <JsonLdScript
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: t('brand.name'),
            url: process.env.NEXT_PUBLIC_SITE_URL ?? "",
            description: t('brand.description'),
          }}
        />
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
        </ThemeProvider>
      </body>
    </html>
  );
}
