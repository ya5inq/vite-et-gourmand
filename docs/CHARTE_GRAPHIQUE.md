# Charte graphique — Vite & Gourmand

Identité visuelle d'un traiteur bordelais : chaleureuse, gourmande et élégante.
Les valeurs ci-dessous sont extraites du thème réel (Tailwind v4, `@theme` dans les
fichiers `globals.css` du client et du back-office).

## 1. Typographie

**Police principale : Inter**

- Déclarée dans `client/src/styles/globals.css` : `--font-sans: 'Inter', system-ui, -apple-system, sans-serif;`
- Fallback système : `system-ui, -apple-system, sans-serif`
- Choix motivé par sa lisibilité à l'écran et son caractère moderne et neutre, qui
  laisse la couleur et la photographie culinaire porter l'identité.

## 2. Palette de couleurs

### Couleurs de marque

| Rôle | Couleur | Hex |
| --- | --- | --- |
| **Primaire** (CTA, liens, focus) | Orange-brun chaud | `#c2410c` |
| **Accent** (client) | Jaune pâle gastronomique | `#fef3c7` |
| **Accent — texte** | Marron | `#92400e` |
| **Thème PWA** | Orange | `#E67E22` |

### Couleurs neutres

| Rôle | Hex |
| --- | --- |
| Fond de page | `#ffffff` |
| Cartes / conteneurs | `#ffffff` |
| Texte principal | `#1c1917` |
| Texte secondaire / muted | `#78716c` |
| Zone secondaire / muted (fond) | `#f5f5f4` |
| Bordures / inputs | `#e7e5e4` |

### Couleurs d'état

| État | Fond | Texte |
| --- | --- | --- |
| Succès | `green-100` | `green-800` |
| Avertissement | `yellow-100` | `yellow-800` |
| Erreur / destructif | `#dc2626` | `#ffffff` |

> Le back-office reprend la même primaire mais un accent plus sobre (beige `#f5f5f4`
> au lieu du jaune), avec des tokens de barre latérale dédiés (`--color-sidebar-*`).

## 3. Tokens de design

**Rayons de bordure** (`--radius-*`, back-office) :

| Token | Valeur |
| --- | --- |
| `sm` | `0.25rem` (4px) |
| `md` | `0.375rem` (6px) |
| `lg` | `0.5rem` (8px) |

Les cartes utilisent `rounded-xl` (16px), les avatars/icônes `rounded-full`.

**Ombres** : échelle Tailwind `shadow-sm` → `shadow-lg` (inputs légers, cartes et
sur-couches plus prononcées).

**Espacement** : échelle Tailwind (base 4px). Conteneurs de cartes en `p-6` (24px).

## 4. Aperçu de la palette

```
Primaire   #c2410c  ██████    Accent     #fef3c7  ██████
Texte      #1c1917  ██████    Muted      #78716c  ██████
Fond       #ffffff  ██████    Bordure    #e7e5e4  ██████
Succès     #16a34a  ██████    Erreur     #dc2626  ██████
```

> Les maquettes (3 bureautiques + 3 mobiles) sont à réaliser dans Figma à partir de
> cette charte, puis à exporter dans le PDF de charte graphique final.
