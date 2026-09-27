#!/usr/bin/env bash
# Dump $SOURCE_DATABASE_URL (custom format, portable vers Neon).
# Usage : SOURCE_DATABASE_URL='...' ./scripts/db-export.sh [out.dump]
set -euo pipefail

show_help() {
  sed -n '2,8p' "$0"
  exit 0
}

[[ "${1:-}" == "-h" || "${1:-}" == "--help" ]] && show_help

if ! command -v pg_dump >/dev/null 2>&1; then
  echo "ERROR: pg_dump manquant. Installer Postgres.app ou 'brew install libpq'." >&2
  exit 1
fi

if [[ -z "${SOURCE_DATABASE_URL:-}" ]]; then
  echo "ERROR: SOURCE_DATABASE_URL est requis." >&2
  echo "Exemple: SOURCE_DATABASE_URL='postgresql://veg:xxxx@dpg-xxx-frankfurt-postgres.render.com/vite_et_gourmand_xxx?sslmode=require' $0" >&2
  exit 1
fi

OUT="${1:-./tmp/dump-$(date -u +%Y%m%dT%H%M%SZ).dump}"
mkdir -p "$(dirname "$OUT")"

echo "Export → $OUT"
PGSSLMODE=require pg_dump \
  --no-owner \
  --no-privileges \
  --no-acl \
  --no-sync \
  --format=custom \
  --compress=9 \
  --file="$OUT" \
  "$SOURCE_DATABASE_URL"

echo "OK. Taille : $(du -h "$OUT" | cut -f1)"