/**
 * CMS fixtures, ported verbatim from supabase/seed.sql sections 9 (operating_hours)
 * and 10 (page_contents). The JSON content is copied exactly from the seed.
 */

export interface OperatingHoursFixture {
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
}

// day_of_week: 0 = Sunday, ..., 6 = Saturday (PostgreSQL convention).
export const OPERATING_HOURS: OperatingHoursFixture[] = [
  { dayOfWeek: 0, openTime: null, closeTime: null, isClosed: true }, // Dimanche: fermé
  { dayOfWeek: 1, openTime: '09:00', closeTime: '18:00', isClosed: false }, // Lundi
  { dayOfWeek: 2, openTime: '09:00', closeTime: '18:00', isClosed: false }, // Mardi
  { dayOfWeek: 3, openTime: '09:00', closeTime: '18:00', isClosed: false }, // Mercredi
  { dayOfWeek: 4, openTime: '09:00', closeTime: '18:00', isClosed: false }, // Jeudi
  { dayOfWeek: 5, openTime: '09:00', closeTime: '18:00', isClosed: false }, // Vendredi
  { dayOfWeek: 6, openTime: '10:00', closeTime: '17:00', isClosed: false }, // Samedi
];

export interface PageContentFixture {
  page: string;
  section: string;
  content: Record<string, unknown>;
}

export const PAGE_CONTENTS: PageContentFixture[] = [
  {
    page: 'home',
    section: 'hero',
    content: {
      title: 'Vite & Gourmand',
      subtitle: 'Traiteur d’exception à Bordeaux',
      description:
        'Des menus raffinés pour vos événements professionnels et privés. Notre équipe de chefs passionnés met son savoir-faire au service de vos réceptions pour créer des moments gustatifs inoubliables.',
      image: '/images/hero-bg.jpg',
      cta_text: 'Découvrir nos menus',
      cta_link: '/menus',
    },
  },
  {
    page: 'home',
    section: 'features',
    content: {
      items: [
        {
          icon: 'award',
          title: 'Qualité premium',
          description:
            'Des ingrédients soigneusement sélectionnés auprès de producteurs locaux et des préparations réalisées par des chefs expérimentés.',
        },
        {
          icon: 'leaf',
          title: 'Produits frais',
          description:
            'Tous nos plats sont préparés le jour même avec des produits frais de saison, pour garantir une fraîcheur et des saveurs optimales.',
        },
        {
          icon: 'truck',
          title: 'Livraison soignée',
          description:
            'Une livraison ponctuelle et soignée dans toute la métropole bordelaise, avec un conditionnement adapté pour préserver la qualité.',
        },
        {
          icon: 'settings',
          title: 'Sur mesure',
          description:
            'Chaque événement est unique. Nous adaptons nos menus à vos besoins, préférences alimentaires et contraintes spécifiques.',
        },
      ],
    },
  },
  {
    page: 'home',
    section: 'values',
    content: {
      items: [
        {
          icon: 'map-pin',
          title: 'Circuit court',
          description:
            'Nous privilégions les producteurs locaux et les circuits courts pour soutenir l’économie régionale et réduire notre empreinte carbone.',
        },
        {
          icon: 'chef-hat',
          title: 'Excellence culinaire',
          description:
            'Notre équipe de chefs diplômés met tout son savoir-faire au service de la gastronomie française pour sublimer chaque plat.',
        },
        {
          icon: 'heart',
          title: 'Satisfaction client',
          description:
            'Votre satisfaction est notre priorité. Nous vous accompagnons de la commande à la dégustation pour un service irréprochable.',
        },
        {
          icon: 'recycle',
          title: 'Éco-responsabilité',
          description:
            'Emballages recyclables, lutte contre le gaspillage alimentaire et gestion responsable des déchets : nous nous engageons pour la planète.',
        },
      ],
    },
  },
  {
    page: 'home',
    section: 'testimonials',
    content: {
      display_count: 3,
      title: 'Ce que disent nos clients',
    },
  },
  {
    page: 'menus',
    section: 'hero',
    content: {
      title: 'Nos Menus',
      description:
        'Découvrez notre sélection de menus soigneusement composés pour ravir les palais de vos convives. Du brunch décontracté au dîner gastronomique, trouvez la formule idéale pour votre événement.',
    },
  },
  {
    page: 'contact',
    section: 'content',
    content: {
      title: 'Contactez-nous',
      description:
        'Une question ? Un devis personnalisé ? Notre équipe est à votre écoute pour vous accompagner dans l’organisation de votre événement.',
      email: 'contact@viteetgourmand.fr',
      phone: '05 56 00 00 00',
      address: '12 Rue Sainte-Catherine, 33000 Bordeaux',
    },
  },
  {
    page: 'legal',
    section: 'mentions',
    content: {
      content:
        'Mentions légales\n\n' +
        'Éditeur du site\n' +
        'Raison sociale : Vite & Gourmand SARL\n' +
        'Siège social : 12 Rue Sainte-Catherine, 33000 Bordeaux, France\n' +
        'SIRET : 123 456 789 00012\n' +
        'Capital social : 10 000 €\n' +
        'Téléphone : 05 56 00 00 00\n' +
        'Email : contact@viteetgourmand.fr\n' +
        'Directeur de la publication : le représentant légal de Vite & Gourmand SARL\n\n' +
        'Hébergement\n' +
        'L’application (backend et bases de données) est hébergée par Render (Render Services, Inc., San Francisco, CA, USA). La base de données non relationnelle est hébergée par MongoDB Atlas (MongoDB, Inc.). Ces prestataires peuvent opérer des serveurs situés dans l’Union européenne et aux États-Unis.\n\n' +
        'Propriété intellectuelle\n' +
        'L’ensemble des contenus présents sur ce site (textes, images, logos, charte graphique) est la propriété de Vite & Gourmand SARL, sauf mention contraire. Toute reproduction sans autorisation est interdite.\n\n' +
        'Données personnelles\n' +
        'Le traitement de vos données personnelles est décrit dans notre Politique de confidentialité. Conformément au Règlement (UE) 2016/679 (RGPD) et à la loi n°78-17 du 6 janvier 1978 modifiée, vous disposez de droits que vous pouvez exercer à contact@viteetgourmand.fr.',
    },
  },
  {
    page: 'legal',
    section: 'cgv',
    content: {
      content:
        'Conditions générales de vente\n\n' +
        'Article 1 - Objet\n' +
        'Les présentes conditions générales de vente régissent les relations contractuelles entre Vite & Gourmand SARL et ses clients dans le cadre de prestations de traiteur.\n\n' +
        'Article 2 - Commandes\n' +
        'Toute commande doit être passée dans le respect du délai de préparation indiqué sur chaque menu. Chaque menu impose un nombre minimum de personnes ; la commande ne peut être validée en dessous de ce seuil.\n\n' +
        'Article 3 - Prix et réductions\n' +
        'Les prix sont indiqués en euros. Une réduction de 10 % est appliquée pour toute commande dépassant d’au moins 5 personnes le nombre minimum indiqué sur le menu. Le détail du prix (menu et livraison) est présenté avant la validation.\n\n' +
        'Article 4 - Livraison\n' +
        'La livraison est effectuée à l’adresse et à la date indiquées lors de la commande. Des frais de livraison de 5 € s’appliquent, majorés de 0,59 € par kilomètre lorsque la livraison est située hors de Bordeaux.\n\n' +
        'Article 5 - Suivi et statuts\n' +
        'Le client authentifié peut suivre l’état de sa commande (acceptée, en préparation, en cours de livraison, livrée, terminée). La modification ou l’annulation reste possible tant que la commande n’a pas été acceptée par l’équipe.\n\n' +
        'Article 6 - Retour du matériel\n' +
        'Lorsque du matériel est prêté au client, celui-ci doit être restitué dans un délai de 10 jours ouvrés suivant la notification. À défaut de restitution dans ce délai, une pénalité de 600 € sera facturée.\n\n' +
        'Article 7 - Avis\n' +
        'Une fois la commande terminée, le client peut laisser une note (de 1 à 5) et un commentaire. Les avis sont publiés après validation par l’équipe.\n\n' +
        'Article 8 - Responsabilité\n' +
        'Vite & Gourmand s’engage à fournir des prestations de qualité. Sa responsabilité est limitée au montant de la commande.\n\n' +
        'Article 9 - Litiges\n' +
        'En cas de litige, une solution amiable sera recherchée. À défaut, les tribunaux de Bordeaux seront compétents.',
    },
  },
  {
    page: 'legal',
    section: 'privacy',
    content: {
      content:
        'Politique de confidentialité\n\n' +
        'Vite & Gourmand SARL accorde une grande importance à la protection de vos données personnelles. La présente politique explique quelles données nous traitons, pourquoi, combien de temps, et quels sont vos droits, conformément au Règlement (UE) 2016/679 (RGPD).\n\n' +
        '1. Responsable du traitement\n' +
        'Vite & Gourmand SARL, 12 Rue Sainte-Catherine, 33000 Bordeaux. Contact : contact@viteetgourmand.fr.\n\n' +
        '2. Données collectées\n' +
        '- Données de compte : nom, prénom, adresse email, mot de passe (stocké sous forme hachée, jamais en clair).\n' +
        '- Données de contact et de livraison : numéro de téléphone, adresse postale, code postal, ville.\n' +
        '- Données de commande : menus commandés, montants, dates, historique et statut des commandes.\n' +
        '- Données de contact libre : messages envoyés via le formulaire de contact.\n\n' +
        '3. Finalités et bases légales\n' +
        '- Gestion des comptes et authentification : exécution du contrat.\n' +
        '- Traitement et suivi des commandes et livraisons : exécution du contrat.\n' +
        '- Réponse aux demandes de contact : intérêt légitime.\n' +
        '- Envoi d’un email de bienvenue et d’emails transactionnels (confirmation, suivi) : exécution du contrat.\n' +
        '- Obligations comptables et légales : obligation légale.\n' +
        'Aucune donnée n’est utilisée à des fins de prospection commerciale sans votre consentement.\n\n' +
        '4. Destinataires et sous-traitants\n' +
        'Vos données sont accessibles au personnel habilité de Vite & Gourmand. Elles sont hébergées chez nos sous-traitants techniques (Render pour l’application et la base relationnelle, MongoDB Atlas pour les statistiques). L’envoi des emails est assuré par le prestataire Resend. Ces prestataires agissent sur instruction et présentent des garanties de sécurité appropriées.\n\n' +
        '5. Durées de conservation\n' +
        '- Compte utilisateur : pendant toute la durée de la relation, puis suppression ou anonymisation.\n' +
        '- Données de commande : jusqu’à 3 ans après la dernière commande à des fins de suivi, puis archivage légal (comptabilité) jusqu’à 10 ans.\n' +
        '- Messages de contact : 1 an après traitement.\n\n' +
        '6. Sécurité\n' +
        'Les mots de passe sont hachés (bcrypt). L’authentification repose sur un cookie sécurisé httpOnly. Les accès sont limités aux personnes habilitées et journalisés.\n\n' +
        '7. Vos droits\n' +
        'Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, de portabilité et d’opposition. Vous pouvez les exercer à contact@viteetgourmand.fr. Vous disposez également du droit d’introduire une réclamation auprès de la CNIL (www.cnil.fr).\n\n' +
        '8. Cookies\n' +
        'Le site utilise un cookie strictement nécessaire au maintien de votre session authentifiée. Aucun cookie publicitaire tiers n’est déposé.',
    },
  },
  {
    page: 'footer',
    section: 'info',
    content: {
      company_name: 'Vite & Gourmand',
      siret: '123 456 789 00012',
      address: '12 Rue Sainte-Catherine, 33000 Bordeaux',
    },
  },
];
