# Board Trello — Vite & Gourmand (ECF)

Backlog complet du projet, à reporter dans Trello (une **liste** = une colonne,
une **carte** = une tâche). Copier chaque carte : le titre en nom de carte, la
ligne « _Desc_ » en description, les labels dans les étiquettes.

**Labels suggérés :** 🟦 Analyse · 🟪 Design · 🟩 Front · 🟧 Back · 🟥 BDD ·
⬛ DevOps · 🟨 Docs · ⬜ Qualité

> État au 2026-09-05 : code terminé (191 tests backend), **application déployée
> en ligne** (Render + MongoDB Atlas). Restent surtout des livrables
> documentaires/visuels et le passage du dépôt en public.

---

## 📋 Backlog (idées / non planifié)

- **Emails transactionnels réels (Resend)**
  _Desc_ : Créer une clé Resend + domaine expéditeur vérifié, renseigner
  `RESEND_API_KEY`. Sans clé, les emails sont journalisés (suffisant pour la
  démo). — 🟧 Back · ⬛ DevOps

- **Tests automatisés des fronts**
  _Desc_ : Le backend a 191 tests ; client et back-office n'en ont pas. Ajouter
  Vitest + Testing Library / MSW sur les parcours clés (commande, connexion,
  filtres). — ⬜ Qualité · 🟩 Front

- **Nom de domaine personnalisé (optionnel)**
  _Desc_ : Brancher un domaine type `viteetgourmand.fr` sur le client Render au
  lieu de `*.onrender.com`. — ⬛ DevOps

---

## 🗓️ À faire

- **Passer le dépôt GitHub en PUBLIC** 🔴 _priorité_
  _Desc_ : L'ECF exige un dépôt public. GitHub → Settings → General → Change
  repository visibility → Public. URL : github.com/ya5inq/vite-et-gourmand. — 🟨 Docs

- **Créer le board Trello et renseigner le lien**
  _Desc_ : Reporter ce backlog dans Trello, rendre le board visible, ajouter le
  lien aux livrables. — 🟨 Docs

- **Manuel d'utilisation (PDF)**
  _Desc_ : Présenter l'application et donner les identifiants pour chaque parcours
  (visiteur, client, employé, admin). Base : `DEMO.md` + captures d'écran. Admin
  démo : `admin@viteetgourmand.fr` / `password123`. — 🟨 Docs

- **Maquettes — 3 bureautiques + 3 mobiles**
  _Desc_ : Exporter wireframes & mockups (Figma ou équivalent) pour la charte
  graphique. La palette/police réelles sont dans `docs/CHARTE_GRAPHIQUE.md`. — 🟪 Design

- **Convertir les docs .md en PDF pour la remise**
  _Desc_ : Exporter MCD, diagrammes, doc technique, charte, gestion de projet en
  PDF (les diagrammes Mermaid se rendent sur GitHub / via export). — 🟨 Docs

- **Audit RGAA interactif final**
  _Desc_ : Passer axe / Lighthouse / WAVE sur l'app déployée et corriger les
  écarts restants. Audit statique déjà fait (`docs/ACCESSIBILITE_RGAA.md`). — ⬜ Qualité

---

## 🔧 En cours

- **Finalisation des livrables ECF**
  _Desc_ : Rassembler dépôt public + URLs déployées + PDF (manuel, technique,
  charte, gestion de projet) + lien Trello dans le dossier de rendu. — 🟨 Docs

---

## ✅ Terminé — Analyse & conception

- **Analyse des besoins (cahier des charges)**
  _Desc_ : Dépouillement du sujet : parcours visiteur/client/employé/admin,
  règles métier (livraison, réduction 10 %, pénalité matériel 600 €). — 🟦 Analyse

- **Modèle Conceptuel de Données (MCD)**
  _Desc_ : Schéma relationnel (18 tables) + collections MongoDB. — `docs/technique/MCD.md`. — 🟦 Analyse · 🟥 BDD

- **Diagrammes de cas d'usage & de séquence**
  _Desc_ : Cas d'utilisation + séquences (commande, cycle de statut, machine à
  états). — `docs/technique/DIAGRAMMES.md`. — 🟦 Analyse

- **Charte graphique**
  _Desc_ : Palette de couleurs + polices (thème Tailwind réel). —
  `docs/CHARTE_GRAPHIQUE.md`. — 🟪 Design

- **Réflexions technologiques & configuration de l'environnement**
  _Desc_ : Choix de stack justifiés + setup du poste de dev. —
  `docs/technique/DOCUMENTATION_TECHNIQUE.md`. — 🟦 Analyse

## ✅ Terminé — Base de données

- **Base relationnelle PostgreSQL (TypeORM + migrations)**
  _Desc_ : 18 tables, migrations, contraintes et relations. — 🟥 BDD · 🟧 Back

- **Base NoSQL MongoDB (stats)**
  _Desc_ : Statistiques commandes par menu + chiffre d'affaires (base non
  relationnelle exigée par le sujet). — 🟥 BDD · 🟧 Back

- **Fichiers SQL (schéma + seed)**
  _Desc_ : `docs/database/schema.sql` + `seed.sql`, rechargeables sans erreur sur
  base vierge. — 🟥 BDD

- **Jeu de données de démonstration (fixtures)**
  _Desc_ : 14 allergènes, 7 régimes, 26 plats, 8 menus, 8 zones, contenus CMS,
  admin, commandes de démo. Idempotent (TRUNCATE + réinsertion). — 🟥 BDD

## ✅ Terminé — Backend (API)

- **API Hono + Clean Architecture (Inversify)**
  _Desc_ : Endpoints public / protected / admin, validation Zod, OpenAPI. — 🟧 Back

- **Authentification JWT + refresh (cookie httpOnly)**
  _Desc_ : Inscription, connexion, mot de passe oublié/réinitialisation, rôles
  (utilisateur / employé / admin). — 🟧 Back

- **Gestion des commandes & cycle de statut**
  _Desc_ : Création (invité + client), machine à états (accepté → en préparation →
  livraison → livré → retour matériel → terminée), motif d'annulation. — 🟧 Back

- **Règles métier livraison & tarification**
  _Desc_ : Frais 5 € + 0,59 €/km hors Bordeaux, réduction 10 % dès +5 personnes,
  minimum de personnes par menu. — 🟧 Back

- **Statistiques admin (MongoDB)**
  _Desc_ : Commandes par menu + CA par menu avec filtres (menu, durée). — 🟧 Back

- **SDK TypeScript généré (Orval)**
  _Desc_ : SDK typé (axios + zod) généré depuis l'OpenAPI, consommé par les deux
  fronts. — 🟧 Back · 🟩 Front

- **Emails transactionnels (templates)**
  _Desc_ : Bienvenue, réinit. mot de passe, compte employé, confirmation de
  commande, retour/pénalité matériel, avis. Journalisés à défaut de clé Resend. — 🟧 Back

## ✅ Terminé — Front client (Next.js)

- **Page d'accueil**
  _Desc_ : Présentation entreprise, professionnalisme de l'équipe, avis clients
  validés. — 🟩 Front

- **Vue globale des menus + filtres dynamiques**
  _Desc_ : Filtres prix max, fourchette, thème, régime, nombre de personnes —
  sans rechargement. — 🟩 Front

- **Vue détaillée d'un menu**
  _Desc_ : Tous les éléments du menu + conditions mises en évidence + bouton
  commander (pré-remplissage). — 🟩 Front

- **Création de compte & connexion**
  _Desc_ : Inscription (mot de passe 10+ car., règles), connexion, mot de passe
  oublié. — 🟩 Front

- **Tunnel de commande**
  _Desc_ : Infos prestation (auto-remplies si connecté), zone de livraison, date,
  nombre de personnes, récap prix (menu + livraison) avant validation. — 🟩 Front

- **Espace utilisateur**
  _Desc_ : Historique des commandes, détail, modification/annulation (avant
  acceptation), suivi de statut, dépôt d'avis (note 1–5 + commentaire). — 🟩 Front

- **Page de contact**
  _Desc_ : Formulaire (titre, description, email) envoyé à l'entreprise. — 🟩 Front

- **Pied de page + pages légales**
  _Desc_ : Horaires (lun→dim), mentions légales, CGV, politique de
  confidentialité. — 🟩 Front

## ✅ Terminé — Back-office (React/Vite)

- **Espace employé**
  _Desc_ : Gestion menus/plats/horaires, filtre commandes par statut/client,
  mise à jour des statuts (avec contact client obligatoire avant annulation),
  validation/refus des avis. — 🟩 Front

- **Espace administrateur**
  _Desc_ : Tout ce que fait l'employé + création/désactivation de comptes
  employés, statistiques (graphique commandes par menu, CA par menu/durée). — 🟩 Front

- **Gestion de contenu (CMS)**
  _Desc_ : Édition des contenus des pages (accueil, menus, contact, footer,
  légal) depuis le back-office. — 🟩 Front

## ✅ Terminé — Qualité & conformité

- **Conformité RGPD**
  _Desc_ : Mentions légales, CGV, politique de confidentialité (responsable,
  finalités + bases légales, durées, sous-traitants, droits + CNIL). — ⬜ Qualité

- **Accessibilité RGAA (audit statique + corrections)**
  _Desc_ : Alternatives d'images, aria-* icônes/dialog/notation, hiérarchie des
  titres, focus visible. — `docs/ACCESSIBILITE_RGAA.md`. — ⬜ Qualité

- **Restauration typographie FR (accents, €, apostrophes)**
  _Desc_ : Correction de tous les textes (fixtures, CMS, légal, UI client &
  back-office, emails) — 66 fichiers, cohérence référentielle vérifiée. — ⬜ Qualité

- **Intégration continue (GitHub Actions)**
  _Desc_ : lint + typecheck + tests backend à chaque push. —
  `.github/workflows/ci.yml`. — ⬛ DevOps

## ✅ Terminé — Déploiement

- **Dockerisation (prod)**
  _Desc_ : Dockerfiles backend / client Next standalone / back-office +
  `docker-compose.prod.yml`. — ⬛ DevOps

- **Infrastructure as Code (render.yaml)**
  _Desc_ : Blueprint Render décrivant les 4 services, région Frankfurt (UE). — ⬛ DevOps

- **Déploiement en ligne (Render + MongoDB Atlas)**
  _Desc_ : Backend, PostgreSQL, client, back-office sur Render (free) + MongoDB
  Atlas M0. URLs :
  client https://veg-client-kr9d.onrender.com ·
  back-office https://veg-back-office.onrender.com ·
  API https://veg-backend-ooky.onrender.com/api/doc. — ⬛ DevOps

- **Correctifs de déploiement**
  _Desc_ : Fix build back-office (corepack/EROFS + Node 20), CORS (URLs
  complètes), région Frankfurt, seed via URL externe (Shell indispo en gratuit). —
  `docs/DEPLOYMENT_RENDER.md`. — ⬛ DevOps

- **Anti-veille (UptimeRobot)**
  _Desc_ : 2 moniteurs HTTP (backend + client) toutes les 5 min pour éviter la
  mise en veille des services gratuits. — ⬛ DevOps

- **Chargement des données en production (seed)**
  _Desc_ : Exécution de `setup.ts` sur la base Render via l'External Database URL
  (SSL requis). Données accentuées vérifiées via l'API. — 🟥 BDD · ⬛ DevOps

## ✅ Terminé — Gestion de projet & docs

- **Dépôt Git avec bonnes pratiques**
  _Desc_ : Branches `main` / `develop` + une branche par feature mergée dans
  `develop`. Poussé sur GitHub. — 🟨 Docs

- **README (démarrage local)**
  _Desc_ : Procédure d'installation et de lancement en local. — 🟨 Docs

- **Documentation de gestion de projet**
  _Desc_ : Méthodologie, backlog des phases, workflow Git. —
  `docs/GESTION_DE_PROJET.md`. — 🟨 Docs

- **Documentation technique & de déploiement**
  _Desc_ : Doc technique, MCD, diagrammes, déploiement Docker + Render. —
  `docs/technique/` + `docs/DEPLOYMENT*.md`. — 🟨 Docs
