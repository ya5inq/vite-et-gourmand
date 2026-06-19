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
  { name: 'Crustaces', icon: 'shrimp' },
  { name: 'Oeufs', icon: 'egg' },
  { name: 'Poisson', icon: 'fish' },
  { name: 'Arachides', icon: 'peanut' },
  { name: 'Soja', icon: 'soybean' },
  { name: 'Lait', icon: 'milk' },
  { name: 'Fruits a coque', icon: 'tree-nut' },
  { name: 'Celeri', icon: 'celery' },
  { name: 'Moutarde', icon: 'mustard' },
  { name: 'Sesame', icon: 'sesame' },
  { name: 'Sulfites', icon: 'sulfite' },
  { name: 'Lupin', icon: 'lupin' },
  { name: 'Mollusques', icon: 'mollusk' },
];

export const DIETARY_REGIMES: DietaryRegimeFixture[] = [
  { name: 'Standard', description: 'Regime alimentaire classique sans restriction particuliere.' },
  {
    name: 'Vegetarien',
    description: 'Regime excluant la viande et le poisson, mais autorisant les produits laitiers et les oeufs.',
  },
  { name: 'Vegan', description: "Regime excluant tout produit d'origine animale." },
  { name: 'Sans gluten', description: 'Regime excluant toutes les sources de gluten (ble, orge, seigle, etc.).' },
  { name: 'Halal', description: 'Regime conforme aux prescriptions alimentaires islamiques.' },
  { name: 'Casher', description: 'Regime conforme aux lois alimentaires juives (kashrout).' },
  { name: 'Sans lactose', description: 'Regime excluant le lactose et les produits laitiers.' },
];

export const DISHES: DishFixture[] = [
  // Entrees (8)
  {
    name: 'Salade de chevre chaud',
    description: 'Mesclun de saison, crottin de chevre gratine sur toast, miel et noix, vinaigrette balsamique.',
    category: DishCategory.ENTREE,
    price: 12.5,
    imageUrl: '/images/dishes/salade-chevre-chaud.jpg',
    isAvailable: true,
    allergens: ['Gluten', 'Lait', 'Fruits a coque'],
  },
  {
    name: 'Veloute de champignons',
    description: 'Veloute onctueux de champignons de Paris et cepes, creme fraiche et ciboulette.',
    category: DishCategory.ENTREE,
    price: 10.0,
    imageUrl: '/images/dishes/veloute-champignons.jpg',
    isAvailable: true,
    allergens: ['Lait', 'Celeri'],
  },
  {
    name: 'Tartare de saumon',
    description: 'Tartare de saumon frais Label Rouge, avocat, citron vert, aneth et huile de sesame.',
    category: DishCategory.ENTREE,
    price: 14.5,
    imageUrl: '/images/dishes/tartare-saumon.jpg',
    isAvailable: true,
    allergens: ['Poisson', 'Sesame'],
  },
  {
    name: 'Foie gras maison',
    description: "Foie gras de canard mi-cuit fait maison, chutney de figues et pain d'epices toaste.",
    category: DishCategory.ENTREE,
    price: 22.0,
    imageUrl: '/images/dishes/foie-gras.jpg',
    isAvailable: true,
    allergens: ['Oeufs', 'Sulfites', 'Gluten'],
  },
  {
    name: 'Carpaccio de boeuf',
    description: 'Fines tranches de boeuf cru, copeaux de parmesan, roquette, huile de truffe et citron.',
    category: DishCategory.ENTREE,
    price: 15.0,
    imageUrl: '/images/dishes/carpaccio-boeuf.jpg',
    isAvailable: true,
    allergens: ['Lait', 'Moutarde'],
  },
  {
    name: 'Bruschetta tomates-mozzarella',
    description:
      "Pain ciabatta grille, tomates cerises confites, mozzarella di Bufala, basilic frais et huile d'olive.",
    category: DishCategory.ENTREE,
    price: 11.0,
    imageUrl: '/images/dishes/bruschetta.jpg',
    isAvailable: true,
    allergens: ['Gluten', 'Lait'],
  },
  {
    name: "Soupe a l'oignon gratinee",
    description: "Soupe traditionnelle a l'oignon caramelise, gratinee au fromage Comte, croutons dores.",
    category: DishCategory.ENTREE,
    price: 10.5,
    imageUrl: '/images/dishes/soupe-oignon.jpg',
    isAvailable: true,
    allergens: ['Gluten', 'Lait'],
  },
  {
    name: 'Salade Caesar',
    description: 'Laitue romaine croquante, poulet grille, crotons ailles, parmesan, sauce Caesar maison.',
    category: DishCategory.ENTREE,
    price: 13.0,
    imageUrl: '/images/dishes/salade-caesar.jpg',
    isAvailable: true,
    allergens: ['Gluten', 'Lait', 'Oeufs', 'Poisson'],
  },
  // Plats (10)
  {
    name: 'Filet de boeuf rossini',
    description:
      'Filet de boeuf francais poele, escalope de foie gras, sauce Perigueux a la truffe noire, pommes fondantes.',
    category: DishCategory.PLAT,
    price: 25.0,
    imageUrl: '/images/dishes/filet-boeuf-rossini.jpg',
    isAvailable: true,
    allergens: ['Oeufs', 'Sulfites', 'Gluten'],
  },
  {
    name: 'Supreme de volaille',
    description:
      "Supreme de volaille fermiere, jus au thym, ecrase de pommes de terre a l'huile d'olive et legumes de saison.",
    category: DishCategory.PLAT,
    price: 18.0,
    imageUrl: '/images/dishes/supreme-volaille.jpg',
    isAvailable: true,
    allergens: ['Lait', 'Celeri'],
  },
  {
    name: 'Dos de cabillaud',
    description: 'Dos de cabillaud roti, beurre blanc au citron, risotto crémeux aux petits pois et menthe fraiche.',
    category: DishCategory.PLAT,
    price: 20.0,
    imageUrl: '/images/dishes/dos-cabillaud.jpg',
    isAvailable: true,
    allergens: ['Poisson', 'Lait', 'Gluten'],
  },
  {
    name: "Souris d'agneau confite",
    description: "Souris d'agneau confite 7 heures au romarin, puree de patate douce et jus d'agneau reduit.",
    category: DishCategory.PLAT,
    price: 22.0,
    imageUrl: '/images/dishes/souris-agneau.jpg',
    isAvailable: true,
    allergens: ['Celeri', 'Sulfites'],
  },
  {
    name: 'Risotto aux legumes',
    description: 'Risotto cremeux aux legumes de saison, parmesan affine 24 mois, huile de truffe blanche.',
    category: DishCategory.PLAT,
    price: 16.0,
    imageUrl: '/images/dishes/risotto-legumes.jpg',
    isAvailable: true,
    allergens: ['Lait', 'Celeri'],
  },
  {
    name: 'Magret de canard',
    description: 'Magret de canard du Sud-Ouest roti, sauce aux cerises, gratin dauphinois et haricots verts.',
    category: DishCategory.PLAT,
    price: 21.0,
    imageUrl: '/images/dishes/magret-canard.jpg',
    isAvailable: true,
    allergens: ['Sulfites', 'Lait'],
  },
  {
    name: 'Pave de thon',
    description: 'Pave de thon rouge mi-cuit, croute de sesame, wok de legumes croquants et sauce soja-gingembre.',
    category: DishCategory.PLAT,
    price: 19.5,
    imageUrl: '/images/dishes/pave-thon.jpg',
    isAvailable: true,
    allergens: ['Poisson', 'Sesame', 'Soja'],
  },
  {
    name: 'Blanquette de veau',
    description: "Blanquette de veau a l'ancienne, riz pilaf, carottes et champignons, sauce onctueuse a la creme.",
    category: DishCategory.PLAT,
    price: 18.5,
    imageUrl: '/images/dishes/blanquette-veau.jpg',
    isAvailable: true,
    allergens: ['Lait', 'Oeufs', 'Gluten', 'Celeri'],
  },
  {
    name: 'Tajine de poulet',
    description: 'Tajine de poulet fermier aux olives et citrons confits, semoule fine aux herbes et amandes grillees.',
    category: DishCategory.PLAT,
    price: 17.0,
    imageUrl: '/images/dishes/tajine-poulet.jpg',
    isAvailable: true,
    allergens: ['Fruits a coque', 'Sulfites'],
  },
  {
    name: 'Filet mignon en croute',
    description: 'Filet mignon de porc en croute feuilletee, duxelles de champignons, sauce madere et legumes glaces.',
    category: DishCategory.PLAT,
    price: 20.5,
    imageUrl: '/images/dishes/filet-mignon-croute.jpg',
    isAvailable: true,
    allergens: ['Gluten', 'Oeufs', 'Lait'],
  },
  // Desserts (8)
  {
    name: 'Fondant au chocolat',
    description: 'Fondant au chocolat noir Valrhona 70%, coeur coulant, creme anglaise vanille Bourbon.',
    category: DishCategory.DESSERT,
    price: 10.0,
    imageUrl: '/images/dishes/fondant-chocolat.jpg',
    isAvailable: true,
    allergens: ['Gluten', 'Oeufs', 'Lait'],
  },
  {
    name: 'Tarte au citron meringuee',
    description: 'Tarte au citron de Menton meringuee, pate sablee croustillante, meringue italienne flambee.',
    category: DishCategory.DESSERT,
    price: 9.5,
    imageUrl: '/images/dishes/tarte-citron.jpg',
    isAvailable: true,
    allergens: ['Gluten', 'Oeufs', 'Lait'],
  },
  {
    name: 'Tiramisu',
    description: 'Tiramisu traditionnel au mascarpone, biscuits imbibbes de cafe espresso, cacao amer.',
    category: DishCategory.DESSERT,
    price: 9.0,
    imageUrl: '/images/dishes/tiramisu.jpg',
    isAvailable: true,
    allergens: ['Oeufs', 'Lait', 'Gluten'],
  },
  {
    name: 'Panna cotta aux fruits rouges',
    description: 'Panna cotta a la vanille de Madagascar, coulis de fruits rouges frais de saison.',
    category: DishCategory.DESSERT,
    price: 8.5,
    imageUrl: '/images/dishes/panna-cotta.jpg',
    isAvailable: true,
    allergens: ['Lait'],
  },
  {
    name: 'Assiette de fromages affines',
    description:
      "Selection de 5 fromages affines de la region : Ossau-Iraty, Rocamadour, Bleu d'Auvergne, Comte 18 mois et Saint-Nectaire.",
    category: DishCategory.DESSERT,
    price: 13.0,
    imageUrl: '/images/dishes/fromages.jpg',
    isAvailable: true,
    allergens: ['Lait'],
  },
  {
    name: 'Creme brulee',
    description: 'Creme brulee a la vanille de Tahiti, caramelisee au chalumeau, tuile aux amandes.',
    category: DishCategory.DESSERT,
    price: 9.0,
    imageUrl: '/images/dishes/creme-brulee.jpg',
    isAvailable: true,
    allergens: ['Oeufs', 'Lait', 'Fruits a coque'],
  },
  {
    name: 'Paris-Brest',
    description: 'Paris-Brest croustillant, creme mousseline pralinee aux noisettes du Piemont, eclats de pralin.',
    category: DishCategory.DESSERT,
    price: 11.0,
    imageUrl: '/images/dishes/paris-brest.jpg',
    isAvailable: true,
    allergens: ['Gluten', 'Oeufs', 'Lait', 'Fruits a coque'],
  },
  {
    name: 'Mousse au chocolat',
    description: 'Mousse aerienne au chocolat noir grand cru, chantilly legere et copeaux de chocolat.',
    category: DishCategory.DESSERT,
    price: 8.0,
    imageUrl: '/images/dishes/mousse-chocolat.jpg',
    isAvailable: true,
    allergens: ['Oeufs', 'Lait', 'Soja'],
  },
];

export const MENUS: MenuFixture[] = [
  {
    name: 'Menu Prestige',
    description:
      "Notre menu d'exception pour des evenements inoubliables. Une selection raffinee de mets gastronomiques prepares avec les meilleurs produits du terroir. Foie gras maison, filet de boeuf Rossini et desserts d'excellence pour sublimer vos receptions les plus prestigieuses.",
    theme: 'Gastronomique',
    price: 85.0,
    minPersons: 15,
    maxPersons: 100,
    conditions:
      "Commande 7 jours a l'avance minimum. Supplement de 10 EUR par personne pour le service en salle. Vaisselle et nappage inclus. Degressif a partir de 50 convives.",
    imageUrl: '/images/menus/prestige.jpg',
    isAvailable: true,
    dishes: ['Foie gras maison', 'Filet de boeuf rossini', 'Magret de canard', 'Creme brulee', 'Paris-Brest'],
    dietaryRegimes: ['Standard'],
  },
  {
    name: 'Menu Tradition',
    description:
      "Un voyage au coeur des saveurs traditionnelles francaises. Des recettes authentiques revisitees avec soin par notre chef, pour retrouver le gout des bons plats d'autrefois. Ideal pour les repas de famille et les celebrations conviviales.",
    theme: 'Terroir',
    price: 65.0,
    minPersons: 10,
    maxPersons: 80,
    conditions:
      "Commande 5 jours a l'avance minimum. Possibilite d'adapter les plats selon vos preferences. Service en buffet ou a l'assiette.",
    imageUrl: '/images/menus/tradition.jpg',
    isAvailable: true,
    dishes: ["Soupe a l'oignon gratinee", 'Blanquette de veau', "Souris d'agneau confite", 'Fondant au chocolat'],
    dietaryRegimes: ['Standard', 'Halal'],
  },
  {
    name: 'Menu Mediterranee',
    description:
      "Les saveurs ensoleillees de la Mediterranee s'invitent a votre table. Des produits frais, des herbes aromatiques et des preparations legeres qui evoquent la douceur du sud. Parfait pour les evenements estivaux et les repas en plein air.",
    theme: 'Mediterraneen',
    price: 55.0,
    minPersons: 10,
    maxPersons: 60,
    conditions:
      "Commande 4 jours a l'avance minimum. Menu ideal pour les evenements en exterieur. Options sans gluten disponibles sur demande.",
    imageUrl: '/images/menus/mediterranee.jpg',
    isAvailable: true,
    dishes: ['Bruschetta tomates-mozzarella', 'Carpaccio de boeuf', 'Pave de thon', 'Tiramisu'],
    dietaryRegimes: ['Standard', 'Sans lactose'],
  },
  {
    name: 'Menu Vegetarien Gourmet',
    description:
      "Une cuisine vegetarienne creative et gourmande qui met a l'honneur les legumes de saison et les cereales nobles. Prouvez que la gastronomie vegetarienne peut etre aussi raffinee qu'inventive. Chaque plat est une celebration du vegetal.",
    theme: 'Vegetarien',
    price: 50.0,
    minPersons: 8,
    maxPersons: 50,
    conditions:
      "Commande 4 jours a l'avance minimum. Adaptation vegan possible sur demande. Tous les produits sont issus de l'agriculture biologique ou raisonnee.",
    imageUrl: '/images/menus/vegetarien.jpg',
    isAvailable: true,
    dishes: [
      'Veloute de champignons',
      'Risotto aux legumes',
      'Salade de chevre chaud',
      'Panna cotta aux fruits rouges',
    ],
    dietaryRegimes: ['Standard', 'Vegetarien', 'Sans gluten'],
  },
  {
    name: 'Menu Ocean',
    description:
      "Une ode aux tresors de la mer. Poissons frais, crustaces et coquillages sublimes par notre chef pour un festin marin d'exception. Les produits sont selectionnes chaque matin aupres de nos pecheurs partenaires de la cote atlantique.",
    theme: 'Fruits de mer',
    price: 70.0,
    minPersons: 10,
    maxPersons: 60,
    conditions:
      "Commande 5 jours a l'avance minimum. Arrivage frais quotidien, le menu peut varier selon la peche du jour. Supplement plateau de fruits de mer : 20 EUR/personne.",
    imageUrl: '/images/menus/ocean.jpg',
    isAvailable: true,
    dishes: ['Tartare de saumon', 'Dos de cabillaud', 'Pave de thon', 'Tarte au citron meringuee'],
    dietaryRegimes: ['Standard', 'Sans gluten', 'Sans lactose'],
  },
  {
    name: 'Menu Brunch',
    description:
      "Un brunch genereux et convivial, melant preparations sucrees et salees. Viennoiseries fraiches, oeufs prepares a votre gout, charcuterie fine et patisseries maison. L'art du brunch a la francaise pour vos matinees gourmandes.",
    theme: 'Brunch',
    price: 35.0,
    minPersons: 20,
    maxPersons: 100,
    conditions:
      "Commande 3 jours a l'avance minimum. Service de 10h a 14h. Boissons chaudes incluses (cafe, the, chocolat). Jus de fruits frais en supplement.",
    imageUrl: '/images/menus/brunch.jpg',
    isAvailable: true,
    dishes: ['Salade Caesar', 'Supreme de volaille', 'Fondant au chocolat', 'Mousse au chocolat'],
    dietaryRegimes: ['Standard', 'Vegetarien', 'Halal'],
  },
  {
    name: 'Menu Cocktail',
    description:
      'Des bouchees raffinées et des pieces cocktail elegantes pour animer vos receptions debout. Un assortiment savant de saveurs sucrees et salees, ideal pour les vernissages, lancements et soirees networking.',
    theme: 'Cocktail',
    price: 45.0,
    minPersons: 20,
    maxPersons: 150,
    conditions:
      "Commande 4 jours a l'avance minimum. 10 pieces par personne incluses. Service de 2 heures inclus. Supplement pour pieces supplementaires ou service prolonge.",
    imageUrl: '/images/menus/cocktail.jpg',
    isAvailable: true,
    dishes: [
      'Bruschetta tomates-mozzarella',
      'Tartare de saumon',
      'Foie gras maison',
      'Salade de chevre chaud',
      'Creme brulee',
    ],
    dietaryRegimes: ['Standard', 'Vegetarien', 'Sans lactose'],
  },
  {
    name: 'Menu Entreprise',
    description:
      "La solution ideale pour vos dejeuners d'affaires, seminaires et evenements corporate. Un menu equilibre et savoureux qui allie efficacite et qualite gastronomique. Presentation soignee pour une image professionnelle impeccable.",
    theme: 'Business',
    price: 55.0,
    minPersons: 10,
    maxPersons: 200,
    conditions:
      "Commande 3 jours a l'avance minimum. Facturation entreprise possible. Options dietetiques et allergenes prises en compte. Livraison a l'heure garantie.",
    imageUrl: '/images/menus/entreprise.jpg',
    isAvailable: true,
    dishes: ['Salade Caesar', 'Filet mignon en croute', 'Tajine de poulet', 'Tarte au citron meringuee'],
    dietaryRegimes: ['Standard', 'Halal', 'Sans gluten', 'Vegetarien'],
  },
];
