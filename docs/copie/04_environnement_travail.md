# Partie 2 — Spécifications techniques

## Question 2 — Mise en place de l'environnement de travail (README.md)

### Organisation en monorepo

Le dépôt est un **monorepo pnpm** regroupant cinq paquets : `backend`, `client`, `back-office`, `packages/sdk` et `packages/ui`. Ce choix permet de partager le SDK et les composants d'interface entre les deux fronts, et de versionner l'ensemble dans un seul dépôt. La version de pnpm est figée (champ `packageManager` du `package.json` racine) et installée automatiquement via `corepack`, ce qui garantit un environnement identique sur tous les postes.

### Prérequis

- **Node.js** version 20 ou supérieure — exécution du backend et build des fronts.
- **pnpm** version 10 ou supérieure — gestionnaire de paquets du monorepo.
- **Docker + Docker Compose** — PostgreSQL et MongoDB en local, sans installation système.
- **Git** — versionnage.

Faire tourner les bases de données dans des conteneurs Docker permet de reproduire à l'identique l'environnement sur n'importe quel poste, sans installer de moteur de base de données sur la machine hôte.

### Étapes d'installation

Le détail figure dans le fichier `README.md`. En résumé :

```
pnpm install                          # dépendances de tout le monorepo
cp .env.dist .env                     # + backend/.env, client/.env.local, back-office/.env
pnpm start:database                   # PostgreSQL + MongoDB via Docker
pnpm --filter backend migration:run   # création du schéma relationnel
pnpm --filter backend fixtures:load   # jeu de données et comptes de démonstration
pnpm dev:be   # API          (http://localhost:8080)
pnpm dev:cl   # site client   (http://localhost:3000)
pnpm dev:bo   # back-office   (http://localhost:3001)
```

### Outils de qualité intégrés

- **ESLint** — analyse statique du code (tous les paquets).
- **TypeScript** — vérification des types.
- **Vitest** — 191 tests unitaires du backend.
- **GitHub Actions** — intégration continue exécutant lint, vérification de types et tests à chaque push.

### Génération du SDK et de la documentation d'API

Le SDK et la documentation d'API sont générés automatiquement depuis l'OpenAPI du backend (`pnpm generate-sdk`). La documentation d'API interactive est exposée par le backend sur `/api/doc`.
