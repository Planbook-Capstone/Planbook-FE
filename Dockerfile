# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Cài đặt các dependencies cần thiết cho build
RUN apk add --no-cache libc6-compat

# Sao chép package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt dependencies với timeout và retry
RUN npm ci --only=production=false --timeout=300000 --maxsockets=1

# Sao chép Prisma schema trước
COPY src/prisma ./src/prisma

# Generate Prisma client
RUN npx prisma generate

# Sao chép toàn bộ source code
COPY . .

# Build ứng dụng với skip Prisma để tránh generate lại
RUN npm run build:no-prisma

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Cài đặt các dependencies cần thiết
RUN apk add --no-cache libc6-compat

# Sao chép package.json và package-lock.json
COPY package.json package-lock.json ./

# Chỉ cài đặt dependencies cho production
RUN npm ci --only=production --timeout=300000 --maxsockets=1

# Sao chép Prisma schema và generate client cho production
COPY src/prisma ./src/prisma
RUN npx prisma generate

# Sao chép build artifacts từ stage trước
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

# Expose port
EXPOSE 3000

# Start ứng dụng
CMD ["npm", "run", "start"]







