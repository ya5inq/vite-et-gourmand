#!/usr/bin/env bash
# Restore un dump custom dans $TARGET_DATABASE_URL.
# Usage : TARGET_DATABASE_URL='...' ./scripts/db-import.sh ./tmp/dump-xxx.dump
set -euo pipefail

show_help() {
  sed -n '2,8p' "$0"
  exit 0
}

[[ "${1:-}" == "-h" || "${1:-}" == "--help" ]] && show_help

if ! command -v pg_restore >/dev/null 2>&1; then
  echo "ERROR: pg_restore manquant." >&2
  exit 1
fi

DUMP="${1:-}"
if [[ -z "$DUMP" ]]; then
  echo "ERROR: passer le chemin du dump en arg #1." >&2
  echo "Exemple: TARGET_DATABASE_URL='...' $0 ./tmp/dump-20260927T120000Z.dump" >&2
  exit 1
fi
if [[ ! -f "$DUMP" ]]; then
  echo "ERROR: fichier dump introuvable : $DUMP" >&2
  exit 1
fi

if [[ -z "${TARGET_DATABASE_URL:-}" ]]; then
  echo "ERROR: TARGET_DATABASE_URL est requis." >&2
  exit 1
fi

if [[ "$TARGET_DATABASE_URL" != *"sslmode=require"* && "$TARGET_DATABASE_URL" != *"sslmode=verify"* ]]; then
  echo "ERROR: TARGET_DATABASE_URL doit inclure sslmode=require (Neon exige SSL)." >&2
  exit 1
fi

echo "Restore $DUMP → Neon…"
pg_restore \
  --no-owner \
  --no-privileges \
  --no-acl \
  --clean --if-exists \
  --single-transaction \
  --dbname="$TARGET_DATABASE_URL" \
  "$DUMP"

echo "OK."