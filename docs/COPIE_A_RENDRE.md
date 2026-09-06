# Copie à rendre — TP Développeur Web et Web Mobile

**NOM :** Avci
**Prénom :** Yasin
**Date de naissance :** 14/09/1994

---

**Lien du git :** https://github.com/ya5inq/vite-et-gourmand
**Lien de l'outil de gestion de projet :** https://trello.com/b/QsQPGCHa/vite-gourmand-ecf
**Lien du déploiement :** https://veg-client-kr9d.onrender.com/ — BO : https://veg-back-office.onrender.com/
**Login et mot de passe administrateur :** `admin@viteetgourmand.fr` / `password123`

> Compte client de démonstration (parcours utilisateur) : `client@viteetgourmand.fr` / `password123`

---

## Partie 1 : Analyse des besoins

### 1. Résumé du projet (200 à 250 mots)

Vite & Gourmand est une entreprise de traiteur bordelaise, tenue par Julie et José,
qui existe depuis vingt-cinq ans et propose des menus pour tout type d'événement,
des repas de fête aux réceptions d'entreprise. Jusqu'ici, ces menus étaient envoyés
par courriel aux habitués. L'objectif du projet est de leur donner une application
web pour gagner en visibilité et permettre aux clients de commander plus facilement.

L'application se compose de trois parties. Un site public, où les visiteurs
consultent la présentation de l'entreprise, parcourent l'ensemble des menus avec des
filtres dynamiques (prix, thème, régime alimentaire, nombre de personnes), consultent
le détail d'un menu et passent commande après s'être créé un compte. Un back-office,
réservé aux employés et à l'administrateur, pour gérer les menus, les plats, les
horaires, traiter les commandes selon un cycle de statuts précis, valider les avis et
consulter des statistiques. Enfin un backend, qui porte toute la logique métier :
authentification, règles de tarification et de livraison, gestion des commandes et
envoi d'e-mails transactionnels.

Le projet respecte les contraintes du sujet : une base relationnelle pour les données
métier et une base non relationnelle pour les statistiques. Il intègre les aspects
réglementaires attendus, à savoir la conformité RGPD (mentions légales, CGV,
politique de confidentialité) et l'accessibilité selon le RGAA. L'application est
déployée en ligne et fonctionnelle, comme l'exige le cahier des charges.

### 2. Cahier des charges — expression des besoins et spécifications fonctionnelles

**Acteurs et rôles**

- **Visiteur** : consulte le site, les menus et le détail, mais doit créer un compte
  pour commander.
- **Utilisateur (client)** : commande, suit ses commandes, modifie ses informations,
  dépose un avis.
- **Employé** : gère les menus, plats et horaires, traite les commandes, valide ou
  refuse les avis.
- **Administrateur** : dispose de toutes les capacités de l'employé, gère les comptes
  employés et consulte les statistiques.

**Fonctionnalités attendues**

*Site public*
- Page d'accueil : présentation de l'entreprise, mise en avant du professionnalisme de
  l'équipe, avis clients validés.
- Menu de navigation : retour à l'accueil, accès à tous les menus, connexion, contact.
- Pied de page : horaires du lundi au dimanche, accès aux mentions légales et aux CGV.
- Vue globale des menus : titre, description, nombre de personnes minimal et prix, avec
  bouton d'accès au détail — visible pour les visiteurs comme pour les personnes
  connectées. Filtres dynamiques (prix maximum, fourchette de prix, thème, régime,
  nombre de personnes) mis à jour sans rechargement de page.
- Vue détaillée d'un menu : galerie, description, thème, liste des plats (entrée, plat,
  dessert), allergènes, nombre de personnes minimal, prix, conditions mises en évidence,
  régime, stock. Bouton « commander » redirigeant vers la commande pré-remplie.
- Création de compte (nom, prénom, GSM, e-mail, adresse, mot de passe sécurisé), avec
  e-mail de bienvenue automatique. Connexion par e-mail et mot de passe, réinitialisation
  du mot de passe par e-mail.

*Commande*
- Informations de prestation (auto-remplies depuis le compte), adresse et date de
  livraison, heure souhaitée, nombre de personnes.
- Tarification : frais de livraison de 5 € majorés de 0,59 € par kilomètre hors
  Bordeaux, réduction de 10 % dès cinq personnes de plus que le minimum du menu,
  respect du nombre minimal de personnes.
- Récapitulatif détaillé du prix (menu + livraison) avant validation, puis e-mail de
  confirmation.

*Espace utilisateur*
- Historique et détail des commandes, modification des informations personnelles,
  modification ou annulation d'une commande tant qu'elle n'est pas acceptée, suivi des
  statuts, dépôt d'un avis (note de 1 à 5 et commentaire) une fois la commande terminée.

*Espace employé et administrateur*
- Gestion des menus, plats et horaires ; filtrage des commandes par statut ou par
  client ; mise à jour des statuts (accepté, en préparation, en cours de livraison,
  livré, en attente de retour de matériel, terminée), avec obligation de contacter le
  client avant toute annulation. Validation ou refus des avis.
- Pour l'administrateur uniquement : création et désactivation de comptes employés
  (sans création de compte administrateur depuis l'application), statistiques du nombre
  de commandes par menu et du chiffre d'affaires par menu et par durée, issues de la
  base non relationnelle.

*Contact* : formulaire (titre, description, e-mail) transmis par courriel à l'entreprise.

**Contraintes** : base relationnelle et base non relationnelle, déploiement en ligne,
conformité RGPD et accessibilité RGAA.

---

## Partie 2 : Spécifications techniques

### 1. Technologies utilisées et justification des choix

Le sujet impose deux contraintes fortes : une base relationnelle et une base non
relationnelle. Le reste de la pile a été choisi au regard de la qualité attendue
(sécurité, maintenabilité) et du périmètre fonctionnel.

| Besoin | Choix | Justification |
| --- | --- | --- |
| Base relationnelle | **PostgreSQL 16** | Intégrité référentielle forte entre commandes, menus et utilisateurs, types riches (`numeric`, `enum`) et transactions ACID indispensables pour créer une commande (commande + lignes + historique) de façon atomique. |
| Base non relationnelle | **MongoDB 7** | Imposée par le sujet pour les statistiques. Adaptée aux vues dénormalisées interrogées en lecture (statistiques par menu, journal d'audit), découplées du modèle transactionnel. |
| Langage | **TypeScript** de bout en bout | Un seul langage pour le front, le back et le SDK. Le typage statique réduit les erreurs et améliore la maintenabilité. |
| Framework backend | **Hono** avec `@hono/zod-openapi` | Léger, rapide, natif TypeScript. La validation Zod et la spécification OpenAPI sont générées à partir du même schéma, garantissant leur cohérence. |
| Accès aux données | **TypeORM** | ORM mature avec migrations versionnées, répondant à la compétence « composants d'accès aux données SQL ». |
| Architecture backend | **Clean Architecture + Inversify (injection de dépendances)** | Sépare les couches domaine, application et infrastructure. Les règles métier (calcul du prix, transitions de statut) sont isolées et testables : 191 tests unitaires. |
| Front public | **Next.js 15** (App Router, SSR) | Rendu côté serveur pour le référencement d'un site vitrine et la performance ; authentification par cookie httpOnly compatible avec le SSR. |
| Front back-office | **React 19 + Vite** (SPA) | Interface interne sans besoin de référencement : une application monopage rapide, servie en statique, suffit. |
| SDK d'API | **Orval** (généré depuis l'OpenAPI) | Les deux fronts consomment l'API via un SDK typé généré (axios + Zod), garantissant la cohérence entre le back et les fronts. |
| E-mails | **Resend** | API transactionnelle simple ; en l'absence de clé, les e-mails sont journalisés (pratique en développement). |
| Jobs planifiés | **pg-boss** | File d'attente adossée à PostgreSQL, sans infrastructure supplémentaire, pour la pénalité de retour de matériel. |

Le projet a d'abord été prototypé avec un *Backend-as-a-Service*, puis migré vers un
backend Node dédié : le TP exige de développer des composants métier côté serveur et
des composants d'accès aux données SQL et NoSQL, ce qu'un BaaS masque, et un backend
propre permet de maîtriser finement les règles métier et la sécurité.

### 2. Mise en place de l'environnement de travail (README.md)

Le dépôt est un **monorepo pnpm** regroupant cinq paquets : `backend`, `client`,
`back-office`, `packages/sdk` et `packages/ui`. Ce choix permet de partager le SDK et
les composants d'interface entre les fronts, et de versionner l'ensemble dans un seul
dépôt avec une version de `pnpm` figée (champ `packageManager`, installée via
`corepack`).

Prérequis : Node.js ≥ 20, pnpm ≥ 10, Docker + Compose (PostgreSQL et MongoDB en local),
Git. Les bases de données tournent dans des conteneurs Docker afin de reproduire à
l'identique l'environnement sur n'importe quel poste, sans installation système.

Étapes d'installation (détaillées dans le `README.md`) :

```bash
pnpm install                          # dépendances du monorepo
cp .env.dist .env                     # (+ backend/.env, client/.env.local, back-office/.env)
pnpm start:database                   # PostgreSQL + MongoDB via Docker
pnpm --filter backend migration:run   # schéma relationnel
pnpm --filter backend fixtures:load   # jeu de données + comptes de démo
pnpm dev:be   # API         (http://localhost:8080)
pnpm dev:cl   # site client  (http://localhost:3000)
pnpm dev:bo   # back-office  (http://localhost:3001)
```

Outils de qualité intégrés : ESLint (analyse statique), TypeScript (vérification de
types), Vitest (191 tests unitaires backend) et une intégration continue GitHub Actions
qui exécute lint, typecheck et tests à chaque push. Le SDK et la documentation d'API
sont générés automatiquement depuis l'OpenAPI (`pnpm generate-sdk`), la documentation
interactive étant exposée par le backend sur `/api/doc`.

### 3. Mécanismes de sécurité

**Authentification et sessions**
- Mots de passe **hachés avec bcrypt** (algorithme adaptatif, 10 tours de salage) — ils
  ne sont jamais stockés en clair.
- Authentification par **JWT** avec un mécanisme de **refresh token** stocké dans un
  **cookie httpOnly** (inaccessible au JavaScript, donc protégé contre le vol par XSS),
  marqué `secure` en production (transmission HTTPS uniquement) et `SameSite=Lax`
  (limitation des envois inter-sites, protection CSRF).
- **Politique de mot de passe** appliquée à l'inscription et à la réinitialisation :
  au moins huit caractères, avec une minuscule, une majuscule et un chiffre ou
  caractère spécial, contrôlée par une expression régulière partagée entre la validation
  des requêtes et le service.

**Autorisation**
- **Middlewares d'authentification et d'autorisation par rôle** : les routes protégées
  vérifient la validité du jeton, les routes d'administration vérifient en plus le rôle.
  Il est impossible de créer un compte administrateur depuis l'application (exigence du
  sujet).

**Validation des entrées**
- **Validation systématique des données** avec Zod sur l'ensemble des routes (le schéma
  sert à la fois à valider les requêtes et à générer la documentation OpenAPI). Toute
  entrée malformée est rejetée avant d'atteindre la logique métier.
- L'usage d'un **ORM (TypeORM)** avec requêtes paramétrées prévient les injections SQL.

**Front-end**
- Les formulaires (inscription, connexion, commande, contact) sont validés côté client
  (retour immédiat à l'utilisateur) **et** revérifiés côté serveur : la validation
  cliente ne fait pas foi.
- Le jeton d'accès n'est jamais exposé dans une URL ; l'authentification SSR du site
  client repose sur le cookie httpOnly.

**Transport et exploitation**
- HTTPS en production (certificats gérés par l'hébergeur), **CORS restreint aux seules
  origines des deux fronts**.
- **Journal d'audit** des actions sensibles et gestion centralisée des erreurs (pas de
  fuite d'information technique vers le client).

**Conformité**
- **RGPD** : mentions légales, CGV et politique de confidentialité complètes
  (responsable de traitement, finalités et bases légales, durées de conservation,
  sous-traitants, droits des personnes et voie de recours CNIL).

### 4. Veille technologique sur les vulnérabilités de sécurité

La référence suivie est le **OWASP Top 10**, classement de référence des risques de
sécurité des applications web, complété par les bulletins **GitHub Advisory Database**
(alertes de vulnérabilités sur les dépendances npm) et l'audit `pnpm audit`.

Cette veille a orienté des décisions concrètes du projet. Le risque *A07 – Identification
and Authentication Failures* a conduit à imposer une politique de mot de passe robuste
et à hacher les mots de passe avec bcrypt. Le risque *A03 – Injection* est couvert par
la validation Zod de toutes les entrées et l'usage de requêtes paramétrées via l'ORM.
Le risque *A05 – Security Misconfiguration* a motivé la restriction du CORS aux seules
origines légitimes et l'usage de cookies `httpOnly` / `secure` / `SameSite`. Le suivi
des advisories permet de mettre à jour rapidement une dépendance dès qu'une faille est
publiée.

---

## Partie 3 : Recherche

### 1. Situation de travail ayant nécessité une recherche (site anglophone)

Lors du déploiement du back-office (application Vite servie en statique) sur la
plateforme Render, le build échouait avec l'erreur
`EROFS: read-only file system, unlink '/usr/bin/pnpm'`, déclenchée par la commande
`corepack enable`. Cet échec annulait en cascade la création du service backend, ce
qui bloquait toute la mise en ligne.

La recherche a porté sur cette erreur précise. La documentation officielle de Render
consacrée au dépannage des déploiements indique que le système de fichiers des sites
statiques est en lecture seule et que les gestionnaires de paquets y sont déjà
disponibles, rendant `corepack enable` à la fois inutile et impossible.

**Source :** Render — *Troubleshooting Deploys*,
<https://render.com/docs/troubleshooting-deploys>

La solution appliquée a consisté à retirer `corepack enable` de la commande de build
(pnpm étant déjà préinstallé sur l'image) et à épingler la version de Node à 20. Le
build du back-office a alors abouti, et le backend a pu être créé.

### 2. Extrait du site anglophone et traduction

**Extrait original (anglais) :**

> « Static Sites run on a read-only filesystem. Package managers such as npm, yarn and
> pnpm are already available in the build environment, so you do not need to install or
> enable them yourself. »

**Traduction en français :**

> « Les sites statiques s'exécutent sur un système de fichiers en lecture seule. Les
> gestionnaires de paquets tels que npm, yarn et pnpm sont déjà disponibles dans
> l'environnement de build : vous n'avez donc pas besoin de les installer ni de les
> activer vous-même. »

Cet extrait a confirmé le diagnostic : la commande `corepack enable` tentait d'écrire
dans un système de fichiers en lecture seule alors que pnpm était déjà présent, d'où
la nécessité de simplement la supprimer.

---

## Autres ressources

- **Documentation du déploiement** : `docs/DEPLOYMENT_RENDER.md` (mise en ligne Render +
  MongoDB Atlas) et `docs/DEPLOYMENT.md` (conteneurisation Docker).
- **Documentation technique** : `docs/technique/DOCUMENTATION_TECHNIQUE.md`,
  modèle conceptuel de données `docs/technique/MCD.md`, diagrammes de cas d'usage et de
  séquence `docs/technique/DIAGRAMMES.md`.
- **Base de données** : scripts `docs/database/schema.sql` et `docs/database/seed.sql`.
- **Charte graphique** : `docs/CHARTE_GRAPHIQUE.md`.
- **Accessibilité** : `docs/ACCESSIBILITE_RGAA.md`.
- **Gestion de projet** : `docs/GESTION_DE_PROJET.md` et le tableau Trello.
- **Documentation d'API interactive** (application déployée) :
  <https://veg-backend-ooky.onrender.com/api/doc>

## Informations complémentaires

- **Architecture** : monorepo pnpm — backend (Hono + TypeORM + Inversify),
  site client (Next.js 15), back-office (React 19 + Vite), SDK TypeScript généré (Orval).
- **Bases de données** : PostgreSQL 16 (relationnelle) et MongoDB 7 (non relationnelle).
- **Qualité** : 191 tests unitaires backend (Vitest), intégration continue GitHub
  Actions (lint + typecheck + tests).
- **Hébergement** : Render (région Frankfurt, Union européenne) pour le backend, la base
  PostgreSQL, le site client et le back-office ; MongoDB Atlas pour la base non
  relationnelle. Disponibilité maintenue par une surveillance externe (UptimeRobot).
- **Comptes de démonstration** :
  administrateur `admin@viteetgourmand.fr` / `password123` ;
  client `client@viteetgourmand.fr` / `password123`.
