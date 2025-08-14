/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bỏ qua Prisma generate nếu có biến môi trường SKIP_PRISMA
  webpack: (config, { isServer }) => {
    if (process.env.SKIP_PRISMA === 'true') {
      // Bỏ qua các module liên quan đến Prisma
      config.externals = config.externals || [];
      if (isServer) {
        config.externals.push('@prisma/client');
      }
    }
    return config;
  },
};

module.exports = nextConfig;
