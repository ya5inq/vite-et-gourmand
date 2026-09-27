#!/usr/bin/env bash
# Recharge les fixtures TypeORM idempotentes dans $DATABASE_URL.
# Usage : DATABASE_URL='...' ./scripts/db-seed.sh
set -euo pipefail

show_help() {
  sed -n '2,8p' "$0"
  exit 0
}

[[ "${1:-}" == "-h" || "${1:-}" == "--help" ]] && show_help

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "ERROR: DATABASE_URL est requis." >&2
  exit 1
fi

export DATABASE_URL
export PGSSLMODE=require
export NODE_ENV="${NODE_ENV:-production}"

cd "$(cd "$(dirname "$0")/.." && pwd)"

echo "Chargement des fixtures dans $(echo "$DATABASE_URL" | sed -E 's#postgresql://([^:]+):.*#\1#')@host…"
pnpm --filter backend exec ts-node -r tsconfig-paths/register \
  src/infrastructure/database/fixtures/scripts/setup.ts

echo "OK. Admin : admin@viteetgourmand.fr / password123"