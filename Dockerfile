# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Cài đặt dependencies cần thiết
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm ci --timeout=600000 --maxsockets=3 --prefer-offline \
    && npm cache clean --force

# Copy source code và config files
COPY src ./src
COPY public ./public
COPY next.config.* ./
COPY tailwind.config.* ./
COPY postcss.config.* ./
COPY tsconfig.json ./
COPY components.json ./

# Build ứng dụng (skip Prisma để tăng tốc)
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build:no-prisma:no-prisma

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

# Tạo user non-root
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Cài đặt runtime dependencies
RUN apk add --no-cache libc6-compat curl

# Copy package.json và cài đặt production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production --timeout=300000 --prefer-offline \
    && npm cache clean --force

# Copy build artifacts và Prisma schema
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.* ./
COPY --chown=nextjs:nodejs src/prisma ./src/prisma

# Generate Prisma client cho production


# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Start application
CMD ["npm", "run", "start"]







