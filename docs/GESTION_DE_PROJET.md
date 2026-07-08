# Gestion de projet — Vite & Gourmand

## 1. Méthodologie

Le projet a été mené de façon **itérative et incrémentale**, découpé en **phases**
livrant chacune une capacité fonctionnelle vérifiable. Chaque phase suit le même
cycle, aligné sur les bonnes pratiques Git exigées par le sujet :

1. Création d'une **branche de fonctionnalité** depuis `develop`
   (`feat/…`, `fix/…` ou `chore/…`).
2. Développement + **tests** (191 tests unitaires backend).
3. Revue, puis **merge dans `develop`** une fois la branche testée.
4. Fusion `develop` → `main` pour les jalons stables.

## 2. Organisation Git (traçabilité)

| Branche | Rôle |
| --- | --- |
| `main` | Version stable / livrable |
| `develop` | Intégration continue des fonctionnalités |
| `feat/*`, `fix/*`, `chore/*` | Une branche par fonctionnalité, mergée dans `develop` |

Chaque phase est identifiable dans l'historique Git (message de merge « Phase N »),
ce qui documente le **découpage et le suivi** du projet directement dans le dépôt.

## 3. Backlog et suivi des phases

| Phase | Périmètre livré | Branche |
| --- | --- | --- |
| 0 | Scaffold backend (Clean Architecture : Hono + TypeORM + Inversify) | `feat/backend-scaffold` |
| 1 | Authentification maison (JWT + refresh) et entité `User` | `feat/be-auth-users` |
| 2 | Infrastructure MongoDB + adaptateurs analytics & audit log | `feat/be-mongo-infra` |
| 3 | Catalogue : allergènes, régimes, plats, menus | `feat/be-catalog` |
| 4 | Zones de livraison + calcul du prix | `feat/be-delivery-zones` |
| 5 | Commandes : `Order` / `OrderItem` / `OrderHistory` + règles métier | `feat/be-orders` |
| 6 | Machine à états des commandes + pénalité de retour de matériel | `feat/be-order-statemachine` |
| 7 | Gestion des employés | `feat/be-employees` |
| 8 | Avis, contact, CMS | `feat/be-reviews-contact-cms` |
| 9 | Statistiques admin lues depuis MongoDB | `feat/be-admin-stats` |
| 10 | SDK TypeScript généré (Orval) depuis l'OpenAPI | `feat/sdk` |
| 11 | Back-office : migration vers le SDK HTTP | `feat/front-bo-migration` |
| 12 | Client Next.js : migration SDK + auth cookie | `feat/front-client-migration` |
| 13 | Nettoyage (retrait du prototype BaaS) | `chore/remove-supabase` |
| 14 | Infra de déploiement (Docker + CI), export SQL, mise en ligne Render | `chore/deploy-infra-and-sql`, `chore/render-deploy` |

## 4. Outil de gestion de projet

Le backlog ci-dessus (14 phases) constitue la structure du projet. Il est reporté dans
un outil de gestion de projet en ligne (Notion / Trello) sous forme de tableau
**À faire · En cours · Terminé**, avec une carte par phase.

> **Lien de l'outil de gestion de projet** : _(à renseigner)_

## 5. Qualité et intégration continue

- **Tests** : 191 tests unitaires backend (Vitest).
- **CI** (GitHub Actions, `.github/workflows/ci.yml`) : lint + typecheck + tests
  exécutés automatiquement à chaque push sur `main` et `develop`.
- **Documentation** : technique (`docs/technique/`), déploiement (`docs/`),
  base de données (`docs/database/`).
