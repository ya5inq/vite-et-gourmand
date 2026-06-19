# Reste à faire — ECF Vite & Gourmand

Le **code** de l'application est terminé (backend + 2 fronts + SDK, Supabase retiré,
191 tests backend). Ce fichier liste ce qui reste pour compléter l'ECF : les
**livrables documentaires/visuels** exigés (PDF specs, pages 9 à 12) et quelques
finitions techniques optionnelles.

Légende : ☐ à faire · ◐ partiel · ☑ fait

---

## 1. Livrables OBLIGATOIRES de l'ECF

### Dépôt & démarche
- ☑ Dépôt Git **public** avec bonnes pratiques (branches `main` / `develop` / une branche par feature mergée dans `develop`).
  - ☐ **Pousser sur GitHub en public** (le dépôt est local pour l'instant) et récupérer le lien.
  - ☐ Fusionner `develop` → `main` quand tout est validé (le code vit sur `develop`).
- ☑ `README.md` : démarche pour déployer **en local**.
- ☐ **Fichier SQL** de création de base **et** d'intégration de données.
  - On utilise migrations TypeORM + fixtures programmatiques. Le sujet précise :
    *« cela doit être un fichier SQL »*. → **Générer un export SQL** (`schema.sql` +
    `seed.sql`) depuis la base initialisée (ex. `pg_dump --schema-only` puis un dump
    des données, ou écrire un script qui exporte). À fournir à la racine ou dans `/docs`.

### Application déployée
- ☐ **Déployer l'application en ligne** (le sujet impose le déploiement, avec pénalités si non en ligne à la livraison).
  - Cible possible : un PaaS (Render, Railway, Fly.io, Clever Cloud) ou un VPS avec Docker.
  - À déployer : **backend** (Node) + **PostgreSQL** + **MongoDB** + **client Next.js** + **back-office** (build statique servi).
  - ☐ Documenter la **démarche de déploiement** (étapes, variables d'env, build) — voir doc technique ci-dessous.
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
- ☐ **Palette de couleurs** utilisée + **police(s)**.
  - Extraire les couleurs/typo réelles du thème Tailwind (`client/` et `packages/ui`).
- ☐ **Export des maquettes** (wireframes & mockups) : **3 maquettes bureautiques + 3 maquettes mobiles**.
  - À faire dans Figma (ou équivalent) : accueil, liste menus + détail, checkout / espace client… en desktop ET mobile.

### Documentation de gestion de projet (voir §1)

### Documentation technique (PDF ou MD → PDF)
- ☐ **Réflexions initiales technologiques** sur le sujet (choix de stack, pourquoi un vrai backend + NoSQL vs Supabase — déjà argumenté, à rédiger).
- ☐ **Configuration de l'environnement de travail** (prérequis, outils, étapes).
- ☐ **Modèle Conceptuel de Données (MCD)** ou diagramme de classes.
  - Le MCD de référence est dans l'annexe 1 du sujet ; le nôtre en diffère légèrement
    (3 rôles, `order_items` multi-menus, `distanceKm`, statuts étendus, collections Mongo).
    → Produire un **MCD à jour** (Mermaid ER, dbdiagram.io, ou Looping).
- ☐ **Diagramme de cas d'utilisation** + **diagramme de séquence** (ex. parcours commande, ou transition de statut + email).
- ☐ **Documentation du déploiement** (démarche + étapes) — recoupe §1.

---

## 3. Conformité & qualité

- ☐ **Accessibilité RGAA** (exigée par le sujet).
  - Audit des pages du **site client** (contrastes, libellés de formulaires, alternatives
    textuelles des images, navigation clavier, attributs ARIA, structure des titres).
  - Corriger les écarts. Outils : axe DevTools, Lighthouse, WAVE.
- ☐ **RGPD** : le code couvre l'essentiel (mots de passe hachés, cookie httpOnly, mail de
  bienvenue, données limitées). À **documenter** dans les mentions légales / politique de
  confidentialité (déjà présentes en CMS — relire et compléter si besoin).

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
- ☐ **CI** (GitHub Actions) : lint + typecheck + `test:be` à chaque push (bonne pratique).
- ☐ **Dockerfile(s)** de production pour le déploiement (backend + fronts) — nécessaire pour §1.
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
