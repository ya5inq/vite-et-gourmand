# Démo guidée — Vite & Gourmand

Parcours complet de bout en bout pour présenter l'application au jury : on lance
l'infra, on montre les **parcours visiteur / client / employé / administrateur**,
et on vérifie les **règles métier** et la **base non relationnelle**.

> Durée : ~15 min. Tout se fait en local. Identifiants de démo plus bas.

---

## 0. Prérequis et nettoyage

```bash
cd /Users/yasinavci/Projects/yasin/vite-et-gourmand
git switch develop          # toutes les fonctionnalités sont sur develop
node -v                     # >= 20
docker info > /dev/null && echo "Docker OK"
```

> ⚠️ **Conteneurs Supabase obsolètes** : d'anciens conteneurs `supabase_*_vite-et-gourmand`
> peuvent encore tourner (avant migration). On peut les arrêter, ils ne servent plus :
> ```bash
> docker ps --format '{{.Names}}' | grep '^supabase_.*vite-et-gourmand' | xargs -r docker stop
> ```

> ⚠️ **Port 5432 occupé ?** Un autre projet utilise peut-être déjà 5432
> (`docker ps | grep 5432`). Dans ce cas, lancer Postgres sur un port alternatif
> avec `DB_HOST_PORT=5433` (voir étape 1) et ajuster `DATABASE_URL` en conséquence.

---

## 1. Lancer l'infrastructure

```bash
# Variables d'env (valeurs de dev par défaut)
cp .env.dist .env
cp .env.dist backend/.env
cp .env.dist client/.env.local
cp .env.dist back-office/.env

# Bases de données (Postgres + Adminer + MongoDB + mongo-express)
# Si 5432 est libre :
pnpm start:database
# Sinon (5432 occupé), Postgres sur 5433 :
#   DB_HOST_PORT=5433 docker compose up -d postgres adminer mongo mongo-express
#   puis éditer DATABASE_URL dans backend/.env -> ...@localhost:5433/...
```

À montrer au jury :
- **Adminer** (base relationnelle) : http://localhost:8089
- **mongo-express** (base non relationnelle) : http://localhost:8081

---

## 2. Initialiser et générer

```bash
pnpm install
pnpm migration:run        # crée les tables (PostgreSQL)
pnpm fixtures:load         # 14 allergènes, 7 régimes, 26 plats, 8 menus, zones, horaires, CMS, admin
pnpm generate-sdk          # OpenAPI du backend -> SDK TypeScript consommé par les fronts
```

> Montrer dans Adminer : les tables `menus`, `dishes`, `orders`, `order_items`,
> `user`, `reviews`, etc. (la **base relationnelle** demandée par le référentiel).

---

## 3. Démarrer les 3 applications

Dans 3 terminaux séparés :

```bash
pnpm dev:be      # API         -> http://localhost:8080
pnpm dev:cl      # Site client  -> http://localhost:3000
pnpm dev:bo      # Back-office  -> http://localhost:3001
```

Vérification rapide de l'API :
```bash
curl -s http://localhost:8080/api/public/healthcheck
# Doc OpenAPI interactive : http://localhost:8080/reference (Scalar) ou /ui (Swagger)
```

---

## 4. Identifiants de démo

| Rôle | Email | Mot de passe | Espace |
|------|-------|--------------|--------|
| Administrateur | `admin@viteetgourmand.fr` | `password123` | Back-office (tout) |
| Client | *à créer en direct* (étape 5.2) | *au choix* | Site client |
| Employé | *créé par l'admin* (étape 7.3) | *via email* | Back-office (métier) |

> Mot de passe valide = 10 caractères mini, 1 majuscule, 1 minuscule, 1 chiffre/spécial.

---

## 5. Parcours CLIENT (site http://localhost:3000)

### 5.1 Visiteur (non connecté)
1. **Accueil** `/` : présentation entreprise, mise en avant de l'équipe, **avis clients validés**, menus populaires. (Données chargées en **SSR** depuis l'API.)
2. **Nos menus** `/menus` : la vue globale, avec **filtres** (thème, prix, nombre de personnes). Cliquer un menu.
3. **Détail menu** `/menus/[id]` : galerie, description, **liste des plats par catégorie** (entrée/plat/dessert), **allergènes**, régimes, **conditions** mises en évidence, prix pour le nombre de personnes minimal.
4. **Pied de page** : **horaires** (lundi→dimanche), liens **mentions légales / CGV** (contenu CMS).
5. **Contact** `/contact` : envoyer un message → persisté + email à l'entreprise (loggé en console côté backend en mode dev).

### 5.2 Création de compte + connexion
1. **S'inscrire** `/auth/register` : nom, prénom, email, GSM, adresse, mot de passe sécurisé → rôle `utilisateur`, email de bienvenue (loggé).
2. **Se connecter** `/auth/login`.
   - Le backend pose un **refresh token en cookie httpOnly** ; l'access token est en mémoire. (Sécurité : montrer dans les DevTools → Application → Cookies que le cookie est `HttpOnly`.)

### 5.3 Commander — **règles métier serveur à montrer**
1. Depuis un menu, **Ajouter au panier**, puis `/panier`, puis **Commander** → `/checkout`.
2. Renseigner la prestation : adresse, ville, **date**, créneau. Choisir une **zone de livraison**.
   - **Prix de livraison calculé par le serveur** : `0 €` dans Bordeaux, `5 € + 0,59 €/km` ailleurs (ex. Mérignac ≈ 9,72 €). À montrer en changeant de zone.
3. Choisir le **nombre de personnes** :
   - **Impossible de commander en dessous du minimum** du menu (message d'erreur).
   - **Remise automatique de 10 %** si on commande ≥ (min + 5) personnes — le total change en direct.
4. Valider → **email de confirmation** + page **confirmation** avec le récapitulatif (prix menu + livraison).

### 5.4 Espace utilisateur `/dashboard`
- **Historique des commandes** avec leur statut.
- Tant que la commande n'est pas « acceptée », elle est **modifiable / annulable** (selon implémentation).
- Une fois **« terminée »**, l'utilisateur reçoit un mail l'invitant à **donner un avis** → `/dashboard/avis` : note de 1 à 5 + commentaire (uniquement sur une commande terminée lui appartenant, 1 avis par commande).

---

## 6. Parcours EMPLOYÉ / 7. ADMIN (back-office http://localhost:3001)

Se connecter avec le compte **admin** (`admin@viteetgourmand.fr` / `password123`).

### 6. Espace employé (gestion métier)
- **Menus / Plats / Allergènes / Régimes** : CRUD complet (configurer l'offre).
- **Commandes** : liste **filtrable par statut et par client**, détail (items, historique).
  - **Faire évoluer une commande** : `en attente → acceptée → en préparation → en cours de livraison → livré → (en attente du retour de matériel) → terminée`. Les transitions invalides sont **refusées par le serveur**.
  - **Annuler / rejeter** : le serveur **exige un motif + un mode de contact** (téléphone/email) — montrer le refus si on ne les fournit pas.
  - Statut **« en attente du retour de matériel »** : pose une échéance à **10 jours ouvrés** + mail au client (à défaut, **600 € de pénalité** appliqués automatiquement par un job planifié).
- **Avis** : modération (valider pour publication sur l'accueil, ou supprimer).
- **Zones de livraison**, **horaires d'ouverture**, **pages CMS**, **messages de contact** (lu/non-lu).

### 7. Espace administrateur (en plus de tout l'employé)
1. **Comptes employés** : **créer un employé** (email + nom) → l'employé reçoit un **mail pour définir son mot de passe** (le mot de passe n'est **jamais** transmis). On peut **désactiver** un compte (départ).
   - À montrer : **impossible de créer un administrateur** depuis l'application.
2. **Statistiques** (la **base non relationnelle** demandée par le référentiel) :
   - **Nombre de commandes par menu** + comparaison (graphique).
   - **Chiffre d'affaires par menu**, filtrable **par menu et par durée**.
   - Données servies **depuis MongoDB** — montrer la collection `order_stats` dans **mongo-express** (http://localhost:8081), et `audit_logs` (traçabilité des actions).

---

## 8. Points techniques à mettre en avant au jury

- **Deux bases de données** : PostgreSQL (relationnel, via TypeORM) **+** MongoDB (non relationnel, stats + audit) → exigence du référentiel.
- **Composants métier côté serveur** écrits à la main : calcul de livraison, remise, garde de stock, machine à états, pénalité — tout est **testé** (`pnpm test:be` → 191 tests).
- **Sécurité / RGPD** : mots de passe hachés (bcrypt), JWT + **cookie httpOnly**, séparation des rôles (middlewares), validation des entrées (zod), pas de secret exposé côté client.
- **Architecture** : Clean Architecture (domain/application/adapters/infrastructure/entrypoints), API documentée en **OpenAPI**, **SDK typé** généré et consommé par les deux fronts.
- **Accessibilité / RGAA** : *(à compléter — voir TODO.md)*.

---

## 9. Démo express (sans naviguer) — tout en curl

Pour prouver les règles métier sans cliquer (utile en secours) :

```bash
B=http://localhost:8080/api

# Login admin -> récupère un token
TOK=$(curl -s -X POST $B/public/auth/login -H 'content-type: application/json' \
  -d '{"email":"admin@viteetgourmand.fr","password":"password123"}' \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['accessToken'])")

# Un menu (id + minPersons)
curl -s "$B/public/menu?limit=1" | python3 -m json.tool | head -30

# Calcul de livraison : Bordeaux (0€) vs Mérignac (~9,72€)
curl -s -X POST $B/public/delivery-zone/calculate-price -H 'content-type: application/json' -d '{"postalCode":"33000"}'
curl -s -X POST $B/public/delivery-zone/calculate-price -H 'content-type: application/json' -d '{"postalCode":"33700"}'

# Stats Mongo (admin) : commandes/menu et CA/menu
curl -s "$B/admin/stats/orders-by-menu"  -H "Authorization: Bearer $TOK"
curl -s "$B/admin/stats/revenue-by-menu" -H "Authorization: Bearer $TOK"
```

---

## 10. Arrêt / nettoyage

```bash
# Stopper les 3 dev servers (Ctrl-C dans chaque terminal)
pnpm stop:database         # arrête Postgres + Mongo (conserve les volumes)
# Pour repartir de zéro : docker compose down -v  (supprime les données)
```
