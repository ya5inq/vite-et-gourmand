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
      subtitle: "Traiteur d'exception a Bordeaux",
      description:
        'Des menus raffines pour vos evenements professionnels et prives. Notre equipe de chefs passionnes met son savoir-faire au service de vos receptions pour creer des moments gustatifs inoubliables.',
      image: '/images/hero-bg.jpg',
      cta_text: 'Decouvrir nos menus',
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
          title: 'Qualite premium',
          description:
            'Des ingredients soigneusement selectionnes aupres de producteurs locaux et des preparations realisees par des chefs experimentes.',
        },
        {
          icon: 'leaf',
          title: 'Produits frais',
          description:
            'Tous nos plats sont prepares le jour meme avec des produits frais de saison, pour garantir une fraicheur et des saveurs optimales.',
        },
        {
          icon: 'truck',
          title: 'Livraison soignee',
          description:
            'Une livraison ponctuelle et soignee dans toute la metropole bordelaise, avec un conditionnement adapte pour preserver la qualite.',
        },
        {
          icon: 'settings',
          title: 'Sur mesure',
          description:
            'Chaque evenement est unique. Nous adaptons nos menus a vos besoins, preferences alimentaires et contraintes specifiques.',
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
            "Nous privilegions les producteurs locaux et les circuits courts pour soutenir l'economie regionale et reduire notre empreinte carbone.",
        },
        {
          icon: 'chef-hat',
          title: 'Excellence culinaire',
          description:
            'Notre equipe de chefs diplomes met tout son savoir-faire au service de la gastronomie francaise pour sublimer chaque plat.',
        },
        {
          icon: 'heart',
          title: 'Satisfaction client',
          description:
            'Votre satisfaction est notre priorite. Nous vous accompagnons de la commande a la degustation pour un service irreprochable.',
        },
        {
          icon: 'recycle',
          title: 'Eco-responsabilite',
          description:
            'Emballages recyclables, lutte contre le gaspillage alimentaire et gestion responsable des dechets : nous nous engageons pour la planete.',
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
        'Decouvrez notre selection de menus soigneusement composes pour ravir les palais de vos convives. Du brunch decontracte au diner gastronomique, trouvez la formule ideale pour votre evenement.',
    },
  },
  {
    page: 'contact',
    section: 'content',
    content: {
      title: 'Contactez-nous',
      description:
        "Une question ? Un devis personnalise ? Notre equipe est a votre ecoute pour vous accompagner dans l'organisation de votre evenement.",
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
        "Mentions legales\n\n" +
        "Editeur du site\n" +
        "Raison sociale : Vite & Gourmand SARL\n" +
        "Siege social : 12 Rue Sainte-Catherine, 33000 Bordeaux, France\n" +
        "SIRET : 123 456 789 00012\n" +
        "Capital social : 10 000 EUR\n" +
        "Telephone : 05 56 00 00 00\n" +
        "Email : contact@viteetgourmand.fr\n" +
        "Directeur de la publication : le representant legal de Vite & Gourmand SARL\n\n" +
        "Hebergement\n" +
        "L'application (backend et bases de donnees) est hebergee par Render (Render Services, Inc., San Francisco, CA, USA). La base de donnees non relationnelle est hebergee par MongoDB Atlas (MongoDB, Inc.). Ces prestataires peuvent operer des serveurs situes dans l'Union europeenne et aux Etats-Unis.\n\n" +
        "Propriete intellectuelle\n" +
        "L'ensemble des contenus presents sur ce site (textes, images, logos, charte graphique) est la propriete de Vite & Gourmand SARL, sauf mention contraire. Toute reproduction sans autorisation est interdite.\n\n" +
        "Donnees personnelles\n" +
        "Le traitement de vos donnees personnelles est decrit dans notre Politique de confidentialite. Conformement au Reglement (UE) 2016/679 (RGPD) et a la loi n°78-17 du 6 janvier 1978 modifiee, vous disposez de droits que vous pouvez exercer a contact@viteetgourmand.fr.",
    },
  },
  {
    page: 'legal',
    section: 'cgv',
    content: {
      content:
        "Conditions generales de vente\n\n" +
        "Article 1 - Objet\n" +
        "Les presentes conditions generales de vente regissent les relations contractuelles entre Vite & Gourmand SARL et ses clients dans le cadre de prestations de traiteur.\n\n" +
        "Article 2 - Commandes\n" +
        "Toute commande doit etre passee dans le respect du delai de preparation indique sur chaque menu. Chaque menu impose un nombre minimum de personnes ; la commande ne peut etre validee en dessous de ce seuil.\n\n" +
        "Article 3 - Prix et reductions\n" +
        "Les prix sont indiques en euros. Une reduction de 10% est appliquee pour toute commande depassant d'au moins 5 personnes le nombre minimum indique sur le menu. Le detail du prix (menu et livraison) est presente avant la validation.\n\n" +
        "Article 4 - Livraison\n" +
        "La livraison est effectuee a l'adresse et a la date indiquees lors de la commande. Des frais de livraison de 5 EUR s'appliquent, majores de 0,59 EUR par kilometre lorsque la livraison est situee hors de Bordeaux.\n\n" +
        "Article 5 - Suivi et statuts\n" +
        "Le client authentifie peut suivre l'etat de sa commande (acceptee, en preparation, en cours de livraison, livree, terminee). La modification ou l'annulation reste possible tant que la commande n'a pas ete acceptee par l'equipe.\n\n" +
        "Article 6 - Retour du materiel\n" +
        "Lorsque du materiel est prete au client, celui-ci doit etre restitue dans un delai de 10 jours ouvres suivant la notification. A defaut de restitution dans ce delai, une penalite de 600 EUR sera facturee.\n\n" +
        "Article 7 - Avis\n" +
        "Une fois la commande terminee, le client peut laisser une note (de 1 a 5) et un commentaire. Les avis sont publies apres validation par l'equipe.\n\n" +
        "Article 8 - Responsabilite\n" +
        "Vite & Gourmand s'engage a fournir des prestations de qualite. Sa responsabilite est limitee au montant de la commande.\n\n" +
        "Article 9 - Litiges\n" +
        "En cas de litige, une solution amiable sera recherchee. A defaut, les tribunaux de Bordeaux seront competents.",
    },
  },
  {
    page: 'legal',
    section: 'privacy',
    content: {
      content:
        "Politique de confidentialite\n\n" +
        "Vite & Gourmand SARL accorde une grande importance a la protection de vos donnees personnelles. La presente politique explique quelles donnees nous traitons, pourquoi, combien de temps, et quels sont vos droits, conformement au Reglement (UE) 2016/679 (RGPD).\n\n" +
        "1. Responsable du traitement\n" +
        "Vite & Gourmand SARL, 12 Rue Sainte-Catherine, 33000 Bordeaux. Contact : contact@viteetgourmand.fr.\n\n" +
        "2. Donnees collectees\n" +
        "- Donnees de compte : nom, prenom, adresse email, mot de passe (stocke sous forme hachee, jamais en clair).\n" +
        "- Donnees de contact et de livraison : numero de telephone, adresse postale, code postal, ville.\n" +
        "- Donnees de commande : menus commandes, montants, dates, historique et statut des commandes.\n" +
        "- Donnees de contact libre : messages envoyes via le formulaire de contact.\n\n" +
        "3. Finalites et bases legales\n" +
        "- Gestion des comptes et authentification : execution du contrat.\n" +
        "- Traitement et suivi des commandes et livraisons : execution du contrat.\n" +
        "- Reponse aux demandes de contact : interet legitime.\n" +
        "- Envoi d'un email de bienvenue et d'emails transactionnels (confirmation, suivi) : execution du contrat.\n" +
        "- Obligations comptables et legales : obligation legale.\n" +
        "Aucune donnee n'est utilisee a des fins de prospection commerciale sans votre consentement.\n\n" +
        "4. Destinataires et sous-traitants\n" +
        "Vos donnees sont accessibles au personnel habilite de Vite & Gourmand. Elles sont hebergees chez nos sous-traitants techniques (Render pour l'application et la base relationnelle, MongoDB Atlas pour les statistiques). L'envoi des emails est assure par le prestataire Resend. Ces prestataires agissent sur instruction et presentent des garanties de securite appropriees.\n\n" +
        "5. Durees de conservation\n" +
        "- Compte utilisateur : pendant toute la duree de la relation, puis suppression ou anonymisation.\n" +
        "- Donnees de commande : jusqu'a 3 ans apres la derniere commande a des fins de suivi, puis archivage legal (comptabilite) jusqu'a 10 ans.\n" +
        "- Messages de contact : 1 an apres traitement.\n\n" +
        "6. Securite\n" +
        "Les mots de passe sont haches (bcrypt). L'authentification repose sur un cookie securise httpOnly. Les acces sont limites aux personnes habilitees et journalises.\n\n" +
        "7. Vos droits\n" +
        "Vous disposez d'un droit d'acces, de rectification, d'effacement, de limitation, de portabilite et d'opposition. Vous pouvez les exercer a contact@viteetgourmand.fr. Vous disposez egalement du droit d'introduire une reclamation aupres de la CNIL (www.cnil.fr).\n\n" +
        "8. Cookies\n" +
        "Le site utilise un cookie strictement necessaire au maintien de votre session authentifiee. Aucun cookie publicitaire tiers n'est depose.",
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
