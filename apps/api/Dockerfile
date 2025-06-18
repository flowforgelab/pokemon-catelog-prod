# Use Node Alpine for smaller image
FROM node:18-alpine AS builder

# Install dependencies needed for building
RUN apk add --no-cache python3 make g++

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.10.0 --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY src ./src

# Build the API
RUN pnpm build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

# Copy built application and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Start the application
CMD ["node", "dist/main.js"]