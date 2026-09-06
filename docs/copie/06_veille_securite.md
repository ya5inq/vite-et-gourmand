# Partie 2 — Spécifications techniques

## Question 4 — Veille technologique sur les vulnérabilités de sécurité

La référence suivie est le **OWASP Top 10**, classement de référence des dix risques de sécurité les plus critiques des applications web. Il est complété par les bulletins de la **GitHub Advisory Database**, qui alerte sur les vulnérabilités connues des dépendances npm, et par la commande d'audit `pnpm audit`, qui signale les paquets vulnérables du projet.

Cette veille a orienté des décisions concrètes du projet :

- **A07 – Identification and Authentication Failures** : ce risque a conduit à imposer une politique de mot de passe robuste et à hacher les mots de passe avec bcrypt, ainsi qu'à gérer les sessions par jeton avec un refresh token en cookie httpOnly.
- **A03 – Injection** : couvert par la validation Zod de toutes les entrées et par l'usage de requêtes paramétrées via l'ORM, ce qui prévient les injections SQL.
- **A05 – Security Misconfiguration** : ce risque a motivé la restriction du CORS aux seules origines légitimes et l'emploi de cookies `httpOnly`, `secure` et `SameSite`.

Le suivi régulier des advisories permet de réagir rapidement : dès qu'une faille est publiée sur une dépendance utilisée, la mise à jour correspondante est appliquée. Cette démarche s'inscrit dans la durée, car de nouvelles vulnérabilités sont publiées en continu.
