import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true, // Optional, enables React Strict Mode
    compiler: {
        styledComponents: {
            displayName: true, // Useful for debugging in development
            ssr: true, // Enables server-side rendering
            fileName: true, // Includes filenames in classnames
            topLevelImportPaths: [], // Add custom paths if necessary
            meaninglessFileNames: ["index"], // Default meaningless file names
            minify: true, // Minify output
            transpileTemplateLiterals: true, // Improves performance
            namespace: "my-app", // Adds a namespace to classnames
            pure: true, // Removes side-effect-free methods
            cssProp: true, // Enables `css` prop for styled-component
        },
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true, // Ignore TypeScript errors during the build
    },
};

export default nextConfig;