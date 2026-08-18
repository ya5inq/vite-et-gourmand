/**
 * Catalog fixtures data, ported from supabase/seed.sql (sections 1-7).
 * Associations reference entities by their unique `name`.
 */

import { DishCategory } from '@/domain/entities/dish/dish.entity.interface';

export interface AllergenFixture {
  name: string;
  icon: string;
}

export interface DietaryRegimeFixture {
  name: string;
  description: string;
}

export interface DishFixture {
  name: string;
  description: string;
  category: DishCategory;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  allergens: string[];
}

export interface MenuFixture {
  name: string;
  description: string;
  theme: string;
  price: number;
  minPersons: number;
  maxPersons: number;
  conditions: string;
  imageUrl: string;
  isAvailable: boolean;
  dishes: string[];
  dietaryRegimes: string[];
}

export const ALLERGENS: AllergenFixture[] = [
  { name: 'Gluten', icon: 'wheat' },
  { name: 'Crustacés', icon: 'shrimp' },
  { name: 'Œufs', icon: 'egg' },
  { name: 'Poisson', icon: 'fish' },
  { name: 'Arachides', icon: 'peanut' },
  { name: 'Soja', icon: 'soybean' },
  { name: 'Lait', icon: 'milk' },
  { name: 'Fruits à coque', icon: 'tree-nut' },
  { name: 'Céleri', icon: 'celery' },
  { name: 'Moutarde', icon: 'mustard' },
  { name: 'Sésame', icon: 'sesame' },
  { name: 'Sulfites', icon: 'sulfite' },
  { name: 'Lupin', icon: 'lupin' },
  { name: 'Mollusques', icon: 'mollusk' },
];

export const DIETARY_REGIMES: DietaryRegimeFixture[] = [
  { name: 'Standard', description: 'Régime alimentaire classique sans restriction particulière.' },
  {
    name: 'Végétarien',
    description: 'Régime excluant la viande et le poisson, mais autorisant les produits laitiers et les œufs.',
  },
  { name: 'Vegan', description: 'Régime excluant tout produit d’origine animale.' },
  { name: 'Sans gluten', description: 'Régime excluant toutes les sources de gluten (blé, orge, seigle, etc.).' },
  { name: 'Halal', description: 'Régime conforme aux prescriptions alimentaires islamiques.' },
  { name: 'Casher', description: 'Régime conforme aux lois alimentaires juives (kashrout).' },
  { name: 'Sans lactose', description: 'Régime excluant le lactose et les produits laitiers.' },
];

export const DISHES: DishFixture[] = [
  // Entrees (8)
  {
    name: 'Salade de chèvre chaud',
    description: 'Mesclun de saison, crottin de chèvre gratiné sur toast, miel et noix, vinaigrette balsamique.',
    category: DishCategory.ENTREE,
    price: 12.5,
    imageUrl: '/images/dishes/salade-chevre-chaud.jpg',
    isAvailable: true,
    allergens: ['Gluten', 'Lait', 'Fruits à coque'],
  },
  {
    name: 'Velouté de champignons',
    description: 'Velouté onctueux de champignons de Paris et cèpes, crème fraîche et ciboulette.',
    category: DishCategory.ENTREE,
    price: 10.0,
    imageUrl: '/images/dishes/veloute-champignons.jpg',
    isAvailable: true,
    allergens: ['Lait', 'Céleri'],
  },
  {
    name: 'Tartare de saumon',
    description: 'Tartare de saumon frais Label Rouge, avocat, citron vert, aneth et huile de sésame.',
    category: DishCategory.ENTREE,
    price: 14.5,
    imageUrl: '/images/dishes/tartare-saumon.jpg',
    isAvailable: true,
    allergens: ['Poisson', 'Sésame'],
  },
  {
    name: 'Foie gras maison',
    description: 'Foie gras de canard mi-cuit fait maison, chutney de figues et pain d’épices toasté.',
    category: DishCategory.ENTREE,
    price: 22.0,
    imageUrl: '/images/dishes/foie-gras.jpg',
    isAvailable: true,
    allergens: ['Œufs', 'Sulfites', 'Gluten'],
  },
  {
    name: 'Carpaccio de bœuf',
    description: 'Fines tranches de bœuf cru, copeaux de parmesan, roquette, huile de truffe et citron.',
    category: DishCategory.ENTREE,
    price: 15.0,
    imageUrl: '/images/dishes/carpaccio-boeuf.jpg',
    isAvailable: true,
    allergens: ['Lait', 'Moutarde'],
  },
  {
    name: 'Bruschetta tomates-mozzarella',
    description:
      'Pain ciabatta grillé, tomates cerises confites, mozzarella di Bufala, basilic frais et huile d’olive.',
    category: DishCategory.ENTREE,
    price: 11.0,
    imageUrl: '/images/dishes/bruschetta.jpg',
    isAvailable: true,
    allergens: ['Gluten', 'Lait'],
  },
  {
    name: 'Soupe à l’oignon gratinée',
    description: 'Soupe traditionnelle à l’oignon caramélisé, gratinée au fromage Comté, croûtons dorés.',
    category: DishCategory.ENTREE,
    price: 10.5,
    imageUrl: '/images/dishes/soupe-oignon.jpg',
    isAvailable: true,
    allergens: ['Gluten', 'Lait'],
  },
  {
    name: 'Salade Caesar',
    description: 'Laitue romaine croquante, poulet grillé, croûtons aillés, parmesan, sauce Caesar maison.',
    category: DishCategory.ENTREE,
    price: 13.0,
    imageUrl: '/images/dishes/salade-caesar.jpg',
    isAvailable: true,
    allergens: ['Gluten', 'Lait', 'Œufs', 'Poisson'],
  },
  // Plats (10)
  {
    name: 'Filet de bœuf rossini',
    description:
      'Filet de bœuf français poêlé, escalope de foie gras, sauce Périgueux à la truffe noire, pommes fondantes.',
    category: DishCategory.PLAT,
    price: 25.0,
    imageUrl: '/images/dishes/filet-boeuf-rossini.jpg',
    isAvailable: true,
    allergens: ['Œufs', 'Sulfites', 'Gluten'],
  },
  {
    name: 'Suprême de volaille',
    description:
      'Suprême de volaille fermière, jus au thym, écrasé de pommes de terre à l’huile d’olive et légumes de saison.',
    category: DishCategory.PLAT,
    price: 18.0,
    imageUrl: '/images/dishes/supreme-volaille.jpg',
    isAvailable: true,
    allergens: ['Lait', 'Céleri'],
  },
  {
    name: 'Dos de cabillaud',
    description: 'Dos de cabillaud rôti, beurre blanc au citron, risotto crémeux aux petits pois et menthe fraîche.',
    category: DishCategory.PLAT,
    price: 20.0,
    imageUrl: '/images/dishes/dos-cabillaud.jpg',
    isAvailable: true,
    allergens: ['Poisson', 'Lait', 'Gluten'],
  },
  {
    name: 'Souris d’agneau confite',
    description: 'Souris d’agneau confite 7 heures au romarin, purée de patate douce et jus d’agneau réduit.',
    category: DishCategory.PLAT,
    price: 22.0,
    imageUrl: '/images/dishes/souris-agneau.jpg',
    isAvailable: true,
    allergens: ['Céleri', 'Sulfites'],
  },
  {
    name: 'Risotto aux légumes',
    description: 'Risotto crémeux aux légumes de saison, parmesan affiné 24 mois, huile de truffe blanche.',
    category: DishCategory.PLAT,
    price: 16.0,
    imageUrl: '/images/dishes/risotto-legumes.jpg',
    isAvailable: true,
    allergens: ['Lait', 'Céleri'],
  },
  {
    name: 'Magret de canard',
    description: 'Magret de canard du Sud-Ouest rôti, sauce aux cerises, gratin dauphinois et haricots verts.',
    category: DishCategory.PLAT,
    price: 21.0,
    imageUrl: '/images/dishes/magret-canard.jpg',
    isAvailable: true,
    allergens: ['Sulfites', 'Lait'],
  },
  {
    name: 'Pavé de thon',
    description: 'Pavé de thon rouge mi-cuit, croûte de sésame, wok de légumes croquants et sauce soja-gingembre.',
    category: DishCategory.PLAT,
    price: 19.5,
    imageUrl: '/images/dishes/pave-thon.jpg',
    isAvailable: true,
    allergens: ['Poisson', 'Sésame', 'Soja'],
  },
  {
    name: 'Blanquette de veau',
    description: 'Blanquette de veau à l’ancienne, riz pilaf, carottes et champignons, sauce onctueuse à la crème.',
    category: DishCategory.PLAT,
    price: 18.5,
    imageUrl: '/images/dishes/blanquette-veau.jpg',
    isAvailable: true,
    allergens: ['Lait', 'Œufs', 'Gluten', 'Céleri'],
  },
  {
    name: 'Tajine de poulet',
    description: 'Tajine de poulet fermier aux olives et citrons confits, semoule fine aux herbes et amandes grillées.',
    category: DishCategory.PLAT,
    price: 17.0,
    imageUrl: '/images/dishes/tajine-poulet.jpg',
    isAvailable: true,
    allergens: ['Fruits à coque', 'Sulfites'],
  },
  {
    name: 'Filet mignon en croûte',
    description: 'Filet mignon de porc en croûte feuilletée, duxelles de champignons, sauce madère et légumes glacés.',
    category: DishCategory.PLAT,
    price: 20.5,
    imageUrl: '/images/dishes/filet-mignon-croute.jpg',
    isAvailable: true,
    allergens: ['Gluten', 'Œufs', 'Lait'],
  },
  // Desserts (8)
  {
    name: 'Fondant au chocolat',
    description: 'Fondant au chocolat noir Valrhona 70 %, cœur coulant, crème anglaise vanille Bourbon.',
    category: DishCategory.DESSERT,
    price: 10.0,
    imageUrl: '/images/dishes/fondant-chocolat.jpg',
    isAvailable: true,
    allergens: ['Gluten', 'Œufs', 'Lait'],
  },
  {
    name: 'Tarte au citron meringuée',
    description: 'Tarte au citron de Menton meringuée, pâte sablée croustillante, meringue italienne flambée.',
    category: DishCategory.DESSERT,
    price: 9.5,
    imageUrl: '/images/dishes/tarte-citron.jpg',
    isAvailable: true,
    allergens: ['Gluten', 'Œufs', 'Lait'],
  },
  {
    name: 'Tiramisu',
    description: 'Tiramisu traditionnel au mascarpone, biscuits imbibés de café espresso, cacao amer.',
    category: DishCategory.DESSERT,
    price: 9.0,
    imageUrl: '/images/dishes/tiramisu.jpg',
    isAvailable: true,
    allergens: ['Œufs', 'Lait', 'Gluten'],
  },
  {
    name: 'Panna cotta aux fruits rouges',
    description: 'Panna cotta à la vanille de Madagascar, coulis de fruits rouges frais de saison.',
    category: DishCategory.DESSERT,
    price: 8.5,
    imageUrl: '/images/dishes/panna-cotta.jpg',
    isAvailable: true,
    allergens: ['Lait'],
  },
  {
    name: 'Assiette de fromages affinés',
    description:
      'Sélection de 5 fromages affinés de la région : Ossau-Iraty, Rocamadour, Bleu d’Auvergne, Comté 18 mois et Saint-Nectaire.',
    category: DishCategory.DESSERT,
    price: 13.0,
    imageUrl: '/images/dishes/fromages.jpg',
    isAvailable: true,
    allergens: ['Lait'],
  },
  {
    name: 'Crème brûlée',
    description: 'Crème brûlée à la vanille de Tahiti, caramélisée au chalumeau, tuile aux amandes.',
    category: DishCategory.DESSERT,
    price: 9.0,
    imageUrl: '/images/dishes/creme-brulee.jpg',
    isAvailable: true,
    allergens: ['Œufs', 'Lait', 'Fruits à coque'],
  },
  {
    name: 'Paris-Brest',
    description: 'Paris-Brest croustillant, crème mousseline pralinée aux noisettes du Piémont, éclats de pralin.',
    category: DishCategory.DESSERT,
    price: 11.0,
    imageUrl: '/images/dishes/paris-brest.jpg',
    isAvailable: true,
    allergens: ['Gluten', 'Œufs', 'Lait', 'Fruits à coque'],
  },
  {
    name: 'Mousse au chocolat',
    description: 'Mousse aérienne au chocolat noir grand cru, chantilly légère et copeaux de chocolat.',
    category: DishCategory.DESSERT,
    price: 8.0,
    imageUrl: '/images/dishes/mousse-chocolat.jpg',
    isAvailable: true,
    allergens: ['Œufs', 'Lait', 'Soja'],
  },
];

export const MENUS: MenuFixture[] = [
  {
    name: 'Menu Prestige',
    description:
      'Notre menu d’exception pour des événements inoubliables. Une sélection raffinée de mets gastronomiques préparés avec les meilleurs produits du terroir. Foie gras maison, filet de bœuf Rossini et desserts d’excellence pour sublimer vos réceptions les plus prestigieuses.',
    theme: 'Gastronomique',
    price: 85.0,
    minPersons: 15,
    maxPersons: 100,
    conditions:
      'Commande 7 jours à l’avance minimum. Supplément de 10 € par personne pour le service en salle. Vaisselle et nappage inclus. Dégressif à partir de 50 convives.',
    imageUrl: '/images/menus/prestige.jpg',
    isAvailable: true,
    dishes: ['Foie gras maison', 'Filet de bœuf rossini', 'Magret de canard', 'Crème brûlée', 'Paris-Brest'],
    dietaryRegimes: ['Standard'],
  },
  {
    name: 'Menu Tradition',
    description:
      'Un voyage au cœur des saveurs traditionnelles françaises. Des recettes authentiques revisitées avec soin par notre chef, pour retrouver le goût des bons plats d’autrefois. Idéal pour les repas de famille et les célébrations conviviales.',
    theme: 'Terroir',
    price: 65.0,
    minPersons: 10,
    maxPersons: 80,
    conditions:
      'Commande 5 jours à l’avance minimum. Possibilité d’adapter les plats selon vos préférences. Service en buffet ou à l’assiette.',
    imageUrl: '/images/menus/tradition.jpg',
    isAvailable: true,
    dishes: ['Soupe à l’oignon gratinée', 'Blanquette de veau', 'Souris d’agneau confite', 'Fondant au chocolat'],
    dietaryRegimes: ['Standard', 'Halal'],
  },
  {
    name: 'Menu Méditerranée',
    description:
      'Les saveurs ensoleillées de la Méditerranée s’invitent à votre table. Des produits frais, des herbes aromatiques et des préparations légères qui évoquent la douceur du sud. Parfait pour les événements estivaux et les repas en plein air.',
    theme: 'Méditerranéen',
    price: 55.0,
    minPersons: 10,
    maxPersons: 60,
    conditions:
      'Commande 4 jours à l’avance minimum. Menu idéal pour les événements en extérieur. Options sans gluten disponibles sur demande.',
    imageUrl: '/images/menus/mediterranee.jpg',
    isAvailable: true,
    dishes: ['Bruschetta tomates-mozzarella', 'Carpaccio de bœuf', 'Pavé de thon', 'Tiramisu'],
    dietaryRegimes: ['Standard', 'Sans lactose'],
  },
  {
    name: 'Menu Végétarien Gourmet',
    description:
      'Une cuisine végétarienne créative et gourmande qui met à l’honneur les légumes de saison et les céréales nobles. Prouvez que la gastronomie végétarienne peut être aussi raffinée qu’inventive. Chaque plat est une célébration du végétal.',
    theme: 'Végétarien',
    price: 50.0,
    minPersons: 8,
    maxPersons: 50,
    conditions:
      'Commande 4 jours à l’avance minimum. Adaptation vegan possible sur demande. Tous les produits sont issus de l’agriculture biologique ou raisonnée.',
    imageUrl: '/images/menus/vegetarien.jpg',
    isAvailable: true,
    dishes: [
      'Velouté de champignons',
      'Risotto aux légumes',
      'Salade de chèvre chaud',
      'Panna cotta aux fruits rouges',
    ],
    dietaryRegimes: ['Standard', 'Végétarien', 'Sans gluten'],
  },
  {
    name: 'Menu Océan',
    description:
      'Une ode aux trésors de la mer. Poissons frais, crustacés et coquillages sublimés par notre chef pour un festin marin d’exception. Les produits sont sélectionnés chaque matin auprès de nos pêcheurs partenaires de la côte atlantique.',
    theme: 'Fruits de mer',
    price: 70.0,
    minPersons: 10,
    maxPersons: 60,
    conditions:
      'Commande 5 jours à l’avance minimum. Arrivage frais quotidien, le menu peut varier selon la pêche du jour. Supplément plateau de fruits de mer : 20 €/personne.',
    imageUrl: '/images/menus/ocean.jpg',
    isAvailable: true,
    dishes: ['Tartare de saumon', 'Dos de cabillaud', 'Pavé de thon', 'Tarte au citron meringuée'],
    dietaryRegimes: ['Standard', 'Sans gluten', 'Sans lactose'],
  },
  {
    name: 'Menu Brunch',
    description:
      'Un brunch généreux et convivial, mêlant préparations sucrées et salées. Viennoiseries fraîches, œufs préparés à votre goût, charcuterie fine et pâtisseries maison. L’art du brunch à la française pour vos matinées gourmandes.',
    theme: 'Brunch',
    price: 35.0,
    minPersons: 20,
    maxPersons: 100,
    conditions:
      'Commande 3 jours à l’avance minimum. Service de 10h à 14h. Boissons chaudes incluses (café, thé, chocolat). Jus de fruits frais en supplément.',
    imageUrl: '/images/menus/brunch.jpg',
    isAvailable: true,
    dishes: ['Salade Caesar', 'Suprême de volaille', 'Fondant au chocolat', 'Mousse au chocolat'],
    dietaryRegimes: ['Standard', 'Végétarien', 'Halal'],
  },
  {
    name: 'Menu Cocktail',
    description:
      'Des bouchées raffinées et des pièces cocktail élégantes pour animer vos réceptions debout. Un assortiment savant de saveurs sucrées et salées, idéal pour les vernissages, lancements et soirées networking.',
    theme: 'Cocktail',
    price: 45.0,
    minPersons: 20,
    maxPersons: 150,
    conditions:
      'Commande 4 jours à l’avance minimum. 10 pièces par personne incluses. Service de 2 heures inclus. Supplément pour pièces supplémentaires ou service prolongé.',
    imageUrl: '/images/menus/cocktail.jpg',
    isAvailable: true,
    dishes: [
      'Bruschetta tomates-mozzarella',
      'Tartare de saumon',
      'Foie gras maison',
      'Salade de chèvre chaud',
      'Crème brûlée',
    ],
    dietaryRegimes: ['Standard', 'Végétarien', 'Sans lactose'],
  },
  {
    name: 'Menu Entreprise',
    description:
      'La solution idéale pour vos déjeuners d’affaires, séminaires et événements corporate. Un menu équilibré et savoureux qui allie efficacité et qualité gastronomique. Présentation soignée pour une image professionnelle impeccable.',
    theme: 'Business',
    price: 55.0,
    minPersons: 10,
    maxPersons: 200,
    conditions:
      'Commande 3 jours à l’avance minimum. Facturation entreprise possible. Options diététiques et allergènes prises en compte. Livraison à l’heure garantie.',
    imageUrl: '/images/menus/entreprise.jpg',
    isAvailable: true,
    dishes: ['Salade Caesar', 'Filet mignon en croûte', 'Tajine de poulet', 'Tarte au citron meringuée'],
    dietaryRegimes: ['Standard', 'Halal', 'Sans gluten', 'Végétarien'],
  },
];
