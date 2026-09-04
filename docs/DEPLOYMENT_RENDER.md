# Déploiement gratuit — Render + MongoDB Atlas

Procédure pas-à-pas pour mettre Vite & Gourmand en ligne **gratuitement et
durablement**, telle qu'elle a été réellement effectuée, y compris les écueils
rencontrés et leur résolution.

- **Render** (gratuit, région **Frankfurt** / UE) : backend (Hono), PostgreSQL,
  client (Next.js), back-office (SPA statique).
- **MongoDB Atlas M0** (gratuit à vie) : base NoSQL (statistiques admin :
  commandes par menu, chiffre d'affaires).

> ℹ️ Le fichier `render.yaml` à la racine décrit automatiquement les 4 services
> Render (Infrastructure as Code). La région Frankfurt y est fixée
> (`region: frankfurt`) pour un hébergement dans l'Union européenne (cohérence
> RGPD + latence depuis la France).

## URLs de production

| Élément                 | URL publique                                    |
| ----------------------- | ----------------------------------------------- |
| Dépôt GitHub (public)   | https://github.com/ya5inq/vite-et-gourmand      |
| Site client             | https://veg-client-kr9d.onrender.com            |
| Back-office             | https://veg-back-office.onrender.com            |
| API (doc OpenAPI)       | https://veg-backend-ooky.onrender.com/api/doc   |

> Render ajoute un suffixe aléatoire aux noms de services web
> (`veg-backend-ooky`, `veg-client-kr9d`). Les URLs réelles sont celles
> ci-dessus, pas `veg-backend.onrender.com`.

Connexion back-office : `admin@viteetgourmand.fr` / `password123`.

---

## Architecture cible (100 % gratuit)

| Composant                  | Hébergeur                       | Runtime Render |
| -------------------------- | ------------------------------- | -------------- |
| Base relationnelle (Postgres) | Render PostgreSQL (free)     | PostgreSQL     |
| Base NoSQL (MongoDB)       | MongoDB Atlas M0 (free)         | —              |
| Backend (API Hono)         | Render Web Service (free)       | Docker         |
| Site client (Next.js SSR)  | Render Web Service (free)       | Docker         |
| Back-office (React/Vite)   | Render Static Site (free)       | Static (CDN)   |

---

## Étape 1 — MongoDB Atlas (base NoSQL)

1. Créer un compte sur <https://www.mongodb.com/cloud/atlas> (gratuit, sans carte).
2. Créer un cluster **M0** (Free), provider AWS, région proche (ex. Frankfurt).
3. **Security → Database Access** → **Add New Database User** : méthode
   *Password*, privilèges *Read and write to any database*. Noter le mot de
   passe. **Éviter les caractères** `@ : / # ? & %` (ils cassent l'URI ou
   doivent être URL-encodés).
4. **Security → Network Access** → **Add IP Address** → saisir `0.0.0.0/0`
   (Render n'a pas d'IP fixe en offre gratuite ; l'entrée doit être permanente,
   pas temporaire).
5. **Database → Connect → Drivers** → copier l'URI, puis **y ajouter le nom de
   base** `vite_et_gourmand` avant le `?` :
   ```
   mongodb+srv://<user>:<password>@<cluster>.xxxx.mongodb.net/vite_et_gourmand?retryWrites=true&w=majority&appName=Cluster0
   ```
   → c'est la valeur `MONGO_URL` à donner au backend (étape 2).

---

## Étape 2 — Créer le Blueprint Render

1. Créer un compte sur <https://render.com> (connexion via GitHub), autoriser
   l'accès au dépôt `vite-et-gourmand` (**public**).
2. Dashboard → **+ New → Blueprint** (⚠️ *pas* « Web Service » : le Blueprint
   crée les 4 services d'un coup depuis `render.yaml`). À défaut, aller sur
   <https://dashboard.render.com/blueprints> → **New Blueprint Instance**.
3. Sélectionner le dépôt, branche **`main`**. Render lit `render.yaml` et propose
   `veg-postgres`, `veg-backend`, `veg-client`, `veg-back-office`.
4. Renseigner les variables marquées `sync: false` :
   - `veg-backend` → **`MONGO_URL`** = l'URI Atlas de l'étape 1.
   - `RESEND_API_KEY` : laisser **vide** (emails journalisés à défaut de clé).
   - `NEXT_PUBLIC_API_URL` / `VITE_API_URL` : laisser **vides** pour l'instant
     (on ne connaît pas encore l'URL publique du backend — voir étape 3).
5. **Deploy Blueprint**.

> ⚠️ **Ordre de création & échec en cascade.** Render crée les services en
> séquence et **annule les suivants dès qu'un échoue**. Si le back-office échoue
> au build, `veg-backend` est *canceled* et n'apparaît pas. Corriger la cause
> (voir « Écueils » ci-dessous), pousser sur `main` : Render redéploie
> automatiquement et crée les services manquants.

---

## Étape 3 — Câbler les URLs publiques (une seule fois)

Après le premier déploiement, Render attribue les domaines publics (avec suffixe
aléatoire). Renseigner alors, dans l'onglet **Environment** de chaque service :

| Service           | Variable              | Valeur (exemple réel)                          |
| ----------------- | --------------------- | ---------------------------------------------- |
| `veg-client`      | `NEXT_PUBLIC_API_URL` | `https://veg-backend-ooky.onrender.com/api`    |
| `veg-back-office` | `VITE_API_URL`        | `https://veg-backend-ooky.onrender.com/api`    |
| `veg-backend`     | `FRONTEND_URL`        | `https://veg-client-kr9d.onrender.com`         |
| `veg-backend`     | `BACK_OFFICE_URL`     | `https://veg-back-office.onrender.com`         |

- Les variables **API** (`*_API_URL`) se terminent par **`/api`**.
- Les variables **CORS** (`FRONTEND_URL`, `BACK_OFFICE_URL`) sont les origines
  des sites, **sans** `/api` ni `/` final.

Après avoir renseigné `NEXT_PUBLIC_API_URL` / `VITE_API_URL`, **redéployer** les
deux fronts : **Manual Deploy → Clear build cache & deploy**. L'URL de l'API est
figée **au moment du build** (ARG Docker pour le client, `VITE_*` pour la SPA).
Le backend, lui, redémarre seul après *Save* (pas de rebuild nécessaire).

---

## Étape 4 — Charger le jeu de données initial (seed)

Les migrations tournent automatiquement au démarrage (`AUTO_MIGRATION=true`), donc
les tables existent, mais **la base est vide** tant que le seed n'a pas été lancé.

Le script `setup.ts` alimente **PostgreSQL** (allergènes, régimes, 26 plats, 8
menus, zones, contenus CMS/légaux, compte admin, commandes de démo). MongoDB
n'a pas besoin de seed : il se remplit à l'usage (stats calculées à chaque
commande).

> ⚠️ **Le Shell Render n'est PAS disponible en plan gratuit** (« Shell is not
> supported for free compute plans »). On ne peut donc pas lancer le seed
> *dans* le conteneur. On le lance **depuis la machine locale**, en pointant sur
> la base Postgres externe de Render.

1. `veg-postgres` → onglet **Info** → copier l'**External Database URL**
   (`postgresql://veg:<password>@dpg-...frankfurt-postgres.render.com/vite_et_gourmand_xxxx`).
2. Lancer, depuis la racine du dépôt :
   ```bash
   DATABASE_URL="<EXTERNAL_DATABASE_URL>" PGSSLMODE=require NODE_ENV=production \
     pnpm --filter backend exec ts-node -r tsconfig-paths/register \
     src/infrastructure/database/fixtures/scripts/setup.ts
   ```
   - `PGSSLMODE=require` : Render impose le SSL sur les connexions externes.
   - `DATABASE_URL` en préfixe **surcharge** la valeur du `backend/.env`
     (dotenv n'écrase pas une variable déjà présente dans l'environnement).
3. Le script fait un `TRUNCATE ... RESTART IDENTITY CASCADE` puis réinsère : il
   est **idempotent**, on peut le relancer sans créer de doublons.

Sortie attendue : `✅ 8 menus inserted`, `✅ Admin user created`, etc.

> 🔒 L'External Database URL est un secret (accès direct à la base). Après
> l'évaluation, régénérer le mot de passe dans Render ou supprimer la base.

> Alternative non retenue : `docs/database/seed.sql` via `psql`. Écartée car ce
> fichier statique est antérieur à la correction typographique FR (accents `é`,
> `è`, `€`, apostrophes `’`). Le script `setup.ts` charge le jeu de données à
> jour.

---

## Étape 5 — Empêcher les services de s'endormir (anti-veille)

Sur l'offre gratuite, un service web Render s'endort après **15 min** sans
requête (réveil ~30–40 s au prochain accès). Un site statique (back-office) ne
s'endort **pas** (servi par CDN).

1. Créer un compte gratuit sur <https://uptimerobot.com>.
2. Créer **deux moniteurs HTTP(s)**, intervalle **5 minutes** (mini gratuit) :
   - `https://veg-backend-ooky.onrender.com/api/doc` (backend)
   - `https://veg-client-kr9d.onrender.com` (client Next.js)

Le ping régulier maintient les services éveillés : les temps de réponse passent
de ~40 s (réveil à froid) à ~1 s.

> Astuce démo : à défaut de ping, ouvrir les URLs 1 à 2 minutes avant la
> présentation suffit à réveiller les services.

---

## Écueils rencontrés et corrections (démarche)

Trois problèmes ont dû être corrigés dans `render.yaml` avant que le déploiement
soit fonctionnel. Chaque correctif est commité sur `main`.

### 1. Build du back-office statique — `corepack enable` (EROFS)
**Symptôme :** `veg-back-office` en *Failed deploy*, ce qui annulait en cascade
la création de `veg-backend`.
**Cause :** le `buildCommand` commençait par `corepack enable`, qui tente de
créer un lien dans `/usr/bin/` — or le système de fichiers des **Static Sites
Render est en lecture seule** (`EROFS: read-only file system, unlink
'/usr/bin/pnpm'`). De plus Render prenait Node 26 par défaut.
**Correctif :** retirer `corepack enable` (pnpm est déjà préinstallé sur l'image
Render) et épingler `NODE_VERSION=20`. Les services **Docker** (backend, client)
ne sont pas concernés : `corepack enable` y fonctionne (FS accessible en
écriture dans le conteneur).

### 2. CORS — origines tronquées (`property: host`)
**Symptôme :** le backend renvoyait `access-control-allow-origin: veg-client-kr9d`
(hostname tronqué, sans schéma) → le navigateur bloquait tous les appels des
fronts.
**Cause :** `FRONTEND_URL` / `BACK_OFFICE_URL` étaient dérivées via
`fromService/property: host`, qui renvoie le hostname **sans** `https://`. Or le
backend compare l'`Origin` **complet** envoyé par le navigateur
(`server.ts` : `allowedOrigins.includes(origin)`).
**Correctif :** passer ces deux variables en `sync: false` et saisir les **URLs
publiques complètes** (`https://...onrender.com`) dans l'Environment du backend.

### 3. Région
`render.yaml` ne fixait pas de région → Render déployait en Oregon (US) par
défaut. Ajout de `region: frankfurt` sur `veg-postgres`, `veg-backend`,
`veg-client` (le back-office statique reste servi en global via le CDN).

---

## Vérification

```bash
# API up + données présentes
curl -fsS https://veg-backend-ooky.onrender.com/api/doc > /dev/null && echo "API OK"
curl -s https://veg-backend-ooky.onrender.com/api/public/menu | head -c 120   # doit lister des menus

# Fronts servis
curl -s -o /dev/null -w '%{http_code}\n' https://veg-client-kr9d.onrender.com
curl -s -o /dev/null -w '%{http_code}\n' https://veg-back-office.onrender.com
```

- Site public : https://veg-client-kr9d.onrender.com
- Back-office : https://veg-back-office.onrender.com
  — connexion `admin@viteetgourmand.fr` / `password123`
