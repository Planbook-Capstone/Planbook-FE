# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package.json package-lock.json ./
# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ source code
COPY . .

# Sao chép .env.production thành .env.local để sử dụng trong quá trình build
COPY .env.production .env.local

# Build ứng dụng
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package.json package-lock.json ./
# Chỉ cài đặt dependencies cho production
RUN npm install --production

# Sao chép build artifacts từ stage trước
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

# Sao chép .env.production thành .env.local để sử dụng trong production
COPY .env.production .env.local

# Expose port
EXPOSE 3000

# Start ứng dụng với HOST 0.0.0.0 để cho phép truy cập từ bên ngoài container
CMD ["npm", "run", "start", "--", "-H", "0.0.0.0"]







