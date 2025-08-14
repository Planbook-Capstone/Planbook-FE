# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Cài đặt các dependencies cần thiết cho build
RUN apk add --no-cache libc6-compat

# Sao chép package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt dependencies với timeout và retry
RUN npm ci --only=production=false --timeout=300000 --maxsockets=1 \
    && npm cache clean --force

# Sao chép Prisma schema trước
COPY src/prisma ./src/prisma

# Generate Prisma client
RUN npx prisma generate

# Sao chép source code (chỉ những gì cần thiết)
COPY src ./src
COPY public ./public
COPY next.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY tsconfig.json ./
COPY components.json ./

# Build ứng dụng với skip Prisma để tránh generate lại
RUN npm run build:no-prisma \
    && rm -rf node_modules

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Tạo user non-root cho security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Cài đặt các dependencies cần thiết
RUN apk add --no-cache libc6-compat curl

# Sao chép package.json và package-lock.json
COPY package.json package-lock.json ./

# Chỉ cài đặt dependencies cho production
RUN npm ci --only=production --timeout=300000 --maxsockets=1 \
    && npm cache clean --force

# Sao chép Prisma schema và generate client cho production
COPY src/prisma ./src/prisma
RUN npx prisma generate

# Sao chép build artifacts từ stage trước
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.* ./

# Chuyển sang user non-root
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Start ứng dụng
CMD ["npm", "run", "start"]







