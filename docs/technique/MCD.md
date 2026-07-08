# Modèle Conceptuel de Données — Vite & Gourmand

L'application repose sur **deux bases** :

- **PostgreSQL** (relationnel) : cœur métier — catalogue, commandes, utilisateurs, CMS.
- **MongoDB** (non relationnel) : vues dérivées — statistiques de commandes et journal d'audit.

Le modèle ci-dessous reflète le schéma réel (18 tables, cf. `docs/database/schema.sql`).
Il étend le MCD de référence du sujet (annexe 1) : 3 rôles utilisateur, commandes
multi-menus via `order_items`, statuts de commande étendus, `distance_km` sur les zones,
et collections MongoDB.

## Diagramme entité-relation (PostgreSQL)

```mermaid
erDiagram
    user ||--o{ user_token : possede
    user ||--o{ orders : passe
    user ||--o{ reviews : redige
    user ||--o{ order_history : modifie
    user ||--o{ page_contents : met_a_jour

    orders ||--o{ order_items : contient
    orders ||--o{ order_history : trace
    orders ||--o| reviews : recoit
    delivery_zones ||--o{ orders : dessert

    menus ||--o{ order_items : reference
    menus }o--o{ dishes : "menu_dishes"
    menus }o--o{ dietary_regimes : "menu_dietary_regimes"
    dishes }o--o{ allergens : "dish_allergens"

    user {
        uuid id PK
        varchar email UK
        varchar password
        enum role "USER|EMPLOYEE|ADMIN"
        boolean admin
        varchar first_name
        varchar last_name
        varchar phone
        varchar address
        varchar city
        varchar postal_code
        boolean is_active
        boolean email_verified
        timestamptz last_login_at
        varchar preferred_language
    }

    user_token {
        uuid id PK
        uuid user_id FK
        varchar value UK
        boolean can_be_refreshed
        varchar token_type
        timestamptz expiration_date
    }

    orders {
        uuid id PK
        uuid user_id FK "nullable (invité)"
        enum status "PENDING..COMPLETED"
        varchar guest_email
        varchar guest_name
        varchar guest_phone
        varchar delivery_address
        varchar delivery_city
        varchar delivery_postal_code
        uuid delivery_zone_id FK
        date delivery_date
        numeric delivery_fee
        numeric total_price
        text rejection_reason
        uuid rejected_by FK
        timestamptz material_return_deadline
        boolean material_penalty_applied
        numeric penalty_amount
    }

    order_items {
        uuid id PK
        uuid order_id FK
        uuid menu_id FK
        int quantity
        numeric unit_price
        numeric line_total
        boolean discount_applied
    }

    order_history {
        uuid id PK
        uuid order_id FK
        enum old_status
        enum new_status
        uuid changed_by FK
        text reason
        varchar contact_mode
    }

    menus {
        uuid id PK
        varchar name
        text description
        varchar theme
        numeric price
        int min_persons
        int max_persons
        int stock
        text conditions
        text image_url
        boolean is_available
    }

    dishes {
        uuid id PK
        varchar name
        text description
        enum category "entree|plat|dessert"
        numeric price
        text image_url
        boolean is_available
    }

    allergens {
        uuid id PK
        varchar name UK
        varchar icon
    }

    dietary_regimes {
        uuid id PK
        varchar name UK
        text description
    }

    delivery_zones {
        uuid id PK
        varchar name
        varchar postal_code
        varchar city
        numeric distance_km
        boolean is_active
    }

    reviews {
        uuid id PK
        uuid user_id FK
        uuid order_id FK "UK (1 avis / commande)"
        int rating "1..5"
        text comment
        boolean is_approved
        uuid approved_by FK
    }

    contact_messages {
        uuid id PK
        varchar name
        varchar email
        varchar phone
        varchar subject
        text message
        boolean is_read
    }

    page_contents {
        uuid id PK
        text page
        text section
        jsonb content
        uuid updated_by FK
    }

    operating_hours {
        uuid id PK
        int day_of_week UK "0..6"
        time open_time
        time close_time
        boolean is_closed
    }
```

## Tables d'association (relations N-N)

| Table de jointure       | Relie                          |
| ----------------------- | ------------------------------ |
| `menu_dishes`           | `menus` ↔ `dishes`             |
| `menu_dietary_regimes`  | `menus` ↔ `dietary_regimes`    |
| `dish_allergens`        | `dishes` ↔ `allergens`         |

## Collections MongoDB (base non relationnelle)

| Collection    | Rôle                                                                 |
| ------------- | ------------------------------------------------------------------- |
| `order_stats` | Statistiques par menu (nombre de commandes, CA) — alimente le tableau de bord admin. |
| `audit_logs`  | Journal d'audit des actions du personnel (changements de statut, modération…). |

> Les collections MongoDB sont des **vues dérivées** tolérantes aux pannes : leur
> indisponibilité n'empêche pas le fonctionnement de l'API.
