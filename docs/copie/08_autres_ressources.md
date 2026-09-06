# Autres ressources et informations complémentaires

## Autres ressources

- **Documentation du déploiement** : `docs/DEPLOYMENT_RENDER.md` (mise en ligne gratuite Render et MongoDB Atlas) et `docs/DEPLOYMENT.md` (conteneurisation Docker).
- **Documentation technique** : `docs/technique/DOCUMENTATION_TECHNIQUE.md`.
- **Modèle conceptuel de données** : `docs/technique/MCD.md`.
- **Diagrammes de cas d'usage et de séquence** : `docs/technique/DIAGRAMMES.md`.
- **Base de données** : scripts `docs/database/schema.sql` (création) et `docs/database/seed.sql` (intégration des données).
- **Charte graphique** : `docs/CHARTE_GRAPHIQUE.md`.
- **Accessibilité RGAA** : `docs/ACCESSIBILITE_RGAA.md`.
- **Gestion de projet** : `docs/GESTION_DE_PROJET.md` et le tableau Trello.
- **Documentation d'API interactive** (application déployée) : https://veg-backend-ooky.onrender.com/api/doc

## Informations complémentaires

- **Architecture** : monorepo pnpm — backend (Hono + TypeORM + Inversify), site client (Next.js 15), back-office (React 19 + Vite), SDK TypeScript généré (Orval).
- **Bases de données** : PostgreSQL 16 (relationnelle) et MongoDB 7 (non relationnelle).
- **Qualité** : 191 tests unitaires backend (Vitest) et intégration continue GitHub Actions (lint, vérification de types et tests).
- **Hébergement** : Render (région Frankfurt, Union européenne) pour le backend, la base PostgreSQL, le site client et le back-office ; MongoDB Atlas pour la base non relationnelle. La disponibilité est maintenue par une surveillance externe (UptimeRobot).
- **Comptes de démonstration** :
  - Administrateur : `admin@viteetgourmand.fr` / `password123`
  - Client : `client@viteetgourmand.fr` / `password123`
