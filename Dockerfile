# ============================================================
# PathWise — Multi-stage Docker build for Next.js 15
# ============================================================

# ---- Stage 1: Install dependencies ----
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy package files AND prisma schema (needed by postinstall: prisma generate)
COPY package.json package-lock.json ./
COPY prisma ./prisma/

RUN npm ci

# ---- Stage 2: Build the application ----
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client (re-generate with full source context)
RUN npx prisma generate

# Build Next.js (standalone output)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Stage 3: Production runner ----
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone build output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Install Prisma CLI globally for runtime migrations
RUN npm install -g prisma@^6.14.0

# Copy Prisma schema (needed for migrations at runtime)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Copy entrypoint script
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
