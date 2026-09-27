# scripts/

Outils shell pour la base de production. Tous nécessitent `pg_dump` /
`pg_restore` / `psql` sur le `PATH` (Postgres.app ou `brew install libpq`).

| Script                    | Rôle                                        | Env requise                          | Exemple |
|---------------------------|---------------------------------------------|--------------------------------------|---------|
| `db-export.sh [out.dump]` | Dump la DB source (ex. Render)              | `SOURCE_DATABASE_URL`                | `SOURCE_DATABASE_URL='postgresql://...render.com/...?sslmode=require' ./scripts/db-export.sh` |
| `db-import.sh <file>`     | Restore un dump dans la DB cible (ex. Neon) | `TARGET_DATABASE_URL` (avec `sslmode=require`) | `TARGET_DATABASE_URL='postgresql://...neon.tech/...?sslmode=require' ./scripts/db-import.sh ./tmp/dump-xxx.dump` |
| `db-seed.sh`              | Recharge les fixtures TypeORM (idempotent)  | `DATABASE_URL`                       | `DATABASE_URL='postgresql://...neon.tech/...?sslmode=require' ./scripts/db-seed.sh` |

Les dumps sont binaires et volumineux → ils vivent sous `./tmp/` (gitignored).

Aliases équivalents côté `package.json` racine : `pnpm db:export`, `pnpm db:import`, `pnpm db:seed`.