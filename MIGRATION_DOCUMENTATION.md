# Guide des Migrations - Vite & Gourmand

## Architecture

```
supabase/migrations/   <-- Source de verite (versionne dans git)
        |
        ├──> DB locale (Docker)    <-- pnpm db:reset
        |
        └──> DB prod (Supabase)    <-- pnpm db:push
```

---

## Commandes disponibles

| Commande | Description |
|----------|-------------|
| `pnpm db:start` | Demarrer Supabase local (Docker) |
| `pnpm db:stop` | Arreter Supabase local |
| `pnpm db:reset` | Reappliquer toutes les migrations + seed en local |
| `pnpm db:new <nom>` | Creer un nouveau fichier de migration |
| `pnpm db:push` | Pousser les migrations vers la prod |
| `pnpm db:types` | Regenerer les types TypeScript |

---

## Workflow : Modifier le schema

### Etape 1 - Creer une migration

```bash
pnpm db:new nom_de_la_modification
```

Cela cree un fichier dans `supabase/migrations/<timestamp>_nom_de_la_modification.sql`

### Etape 2 - Ecrire le SQL

Edite le fichier cree avec tes modifications. Exemple :

```sql
-- Ajouter une colonne
ALTER TABLE menus ADD COLUMN featured BOOLEAN DEFAULT false;

-- Creer une table
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ajouter une politique RLS
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Promotions visibles par tous" ON promotions FOR SELECT USING (true);
```

### Etape 3 - Tester en local

```bash
pnpm db:reset
```

Cela :
- Supprime la DB locale
- Reapplique toutes les migrations dans l'ordre
- Execute le seed (donnees de test)

Verifie que tout fonctionne sur http://127.0.0.1:54323 (Supabase Studio local)

### Etape 4 - Regenerer les types TypeScript

```bash
pnpm db:types
```

Met a jour `packages/supabase/src/database.types.ts` avec les nouveaux types.

### Etape 5 - Verifier que le code compile

```bash
pnpm typecheck
```

Corrige les erreurs TypeScript si necessaire.

### Etape 6 - Commit

```bash
git add supabase/migrations/
git add packages/supabase/src/database.types.ts
git commit -m "feat(db): description de la modification"
```

### Etape 7 - Pousser vers la prod

```bash
source .env && pnpm db:push --password "$SUPABASE_DB_PASSWORD"
```

---

## Checklist avant chaque deploy

- [ ] Migration creee (`pnpm db:new`)
- [ ] SQL ecrit
- [ ] Teste en local (`pnpm db:reset`)
- [ ] Types regeneres (`pnpm db:types`)
- [ ] Code compile (`pnpm typecheck`)
- [ ] Commit dans git
- [ ] Pousse en prod (`pnpm db:push`)

---

## Configuration

Les credentials sont dans `.env` (gitignore) :

```env
SUPABASE_ACCESS_TOKEN=ton_token
SUPABASE_DB_PASSWORD=ton_mot_de_passe
```

Pour obtenir ces valeurs :
- **Access Token** : https://supabase.com/dashboard/account/tokens
- **DB Password** : https://supabase.com/dashboard/project/ybumhrtxuxaiutlenpvy/settings/database

---

## Regles importantes

1. **Ne jamais modifier une migration deja poussee en prod**
   Creer une nouvelle migration pour corriger.

2. **Ne jamais modifier le schema directement en prod**
   Toujours passer par une migration locale.

3. **Toujours tester en local avant de pousser**
   `pnpm db:reset` repart de zero.

4. **Toujours regenerer les types apres une modif**
   Les types doivent correspondre au schema.

5. **Toujours commit les migrations**
   C'est la source de verite partagee.

---

## Demarrer Supabase local

```bash
# Demarrer
pnpm db:start

# URLs disponibles
# API:     http://127.0.0.1:54321
# Studio:  http://127.0.0.1:54323
# Emails:  http://127.0.0.1:54324

# Arreter
pnpm db:stop
```

---

## Liens utiles

- Dashboard Supabase : https://supabase.com/dashboard/project/ybumhrtxuxaiutlenpvy
- SQL Editor (prod) : https://supabase.com/dashboard/project/ybumhrtxuxaiutlenpvy/sql
- Studio local : http://127.0.0.1:54323
