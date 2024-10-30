# Production Dockerfile

# Stage 1: Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Stage 2: Build the application
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .
RUN npm run build

# Stage 3: Production image
FROM node:18-alpine AS prod
WORKDIR /app
ENV NODE_ENV production

# Copy built assets and necessary files
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy Prisma files
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./

# Expose port
EXPOSE 3000

# Start the app and run migrations
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
