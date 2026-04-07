import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "luxuryaroma.local",
      },
    ],
    // Skip image optimization for local development (private IP)
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
