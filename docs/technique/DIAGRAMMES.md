# Diagrammes — Vite & Gourmand

## 1. Diagramme de cas d'utilisation

Quatre acteurs, avec héritage des droits (Client hérite du Visiteur, Employé du Client,
Administrateur de l'Employé).

```mermaid
graph LR
    Visiteur((Visiteur))
    Client((Client))
    Employe((Employé))
    Admin((Administrateur))

    Client -.hérite.-> Visiteur
    Employe -.hérite.-> Client
    Admin -.hérite.-> Employe

    subgraph Public
        UC1[Consulter les menus]
        UC2[Voir le détail d'un menu]
        UC3[Filtrer les menus]
        UC4[Passer commande - invité]
        UC5[Créer un compte / Se connecter]
        UC6[Envoyer un message de contact]
        UC7[Voir les avis approuvés]
    end

    subgraph Espace Client
        UC8[Passer commande - authentifié]
        UC9[Suivre ses commandes]
        UC10[Modifier son profil]
        UC11[Laisser un avis]
    end

    subgraph Espace Employé
        UC12[Gérer le catalogue - menus, plats, allergènes]
        UC13[Traiter les commandes - changer statut]
        UC14[Modérer les avis]
        UC15[Éditer le contenu CMS]
    end

    subgraph Espace Admin
        UC16[Gérer les employés]
        UC17[Consulter les statistiques]
        UC18[Gérer les zones de livraison]
        UC19[Gérer les messages de contact]
    end

    Visiteur --> UC1 & UC2 & UC3 & UC4 & UC5 & UC6 & UC7
    Client --> UC8 & UC9 & UC10 & UC11
    Employe --> UC12 & UC13 & UC14 & UC15
    Admin --> UC16 & UC17 & UC18 & UC19
```

## 2. Diagramme de séquence — Passer une commande

Parcours de commande d'un client (authentifié ou invité), de la sélection au mail
de confirmation.

```mermaid
sequenceDiagram
    actor C as Client
    participant F as Front (Next.js)
    participant API as Backend (Hono)
    participant PG as PostgreSQL
    participant MG as MongoDB
    participant Mail as Service e-mail

    C->>F: Sélectionne un menu + quantité
    F->>F: Ajoute au panier (localStorage)
    C->>F: Valide le panier → checkout
    F->>API: GET /public/delivery-zones
    API->>PG: Lecture zones actives
    PG-->>API: Zones + tarifs
    API-->>F: Zones de livraison
    C->>F: Renseigne adresse, date, zone
    F->>API: POST /order (items, livraison)

    API->>PG: Vérifie menus (dispo, stock, min. pers.)
    API->>API: Calcule prix + remise 10% (si +5 pers.)
    API->>API: Calcule frais de livraison

    API->>PG: Transaction : Order + OrderItems + History + stock
    PG-->>API: Commande créée (statut PENDING)

    API-)MG: Enregistre les stats (tolérant aux pannes)
    API-)Mail: Envoie l'e-mail de confirmation

    API-->>F: 201 Created (récapitulatif)
    F->>F: Vide le panier
    F-->>C: Page de confirmation
    Mail-->>C: E-mail de confirmation de commande
```

## 3. Diagramme de séquence — Cycle de vie du statut d'une commande

Traitement d'une commande par le personnel, avec les e-mails déclenchés.

```mermaid
sequenceDiagram
    actor S as Employé / Admin
    participant BO as Back-office
    participant API as Backend
    participant PG as PostgreSQL
    participant MG as MongoDB
    participant Mail as Service e-mail

    S->>BO: Ouvre la liste des commandes
    BO->>API: GET /admin/orders
    API->>PG: Lecture commandes
    PG-->>BO: Commandes + statuts

    S->>BO: Change le statut (ex. PENDING → ACCEPTED)
    BO->>API: PUT /admin/orders/:id/status
    API->>API: Vérifie transition autorisée
    API->>PG: Met à jour statut + OrderHistory
    API-)MG: Journalise l'action (audit log)

    alt Passage à AWAITING_MATERIAL_RETURN
        API->>API: deadline = +10 jours ouvrés
        API-)Mail: E-mail « retour de matériel » (+ pénalité 600€)
    else Passage à COMPLETED
        API-)MG: Met à jour completedAt (stats)
        API-)Mail: E-mail « commande terminée »
    end

    API-->>BO: Statut mis à jour
    BO-->>S: Confirmation
```

## Statuts de commande (machine à états)

```mermaid
stateDiagram-v2
    [*] --> PENDING
    PENDING --> ACCEPTED
    PENDING --> REJECTED
    PENDING --> CANCELLED
    ACCEPTED --> PREPARING
    ACCEPTED --> CANCELLED
    PREPARING --> DELIVERING
    PREPARING --> CANCELLED
    DELIVERING --> DELIVERED
    DELIVERED --> AWAITING_MATERIAL_RETURN
    DELIVERED --> COMPLETED
    AWAITING_MATERIAL_RETURN --> COMPLETED
    COMPLETED --> [*]
    REJECTED --> [*]
    CANCELLED --> [*]
```
