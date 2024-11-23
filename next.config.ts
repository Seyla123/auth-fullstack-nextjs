import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:slug*',
        destination: '/api/:slug*', // Make sure this is targeting your Next.js API routes
      },
    ]
  },
};

export default nextConfig;
