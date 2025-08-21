import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone", // Tối ưu cho Docker

  // SEO và Performance optimizations
  poweredByHeader: false, // Ẩn header "X-Powered-By: Next.js"
  generateEtags: true, // Tạo ETags cho caching
  compress: true, // Bật gzip compression

  // Image optimization
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/webp", "image/avif"], // Tối ưu format ảnh
    minimumCacheTTL: 60 * 60 * 24 * 30, // Cache ảnh 30 ngày
  },

  // Headers cho SEO và Security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Content-Type",
            value: "application/xml",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Content-Type",
            value: "text/plain",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
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
