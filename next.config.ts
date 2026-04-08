import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: (process.env.NEXT_PUBLIC_WOOCOMMERCE_PROTCOL as "http" | "https") || "https",
        hostname: "" + process.env.NEXT_PUBLIC_WOOCOMMERCE_HOST,
      },
    ],
    // Skip image optimization for local development (private IP)
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
