# Vite & Gourmand

Application web pour un service de traiteur à Bordeaux. Un site client pour
consulter les menus et commander, un back-office pour la gestion (employés et
administrateur), et un backend Node qui porte toute la logique métier.

## Architecture (monorepo pnpm)

```
vite-et-gourmand/
├── backend/          # API Node (Hono + TypeORM + Inversify, Clean Architecture)
├── client/           # Site client (Next.js 15, App Router, SSR)
├── back-office/      # Interface admin/employé (React 19 + Vite)
├── packages/
│   ├── sdk/          # SDK TypeScript généré depuis l'OpenAPI du backend (Orval)
│   └── ui/           # Composants UI partagés (shadcn)
└── docker-compose.yml
```

### Stack technique

- **Backend** : Hono 4 + `@hono/zod-openapi`, **TypeORM 0.3 + PostgreSQL 16**
  (base relationnelle), **MongoDB** (base non relationnelle : statistiques de
  commandes par menu, chiffre d'affaires, journaux d'audit), Inversify (DI),
  JWT + refresh token en cookie httpOnly, emails via Resend, jobs/cron via
  pg-boss (pénalité de retour de matériel).
- **Client** : Next.js 15 (Server Components pour le SSR public, cookie httpOnly
  pour l'authentification).
- **Back-office** : React 19 + Vite + React Query.
- **SDK** : généré automatiquement (`pnpm generate-sdk`) — les deux fronts
  consomment l'API via ce SDK typé (axios + zod).

## Prérequis

- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/) >= 10 (`npm install -g pnpm`)
- [Docker](https://www.docker.com/) (PostgreSQL + MongoDB)

## Installation et démarrage local

### 1. Cloner et installer

```bash
git clone <repo>
cd vite-et-gourmand
pnpm install
```

### 2. Variables d'environnement

```bash
cp .env.dist .env
cp .env.dist backend/.env
cp .env.dist client/.env.local
cp .env.dist back-office/.env
```

Les valeurs par défaut conviennent pour le développement local. Renseigner
`RESEND_API_KEY` uniquement pour envoyer de vrais emails (sinon ils sont
journalisés en console en mode développement).

### 3. Lancer les bases de données

```bash
pnpm start:database     # PostgreSQL + Adminer (8089) + MongoDB + mongo-express (8081)
```

### 4. Initialiser la base relationnelle

```bash
pnpm migration:run      # Applique les migrations TypeORM
pnpm fixtures:load       # Données de démonstration (menus, plats, zones, admin...)
```

Compte de démonstration créé par les fixtures :

- `admin@viteetgourmand.fr` / `password123` (administrateur)

### 5. Générer le SDK

```bash
pnpm generate-sdk        # OpenAPI du backend -> packages/sdk
```

### 6. Démarrer les serveurs

```bash
pnpm dev:be              # API backend       -> http://localhost:8080
pnpm dev:cl              # Site client       -> http://localhost:3000
pnpm dev:bo              # Back-office        -> http://localhost:3001
```

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `pnpm start:database` / `pnpm stop:database` | Démarre / arrête Postgres + Mongo (Docker) |
| `pnpm migration:run` | Applique les migrations |
| `pnpm migration:generate <chemin>` | Génère une migration depuis les entités |
| `pnpm fixtures:load` | Charge les données de démonstration |
| `pnpm generate-sdk` | Régénère le SDK depuis l'OpenAPI |
| `pnpm test:be` | Tests unitaires du backend |
| `pnpm typecheck` | Typecheck de tous les paquets |

## Tests

```bash
pnpm test:be             # Tests unitaires backend (Vitest)
```

## Déploiement

L'application est conteneurisable (PostgreSQL + MongoDB + backend + fronts).
Voir la documentation technique pour la démarche de déploiement détaillée.
