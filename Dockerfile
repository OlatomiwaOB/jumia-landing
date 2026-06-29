# ========================
# Build stage
# ========================
FROM node:20.18.0-alpine AS builder

# Build-time args
ARG NEXT_PUBLIC_STORE_FRONT
ARG NEXT_PUBLIC_REACT_APP_API_URL
ARG NEXT_PUBLIC_SOURCE_CODE
ARG NEXT_PUBLIC_CLIENT_ID
ARG NEXT_PUBLIC_CLIENT_SECRET
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# Environment variables
ENV NEXT_PUBLIC_STORE_FRONT=$NEXT_PUBLIC_STORE_FRONT
ENV NEXT_PUBLIC_REACT_APP_API_URL=$NEXT_PUBLIC_REACT_APP_API_URL
ENV NEXT_PUBLIC_SOURCE_CODE=$NEXT_PUBLIC_SOURCE_CODE
ENV NEXT_PUBLIC_CLIENT_ID=$NEXT_PUBLIC_CLIENT_ID
ENV NEXT_PUBLIC_CLIENT_SECRET=$NEXT_PUBLIC_CLIENT_SECRET
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_TELEMETRY_DISABLED=1

# Install build dependencies including Python 3 and build tools
RUN apk add --no-cache libc6-compat python3 make g++

# Set Python 3 as the default python
RUN ln -sf python3 /usr/bin/python

WORKDIR /app

# Copy package files first to leverage docker layer cache
COPY package.json pnpm-lock.yaml ./


# Enable corepack and install dependencies via pnpm
RUN corepack enable \
 && corepack prepare pnpm@9.15.1 --activate \
 && pnpm install --frozen-lockfile

# Copy the rest of the source
COPY . .

# Increase memory allocation
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the application
RUN pnpm build

# ========================
# Production stage
# ========================
FROM node:20.18.0-alpine AS runner

# Install libc6-compat for Alpine compatibility
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copy only manifest files used for production install
COPY package.json pnpm-lock.yaml ./

# Enable corepack and install only production dependencies
RUN corepack enable \
 && COREPACK_ENABLE_DOWNLOAD_PROMPT=0 corepack prepare pnpm@9.15.1 --activate \
 && pnpm install --prod --frozen-lockfile

# Copy build output and static assets from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variables for runtime
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Start the application using npx
CMD ["npx", "next", "start"]