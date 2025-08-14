# Stage 1: Dependencies
FROM node:20-alpine AS deps

WORKDIR /app

# Cài đặt các dependencies cần thiết cho build
RUN apk add --no-cache libc6-compat

# Sao chép package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt tất cả dependencies với tối ưu hóa
RUN npm ci --timeout=600000 --maxsockets=3 --prefer-offline \
    && npm cache clean --force

# Stage 2: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Cài đặt dependencies cần thiết
RUN apk add --no-cache libc6-compat

# Copy dependencies từ stage trước
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./

# Sao chép Prisma schema trước
COPY src/prisma ./src/prisma

# Generate Prisma client
RUN npx prisma generate

# Sao chép source code (chỉ những gì cần thiết)
COPY src ./src
COPY public ./public
COPY next.config.* ./
COPY tailwind.config.* ./
COPY postcss.config.* ./
COPY tsconfig.json ./
COPY components.json ./

# Build ứng dụng với tối ưu hóa
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build \
    && rm -rf .next/cache \
    && rm -rf node_modules/.cache

# Stage 3: Production
FROM node:20-alpine AS runner

WORKDIR /app

# Tạo user non-root cho security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Cài đặt các dependencies cần thiết
RUN apk add --no-cache libc6-compat curl dumb-init

# Copy package.json để cài đặt production dependencies
COPY package.json package-lock.json ./

# Chỉ cài đặt production dependencies
RUN npm ci --only=production --timeout=600000 --maxsockets=3 --prefer-offline \
    && npm cache clean --force

# Sao chép Prisma schema và generate client
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

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check đơn giản
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Start ứng dụng
CMD ["npm", "run", "start"]







