# Déploiement gratuit — Render + MongoDB Atlas

Procédure pas-à-pas pour mettre Vite & Gourmand en ligne **gratuitement et durablement**.

- **Render** (gratuit) : backend (Hono), PostgreSQL, client (Next.js), back-office (SPA statique).
- **MongoDB Atlas M0** (gratuit à vie) : base NoSQL (stats admin + journal d'audit).

> ℹ️ Le fichier `render.yaml` à la racine décrit automatiquement les services Render.

---

## Étape 1 — MongoDB Atlas (base NoSQL)

1. Créer un compte sur <https://www.mongodb.com/cloud/atlas> (gratuit, sans carte).
2. Créer un cluster **M0** (Free).
3. **Database Access** → créer un utilisateur (login + mot de passe).
4. **Network Access** → autoriser `0.0.0.0/0` (accès depuis Render).
5. **Connect → Drivers** → copier l'URI de connexion, de la forme :
   ```
   mongodb+srv://<user>:<password>@<cluster>.xxxx.mongodb.net/vite_et_gourmand?retryWrites=true&w=majority
   ```
   → c'est la valeur `MONGO_URL` à donner au backend (étape 3).

---

## Étape 2 — Créer le Blueprint Render

1. Créer un compte sur <https://render.com> (connexion via GitHub).
2. **New → Blueprint** → sélectionner le dépôt `vite-et-gourmand`.
3. Render lit `render.yaml` et propose : `veg-postgres`, `veg-backend`, `veg-client`, `veg-back-office`.
4. Renseigner les variables marquées « à définir » :
   - `veg-backend` → **`MONGO_URL`** = l'URI Atlas de l'étape 1.
5. Lancer la création. **Le premier déploiement échouera partiellement** sur les URLs croisées : c'est normal (voir étape 3).

---

## Étape 3 — Câbler les URLs publiques (une seule fois)

Les fronts ont besoin de l'URL du backend, et le backend a besoin des URLs des fronts (CORS).
Après le premier déploiement, Render attribue les domaines publics :

- Backend : `https://veg-backend.onrender.com`
- Client : `https://veg-client.onrender.com`
- Back-office : `https://veg-back-office.onrender.com`

Renseigner alors :

| Service           | Variable                | Valeur                                      |
| ----------------- | ----------------------- | ------------------------------------------- |
| `veg-client`      | `NEXT_PUBLIC_API_URL`   | `https://veg-backend.onrender.com/api`      |
| `veg-back-office` | `VITE_API_URL`          | `https://veg-backend.onrender.com/api`      |

Les variables `FRONTEND_URL` / `BACK_OFFICE_URL` du backend sont câblées automatiquement
par le blueprint (`fromService`). Après avoir renseigné les URLs API, **redéployer**
`veg-client` et `veg-back-office` (Manual Deploy → Clear build cache & deploy), car
l'URL de l'API est figée **au moment du build**.

---

## Étape 4 — Charger le jeu de données initial

Les migrations tournent automatiquement au démarrage (`AUTO_MIGRATION=true`).
Pour le seed, ouvrir un **Shell** sur le service `veg-backend` (onglet *Shell* du dashboard) :

```bash
node dist/infrastructure/database/fixtures/scripts/setup.js
```

> Alternative : charger `docs/database/seed.sql` sur la base Postgres via `psql`
> (l'URL externe est fournie dans les détails de `veg-postgres`).

---

## Étape 5 — Empêcher le backend de s'endormir (anti-veille)

Sur l'offre gratuite, un service web Render s'endort après **15 min** sans requête
(réveil ~30 s au prochain accès). Pour une disponibilité continue :

1. Créer un compte gratuit sur <https://uptimerobot.com> (ou <https://cron-job.org>).
2. Ajouter un moniteur **HTTP(s)** :
   - URL : `https://veg-backend.onrender.com/api/doc`
   - Intervalle : **toutes les 10 minutes**.

Le ping régulier maintient le backend éveillé → aucune latence perçue par le jury.

> Astuce démo : à défaut de ping, ouvrir l'URL `/api/doc` 1 à 2 minutes avant la présentation
> suffit à réveiller l'API.

---

## Vérification

```bash
curl -fsS https://veg-backend.onrender.com/api/doc > /dev/null && echo "API OK"
```

- Site public : `https://veg-client.onrender.com`
- Back-office : `https://veg-back-office.onrender.com`
  — connexion `admin@viteetgourmand.fr` / `password123`

---

## Récapitulatif des URLs (à compléter pour les livrables)

| Élément            | URL publique |
| ------------------ | ------------ |
| Dépôt GitHub       |              |
| Site client        |              |
| Back-office        |              |
| API (doc OpenAPI)  |              |
