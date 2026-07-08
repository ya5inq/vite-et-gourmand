# syntax=docker/dockerfile:1
# ------------------------------------------------------------
# Back-office (Vite / React SPA) — build statique servi par nginx
# Build depuis la racine du monorepo :
#   docker build -f back-office/Dockerfile \
#     --build-arg VITE_API_URL=https://api.exemple.com/api \
#     -t veg-back-office .
# ------------------------------------------------------------

FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN corepack enable
WORKDIR /app

# --- Dépendances (SDK + UI = packages workspace) ---
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY back-office/package.json ./back-office/
COPY backend/package.json ./backend/
COPY client/package.json ./client/
COPY packages/sdk/package.json ./packages/sdk/
COPY packages/ui/package.json ./packages/ui/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter back-office...

# --- Build statique ---
FROM base AS build
ARG VITE_API_URL=http://localhost:8080/api
ENV VITE_API_URL=$VITE_API_URL
# Arborescence installée complète (node_modules racine + de chaque workspace)
COPY --from=deps /app ./
COPY packages ./packages
COPY back-office ./back-office
RUN pnpm --filter back-office build

# --- Image finale : nginx sert le dist/ ---
FROM nginx:1.27-alpine AS runner
COPY back-office/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/back-office/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
