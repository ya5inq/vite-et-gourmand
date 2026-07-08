# Reste à faire — ECF Vite & Gourmand

Le **code** de l'application est terminé (backend + 2 fronts + SDK, Supabase retiré,
191 tests backend). Ce fichier liste ce qui reste pour compléter l'ECF : les
**livrables documentaires/visuels** exigés (PDF specs, pages 9 à 12) et quelques
finitions techniques optionnelles.

Légende : ☐ à faire · ◐ partiel · ☑ fait

---

## 1. Livrables OBLIGATOIRES de l'ECF

### Dépôt & démarche
- ◐ Dépôt Git avec bonnes pratiques (branches `main` / `develop` / une branche par feature mergée dans `develop`).
  - ☑ **Poussé sur GitHub** : https://github.com/ya5inq/vite-et-gourmand
  - ☑ Fusionné `develop` → `main`.
  - ☐ **Passer le dépôt en PUBLIC** (il est encore en `PRIVATE` — l'ECF exige un dépôt public).
- ☑ `README.md` : démarche pour déployer **en local**.
- ☑ **Fichier SQL** de création de base **et** d'intégration de données.
  - Export généré dans `docs/database/` : `schema.sql` (18 tables) + `seed.sql` (210 lignes).
    Vérifiés : se rechargent sans erreur dans une base vierge (`psql -f`).

### Application déployée
- ☐ **Déployer l'application en ligne** (le sujet impose le déploiement, avec pénalités si non en ligne à la livraison).
  - Cible possible : un PaaS (Render, Railway, Fly.io, Clever Cloud) ou un VPS avec Docker.
  - À déployer : **backend** (Node) + **PostgreSQL** + **MongoDB** + **client Next.js** + **back-office** (build statique servi).
  - ☑ **Dockerfiles de prod** (backend / client Next standalone / back-office nginx) + `docker-compose.prod.yml` — les 3 images buildent et démarrent (testé).
  - ☑ **Cible choisie : Render + MongoDB Atlas** (gratuit et pérenne). Blueprint `render.yaml` + guide `docs/DEPLOYMENT_RENDER.md`.
  - ☑ Documenter la **démarche de déploiement** → `docs/DEPLOYMENT.md` (Docker) + `docs/DEPLOYMENT_RENDER.md` (Render).
  - ☐ **Créer les comptes Render + Atlas et lancer le Blueprint** — action manuelle (suivre `docs/DEPLOYMENT_RENDER.md`).
  - ☐ Récupérer les **URLs publiques** (client + back-office) pour les livrables.

### Gestion de projet
- ☐ Lien vers l'outil de **gestion de projet** (Jira / Notion / Trello) + une **documentation expliquant la gestion de projet** (découpage, suivi).
  - Astuce : les 14 phases + le plan (`~/.claude/plans/...`) peuvent servir de base au backlog.

---

## 2. Documents PDF à produire

### Manuel d'utilisation (PDF)
- ☐ Présente l'application **et donne des identifiants** pour réaliser les différents parcours (visiteur, client, employé, admin).
  - Réutiliser `DEMO.md` comme trame + captures d'écran. Identifiant admin de démo : `admin@viteetgourmand.fr` / `password123`.

### Charte graphique (PDF)
- ☑ **Palette de couleurs** utilisée + **police(s)** → `docs/CHARTE_GRAPHIQUE.md` (valeurs réelles du thème Tailwind).
- ☐ **Export des maquettes** (wireframes & mockups) : **3 maquettes bureautiques + 3 maquettes mobiles**.
  - À faire dans Figma (ou équivalent) — action manuelle. La charte ci-dessus sert de base.

### Documentation de gestion de projet
- ☑ Rédigée → `docs/GESTION_DE_PROJET.md` (méthodo, backlog des 14 phases, Git).
  - ☐ Reporter le backlog dans un outil en ligne (Notion/Trello) + renseigner le lien.

### Documentation technique (PDF ou MD → PDF)
- ☑ **Réflexions initiales technologiques** → `docs/technique/DOCUMENTATION_TECHNIQUE.md`.
- ☑ **Configuration de l'environnement de travail** → même document.
- ☑ **Modèle Conceptuel de Données (MCD)** → `docs/technique/MCD.md` (ER Mermaid, 18 tables + collections Mongo, validé).
- ☑ **Diagramme de cas d'utilisation** + **diagrammes de séquence** → `docs/technique/DIAGRAMMES.md` (commande, cycle de statut, machine à états — validés).
- ☑ **Documentation du déploiement** → `docs/DEPLOYMENT.md` + `docs/DEPLOYMENT_RENDER.md`.
- ☐ **Convertir les .md en PDF** pour la remise (les diagrammes Mermaid se rendent sur GitHub / via un export).

---

## 3. Conformité & qualité

- ◐ **Accessibilité RGAA** (exigée par le sujet).
  - ☑ Audit statique du site client + corrections : alternatives d'images, `aria-hidden`
    des icônes décoratives, `role`/`aria-*` du panier (dialog) et de la notation (radiogroup),
    hiérarchie des titres, focus visible. Récap : `docs/ACCESSIBILITE_RGAA.md`.
  - ☐ Audit interactif final (axe / Lighthouse / WAVE) sur l'app déployée — action manuelle.
- ☑ **RGPD** : mentions légales, politique de confidentialité et CGV complétées et mises en
  conformité (responsable, finalités + bases légales, durées, sous-traitants, droits + CNIL,
  cookies), et alignées sur les règles métier réelles → `backend/.../fixtures/data/cms.data.ts`.

---

## 4. Finitions techniques (optionnel mais recommandé)

- ☐ **Filtre par régime alimentaire** sur la page `/menus` du client : la liste publique
  (`publicMenuGetAll`) ne renvoie pas les régimes par menu, donc le filtre régime est
  inopérant côté client. → Ajouter `dietaryRegimeId` en query SSR (le backend gère déjà ce
  filtre) ou enrichir la réponse de liste. (Thème / prix / personnes fonctionnent.)
- ☐ **Emails réels** : renseigner `RESEND_API_KEY` + un domaine expéditeur vérifié pour
  envoyer de vrais mails (sinon ils sont journalisés en console — suffisant pour la démo).
- ☐ **Tests fronts** : le backend a 191 tests ; les fronts n'en ont pas. Ajouter quelques
  tests (Vitest + Testing Library / MSW) sur les parcours clés serait un plus.
- ☑ **CI** (GitHub Actions) : lint + typecheck + `test:be` à chaque push → `.github/workflows/ci.yml`.
- ☑ **Dockerfile(s)** de production (backend + fronts) — faits, cf. §1.
- ☐ **Conteneurs Supabase obsolètes** : d'anciens `supabase_*_vite-et-gourmand` peuvent
  encore tourner localement ; les arrêter (`docker stop ...`) — purement local, sans impact code.

---

## 5. Ordre conseillé

1. Pousser sur GitHub (public) + outil de gestion de projet.
2. Dockerfiles + **déploiement en ligne** (récupérer les URLs).
3. Documentation technique (MCD + diagrammes + déploiement) + fichier SQL.
4. Charte graphique + 6 maquettes.
5. Manuel d'utilisation PDF (à partir de `DEMO.md` + captures).
6. Audit RGAA + corrections.
7. (Bonus) filtre régime, emails réels, tests fronts, CI.
