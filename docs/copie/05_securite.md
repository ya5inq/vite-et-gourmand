# Partie 2 — Spécifications techniques

## Question 3 — Mécanismes de sécurité (formulaires, front-end et back-end)

### Authentification et sessions

- Les **mots de passe sont hachés avec bcrypt** (algorithme adaptatif, dix tours de salage) : ils ne sont jamais stockés en clair.
- L'authentification repose sur un **jeton JWT** accompagné d'un mécanisme de **refresh token** stocké dans un **cookie httpOnly**, donc inaccessible au JavaScript et protégé contre le vol par injection de script (XSS). Ce cookie est marqué `secure` en production (transmission par HTTPS uniquement) et `SameSite=Lax`, ce qui limite les envois inter-sites et protège contre les attaques CSRF.
- Une **politique de mot de passe** est appliquée à l'inscription et à la réinitialisation : au moins huit caractères, avec une minuscule, une majuscule et un chiffre ou caractère spécial. Elle est contrôlée par une expression régulière partagée entre la validation des requêtes et le service.

### Autorisation

- Des **middlewares d'authentification et d'autorisation par rôle** protègent les routes : les routes protégées vérifient la validité du jeton, les routes d'administration vérifient en plus le rôle de l'utilisateur.
- La **création d'un compte administrateur depuis l'application est impossible**, conformément au cahier des charges.

### Validation des entrées (formulaires et API)

- **Toutes les entrées sont validées avec Zod** sur l'ensemble des routes de l'API. Le même schéma sert à valider les requêtes et à générer la documentation OpenAPI. Toute donnée malformée est rejetée avant d'atteindre la logique métier.
- L'usage d'un **ORM (TypeORM)** avec des requêtes paramétrées prévient les injections SQL.

### Front-end

- Les formulaires (inscription, connexion, commande, contact) sont validés **côté client** pour un retour immédiat à l'utilisateur, puis **revérifiés côté serveur** : la validation côté client ne fait jamais foi.
- Le jeton d'accès n'est jamais exposé dans une URL. L'authentification du site client (rendu serveur) repose sur le cookie httpOnly.

### Transport et exploitation

- **HTTPS** en production (certificats gérés par l'hébergeur).
- **CORS restreint** aux seules origines des deux fronts.
- **Journal d'audit** des actions sensibles et **gestion centralisée des erreurs**, sans fuite d'information technique vers le client.

### Conformité RGPD

- Mentions légales, conditions générales de vente et politique de confidentialité complètes : responsable de traitement, finalités et bases légales, durées de conservation, sous-traitants, droits des personnes et voie de recours auprès de la CNIL.
