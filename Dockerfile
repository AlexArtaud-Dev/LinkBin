# Production Dockerfile

# Stage 1: Builder
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy common files
COPY package.json package-lock.json ./

# Install all dependencies
RUN npm ci

# Copy the entire project (excluding dev-specific dependencies for cleaner)
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Stage 2: Production for Next.js
FROM node:18-alpine AS production-next

# Set working directory
WORKDIR /app

# Copy only required files and dependencies from the builder stage
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/next.config.js ./next.config.js

# Install only production dependencies
RUN npm ci --only=production

# Expose the port Next.js runs on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Start the application and run migrations
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
