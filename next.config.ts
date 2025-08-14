import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Handle Node.js modules for client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        https: false,
        http: false,
        stream: false,
        crypto: false,
        os: false,
        path: false,
        buffer: false,
        util: false,
        url: false,
        querystring: false,
      };
    }

    // Handle pptxgenjs specifically
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push({
        "node:fs": "commonjs fs",
        "node:https": "commonjs https",
        "node:http": "commonjs http",
        "node:stream": "commonjs stream",
        "node:crypto": "commonjs crypto",
        "node:os": "commonjs os",
        "node:path": "commonjs path",
        "node:buffer": "commonjs buffer",
        "node:util": "commonjs util",
        "node:url": "commonjs url",
        "node:querystring": "commonjs querystring",
      });
    }

    return config;
  },
};

export default nextConfig;
