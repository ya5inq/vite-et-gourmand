# Accessibilité (RGAA / WCAG) — Vite & Gourmand

Le sujet exige que l'application soit accessible conformément au **RGAA**. Ce document
récapitule l'audit du site client et les corrections apportées dans le code.

## Points déjà conformes

- **Langue de la page** : `<html lang="fr">` déclaré (`client/src/app/layout.tsx`).
- **Formulaires** : les champs (connexion, inscription, mot de passe oublié, contact,
  checkout) utilisent des `<label htmlFor>` correctement associés.
- **Contrastes** : palette à dominante texte foncé sur fond clair (cf. `docs/CHARTE_GRAPHIQUE.md`).

## Corrections apportées

| Critère RGAA / WCAG | Correction | Fichier |
| --- | --- | --- |
| 1.1.1 Nom accessible | Notation par étoiles : `role="radiogroup"`/`radio` + `aria-label` par étoile | `dashboard/avis/page.tsx` |
| 1.1.1 Images | Alternative explicite pour les visuels de « features » (ou vide si décoratif) | `FeaturesSection.tsx` |
| 1.1.1 Icônes décoratives | `aria-hidden="true"` sur les icônes accompagnées de texte | `contact`, `checkout`, `confirmation`, `RejectionNotice`, `TestimonialsSection`, `CartDrawer` |
| 4.1.2 Composants | Panier latéral : `role="dialog"`, `aria-modal`, `aria-labelledby` (Échap déjà géré) | `CartDrawer.tsx` |
| 1.3.1 Structure des titres | Cartes de contact passées de `h3` à `h2` (hiérarchie h1 → h2) | `contact/page.tsx` |
| 1.1.1 Lien | Flèche décorative `←` masquée aux lecteurs d'écran | `menus/[id]/page.tsx` |
| 2.4.7 Focus visible | Anneau de focus visible sur les boutons de notation | `dashboard/avis/page.tsx` |

## À poursuivre (audit interactif)

Les corrections ci-dessus traitent les écarts identifiables statiquement dans le code.
Un audit final avec outils (axe DevTools, Lighthouse, WAVE) sur l'application déployée
permet de vérifier : contrastes calculés, ordre de tabulation réel, focus au clavier
sur l'ensemble des parcours, et restitution par lecteur d'écran.
