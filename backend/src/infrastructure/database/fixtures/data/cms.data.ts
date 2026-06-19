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
        "Mentions legales\n\nRaison sociale : Vite & Gourmand SARL\nSiege social : 12 Rue Sainte-Catherine, 33000 Bordeaux\nSIRET : 123 456 789 00012\nCapital social : 10 000 EUR\nDirecteur de la publication : Responsable Vite & Gourmand\nHebergeur : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA\n\nConformement a la loi n°78-17 du 6 janvier 1978 relative a l'informatique, aux fichiers et aux libertes, vous disposez d'un droit d'acces, de rectification et de suppression des donnees vous concernant. Pour exercer ce droit, veuillez nous contacter a contact@viteetgourmand.fr.",
    },
  },
  {
    page: 'legal',
    section: 'cgv',
    content: {
      content:
        "Conditions Generales de Vente\n\nArticle 1 - Objet\nLes presentes conditions generales de vente regissent les relations contractuelles entre Vite & Gourmand SARL et ses clients dans le cadre de prestations de traiteur.\n\nArticle 2 - Commandes\nToute commande doit etre passee au minimum 3 a 7 jours avant la date de l'evenement selon le menu choisi. Un acompte de 30% est demande a la confirmation de la commande.\n\nArticle 3 - Prix\nLes prix sont indiques en euros TTC. Ils comprennent la preparation des plats et, le cas echeant, les frais de livraison selon la zone geographique.\n\nArticle 4 - Livraison\nLa livraison est effectuee a l'adresse indiquee lors de la commande, dans les creneaux horaires convenus. Des frais de livraison peuvent s'appliquer selon la zone.\n\nArticle 5 - Annulation\nToute annulation effectuee plus de 48 heures avant la date prevue donne lieu au remboursement integral de l'acompte. En deca, l'acompte est conserve.\n\nArticle 6 - Responsabilite\nVite & Gourmand s'engage a fournir des prestations de qualite. Notre responsabilite est limitee au montant de la commande.\n\nArticle 7 - Litiges\nEn cas de litige, une solution amiable sera recherchee. A defaut, les tribunaux de Bordeaux seront competents.",
    },
  },
  {
    page: 'legal',
    section: 'privacy',
    content: {
      content:
        "Politique de Confidentialite\n\nVite & Gourmand SARL s'engage a proteger la vie privee de ses utilisateurs. Cette politique de confidentialite decrit comment nous collectons, utilisons et protegeons vos donnees personnelles.\n\nDonnees collectees\nNous collectons les donnees suivantes : nom, prenom, adresse email, numero de telephone, adresse de livraison, et historique de commandes.\n\nUtilisation des donnees\nVos donnees sont utilisees pour : traiter vos commandes, vous contacter concernant vos reservations, ameliorer nos services, et vous envoyer des communications commerciales (avec votre consentement).\n\nConservation\nVos donnees sont conservees pendant la duree de la relation commerciale et 3 ans apres la derniere commande.\n\nDroits\nConformement au RGPD, vous disposez d'un droit d'acces, de rectification, de suppression, de portabilite et d'opposition sur vos donnees. Pour exercer ces droits, contactez-nous a contact@viteetgourmand.fr.\n\nCookies\nNotre site utilise des cookies fonctionnels et analytiques. Vous pouvez gerer vos preferences via le bandeau cookies.",
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
