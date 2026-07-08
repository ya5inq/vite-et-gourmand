# Déploiement — Vite & Gourmand

Ce document décrit la mise en production de la pile complète : **backend** (Hono/Node),
**PostgreSQL**, **MongoDB**, **client** (Next.js) et **back-office** (SPA Vite servie par nginx).

---

## 1. Architecture déployée

| Service       | Techno            | Port interne | Rôle                                        |
| ------------- | ----------------- | ------------ | ------------------------------------------- |
| `backend`     | Hono + TypeORM    | 8080         | API REST (`/api`), migrations, jobs pg-boss |
| `postgres`    | PostgreSQL 16     | 5432         | Base relationnelle principale               |
| `mongo`       | MongoDB 7         | 27017        | Analytics / journal d'audit (dérivé)        |
| `client`      | Next.js 15        | 3000         | Site public (SSR, `output: standalone`)     |
| `back-office` | Vite/React + nginx| 80           | Interface d'administration (SPA statique)   |

Les deux fronts consomment l'API via une URL figée **au moment du build** :
`NEXT_PUBLIC_API_URL` (client) et `VITE_API_URL` (back-office).

---

## 2. Prérequis

- Docker + Docker Compose v2
- Un fichier `.env` à la racine (copié depuis `.env.dist`)

---

## 3. Déploiement local / VPS avec Docker Compose

```bash
# 1. Configurer l'environnement
cp .env.dist .env
#   → renseigner impérativement les 4 secrets JWT (*_TOKEN_SECRET)
#     et, en production, des mots de passe DB robustes.

# 2. Construire et démarrer toute la pile
docker compose -f docker-compose.prod.yml up -d --build

# 3. Charger le jeu de données initial (une seule fois)
docker compose -f docker-compose.prod.yml --profile seed run --rm fixtures
```

Les **migrations TypeORM** s'exécutent automatiquement au démarrage du backend
(`AUTO_MIGRATION=true` dans le compose de prod). Le service `fixtures` (profil `seed`)
charge le catalogue, les zones, les contenus CMS et les comptes de démonstration.

### Variables d'environnement clés

| Variable                 | Description                                   |
| ------------------------ | --------------------------------------------- |
| `*_TOKEN_SECRET`         | Secrets JWT (access / refresh / account / reset) — **obligatoires** |
| `DB_USERNAME/PASSWORD`   | Identifiants PostgreSQL                        |
| `MONGO_ROOT_USERNAME/PASSWORD` | Identifiants MongoDB                     |
| `NEXT_PUBLIC_API_URL`    | URL publique de l'API vue par le client        |
| `VITE_API_URL`           | URL publique de l'API vue par le back-office   |
| `FRONTEND_URL` / `BACK_OFFICE_URL` | Origines autorisées par le CORS backend |
| `RESEND_API_KEY`         | Clé Resend pour l'envoi d'e-mails réels (sinon journalisés) |

---

## 4. Déploiement sur un PaaS

Chaque service dispose d'un `Dockerfile` autonome (build depuis la **racine** du monorepo) :

```bash
docker build -f backend/Dockerfile     -t veg-backend .
docker build -f client/Dockerfile      --build-arg NEXT_PUBLIC_API_URL=https://api.exemple.com/api -t veg-client .
docker build -f back-office/Dockerfile --build-arg VITE_API_URL=https://api.exemple.com/api        -t veg-back-office .
```

Points d'attention selon la cible (Render, Railway, Fly.io, Clever Cloud…) :

- **Bases managées** : fournir `DATABASE_URL` et `MONGO_URL` en variables d'environnement
  et retirer les services `postgres`/`mongo` du compose.
- **URL de l'API** : les fronts étant buildés avec l'URL en dur, un changement de domaine
  impose un **rebuild**.
- **CORS** : renseigner `FRONTEND_URL` et `BACK_OFFICE_URL` avec les domaines publics réels.
- **Healthcheck** : l'API répond sur `GET /api/doc` (document OpenAPI, sans authentification).

---

## 5. Vérification post-déploiement

```bash
curl -fsS https://<api>/api/doc > /dev/null && echo "API OK"
```

- Client public : `https://<client>/`
- Back-office : `https://<back-office>/` — connexion `admin@viteetgourmand.fr` / `password123`
