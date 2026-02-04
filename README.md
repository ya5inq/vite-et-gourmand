# Vite & Gourmand

Application web pour un service de traiteur basé à Bordeaux. Comprend un site client pour les commandes et un back-office pour la gestion.

## Architecture

```
vite-et-gourmand/
├── client/          # Site client (Next.js 15)
├── back-office/     # Interface admin (React + Vite)
├── packages/
│   ├── supabase/    # Types et clients Supabase partagés
│   └── ui/          # Composants UI partagés
└── supabase/        # Configuration et migrations Supabase
```

## Prérequis

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 8
- [Docker](https://www.docker.com/) (pour Supabase local)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### Installation des prérequis

```bash
# Installer pnpm
npm install -g pnpm

# Installer Supabase CLI (macOS)
brew install supabase/tap/supabase

# Installer Supabase CLI (npm)
npm install -g supabase
```

## Installation

### 1. Cloner le repository

```bash
git clone git@github.com:ya5inq/vite-et-gourmand.git
cd vite-et-gourmand
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Configuration des variables d'environnement

Copier le fichier d'exemple et l'adapter :

```bash
cp .env.dist client/.env.local
```

Pour le développement local avec Supabase, les valeurs par défaut fonctionnent :

```env
# Supabase (Next.js client)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# Vite (back-office)
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

### 4. Démarrer Supabase

```bash
# Démarrer les services Supabase (Docker doit être lancé)
supabase start

# Les migrations sont appliquées automatiquement
# Les données de seed sont chargées depuis supabase/seed.sql
```

Supabase démarre plusieurs services :
- **API**: http://127.0.0.1:54321
- **Studio**: http://127.0.0.1:54323 (interface d'administration)
- **Inbucket**: http://127.0.0.1:54324 (emails de test)

### 5. Démarrer les applications

Dans des terminaux séparés :

```bash
# Terminal 1 - Site client (port 3000)
pnpm --filter client dev

# Terminal 2 - Back-office (port 5173)
pnpm --filter back-office dev
```

Ou lancer les deux en parallèle :

```bash
pnpm dev
```

## Accès aux applications

| Application | URL | Description |
|-------------|-----|-------------|
| Client | http://localhost:3000 | Site public pour les clients |
| Back-office | http://localhost:5173 | Interface d'administration |
| Supabase Studio | http://localhost:54323 | Gestion de la base de données |
| Inbucket | http://localhost:54324 | Emails de test |

## Commandes utiles

### Développement

```bash
# Installer les dépendances
pnpm install

# Lancer tous les projets en dev
pnpm dev

# Lancer uniquement le client
pnpm --filter client dev

# Lancer uniquement le back-office
pnpm --filter back-office dev
```

### Supabase

```bash
# Démarrer Supabase
supabase start

# Arrêter Supabase
supabase stop

# Voir le statut
supabase status

# Réinitialiser la base de données (applique migrations + seed)
supabase db reset

# Créer une nouvelle migration
supabase migration new nom_de_la_migration

# Générer les types TypeScript
supabase gen types typescript --local > packages/supabase/src/database.types.ts
```

### Build

```bash
# Build du client
pnpm --filter client build

# Build du back-office
pnpm --filter back-office build

# Build de tous les packages
pnpm build
```

## Structure de la base de données

### Tables principales

- `profiles` - Profils utilisateurs (lié à auth.users)
- `menus` - Menus disponibles
- `dishes` - Plats composant les menus
- `allergens` - Liste des allergènes
- `orders` - Commandes clients
- `order_items` - Items de chaque commande
- `reviews` - Avis clients
- `delivery_zones` - Zones de livraison avec tarifs

### Rôles utilisateurs

- `client` - Utilisateur standard
- `employee` - Employé avec accès au back-office
- `admin` - Administrateur avec tous les droits

## Création d'un utilisateur admin

Via Supabase Studio (http://localhost:54323) :

1. Aller dans **Authentication** > **Users**
2. Cliquer sur **Add user**
3. Remplir email et mot de passe
4. Aller dans **Table Editor** > **profiles**
5. Modifier le `role` de l'utilisateur en `admin`

Ou via SQL :

```sql
-- Mettre à jour le rôle d'un utilisateur existant
UPDATE profiles SET role = 'admin' WHERE id = 'USER_UUID';
```

## Technologies utilisées

- **Frontend Client**: Next.js 15, React 19, Tailwind CSS
- **Frontend Back-office**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Monorepo**: pnpm workspaces
- **Validation**: Zod, React Hook Form

## Dépannage

### Supabase ne démarre pas

```bash
# Vérifier que Docker est lancé
docker ps

# Nettoyer et redémarrer
supabase stop --no-backup
supabase start
```

### Erreurs de types TypeScript

```bash
# Regénérer les types Supabase
supabase gen types typescript --local > packages/supabase/src/database.types.ts

# Rebuild les packages
pnpm build
```

### Port déjà utilisé

```bash
# Trouver le processus utilisant le port (ex: 3000)
lsof -i :3000

# Tuer le processus
kill -9 <PID>
```
