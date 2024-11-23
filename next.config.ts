import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true, // Optional, enables React Strict Mode
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true, // Ignore TypeScript errors during the build
    },
};

export default nextConfig;