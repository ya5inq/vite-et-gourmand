# syntax=docker/dockerfile:1
# ------------------------------------------------------------
# Backend (Hono + TypeORM) — image de production
# Build depuis la racine du monorepo :
#   docker build -f backend/Dockerfile -t veg-backend .
# ------------------------------------------------------------

FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# CI=true : pnpm ne demande pas de confirmation TTY (suppression de modules)
ENV CI=true
RUN corepack enable
WORKDIR /app

# --- Dépendances : on copie les manifestes pour profiter du cache ---
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY backend/package.json ./backend/
COPY client/package.json ./client/
COPY back-office/package.json ./back-office/
COPY packages/sdk/package.json ./packages/sdk/
COPY packages/ui/package.json ./packages/ui/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter backend...

# --- Build TypeScript -> dist ---
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.json ./
COPY backend ./backend
RUN pnpm --filter backend build
# On retire les devDependencies pour l'image finale
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod --filter backend...

# --- Image finale ---
FROM node:20-slim AS runner
ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/backend/node_modules ./backend/node_modules
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/package.json ./backend/package.json
COPY pnpm-workspace.yaml package.json ./

# Utilisateur non-root
RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs appuser
USER appuser

WORKDIR /app/backend
EXPOSE 8080
CMD ["node", "dist/entrypoints/api/index.js"]
