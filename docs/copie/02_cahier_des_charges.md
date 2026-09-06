# Partie 1 — Analyse des besoins

## Question 2 — Cahier des charges, expression du besoin et spécifications fonctionnelles

### Acteurs et rôles

- **Visiteur** : consulte le site, les menus et leur détail, mais doit créer un compte pour commander.
- **Utilisateur (client)** : commande, suit ses commandes, modifie ses informations, dépose un avis.
- **Employé** : gère les menus, plats et horaires, traite les commandes, valide ou refuse les avis.
- **Administrateur** : dispose de toutes les capacités de l'employé, gère les comptes employés et consulte les statistiques.

### Fonctionnalités du site public

- **Page d'accueil** : présentation de l'entreprise, mise en avant du professionnalisme de l'équipe, avis clients validés.
- **Menu de navigation** : retour à l'accueil, accès à tous les menus, connexion, accès à la page de contact.
- **Pied de page** : horaires du lundi au dimanche, accès aux mentions légales et aux conditions générales de vente.
- **Vue globale des menus** : pour chaque menu, titre, description, nombre de personnes minimal et prix, avec un bouton d'accès au détail. Cette vue est visible pour les visiteurs comme pour les personnes connectées. Des filtres dynamiques (prix maximum, fourchette de prix, thème, régime, nombre de personnes) mettent à jour la liste sans rechargement de page.
- **Vue détaillée d'un menu** : galerie d'images, description, thème, liste des plats (entrée, plat, dessert), allergènes, nombre de personnes minimal, prix, conditions mises en évidence, régime et stock. Un bouton « commander » redirige vers la commande pré-remplie.
- **Création de compte** : nom, prénom, numéro de GSM, adresse e-mail, adresse postale et mot de passe sécurisé, avec envoi automatique d'un e-mail de bienvenue.
- **Connexion** : par e-mail et mot de passe, avec réinitialisation du mot de passe par e-mail.

### Commande d'un menu

- Informations de prestation (auto-remplies depuis le compte), adresse et date de livraison, heure souhaitée, nombre de personnes.
- **Tarification** : frais de livraison de 5 € majorés de 0,59 € par kilomètre hors Bordeaux ; réduction de 10 % dès cinq personnes de plus que le minimum du menu ; respect du nombre minimal de personnes.
- Récapitulatif détaillé du prix (menu et livraison) avant validation, puis envoi d'un e-mail de confirmation.

### Espace utilisateur

- Historique et détail des commandes, modification des informations personnelles.
- Modification ou annulation d'une commande tant qu'elle n'a pas été acceptée par un employé.
- Suivi des statuts de la commande.
- Dépôt d'un avis (note de 1 à 5 et commentaire) une fois la commande terminée.

### Espace employé et administrateur

- Gestion des menus, plats et horaires.
- Filtrage des commandes par statut ou par client.
- Mise à jour des statuts : accepté, en préparation, en cours de livraison, livré, en attente de retour de matériel, terminée. L'annulation d'une commande impose de contacter préalablement le client.
- Validation ou refus des avis.
- **Réservé à l'administrateur** : création et désactivation de comptes employés (la création d'un compte administrateur depuis l'application est impossible) ; statistiques du nombre de commandes par menu et du chiffre d'affaires par menu et par durée, issues de la base non relationnelle.

### Contact

- Formulaire (titre, description, e-mail) dont la demande est transmise par courriel à l'entreprise.

### Contraintes

- Une base de données relationnelle et une base de données non relationnelle.
- Déploiement de l'application en ligne.
- Conformité RGPD et accessibilité RGAA.
