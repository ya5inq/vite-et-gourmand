# syntax=docker/dockerfile:1
# ------------------------------------------------------------
# Client (Next.js 15) — image de production (output standalone)
# Build depuis la racine du monorepo :
#   docker build -f client/Dockerfile \
#     --build-arg NEXT_PUBLIC_API_URL=https://api.exemple.com/api \
#     -t veg-client .
# ------------------------------------------------------------

FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN corepack enable
WORKDIR /app

# --- Dépendances (SDK + UI sont des packages workspace requis) ---
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY client/package.json ./client/
COPY backend/package.json ./backend/
COPY back-office/package.json ./back-office/
COPY packages/sdk/package.json ./packages/sdk/
COPY packages/ui/package.json ./packages/ui/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter client...

# --- Build ---
FROM base AS build
# L'URL de l'API est figée au build (variable NEXT_PUBLIC_*)
ARG NEXT_PUBLIC_API_URL=http://localhost:8080/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
# On récupère l'arborescence installée (node_modules racine + de chaque workspace,
# y compris client/node_modules/.bin où se trouve `next`).
COPY --from=deps /app ./
# Sources par-dessus (les .json manifestes sont déjà présents via deps)
COPY packages ./packages
COPY client ./client
RUN pnpm --filter client build

# --- Image finale : serveur Next standalone ---
FROM node:20-slim AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

# Le build standalone regroupe le serveur + node_modules minimal à la racine du monorepo
COPY --from=build --chown=nextjs:nodejs /app/client/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/client/.next/static ./client/.next/static
COPY --from=build --chown=nextjs:nodejs /app/client/public ./client/public

USER nextjs
EXPOSE 3000
CMD ["node", "client/server.js"]
