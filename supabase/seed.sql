-- ============================================================================
-- Vite & Gourmand - Seed Data
-- Traiteur d'exception a Bordeaux
-- ============================================================================
-- This seed file populates the database with initial data for the
-- Vite & Gourmand catering application.
-- ============================================================================

-- Clean existing data (in reverse dependency order)
TRUNCATE public.menu_dietary_regimes CASCADE;
TRUNCATE public.menu_dishes CASCADE;
TRUNCATE public.dish_allergens CASCADE;
TRUNCATE public.menus CASCADE;
TRUNCATE public.dishes CASCADE;
TRUNCATE public.dietary_regimes CASCADE;
TRUNCATE public.allergens CASCADE;
TRUNCATE public.delivery_zones CASCADE;
TRUNCATE public.operating_hours CASCADE;
TRUNCATE public.page_contents CASCADE;

-- ============================================================================
-- Test users (create via Supabase dashboard or auth admin API):
-- admin@viteetgourmand.fr / password123 (role: admin)
-- employe@viteetgourmand.fr / password123 (role: employee)
-- client@example.com / password123 (role: user)
-- jean.petit@example.com / password123 (role: user)
-- claire.bernard@example.com / password123 (role: user)
-- ============================================================================

-- ============================================================================
-- 1. ALLERGENS (14 EU mandatory allergens)
-- ============================================================================
INSERT INTO public.allergens (id, name, icon) VALUES
  (gen_random_uuid(), 'Gluten', 'wheat'),
  (gen_random_uuid(), 'Crustaces', 'shrimp'),
  (gen_random_uuid(), 'Oeufs', 'egg'),
  (gen_random_uuid(), 'Poisson', 'fish'),
  (gen_random_uuid(), 'Arachides', 'peanut'),
  (gen_random_uuid(), 'Soja', 'soybean'),
  (gen_random_uuid(), 'Lait', 'milk'),
  (gen_random_uuid(), 'Fruits a coque', 'tree-nut'),
  (gen_random_uuid(), 'Celeri', 'celery'),
  (gen_random_uuid(), 'Moutarde', 'mustard'),
  (gen_random_uuid(), 'Sesame', 'sesame'),
  (gen_random_uuid(), 'Sulfites', 'sulfite'),
  (gen_random_uuid(), 'Lupin', 'lupin'),
  (gen_random_uuid(), 'Mollusques', 'mollusk');

-- ============================================================================
-- 2. DIETARY REGIMES
-- ============================================================================
INSERT INTO public.dietary_regimes (id, name, description) VALUES
  (gen_random_uuid(), 'Standard', 'Regime alimentaire classique sans restriction particuliere.'),
  (gen_random_uuid(), 'Vegetarien', 'Regime excluant la viande et le poisson, mais autorisant les produits laitiers et les oeufs.'),
  (gen_random_uuid(), 'Vegan', 'Regime excluant tout produit d''origine animale.'),
  (gen_random_uuid(), 'Sans gluten', 'Regime excluant toutes les sources de gluten (ble, orge, seigle, etc.).'),
  (gen_random_uuid(), 'Halal', 'Regime conforme aux prescriptions alimentaires islamiques.'),
  (gen_random_uuid(), 'Casher', 'Regime conforme aux lois alimentaires juives (kashrout).'),
  (gen_random_uuid(), 'Sans lactose', 'Regime excluant le lactose et les produits laitiers.');

-- ============================================================================
-- 3. DISHES
-- ============================================================================

-- Entrees (8)
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available) VALUES
  (gen_random_uuid(), 'Salade de chevre chaud',
   'Mesclun de saison, crottin de chevre gratine sur toast, miel et noix, vinaigrette balsamique.',
   'entree', 12.50, '/images/dishes/salade-chevre-chaud.jpg', true),

  (gen_random_uuid(), 'Veloute de champignons',
   'Veloute onctueux de champignons de Paris et cepes, creme fraiche et ciboulette.',
   'entree', 10.00, '/images/dishes/veloute-champignons.jpg', true),

  (gen_random_uuid(), 'Tartare de saumon',
   'Tartare de saumon frais Label Rouge, avocat, citron vert, aneth et huile de sesame.',
   'entree', 14.50, '/images/dishes/tartare-saumon.jpg', true),

  (gen_random_uuid(), 'Foie gras maison',
   'Foie gras de canard mi-cuit fait maison, chutney de figues et pain d''epices toaste.',
   'entree', 22.00, '/images/dishes/foie-gras.jpg', true),

  (gen_random_uuid(), 'Carpaccio de boeuf',
   'Fines tranches de boeuf cru, copeaux de parmesan, roquette, huile de truffe et citron.',
   'entree', 15.00, '/images/dishes/carpaccio-boeuf.jpg', true),

  (gen_random_uuid(), 'Bruschetta tomates-mozzarella',
   'Pain ciabatta grille, tomates cerises confites, mozzarella di Bufala, basilic frais et huile d''olive.',
   'entree', 11.00, '/images/dishes/bruschetta.jpg', true),

  (gen_random_uuid(), 'Soupe a l''oignon gratinee',
   'Soupe traditionnelle a l''oignon caramelise, gratinee au fromage Comte, croutons dores.',
   'entree', 10.50, '/images/dishes/soupe-oignon.jpg', true),

  (gen_random_uuid(), 'Salade Caesar',
   'Laitue romaine croquante, poulet grille, crotons ailles, parmesan, sauce Caesar maison.',
   'entree', 13.00, '/images/dishes/salade-caesar.jpg', true);

-- Plats (10)
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available) VALUES
  (gen_random_uuid(), 'Filet de boeuf rossini',
   'Filet de boeuf francais poele, escalope de foie gras, sauce Perigueux a la truffe noire, pommes fondantes.',
   'plat', 25.00, '/images/dishes/filet-boeuf-rossini.jpg', true),

  (gen_random_uuid(), 'Supreme de volaille',
   'Supreme de volaille fermiere, jus au thym, ecrase de pommes de terre a l''huile d''olive et legumes de saison.',
   'plat', 18.00, '/images/dishes/supreme-volaille.jpg', true),

  (gen_random_uuid(), 'Dos de cabillaud',
   'Dos de cabillaud roti, beurre blanc au citron, risotto crémeux aux petits pois et menthe fraiche.',
   'plat', 20.00, '/images/dishes/dos-cabillaud.jpg', true),

  (gen_random_uuid(), 'Souris d''agneau confite',
   'Souris d''agneau confite 7 heures au romarin, puree de patate douce et jus d''agneau reduit.',
   'plat', 22.00, '/images/dishes/souris-agneau.jpg', true),

  (gen_random_uuid(), 'Risotto aux legumes',
   'Risotto cremeux aux legumes de saison, parmesan affine 24 mois, huile de truffe blanche.',
   'plat', 16.00, '/images/dishes/risotto-legumes.jpg', true),

  (gen_random_uuid(), 'Magret de canard',
   'Magret de canard du Sud-Ouest roti, sauce aux cerises, gratin dauphinois et haricots verts.',
   'plat', 21.00, '/images/dishes/magret-canard.jpg', true),

  (gen_random_uuid(), 'Pave de thon',
   'Pave de thon rouge mi-cuit, croute de sesame, wok de legumes croquants et sauce soja-gingembre.',
   'plat', 19.50, '/images/dishes/pave-thon.jpg', true),

  (gen_random_uuid(), 'Blanquette de veau',
   'Blanquette de veau a l''ancienne, riz pilaf, carottes et champignons, sauce onctueuse a la creme.',
   'plat', 18.50, '/images/dishes/blanquette-veau.jpg', true),

  (gen_random_uuid(), 'Tajine de poulet',
   'Tajine de poulet fermier aux olives et citrons confits, semoule fine aux herbes et amandes grillees.',
   'plat', 17.00, '/images/dishes/tajine-poulet.jpg', true),

  (gen_random_uuid(), 'Filet mignon en croute',
   'Filet mignon de porc en croute feuilletee, duxelles de champignons, sauce madere et legumes glaces.',
   'plat', 20.50, '/images/dishes/filet-mignon-croute.jpg', true);

-- Desserts (8)
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available) VALUES
  (gen_random_uuid(), 'Fondant au chocolat',
   'Fondant au chocolat noir Valrhona 70%, coeur coulant, creme anglaise vanille Bourbon.',
   'dessert', 10.00, '/images/dishes/fondant-chocolat.jpg', true),

  (gen_random_uuid(), 'Tarte au citron meringuee',
   'Tarte au citron de Menton meringuee, pate sablee croustillante, meringue italienne flambee.',
   'dessert', 9.50, '/images/dishes/tarte-citron.jpg', true),

  (gen_random_uuid(), 'Tiramisu',
   'Tiramisu traditionnel au mascarpone, biscuits imbibbes de cafe espresso, cacao amer.',
   'dessert', 9.00, '/images/dishes/tiramisu.jpg', true),

  (gen_random_uuid(), 'Panna cotta aux fruits rouges',
   'Panna cotta a la vanille de Madagascar, coulis de fruits rouges frais de saison.',
   'dessert', 8.50, '/images/dishes/panna-cotta.jpg', true),

  (gen_random_uuid(), 'Assiette de fromages affines',
   'Selection de 5 fromages affines de la region : Ossau-Iraty, Rocamadour, Bleu d''Auvergne, Comte 18 mois et Saint-Nectaire.',
   'dessert', 13.00, '/images/dishes/fromages.jpg', true),

  (gen_random_uuid(), 'Creme brulee',
   'Creme brulee a la vanille de Tahiti, caramelisee au chalumeau, tuile aux amandes.',
   'dessert', 9.00, '/images/dishes/creme-brulee.jpg', true),

  (gen_random_uuid(), 'Paris-Brest',
   'Paris-Brest croustillant, creme mousseline pralinee aux noisettes du Piemont, eclats de pralin.',
   'dessert', 11.00, '/images/dishes/paris-brest.jpg', true),

  (gen_random_uuid(), 'Mousse au chocolat',
   'Mousse aerienne au chocolat noir grand cru, chantilly legere et copeaux de chocolat.',
   'dessert', 8.00, '/images/dishes/mousse-chocolat.jpg', true);

-- ============================================================================
-- 4. DISH_ALLERGENS (realistic allergen associations)
-- ============================================================================

-- Salade de chevre chaud: Gluten (toast), Lait (chevre), Fruits a coque (noix)
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Salade de chevre chaud'), (SELECT id FROM public.allergens WHERE name = 'Gluten')),
  ((SELECT id FROM public.dishes WHERE name = 'Salade de chevre chaud'), (SELECT id FROM public.allergens WHERE name = 'Lait')),
  ((SELECT id FROM public.dishes WHERE name = 'Salade de chevre chaud'), (SELECT id FROM public.allergens WHERE name = 'Fruits a coque'));

-- Veloute de champignons: Lait (creme), Celeri
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Veloute de champignons'), (SELECT id FROM public.allergens WHERE name = 'Lait')),
  ((SELECT id FROM public.dishes WHERE name = 'Veloute de champignons'), (SELECT id FROM public.allergens WHERE name = 'Celeri'));

-- Tartare de saumon: Poisson, Sesame
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Tartare de saumon'), (SELECT id FROM public.allergens WHERE name = 'Poisson')),
  ((SELECT id FROM public.dishes WHERE name = 'Tartare de saumon'), (SELECT id FROM public.allergens WHERE name = 'Sesame'));

-- Foie gras maison: Oeufs, Sulfites, Gluten (pain d'epices)
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Foie gras maison'), (SELECT id FROM public.allergens WHERE name = 'Oeufs')),
  ((SELECT id FROM public.dishes WHERE name = 'Foie gras maison'), (SELECT id FROM public.allergens WHERE name = 'Sulfites')),
  ((SELECT id FROM public.dishes WHERE name = 'Foie gras maison'), (SELECT id FROM public.allergens WHERE name = 'Gluten'));

-- Carpaccio de boeuf: Lait (parmesan), Moutarde
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Carpaccio de boeuf'), (SELECT id FROM public.allergens WHERE name = 'Lait')),
  ((SELECT id FROM public.dishes WHERE name = 'Carpaccio de boeuf'), (SELECT id FROM public.allergens WHERE name = 'Moutarde'));

-- Bruschetta tomates-mozzarella: Gluten (pain), Lait (mozzarella)
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Bruschetta tomates-mozzarella'), (SELECT id FROM public.allergens WHERE name = 'Gluten')),
  ((SELECT id FROM public.dishes WHERE name = 'Bruschetta tomates-mozzarella'), (SELECT id FROM public.allergens WHERE name = 'Lait'));

-- Soupe a l'oignon gratinee: Gluten (croutons), Lait (fromage)
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Soupe a l''oignon gratinee'), (SELECT id FROM public.allergens WHERE name = 'Gluten')),
  ((SELECT id FROM public.dishes WHERE name = 'Soupe a l''oignon gratinee'), (SELECT id FROM public.allergens WHERE name = 'Lait'));

-- Salade Caesar: Gluten (croutons), Lait (parmesan), Oeufs (sauce Caesar), Poisson (anchois)
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Salade Caesar'), (SELECT id FROM public.allergens WHERE name = 'Gluten')),
  ((SELECT id FROM public.dishes WHERE name = 'Salade Caesar'), (SELECT id FROM public.allergens WHERE name = 'Lait')),
  ((SELECT id FROM public.dishes WHERE name = 'Salade Caesar'), (SELECT id FROM public.allergens WHERE name = 'Oeufs')),
  ((SELECT id FROM public.dishes WHERE name = 'Salade Caesar'), (SELECT id FROM public.allergens WHERE name = 'Poisson'));

-- Filet de boeuf rossini: Oeufs (foie gras), Sulfites (sauce), Gluten (accompagnement)
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Filet de boeuf rossini'), (SELECT id FROM public.allergens WHERE name = 'Oeufs')),
  ((SELECT id FROM public.dishes WHERE name = 'Filet de boeuf rossini'), (SELECT id FROM public.allergens WHERE name = 'Sulfites')),
  ((SELECT id FROM public.dishes WHERE name = 'Filet de boeuf rossini'), (SELECT id FROM public.allergens WHERE name = 'Gluten'));

-- Supreme de volaille: Lait (beurre), Celeri
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Supreme de volaille'), (SELECT id FROM public.allergens WHERE name = 'Lait')),
  ((SELECT id FROM public.dishes WHERE name = 'Supreme de volaille'), (SELECT id FROM public.allergens WHERE name = 'Celeri'));

-- Dos de cabillaud: Poisson, Lait (beurre blanc), Gluten (risotto)
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Dos de cabillaud'), (SELECT id FROM public.allergens WHERE name = 'Poisson')),
  ((SELECT id FROM public.dishes WHERE name = 'Dos de cabillaud'), (SELECT id FROM public.allergens WHERE name = 'Lait')),
  ((SELECT id FROM public.dishes WHERE name = 'Dos de cabillaud'), (SELECT id FROM public.allergens WHERE name = 'Gluten'));

-- Souris d'agneau confite: Celeri, Sulfites (jus)
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Souris d''agneau confite'), (SELECT id FROM public.allergens WHERE name = 'Celeri')),
  ((SELECT id FROM public.dishes WHERE name = 'Souris d''agneau confite'), (SELECT id FROM public.allergens WHERE name = 'Sulfites'));

-- Risotto aux legumes: Lait (parmesan, beurre), Celeri
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Risotto aux legumes'), (SELECT id FROM public.allergens WHERE name = 'Lait')),
  ((SELECT id FROM public.dishes WHERE name = 'Risotto aux legumes'), (SELECT id FROM public.allergens WHERE name = 'Celeri'));

-- Magret de canard: Sulfites (sauce), Lait (gratin)
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Magret de canard'), (SELECT id FROM public.allergens WHERE name = 'Sulfites')),
  ((SELECT id FROM public.dishes WHERE name = 'Magret de canard'), (SELECT id FROM public.allergens WHERE name = 'Lait'));

-- Pave de thon: Poisson, Sesame, Soja
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Pave de thon'), (SELECT id FROM public.allergens WHERE name = 'Poisson')),
  ((SELECT id FROM public.dishes WHERE name = 'Pave de thon'), (SELECT id FROM public.allergens WHERE name = 'Sesame')),
  ((SELECT id FROM public.dishes WHERE name = 'Pave de thon'), (SELECT id FROM public.allergens WHERE name = 'Soja'));

-- Blanquette de veau: Lait (creme), Oeufs, Gluten (roux), Celeri
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Blanquette de veau'), (SELECT id FROM public.allergens WHERE name = 'Lait')),
  ((SELECT id FROM public.dishes WHERE name = 'Blanquette de veau'), (SELECT id FROM public.allergens WHERE name = 'Oeufs')),
  ((SELECT id FROM public.dishes WHERE name = 'Blanquette de veau'), (SELECT id FROM public.allergens WHERE name = 'Gluten')),
  ((SELECT id FROM public.dishes WHERE name = 'Blanquette de veau'), (SELECT id FROM public.allergens WHERE name = 'Celeri'));

-- Tajine de poulet: Fruits a coque (amandes), Sulfites
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Tajine de poulet'), (SELECT id FROM public.allergens WHERE name = 'Fruits a coque')),
  ((SELECT id FROM public.dishes WHERE name = 'Tajine de poulet'), (SELECT id FROM public.allergens WHERE name = 'Sulfites'));

-- Filet mignon en croute: Gluten (pate feuilletee), Oeufs, Lait (beurre)
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Filet mignon en croute'), (SELECT id FROM public.allergens WHERE name = 'Gluten')),
  ((SELECT id FROM public.dishes WHERE name = 'Filet mignon en croute'), (SELECT id FROM public.allergens WHERE name = 'Oeufs')),
  ((SELECT id FROM public.dishes WHERE name = 'Filet mignon en croute'), (SELECT id FROM public.allergens WHERE name = 'Lait'));

-- Fondant au chocolat: Gluten, Oeufs, Lait
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Fondant au chocolat'), (SELECT id FROM public.allergens WHERE name = 'Gluten')),
  ((SELECT id FROM public.dishes WHERE name = 'Fondant au chocolat'), (SELECT id FROM public.allergens WHERE name = 'Oeufs')),
  ((SELECT id FROM public.dishes WHERE name = 'Fondant au chocolat'), (SELECT id FROM public.allergens WHERE name = 'Lait'));

-- Tarte au citron meringuee: Gluten, Oeufs, Lait
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Tarte au citron meringuee'), (SELECT id FROM public.allergens WHERE name = 'Gluten')),
  ((SELECT id FROM public.dishes WHERE name = 'Tarte au citron meringuee'), (SELECT id FROM public.allergens WHERE name = 'Oeufs')),
  ((SELECT id FROM public.dishes WHERE name = 'Tarte au citron meringuee'), (SELECT id FROM public.allergens WHERE name = 'Lait'));

-- Tiramisu: Oeufs, Lait (mascarpone), Gluten (biscuits)
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Tiramisu'), (SELECT id FROM public.allergens WHERE name = 'Oeufs')),
  ((SELECT id FROM public.dishes WHERE name = 'Tiramisu'), (SELECT id FROM public.allergens WHERE name = 'Lait')),
  ((SELECT id FROM public.dishes WHERE name = 'Tiramisu'), (SELECT id FROM public.allergens WHERE name = 'Gluten'));

-- Panna cotta aux fruits rouges: Lait
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Panna cotta aux fruits rouges'), (SELECT id FROM public.allergens WHERE name = 'Lait'));

-- Assiette de fromages affines: Lait
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Assiette de fromages affines'), (SELECT id FROM public.allergens WHERE name = 'Lait'));

-- Creme brulee: Oeufs, Lait, Fruits a coque (amandes dans la tuile)
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Creme brulee'), (SELECT id FROM public.allergens WHERE name = 'Oeufs')),
  ((SELECT id FROM public.dishes WHERE name = 'Creme brulee'), (SELECT id FROM public.allergens WHERE name = 'Lait')),
  ((SELECT id FROM public.dishes WHERE name = 'Creme brulee'), (SELECT id FROM public.allergens WHERE name = 'Fruits a coque'));

-- Paris-Brest: Gluten, Oeufs, Lait, Fruits a coque (noisettes)
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Paris-Brest'), (SELECT id FROM public.allergens WHERE name = 'Gluten')),
  ((SELECT id FROM public.dishes WHERE name = 'Paris-Brest'), (SELECT id FROM public.allergens WHERE name = 'Oeufs')),
  ((SELECT id FROM public.dishes WHERE name = 'Paris-Brest'), (SELECT id FROM public.allergens WHERE name = 'Lait')),
  ((SELECT id FROM public.dishes WHERE name = 'Paris-Brest'), (SELECT id FROM public.allergens WHERE name = 'Fruits a coque'));

-- Mousse au chocolat: Oeufs, Lait, Soja (lecithine dans le chocolat)
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES
  ((SELECT id FROM public.dishes WHERE name = 'Mousse au chocolat'), (SELECT id FROM public.allergens WHERE name = 'Oeufs')),
  ((SELECT id FROM public.dishes WHERE name = 'Mousse au chocolat'), (SELECT id FROM public.allergens WHERE name = 'Lait')),
  ((SELECT id FROM public.dishes WHERE name = 'Mousse au chocolat'), (SELECT id FROM public.allergens WHERE name = 'Soja'));

-- ============================================================================
-- 5. MENUS
-- ============================================================================
INSERT INTO public.menus (id, name, description, theme, price, min_persons, max_persons, conditions, image_url, is_available) VALUES
  (gen_random_uuid(),
   'Menu Prestige',
   'Notre menu d''exception pour des evenements inoubliables. Une selection raffinee de mets gastronomiques prepares avec les meilleurs produits du terroir. Foie gras maison, filet de boeuf Rossini et desserts d''excellence pour sublimer vos receptions les plus prestigieuses.',
   'Gastronomique',
   85.00, 15, 100,
   'Commande 7 jours a l''avance minimum. Supplement de 10 EUR par personne pour le service en salle. Vaisselle et nappage inclus. Degressif a partir de 50 convives.',
   '/images/menus/prestige.jpg', true),

  (gen_random_uuid(),
   'Menu Tradition',
   'Un voyage au coeur des saveurs traditionnelles francaises. Des recettes authentiques revisitees avec soin par notre chef, pour retrouver le gout des bons plats d''autrefois. Ideal pour les repas de famille et les celebrations conviviales.',
   'Terroir',
   65.00, 10, 80,
   'Commande 5 jours a l''avance minimum. Possibilite d''adapter les plats selon vos preferences. Service en buffet ou a l''assiette.',
   '/images/menus/tradition.jpg', true),

  (gen_random_uuid(),
   'Menu Mediterranee',
   'Les saveurs ensoleillees de la Mediterranee s''invitent a votre table. Des produits frais, des herbes aromatiques et des preparations legeres qui evoquent la douceur du sud. Parfait pour les evenements estivaux et les repas en plein air.',
   'Mediterraneen',
   55.00, 10, 60,
   'Commande 4 jours a l''avance minimum. Menu ideal pour les evenements en exterieur. Options sans gluten disponibles sur demande.',
   '/images/menus/mediterranee.jpg', true),

  (gen_random_uuid(),
   'Menu Vegetarien Gourmet',
   'Une cuisine vegetarienne creative et gourmande qui met a l''honneur les legumes de saison et les cereales nobles. Prouvez que la gastronomie vegetarienne peut etre aussi raffinee qu''inventive. Chaque plat est une celebration du vegetal.',
   'Vegetarien',
   50.00, 8, 50,
   'Commande 4 jours a l''avance minimum. Adaptation vegan possible sur demande. Tous les produits sont issus de l''agriculture biologique ou raisonnee.',
   '/images/menus/vegetarien.jpg', true),

  (gen_random_uuid(),
   'Menu Ocean',
   'Une ode aux tresors de la mer. Poissons frais, crustaces et coquillages sublimes par notre chef pour un festin marin d''exception. Les produits sont selectionnes chaque matin aupres de nos pecheurs partenaires de la cote atlantique.',
   'Fruits de mer',
   70.00, 10, 60,
   'Commande 5 jours a l''avance minimum. Arrivage frais quotidien, le menu peut varier selon la peche du jour. Supplement plateau de fruits de mer : 20 EUR/personne.',
   '/images/menus/ocean.jpg', true),

  (gen_random_uuid(),
   'Menu Brunch',
   'Un brunch genereux et convivial, melant preparations sucrees et salees. Viennoiseries fraiches, oeufs prepares a votre gout, charcuterie fine et patisseries maison. L''art du brunch a la francaise pour vos matinees gourmandes.',
   'Brunch',
   35.00, 20, 100,
   'Commande 3 jours a l''avance minimum. Service de 10h a 14h. Boissons chaudes incluses (cafe, the, chocolat). Jus de fruits frais en supplement.',
   '/images/menus/brunch.jpg', true),

  (gen_random_uuid(),
   'Menu Cocktail',
   'Des bouchees raffinées et des pieces cocktail elegantes pour animer vos receptions debout. Un assortiment savant de saveurs sucrees et salees, ideal pour les vernissages, lancements et soirees networking.',
   'Cocktail',
   45.00, 20, 150,
   'Commande 4 jours a l''avance minimum. 10 pieces par personne incluses. Service de 2 heures inclus. Supplement pour pieces supplementaires ou service prolonge.',
   '/images/menus/cocktail.jpg', true),

  (gen_random_uuid(),
   'Menu Entreprise',
   'La solution ideale pour vos dejeuners d''affaires, seminaires et evenements corporate. Un menu equilibre et savoureux qui allie efficacite et qualite gastronomique. Presentation soignee pour une image professionnelle impeccable.',
   'Business',
   55.00, 10, 200,
   'Commande 3 jours a l''avance minimum. Facturation entreprise possible. Options dietetiques et allergenes prises en compte. Livraison a l''heure garantie.',
   '/images/menus/entreprise.jpg', true);

-- ============================================================================
-- 6. MENU_DISHES (link menus to dishes)
-- ============================================================================

-- Menu Prestige: Foie gras, Filet de boeuf rossini, Magret de canard, Creme brulee, Paris-Brest
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES
  ((SELECT id FROM public.menus WHERE name = 'Menu Prestige'), (SELECT id FROM public.dishes WHERE name = 'Foie gras maison')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Prestige'), (SELECT id FROM public.dishes WHERE name = 'Filet de boeuf rossini')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Prestige'), (SELECT id FROM public.dishes WHERE name = 'Magret de canard')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Prestige'), (SELECT id FROM public.dishes WHERE name = 'Creme brulee')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Prestige'), (SELECT id FROM public.dishes WHERE name = 'Paris-Brest'));

-- Menu Tradition: Soupe a l'oignon, Blanquette de veau, Souris d'agneau confite, Fondant au chocolat
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES
  ((SELECT id FROM public.menus WHERE name = 'Menu Tradition'), (SELECT id FROM public.dishes WHERE name = 'Soupe a l''oignon gratinee')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Tradition'), (SELECT id FROM public.dishes WHERE name = 'Blanquette de veau')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Tradition'), (SELECT id FROM public.dishes WHERE name = 'Souris d''agneau confite')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Tradition'), (SELECT id FROM public.dishes WHERE name = 'Fondant au chocolat'));

-- Menu Mediterranee: Bruschetta, Carpaccio de boeuf, Pave de thon, Tiramisu
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES
  ((SELECT id FROM public.menus WHERE name = 'Menu Mediterranee'), (SELECT id FROM public.dishes WHERE name = 'Bruschetta tomates-mozzarella')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Mediterranee'), (SELECT id FROM public.dishes WHERE name = 'Carpaccio de boeuf')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Mediterranee'), (SELECT id FROM public.dishes WHERE name = 'Pave de thon')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Mediterranee'), (SELECT id FROM public.dishes WHERE name = 'Tiramisu'));

-- Menu Vegetarien Gourmet: Veloute de champignons, Risotto aux legumes, Salade de chevre chaud, Panna cotta
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES
  ((SELECT id FROM public.menus WHERE name = 'Menu Vegetarien Gourmet'), (SELECT id FROM public.dishes WHERE name = 'Veloute de champignons')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Vegetarien Gourmet'), (SELECT id FROM public.dishes WHERE name = 'Risotto aux legumes')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Vegetarien Gourmet'), (SELECT id FROM public.dishes WHERE name = 'Salade de chevre chaud')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Vegetarien Gourmet'), (SELECT id FROM public.dishes WHERE name = 'Panna cotta aux fruits rouges'));

-- Menu Ocean: Tartare de saumon, Dos de cabillaud, Pave de thon, Tarte au citron meringuee
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES
  ((SELECT id FROM public.menus WHERE name = 'Menu Ocean'), (SELECT id FROM public.dishes WHERE name = 'Tartare de saumon')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Ocean'), (SELECT id FROM public.dishes WHERE name = 'Dos de cabillaud')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Ocean'), (SELECT id FROM public.dishes WHERE name = 'Pave de thon')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Ocean'), (SELECT id FROM public.dishes WHERE name = 'Tarte au citron meringuee'));

-- Menu Brunch: Salade Caesar, Supreme de volaille, Fondant au chocolat, Mousse au chocolat
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES
  ((SELECT id FROM public.menus WHERE name = 'Menu Brunch'), (SELECT id FROM public.dishes WHERE name = 'Salade Caesar')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Brunch'), (SELECT id FROM public.dishes WHERE name = 'Supreme de volaille')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Brunch'), (SELECT id FROM public.dishes WHERE name = 'Fondant au chocolat')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Brunch'), (SELECT id FROM public.dishes WHERE name = 'Mousse au chocolat'));

-- Menu Cocktail: Bruschetta, Tartare de saumon, Foie gras maison, Salade de chevre chaud, Creme brulee
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES
  ((SELECT id FROM public.menus WHERE name = 'Menu Cocktail'), (SELECT id FROM public.dishes WHERE name = 'Bruschetta tomates-mozzarella')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Cocktail'), (SELECT id FROM public.dishes WHERE name = 'Tartare de saumon')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Cocktail'), (SELECT id FROM public.dishes WHERE name = 'Foie gras maison')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Cocktail'), (SELECT id FROM public.dishes WHERE name = 'Salade de chevre chaud')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Cocktail'), (SELECT id FROM public.dishes WHERE name = 'Creme brulee'));

-- Menu Entreprise: Salade Caesar, Filet mignon en croute, Tajine de poulet, Tarte au citron meringuee
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES
  ((SELECT id FROM public.menus WHERE name = 'Menu Entreprise'), (SELECT id FROM public.dishes WHERE name = 'Salade Caesar')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Entreprise'), (SELECT id FROM public.dishes WHERE name = 'Filet mignon en croute')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Entreprise'), (SELECT id FROM public.dishes WHERE name = 'Tajine de poulet')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Entreprise'), (SELECT id FROM public.dishes WHERE name = 'Tarte au citron meringuee'));

-- ============================================================================
-- 7. MENU_DIETARY_REGIMES (link menus to compatible regimes)
-- ============================================================================

-- Menu Prestige: Standard, Halal (can be adapted)
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES
  ((SELECT id FROM public.menus WHERE name = 'Menu Prestige'), (SELECT id FROM public.dietary_regimes WHERE name = 'Standard'));

-- Menu Tradition: Standard, Halal
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES
  ((SELECT id FROM public.menus WHERE name = 'Menu Tradition'), (SELECT id FROM public.dietary_regimes WHERE name = 'Standard')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Tradition'), (SELECT id FROM public.dietary_regimes WHERE name = 'Halal'));

-- Menu Mediterranee: Standard, Sans lactose
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES
  ((SELECT id FROM public.menus WHERE name = 'Menu Mediterranee'), (SELECT id FROM public.dietary_regimes WHERE name = 'Standard')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Mediterranee'), (SELECT id FROM public.dietary_regimes WHERE name = 'Sans lactose'));

-- Menu Vegetarien Gourmet: Standard, Vegetarien, Sans gluten
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES
  ((SELECT id FROM public.menus WHERE name = 'Menu Vegetarien Gourmet'), (SELECT id FROM public.dietary_regimes WHERE name = 'Standard')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Vegetarien Gourmet'), (SELECT id FROM public.dietary_regimes WHERE name = 'Vegetarien')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Vegetarien Gourmet'), (SELECT id FROM public.dietary_regimes WHERE name = 'Sans gluten'));

-- Menu Ocean: Standard, Sans gluten, Sans lactose
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES
  ((SELECT id FROM public.menus WHERE name = 'Menu Ocean'), (SELECT id FROM public.dietary_regimes WHERE name = 'Standard')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Ocean'), (SELECT id FROM public.dietary_regimes WHERE name = 'Sans gluten')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Ocean'), (SELECT id FROM public.dietary_regimes WHERE name = 'Sans lactose'));

-- Menu Brunch: Standard, Vegetarien, Halal
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES
  ((SELECT id FROM public.menus WHERE name = 'Menu Brunch'), (SELECT id FROM public.dietary_regimes WHERE name = 'Standard')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Brunch'), (SELECT id FROM public.dietary_regimes WHERE name = 'Vegetarien')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Brunch'), (SELECT id FROM public.dietary_regimes WHERE name = 'Halal'));

-- Menu Cocktail: Standard, Vegetarien, Sans lactose
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES
  ((SELECT id FROM public.menus WHERE name = 'Menu Cocktail'), (SELECT id FROM public.dietary_regimes WHERE name = 'Standard')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Cocktail'), (SELECT id FROM public.dietary_regimes WHERE name = 'Vegetarien')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Cocktail'), (SELECT id FROM public.dietary_regimes WHERE name = 'Sans lactose'));

-- Menu Entreprise: Standard, Halal, Sans gluten, Vegetarien
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES
  ((SELECT id FROM public.menus WHERE name = 'Menu Entreprise'), (SELECT id FROM public.dietary_regimes WHERE name = 'Standard')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Entreprise'), (SELECT id FROM public.dietary_regimes WHERE name = 'Halal')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Entreprise'), (SELECT id FROM public.dietary_regimes WHERE name = 'Sans gluten')),
  ((SELECT id FROM public.menus WHERE name = 'Menu Entreprise'), (SELECT id FROM public.dietary_regimes WHERE name = 'Vegetarien'));

-- ============================================================================
-- 8. DELIVERY ZONES
-- ============================================================================
INSERT INTO public.delivery_zones (id, name, postal_code, city, delivery_fee, is_active) VALUES
  (gen_random_uuid(), 'Bordeaux Centre', '33000', 'Bordeaux', 0.00, true),
  (gen_random_uuid(), 'Bordeaux Rive Droite', '33100', 'Bordeaux', 0.00, true),
  (gen_random_uuid(), 'Merignac', '33700', 'Merignac', 5.00, true),
  (gen_random_uuid(), 'Pessac', '33600', 'Pessac', 5.00, true),
  (gen_random_uuid(), 'Talence', '33400', 'Talence', 5.00, true),
  (gen_random_uuid(), 'Begles', '33130', 'Begles', 7.00, true),
  (gen_random_uuid(), 'Gradignan', '33170', 'Gradignan', 7.00, true),
  (gen_random_uuid(), 'Libourne', '33500', 'Libourne', 15.00, true);

-- ============================================================================
-- 9. OPERATING HOURS
-- ============================================================================
-- day_of_week: 0 = Sunday, 1 = Monday, ..., 6 = Saturday (PostgreSQL convention)
INSERT INTO public.operating_hours (id, day_of_week, open_time, close_time, is_closed) VALUES
  (gen_random_uuid(), 0, NULL, NULL, true),          -- Dimanche: ferme
  (gen_random_uuid(), 1, '09:00', '18:00', false),   -- Lundi
  (gen_random_uuid(), 2, '09:00', '18:00', false),   -- Mardi
  (gen_random_uuid(), 3, '09:00', '18:00', false),   -- Mercredi
  (gen_random_uuid(), 4, '09:00', '18:00', false),   -- Jeudi
  (gen_random_uuid(), 5, '09:00', '18:00', false),   -- Vendredi
  (gen_random_uuid(), 6, '10:00', '17:00', false);   -- Samedi

-- ============================================================================
-- 10. CMS PAGE CONTENTS
-- ============================================================================

-- Home page: Hero section
INSERT INTO public.page_contents (id, page, section, content) VALUES
  (gen_random_uuid(), 'home', 'hero', '{
    "title": "Vite & Gourmand",
    "subtitle": "Traiteur d''exception a Bordeaux",
    "description": "Des menus raffines pour vos evenements professionnels et prives. Notre equipe de chefs passionnes met son savoir-faire au service de vos receptions pour creer des moments gustatifs inoubliables.",
    "image": "/images/hero-bg.jpg",
    "cta_text": "Decouvrir nos menus",
    "cta_link": "/menus"
  }'::jsonb);

-- Home page: Features section
INSERT INTO public.page_contents (id, page, section, content) VALUES
  (gen_random_uuid(), 'home', 'features', '{
    "items": [
      {
        "icon": "award",
        "title": "Qualite premium",
        "description": "Des ingredients soigneusement selectionnes aupres de producteurs locaux et des preparations realisees par des chefs experimentes."
      },
      {
        "icon": "leaf",
        "title": "Produits frais",
        "description": "Tous nos plats sont prepares le jour meme avec des produits frais de saison, pour garantir une fraicheur et des saveurs optimales."
      },
      {
        "icon": "truck",
        "title": "Livraison soignee",
        "description": "Une livraison ponctuelle et soignee dans toute la metropole bordelaise, avec un conditionnement adapte pour preserver la qualite."
      },
      {
        "icon": "settings",
        "title": "Sur mesure",
        "description": "Chaque evenement est unique. Nous adaptons nos menus a vos besoins, preferences alimentaires et contraintes specifiques."
      }
    ]
  }'::jsonb);

-- Home page: Values section
INSERT INTO public.page_contents (id, page, section, content) VALUES
  (gen_random_uuid(), 'home', 'values', '{
    "items": [
      {
        "icon": "map-pin",
        "title": "Circuit court",
        "description": "Nous privilegions les producteurs locaux et les circuits courts pour soutenir l''economie regionale et reduire notre empreinte carbone."
      },
      {
        "icon": "chef-hat",
        "title": "Excellence culinaire",
        "description": "Notre equipe de chefs diplomes met tout son savoir-faire au service de la gastronomie francaise pour sublimer chaque plat."
      },
      {
        "icon": "heart",
        "title": "Satisfaction client",
        "description": "Votre satisfaction est notre priorite. Nous vous accompagnons de la commande a la degustation pour un service irreprochable."
      },
      {
        "icon": "recycle",
        "title": "Eco-responsabilite",
        "description": "Emballages recyclables, lutte contre le gaspillage alimentaire et gestion responsable des dechets : nous nous engageons pour la planete."
      }
    ]
  }'::jsonb);

-- Home page: Testimonials section
INSERT INTO public.page_contents (id, page, section, content) VALUES
  (gen_random_uuid(), 'home', 'testimonials', '{
    "display_count": 3,
    "title": "Ce que disent nos clients"
  }'::jsonb);

-- Menus page: Hero section
INSERT INTO public.page_contents (id, page, section, content) VALUES
  (gen_random_uuid(), 'menus', 'hero', '{
    "title": "Nos Menus",
    "description": "Decouvrez notre selection de menus soigneusement composes pour ravir les palais de vos convives. Du brunch decontracte au diner gastronomique, trouvez la formule ideale pour votre evenement."
  }'::jsonb);

-- Contact page: Content section
INSERT INTO public.page_contents (id, page, section, content) VALUES
  (gen_random_uuid(), 'contact', 'content', '{
    "title": "Contactez-nous",
    "description": "Une question ? Un devis personnalise ? Notre equipe est a votre ecoute pour vous accompagner dans l''organisation de votre evenement.",
    "email": "contact@viteetgourmand.fr",
    "phone": "05 56 00 00 00",
    "address": "12 Rue Sainte-Catherine, 33000 Bordeaux"
  }'::jsonb);

-- Legal page: Mentions legales
INSERT INTO public.page_contents (id, page, section, content) VALUES
  (gen_random_uuid(), 'legal', 'mentions', '{
    "content": "Mentions legales\n\nRaison sociale : Vite & Gourmand SARL\nSiege social : 12 Rue Sainte-Catherine, 33000 Bordeaux\nSIRET : 123 456 789 00012\nCapital social : 10 000 EUR\nDirecteur de la publication : Responsable Vite & Gourmand\nHebergeur : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA\n\nConformement a la loi n°78-17 du 6 janvier 1978 relative a l''informatique, aux fichiers et aux libertes, vous disposez d''un droit d''acces, de rectification et de suppression des donnees vous concernant. Pour exercer ce droit, veuillez nous contacter a contact@viteetgourmand.fr."
  }'::jsonb);

-- Legal page: CGV
INSERT INTO public.page_contents (id, page, section, content) VALUES
  (gen_random_uuid(), 'legal', 'cgv', '{
    "content": "Conditions Generales de Vente\n\nArticle 1 - Objet\nLes presentes conditions generales de vente regissent les relations contractuelles entre Vite & Gourmand SARL et ses clients dans le cadre de prestations de traiteur.\n\nArticle 2 - Commandes\nToute commande doit etre passee au minimum 3 a 7 jours avant la date de l''evenement selon le menu choisi. Un acompte de 30% est demande a la confirmation de la commande.\n\nArticle 3 - Prix\nLes prix sont indiques en euros TTC. Ils comprennent la preparation des plats et, le cas echeant, les frais de livraison selon la zone geographique.\n\nArticle 4 - Livraison\nLa livraison est effectuee a l''adresse indiquee lors de la commande, dans les creneaux horaires convenus. Des frais de livraison peuvent s''appliquer selon la zone.\n\nArticle 5 - Annulation\nToute annulation effectuee plus de 48 heures avant la date prevue donne lieu au remboursement integral de l''acompte. En deca, l''acompte est conserve.\n\nArticle 6 - Responsabilite\nVite & Gourmand s''engage a fournir des prestations de qualite. Notre responsabilite est limitee au montant de la commande.\n\nArticle 7 - Litiges\nEn cas de litige, une solution amiable sera recherchee. A defaut, les tribunaux de Bordeaux seront competents."
  }'::jsonb);

-- Legal page: Privacy policy
INSERT INTO public.page_contents (id, page, section, content) VALUES
  (gen_random_uuid(), 'legal', 'privacy', '{
    "content": "Politique de Confidentialite\n\nVite & Gourmand SARL s''engage a proteger la vie privee de ses utilisateurs. Cette politique de confidentialite decrit comment nous collectons, utilisons et protegeons vos donnees personnelles.\n\nDonnees collectees\nNous collectons les donnees suivantes : nom, prenom, adresse email, numero de telephone, adresse de livraison, et historique de commandes.\n\nUtilisation des donnees\nVos donnees sont utilisees pour : traiter vos commandes, vous contacter concernant vos reservations, ameliorer nos services, et vous envoyer des communications commerciales (avec votre consentement).\n\nConservation\nVos donnees sont conservees pendant la duree de la relation commerciale et 3 ans apres la derniere commande.\n\nDroits\nConformement au RGPD, vous disposez d''un droit d''acces, de rectification, de suppression, de portabilite et d''opposition sur vos donnees. Pour exercer ces droits, contactez-nous a contact@viteetgourmand.fr.\n\nCookies\nNotre site utilise des cookies fonctionnels et analytiques. Vous pouvez gerer vos preferences via le bandeau cookies."
  }'::jsonb);

-- Footer: Info section
INSERT INTO public.page_contents (id, page, section, content) VALUES
  (gen_random_uuid(), 'footer', 'info', '{
    "company_name": "Vite & Gourmand",
    "siret": "123 456 789 00012",
    "address": "12 Rue Sainte-Catherine, 33000 Bordeaux"
  }'::jsonb);

-- ============================================================================
-- Seed complete!
-- ============================================================================
