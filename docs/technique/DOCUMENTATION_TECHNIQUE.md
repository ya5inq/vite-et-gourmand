# Documentation technique — Vite & Gourmand

## 1. Réflexions initiales technologiques

### Contexte et contraintes du sujet

Le sujet impose deux contraintes techniques fortes :

1. **Une base de données relationnelle** (données métier structurées).
2. **Une base de données non relationnelle** (les statistiques admin *« doivent venir
   d'une base de données non relationnelle »* — page 9).

Le reste de la stack est libre. Les choix ci-dessous sont justifiés au regard de la
qualité attendue (sécurité, maintenabilité) et du périmètre fonctionnel (3 rôles,
cycle de commande complet, CMS, e-mails transactionnels).

### Choix de la stack

| Besoin | Choix | Justification |
| --- | --- | --- |
| Base relationnelle | **PostgreSQL 16** | Intégrité référentielle forte (commandes ↔ menus ↔ utilisateurs), types riches (`numeric`, `jsonb`, `enum`), transactions ACID indispensables à la création de commande (Order + items + historique + stock en une transaction). |
| Base non relationnelle | **MongoDB 7** | Impose par le sujet pour les stats. Adapté aux **vues dérivées** dénormalisées (stats par menu, journal d'audit) interrogées en lecture, découplées du modèle transactionnel. |
| Langage | **TypeScript** (bout en bout) | Un seul langage front + back + SDK. Typage statique = moins d'erreurs, meilleure maintenabilité. |
| Framework backend | **Hono** | Léger, rapide, natif TypeScript, avec `@hono/zod-openapi` : la **validation Zod** et la **spec OpenAPI** sont générées depuis le même schéma. |
| Accès aux données | **TypeORM** | ORM mûr, migrations versionnées, support PostgreSQL. Répond à la compétence *« composants d'accès aux données SQL »*. |
| Architecture backend | **Clean Architecture + Inversify (DI)** | Séparation domaine / application / infrastructure. Les règles métier (calcul de prix, transitions de statut) sont isolées et **testables** (191 tests unitaires). |
| Front public | **Next.js 15** (App Router, SSR) | Rendu côté serveur pour le SEO (site vitrine d'un traiteur) et la performance. Cookie httpOnly pour l'authentification SSR. |
| Front back-office | **React 19 + Vite** (SPA) | Interface interne : pas de besoin SEO, une SPA rapide suffit. Vite pour un build simple et léger (servi en statique). |
| SDK d'API | **Orval** (généré depuis l'OpenAPI) | Les deux fronts consomment l'API via un **SDK typé généré** (axios + Zod). Cohérence garantie entre back et fronts. |
| E-mails | **Resend** | API transactionnelle simple ; en développement, les e-mails sont journalisés (pas de clé requise). |
| Jobs planifiés | **pg-boss** | File d'attente adossée à PostgreSQL (pas d'infra supplémentaire) pour la pénalité de retour de matériel. |

### Pourquoi un backend dédié plutôt qu'un BaaS

Le projet a d'abord été prototypé avec un *Backend-as-a-Service*, puis migré vers un
**backend Node dédié**. Justification :

- **Compétence évaluée** : le TP exige de *« développer des composants métier côté
  serveur »* et *« des composants d'accès aux données SQL et NoSQL »* — un BaaS masque
  cette couche.
- **Règles métier complexes** : calcul de remise, machine à états des commandes,
  pénalités, envoi conditionnel d'e-mails — mieux maîtrisées dans un domaine explicite.
- **Contrôle de la sécurité** : authentification maison (JWT + refresh en cookie
  httpOnly), autorisation par rôle, hachage bcrypt.

## 2. Configuration de l'environnement de travail

### Prérequis

| Outil | Version | Rôle |
| --- | --- | --- |
| Node.js | ≥ 20 | Exécution backend et build des fronts |
| pnpm | ≥ 10 (10.28.1) | Gestionnaire de paquets (monorepo *workspaces*) |
| Docker + Compose v2 | récent | PostgreSQL + MongoDB en local |
| Git | récent | Versionnage |

> `pnpm` est fixé via le champ `packageManager` du `package.json` racine : `corepack`
> installe automatiquement la bonne version.

### Structure monorepo

Le dépôt est un **monorepo pnpm** (`pnpm-workspace.yaml`) regroupant 5 paquets :
`backend`, `client`, `back-office`, `packages/sdk`, `packages/ui`. Voir le `README.md`
pour l'arborescence détaillée.

### Étapes d'installation (résumé)

Le détail figure dans le `README.md`. En résumé :

```bash
pnpm install                      # dépendances de tout le monorepo
cp .env.dist .env                 # (+ backend/.env, client/.env.local, back-office/.env)
pnpm start:database               # PostgreSQL + Mongo via Docker
pnpm --filter backend migration:run   # schéma
pnpm --filter backend fixtures:load   # jeu de données + comptes de démo
pnpm dev:be   # API        (http://localhost:8080)
pnpm dev:cl   # client     (http://localhost:3000)
pnpm dev:bo   # back-office (http://localhost:3001)
```

### Outils qualité intégrés

| Outil | Commande | Rôle |
| --- | --- | --- |
| ESLint | `pnpm lint` | Analyse statique (tous les paquets) |
| TypeScript | `pnpm typecheck` | Vérification de types |
| Vitest | `pnpm test:be` | 191 tests unitaires backend |
| GitHub Actions | `.github/workflows/ci.yml` | CI : lint + typecheck + tests à chaque push |

### Génération du SDK et de la documentation d'API

```bash
pnpm generate-sdk          # OpenAPI → SDK TypeScript typé (Orval)
```

La documentation d'API interactive est exposée par le backend :
`/ui` (Swagger UI), `/reference` (Scalar), `/api/doc` (spec OpenAPI JSON).

## 3. Modèle de données

Voir [`MCD.md`](./MCD.md) — diagramme entité-relation complet (PostgreSQL) et
collections MongoDB.

## 4. Diagrammes

Voir [`DIAGRAMMES.md`](./DIAGRAMMES.md) — cas d'utilisation, séquences (commande et
cycle de statut), machine à états.

## 5. Déploiement

Voir [`../DEPLOYMENT.md`](../DEPLOYMENT.md) (Docker) et
[`../DEPLOYMENT_RENDER.md`](../DEPLOYMENT_RENDER.md) (mise en ligne gratuite Render + Atlas).
