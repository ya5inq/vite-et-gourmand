# Base de données — fichiers SQL

Export SQL de la base **PostgreSQL** de Vite & Gourmand, généré depuis les migrations
TypeORM et les fixtures programmatiques du projet.

| Fichier      | Contenu                                                             |
| ------------ | ------------------------------------------------------------------ |
| `schema.sql` | Structure : 18 tables, contraintes, index (issu des 6 migrations). |
| `seed.sql`   | Jeu de données initial (catalogue, zones, CMS, comptes de démo).   |

## Rejouer la base à partir des fichiers

```bash
createdb vite_et_gourmand
psql -d vite_et_gourmand -f schema.sql   # structure
psql -d vite_et_gourmand -f seed.sql     # données
```

## Comptes de démonstration

| Rôle   | Identifiant                   | Mot de passe  |
| ------ | ----------------------------- | ------------- |
| Admin  | `admin@viteetgourmand.fr`     | `password123` |
| Client | `client@viteetgourmand.fr`    | `password123` |

> Ces fichiers sont un export statique fourni pour l'ECF. En développement, la base
> est normalement construite via `pnpm migration:run` puis `pnpm fixtures:load`.
