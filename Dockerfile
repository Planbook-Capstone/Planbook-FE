# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Cài đặt dependencies cần thiết cho Alpine Linux
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

# Copy package files
COPY package.json package-lock.json ./

# Cài đặt dependencies với retry và tối ưu hóa
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 5 && \
    npm ci --ignore-scripts --no-audit --no-fund && \
    npm cache clean --force

# Copy source code và config files
COPY src ./src
COPY public ./public
COPY *.config.* ./
COPY tsconfig.json ./

# Build args để pass environment variables vào build time
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_SECONDARY_URL
ARG NEXT_PUBLIC_WEBSOCKET_URL
ARG NEXT_PUBLIC_REDIRECT_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Set environment variables for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_SECONDARY_URL=$NEXT_PUBLIC_API_SECONDARY_URL
ENV NEXT_PUBLIC_WEBSOCKET_URL=$NEXT_PUBLIC_WEBSOCKET_URL
ENV NEXT_PUBLIC_REDIRECT_URL=$NEXT_PUBLIC_REDIRECT_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# Build ứng dụng
RUN npm run build:no-prisma

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

# Tạo user non-root
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Cài đặt runtime dependencies
RUN apk add --no-cache libc6-compat curl

# Không cần cài đặt dependencies nữa vì dùng standalone

# Copy standalone build (không cần node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public


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

# Start application (standalone không cần npm)
CMD ["node", "server.js"]



