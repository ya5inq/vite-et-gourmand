-- ============================================================
-- Vite & Gourmand — Jeu de données initial (seed)
-- ------------------------------------------------------------
-- À exécuter APRÈS schema.sql.
-- Contenu : 14 allergènes, 7 régimes, 26 plats, 8 menus,
-- 8 zones de livraison, horaires, contenus CMS, comptes de démo
-- et 2 commandes d'exemple.
--
-- Comptes de démonstration :
--   admin  : admin@viteetgourmand.fr  / password123
--   client : client@viteetgourmand.fr / password123
-- ============================================================

--
-- PostgreSQL database dump
--


-- Dumped from database version 16.11 (Debian 16.11-1.pgdg13+1)
-- Dumped by pg_dump version 16.11 (Debian 16.11-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: allergens; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.allergens (id, name, icon, created_at) VALUES ('d61bff84-3ca1-4159-945a-287fa3128515', 'Gluten', 'wheat', '2026-07-08 08:23:00.435246+00');
INSERT INTO public.allergens (id, name, icon, created_at) VALUES ('2f17b32c-f755-4653-b056-7c062b2dcd58', 'Crustaces', 'shrimp', '2026-07-08 08:23:00.447537+00');
INSERT INTO public.allergens (id, name, icon, created_at) VALUES ('0ce09c3c-afbf-461a-b10e-1776164d7da0', 'Oeufs', 'egg', '2026-07-08 08:23:00.454567+00');
INSERT INTO public.allergens (id, name, icon, created_at) VALUES ('b45309e3-c49d-46ce-860a-af0077003222', 'Poisson', 'fish', '2026-07-08 08:23:00.458077+00');
INSERT INTO public.allergens (id, name, icon, created_at) VALUES ('163ccd40-5c55-438b-aba5-8a0db0964e91', 'Arachides', 'peanut', '2026-07-08 08:23:00.463029+00');
INSERT INTO public.allergens (id, name, icon, created_at) VALUES ('09108ffd-90b2-48cd-b110-5261ba8f366c', 'Soja', 'soybean', '2026-07-08 08:23:00.470896+00');
INSERT INTO public.allergens (id, name, icon, created_at) VALUES ('b89f09fa-6cb6-4a07-8d34-49b816f2397b', 'Lait', 'milk', '2026-07-08 08:23:00.476159+00');
INSERT INTO public.allergens (id, name, icon, created_at) VALUES ('cd922f2b-348c-4056-9fe1-0b5167da055d', 'Fruits a coque', 'tree-nut', '2026-07-08 08:23:00.481445+00');
INSERT INTO public.allergens (id, name, icon, created_at) VALUES ('59962536-9a57-4576-aec4-d3824d77f150', 'Celeri', 'celery', '2026-07-08 08:23:00.485644+00');
INSERT INTO public.allergens (id, name, icon, created_at) VALUES ('59af60e2-cfb5-49d5-a7c1-0fd29e81ecf5', 'Moutarde', 'mustard', '2026-07-08 08:23:00.490282+00');
INSERT INTO public.allergens (id, name, icon, created_at) VALUES ('d6f12ba7-5094-438b-a9f2-ebedde5e449c', 'Sesame', 'sesame', '2026-07-08 08:23:00.4933+00');
INSERT INTO public.allergens (id, name, icon, created_at) VALUES ('a9f67227-e61d-4d99-861c-0ce81ed80b57', 'Sulfites', 'sulfite', '2026-07-08 08:23:00.497435+00');
INSERT INTO public.allergens (id, name, icon, created_at) VALUES ('c52ae8e9-aa86-4351-806b-4eb46a8daf9d', 'Lupin', 'lupin', '2026-07-08 08:23:00.50221+00');
INSERT INTO public.allergens (id, name, icon, created_at) VALUES ('f059631d-eca6-4c8d-9c05-94b32aeacb91', 'Mollusques', 'mollusk', '2026-07-08 08:23:00.505768+00');


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: delivery_zones; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.delivery_zones (id, name, postal_code, city, distance_km, is_active, created_at) VALUES ('baaf2df9-6097-45a1-b8d1-c9b7b07c517a', 'Bordeaux Centre', '33000', 'Bordeaux', 0.00, true, '2026-07-08 08:23:00.677002+00');
INSERT INTO public.delivery_zones (id, name, postal_code, city, distance_km, is_active, created_at) VALUES ('f49b105a-8a86-47fc-910a-5cc9f59a1664', 'Bordeaux Rive Droite', '33100', 'Bordeaux', 0.00, true, '2026-07-08 08:23:00.679132+00');
INSERT INTO public.delivery_zones (id, name, postal_code, city, distance_km, is_active, created_at) VALUES ('43a810e2-7e4a-4b97-baa9-6fc82a3ff45a', 'Merignac', '33700', 'Merignac', 8.00, true, '2026-07-08 08:23:00.681183+00');
INSERT INTO public.delivery_zones (id, name, postal_code, city, distance_km, is_active, created_at) VALUES ('dfcdde2c-0a2c-4e15-a777-78d7e057c664', 'Pessac', '33600', 'Pessac', 6.00, true, '2026-07-08 08:23:00.684943+00');
INSERT INTO public.delivery_zones (id, name, postal_code, city, distance_km, is_active, created_at) VALUES ('bc793202-5a70-4d6b-bf77-a994c927e6c3', 'Talence', '33400', 'Talence', 5.00, true, '2026-07-08 08:23:00.68747+00');
INSERT INTO public.delivery_zones (id, name, postal_code, city, distance_km, is_active, created_at) VALUES ('3d540a41-7011-4f23-aa44-0cc46e7cbe5f', 'Begles', '33130', 'Begles', 5.00, true, '2026-07-08 08:23:00.689594+00');
INSERT INTO public.delivery_zones (id, name, postal_code, city, distance_km, is_active, created_at) VALUES ('c116f120-69f0-4aa2-a394-ba6a0bbd6cac', 'Gradignan', '33170', 'Gradignan', 9.00, true, '2026-07-08 08:23:00.691541+00');
INSERT INTO public.delivery_zones (id, name, postal_code, city, distance_km, is_active, created_at) VALUES ('c044cba4-af26-41e5-a7db-abed9b22583a', 'Libourne', '33500', 'Libourne', 30.00, true, '2026-07-08 08:23:00.69359+00');


--
-- Data for Name: dietary_regimes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.dietary_regimes (id, name, description, created_at) VALUES ('0120a1ae-d6df-4d02-97eb-47575ae1e7f2', 'Standard', 'Regime alimentaire classique sans restriction particuliere.', '2026-07-08 08:23:00.510975+00');
INSERT INTO public.dietary_regimes (id, name, description, created_at) VALUES ('e5880c20-c464-428f-a5d6-d2a6409c8aab', 'Vegetarien', 'Regime excluant la viande et le poisson, mais autorisant les produits laitiers et les oeufs.', '2026-07-08 08:23:00.517033+00');
INSERT INTO public.dietary_regimes (id, name, description, created_at) VALUES ('dc040386-fbe8-457b-96dd-8710136dc695', 'Vegan', 'Regime excluant tout produit d''origine animale.', '2026-07-08 08:23:00.52012+00');
INSERT INTO public.dietary_regimes (id, name, description, created_at) VALUES ('f7bce9b8-42b9-48ab-a5fa-32930975fecc', 'Sans gluten', 'Regime excluant toutes les sources de gluten (ble, orge, seigle, etc.).', '2026-07-08 08:23:00.523657+00');
INSERT INTO public.dietary_regimes (id, name, description, created_at) VALUES ('ba6fdc00-9faf-4cb2-acef-476ec4fd5b9b', 'Halal', 'Regime conforme aux prescriptions alimentaires islamiques.', '2026-07-08 08:23:00.529028+00');
INSERT INTO public.dietary_regimes (id, name, description, created_at) VALUES ('0a567089-1b7e-4f9f-a86f-8b3e1a7e59b1', 'Casher', 'Regime conforme aux lois alimentaires juives (kashrout).', '2026-07-08 08:23:00.532248+00');
INSERT INTO public.dietary_regimes (id, name, description, created_at) VALUES ('96d30a43-6659-4cb8-88de-38aa7fd4888f', 'Sans lactose', 'Regime excluant le lactose et les produits laitiers.', '2026-07-08 08:23:00.534883+00');


--
-- Data for Name: dishes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('e9e4629f-a1aa-4286-a5fb-c97c09c770c5', 'Salade de chevre chaud', 'Mesclun de saison, crottin de chevre gratine sur toast, miel et noix, vinaigrette balsamique.', 'entree', 12.50, '/images/dishes/salade-chevre-chaud.jpg', true, '2026-07-08 08:23:00.53893+00', '2026-07-08 08:23:00.53893+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('1455a962-f971-4b83-b1f8-cf1b49c5c981', 'Veloute de champignons', 'Veloute onctueux de champignons de Paris et cepes, creme fraiche et ciboulette.', 'entree', 10.00, '/images/dishes/veloute-champignons.jpg', true, '2026-07-08 08:23:00.545207+00', '2026-07-08 08:23:00.545207+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('cd841965-c1fb-4910-ba99-65f88222b20c', 'Tartare de saumon', 'Tartare de saumon frais Label Rouge, avocat, citron vert, aneth et huile de sesame.', 'entree', 14.50, '/images/dishes/tartare-saumon.jpg', true, '2026-07-08 08:23:00.55155+00', '2026-07-08 08:23:00.55155+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('57e566cd-2ea1-4351-9575-d13390076acf', 'Foie gras maison', 'Foie gras de canard mi-cuit fait maison, chutney de figues et pain d''epices toaste.', 'entree', 22.00, '/images/dishes/foie-gras.jpg', true, '2026-07-08 08:23:00.557263+00', '2026-07-08 08:23:00.557263+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('96cd11c7-a230-49b6-adbf-75b5993f6369', 'Carpaccio de boeuf', 'Fines tranches de boeuf cru, copeaux de parmesan, roquette, huile de truffe et citron.', 'entree', 15.00, '/images/dishes/carpaccio-boeuf.jpg', true, '2026-07-08 08:23:00.561652+00', '2026-07-08 08:23:00.561652+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('0d7f71a7-5f59-4175-bdb9-799dd763611b', 'Bruschetta tomates-mozzarella', 'Pain ciabatta grille, tomates cerises confites, mozzarella di Bufala, basilic frais et huile d''olive.', 'entree', 11.00, '/images/dishes/bruschetta.jpg', true, '2026-07-08 08:23:00.564983+00', '2026-07-08 08:23:00.564983+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('86363de1-1f9a-4cec-ad33-ea216c55158b', 'Soupe a l''oignon gratinee', 'Soupe traditionnelle a l''oignon caramelise, gratinee au fromage Comte, croutons dores.', 'entree', 10.50, '/images/dishes/soupe-oignon.jpg', true, '2026-07-08 08:23:00.569611+00', '2026-07-08 08:23:00.569611+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('300b31c4-4c11-440e-ab0a-f80e2afdfd6f', 'Salade Caesar', 'Laitue romaine croquante, poulet grille, crotons ailles, parmesan, sauce Caesar maison.', 'entree', 13.00, '/images/dishes/salade-caesar.jpg', true, '2026-07-08 08:23:00.572398+00', '2026-07-08 08:23:00.572398+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('867b90b1-588a-498c-87da-9e095ea5068a', 'Filet de boeuf rossini', 'Filet de boeuf francais poele, escalope de foie gras, sauce Perigueux a la truffe noire, pommes fondantes.', 'plat', 25.00, '/images/dishes/filet-boeuf-rossini.jpg', true, '2026-07-08 08:23:00.575545+00', '2026-07-08 08:23:00.575545+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('4cdc3256-b63f-48bb-a382-551dd0345388', 'Supreme de volaille', 'Supreme de volaille fermiere, jus au thym, ecrase de pommes de terre a l''huile d''olive et legumes de saison.', 'plat', 18.00, '/images/dishes/supreme-volaille.jpg', true, '2026-07-08 08:23:00.577914+00', '2026-07-08 08:23:00.577914+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('b69386a9-dc96-4e7c-b66e-bff96d75a20e', 'Dos de cabillaud', 'Dos de cabillaud roti, beurre blanc au citron, risotto crémeux aux petits pois et menthe fraiche.', 'plat', 20.00, '/images/dishes/dos-cabillaud.jpg', true, '2026-07-08 08:23:00.582006+00', '2026-07-08 08:23:00.582006+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('4e5c8548-ff6a-461d-bd29-3e5fc96dbd33', 'Souris d''agneau confite', 'Souris d''agneau confite 7 heures au romarin, puree de patate douce et jus d''agneau reduit.', 'plat', 22.00, '/images/dishes/souris-agneau.jpg', true, '2026-07-08 08:23:00.586421+00', '2026-07-08 08:23:00.586421+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('41c1ce96-da9d-4d49-8ce8-706eb47881e3', 'Risotto aux legumes', 'Risotto cremeux aux legumes de saison, parmesan affine 24 mois, huile de truffe blanche.', 'plat', 16.00, '/images/dishes/risotto-legumes.jpg', true, '2026-07-08 08:23:00.590708+00', '2026-07-08 08:23:00.590708+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('03923ec7-9827-4bea-afa0-9371bf21fac6', 'Magret de canard', 'Magret de canard du Sud-Ouest roti, sauce aux cerises, gratin dauphinois et haricots verts.', 'plat', 21.00, '/images/dishes/magret-canard.jpg', true, '2026-07-08 08:23:00.596108+00', '2026-07-08 08:23:00.596108+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('6316e2f0-5742-476b-986f-23ea596a8a15', 'Pave de thon', 'Pave de thon rouge mi-cuit, croute de sesame, wok de legumes croquants et sauce soja-gingembre.', 'plat', 19.50, '/images/dishes/pave-thon.jpg', true, '2026-07-08 08:23:00.601227+00', '2026-07-08 08:23:00.601227+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('d30ecd0b-2aa9-40bb-933d-8249069a23f9', 'Blanquette de veau', 'Blanquette de veau a l''ancienne, riz pilaf, carottes et champignons, sauce onctueuse a la creme.', 'plat', 18.50, '/images/dishes/blanquette-veau.jpg', true, '2026-07-08 08:23:00.605817+00', '2026-07-08 08:23:00.605817+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('af6ffd47-41be-4573-8973-5749e326afa1', 'Tajine de poulet', 'Tajine de poulet fermier aux olives et citrons confits, semoule fine aux herbes et amandes grillees.', 'plat', 17.00, '/images/dishes/tajine-poulet.jpg', true, '2026-07-08 08:23:00.613116+00', '2026-07-08 08:23:00.613116+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('88d72e27-4eeb-4643-9e0a-0eb0bae5c222', 'Filet mignon en croute', 'Filet mignon de porc en croute feuilletee, duxelles de champignons, sauce madere et legumes glaces.', 'plat', 20.50, '/images/dishes/filet-mignon-croute.jpg', true, '2026-07-08 08:23:00.617107+00', '2026-07-08 08:23:00.617107+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('bedaee30-1ecd-4467-8b79-07ecbd6b9e53', 'Fondant au chocolat', 'Fondant au chocolat noir Valrhona 70%, coeur coulant, creme anglaise vanille Bourbon.', 'dessert', 10.00, '/images/dishes/fondant-chocolat.jpg', true, '2026-07-08 08:23:00.620049+00', '2026-07-08 08:23:00.620049+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('d853edc5-4018-4f8d-93da-9e1c6480d16e', 'Tarte au citron meringuee', 'Tarte au citron de Menton meringuee, pate sablee croustillante, meringue italienne flambee.', 'dessert', 9.50, '/images/dishes/tarte-citron.jpg', true, '2026-07-08 08:23:00.623353+00', '2026-07-08 08:23:00.623353+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('b3dd5dc0-b42a-4fe0-ac0d-f1da1b8f8358', 'Tiramisu', 'Tiramisu traditionnel au mascarpone, biscuits imbibbes de cafe espresso, cacao amer.', 'dessert', 9.00, '/images/dishes/tiramisu.jpg', true, '2026-07-08 08:23:00.62637+00', '2026-07-08 08:23:00.62637+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('fb96714c-48a5-436d-87b8-d6f54c975f4f', 'Panna cotta aux fruits rouges', 'Panna cotta a la vanille de Madagascar, coulis de fruits rouges frais de saison.', 'dessert', 8.50, '/images/dishes/panna-cotta.jpg', true, '2026-07-08 08:23:00.628708+00', '2026-07-08 08:23:00.628708+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('92c51904-43ef-4a8a-b095-56ca9035a601', 'Assiette de fromages affines', 'Selection de 5 fromages affines de la region : Ossau-Iraty, Rocamadour, Bleu d''Auvergne, Comte 18 mois et Saint-Nectaire.', 'dessert', 13.00, '/images/dishes/fromages.jpg', true, '2026-07-08 08:23:00.631633+00', '2026-07-08 08:23:00.631633+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('36506418-b90a-4322-a2fc-f066e412153b', 'Creme brulee', 'Creme brulee a la vanille de Tahiti, caramelisee au chalumeau, tuile aux amandes.', 'dessert', 9.00, '/images/dishes/creme-brulee.jpg', true, '2026-07-08 08:23:00.634422+00', '2026-07-08 08:23:00.634422+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('b04c9f0f-693d-43fb-b7e2-90e946f633b8', 'Paris-Brest', 'Paris-Brest croustillant, creme mousseline pralinee aux noisettes du Piemont, eclats de pralin.', 'dessert', 11.00, '/images/dishes/paris-brest.jpg', true, '2026-07-08 08:23:00.637184+00', '2026-07-08 08:23:00.637184+00');
INSERT INTO public.dishes (id, name, description, category, price, image_url, is_available, created_at, updated_at) VALUES ('15eec81a-905a-445f-86c4-0333b1138c34', 'Mousse au chocolat', 'Mousse aerienne au chocolat noir grand cru, chantilly legere et copeaux de chocolat.', 'dessert', 8.00, '/images/dishes/mousse-chocolat.jpg', true, '2026-07-08 08:23:00.63965+00', '2026-07-08 08:23:00.63965+00');


--
-- Data for Name: dish_allergens; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('e9e4629f-a1aa-4286-a5fb-c97c09c770c5', 'd61bff84-3ca1-4159-945a-287fa3128515');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('e9e4629f-a1aa-4286-a5fb-c97c09c770c5', 'b89f09fa-6cb6-4a07-8d34-49b816f2397b');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('e9e4629f-a1aa-4286-a5fb-c97c09c770c5', 'cd922f2b-348c-4056-9fe1-0b5167da055d');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('1455a962-f971-4b83-b1f8-cf1b49c5c981', 'b89f09fa-6cb6-4a07-8d34-49b816f2397b');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('1455a962-f971-4b83-b1f8-cf1b49c5c981', '59962536-9a57-4576-aec4-d3824d77f150');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('cd841965-c1fb-4910-ba99-65f88222b20c', 'b45309e3-c49d-46ce-860a-af0077003222');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('cd841965-c1fb-4910-ba99-65f88222b20c', 'd6f12ba7-5094-438b-a9f2-ebedde5e449c');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('57e566cd-2ea1-4351-9575-d13390076acf', '0ce09c3c-afbf-461a-b10e-1776164d7da0');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('57e566cd-2ea1-4351-9575-d13390076acf', 'a9f67227-e61d-4d99-861c-0ce81ed80b57');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('57e566cd-2ea1-4351-9575-d13390076acf', 'd61bff84-3ca1-4159-945a-287fa3128515');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('96cd11c7-a230-49b6-adbf-75b5993f6369', 'b89f09fa-6cb6-4a07-8d34-49b816f2397b');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('96cd11c7-a230-49b6-adbf-75b5993f6369', '59af60e2-cfb5-49d5-a7c1-0fd29e81ecf5');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('0d7f71a7-5f59-4175-bdb9-799dd763611b', 'd61bff84-3ca1-4159-945a-287fa3128515');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('0d7f71a7-5f59-4175-bdb9-799dd763611b', 'b89f09fa-6cb6-4a07-8d34-49b816f2397b');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('86363de1-1f9a-4cec-ad33-ea216c55158b', 'd61bff84-3ca1-4159-945a-287fa3128515');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('86363de1-1f9a-4cec-ad33-ea216c55158b', 'b89f09fa-6cb6-4a07-8d34-49b816f2397b');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('300b31c4-4c11-440e-ab0a-f80e2afdfd6f', 'd61bff84-3ca1-4159-945a-287fa3128515');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('300b31c4-4c11-440e-ab0a-f80e2afdfd6f', 'b89f09fa-6cb6-4a07-8d34-49b816f2397b');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('300b31c4-4c11-440e-ab0a-f80e2afdfd6f', '0ce09c3c-afbf-461a-b10e-1776164d7da0');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('300b31c4-4c11-440e-ab0a-f80e2afdfd6f', 'b45309e3-c49d-46ce-860a-af0077003222');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('867b90b1-588a-498c-87da-9e095ea5068a', '0ce09c3c-afbf-461a-b10e-1776164d7da0');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('867b90b1-588a-498c-87da-9e095ea5068a', 'a9f67227-e61d-4d99-861c-0ce81ed80b57');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('867b90b1-588a-498c-87da-9e095ea5068a', 'd61bff84-3ca1-4159-945a-287fa3128515');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('4cdc3256-b63f-48bb-a382-551dd0345388', 'b89f09fa-6cb6-4a07-8d34-49b816f2397b');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('4cdc3256-b63f-48bb-a382-551dd0345388', '59962536-9a57-4576-aec4-d3824d77f150');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('b69386a9-dc96-4e7c-b66e-bff96d75a20e', 'b45309e3-c49d-46ce-860a-af0077003222');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('b69386a9-dc96-4e7c-b66e-bff96d75a20e', 'b89f09fa-6cb6-4a07-8d34-49b816f2397b');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('b69386a9-dc96-4e7c-b66e-bff96d75a20e', 'd61bff84-3ca1-4159-945a-287fa3128515');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('4e5c8548-ff6a-461d-bd29-3e5fc96dbd33', '59962536-9a57-4576-aec4-d3824d77f150');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('4e5c8548-ff6a-461d-bd29-3e5fc96dbd33', 'a9f67227-e61d-4d99-861c-0ce81ed80b57');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('41c1ce96-da9d-4d49-8ce8-706eb47881e3', 'b89f09fa-6cb6-4a07-8d34-49b816f2397b');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('41c1ce96-da9d-4d49-8ce8-706eb47881e3', '59962536-9a57-4576-aec4-d3824d77f150');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('03923ec7-9827-4bea-afa0-9371bf21fac6', 'a9f67227-e61d-4d99-861c-0ce81ed80b57');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('03923ec7-9827-4bea-afa0-9371bf21fac6', 'b89f09fa-6cb6-4a07-8d34-49b816f2397b');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('6316e2f0-5742-476b-986f-23ea596a8a15', 'b45309e3-c49d-46ce-860a-af0077003222');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('6316e2f0-5742-476b-986f-23ea596a8a15', 'd6f12ba7-5094-438b-a9f2-ebedde5e449c');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('6316e2f0-5742-476b-986f-23ea596a8a15', '09108ffd-90b2-48cd-b110-5261ba8f366c');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('d30ecd0b-2aa9-40bb-933d-8249069a23f9', 'b89f09fa-6cb6-4a07-8d34-49b816f2397b');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('d30ecd0b-2aa9-40bb-933d-8249069a23f9', '0ce09c3c-afbf-461a-b10e-1776164d7da0');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('d30ecd0b-2aa9-40bb-933d-8249069a23f9', 'd61bff84-3ca1-4159-945a-287fa3128515');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('d30ecd0b-2aa9-40bb-933d-8249069a23f9', '59962536-9a57-4576-aec4-d3824d77f150');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('af6ffd47-41be-4573-8973-5749e326afa1', 'cd922f2b-348c-4056-9fe1-0b5167da055d');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('af6ffd47-41be-4573-8973-5749e326afa1', 'a9f67227-e61d-4d99-861c-0ce81ed80b57');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('88d72e27-4eeb-4643-9e0a-0eb0bae5c222', 'd61bff84-3ca1-4159-945a-287fa3128515');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('88d72e27-4eeb-4643-9e0a-0eb0bae5c222', '0ce09c3c-afbf-461a-b10e-1776164d7da0');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('88d72e27-4eeb-4643-9e0a-0eb0bae5c222', 'b89f09fa-6cb6-4a07-8d34-49b816f2397b');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('bedaee30-1ecd-4467-8b79-07ecbd6b9e53', 'd61bff84-3ca1-4159-945a-287fa3128515');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('bedaee30-1ecd-4467-8b79-07ecbd6b9e53', '0ce09c3c-afbf-461a-b10e-1776164d7da0');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('bedaee30-1ecd-4467-8b79-07ecbd6b9e53', 'b89f09fa-6cb6-4a07-8d34-49b816f2397b');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('d853edc5-4018-4f8d-93da-9e1c6480d16e', 'd61bff84-3ca1-4159-945a-287fa3128515');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('d853edc5-4018-4f8d-93da-9e1c6480d16e', '0ce09c3c-afbf-461a-b10e-1776164d7da0');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('d853edc5-4018-4f8d-93da-9e1c6480d16e', 'b89f09fa-6cb6-4a07-8d34-49b816f2397b');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('b3dd5dc0-b42a-4fe0-ac0d-f1da1b8f8358', '0ce09c3c-afbf-461a-b10e-1776164d7da0');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('b3dd5dc0-b42a-4fe0-ac0d-f1da1b8f8358', 'b89f09fa-6cb6-4a07-8d34-49b816f2397b');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('b3dd5dc0-b42a-4fe0-ac0d-f1da1b8f8358', 'd61bff84-3ca1-4159-945a-287fa3128515');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('fb96714c-48a5-436d-87b8-d6f54c975f4f', 'b89f09fa-6cb6-4a07-8d34-49b816f2397b');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('92c51904-43ef-4a8a-b095-56ca9035a601', 'b89f09fa-6cb6-4a07-8d34-49b816f2397b');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('36506418-b90a-4322-a2fc-f066e412153b', '0ce09c3c-afbf-461a-b10e-1776164d7da0');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('36506418-b90a-4322-a2fc-f066e412153b', 'b89f09fa-6cb6-4a07-8d34-49b816f2397b');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('36506418-b90a-4322-a2fc-f066e412153b', 'cd922f2b-348c-4056-9fe1-0b5167da055d');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('b04c9f0f-693d-43fb-b7e2-90e946f633b8', 'd61bff84-3ca1-4159-945a-287fa3128515');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('b04c9f0f-693d-43fb-b7e2-90e946f633b8', '0ce09c3c-afbf-461a-b10e-1776164d7da0');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('b04c9f0f-693d-43fb-b7e2-90e946f633b8', 'b89f09fa-6cb6-4a07-8d34-49b816f2397b');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('b04c9f0f-693d-43fb-b7e2-90e946f633b8', 'cd922f2b-348c-4056-9fe1-0b5167da055d');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('15eec81a-905a-445f-86c4-0333b1138c34', '0ce09c3c-afbf-461a-b10e-1776164d7da0');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('15eec81a-905a-445f-86c4-0333b1138c34', 'b89f09fa-6cb6-4a07-8d34-49b816f2397b');
INSERT INTO public.dish_allergens (dish_id, allergen_id) VALUES ('15eec81a-905a-445f-86c4-0333b1138c34', '09108ffd-90b2-48cd-b110-5261ba8f366c');


--
-- Data for Name: menus; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.menus (id, name, description, theme, price, min_persons, max_persons, stock, conditions, image_url, is_available, created_at, updated_at) VALUES ('93c569d6-436b-418a-a54c-79156c6ae4d8', 'Menu Prestige', 'Notre menu d''exception pour des evenements inoubliables. Une selection raffinee de mets gastronomiques prepares avec les meilleurs produits du terroir. Foie gras maison, filet de boeuf Rossini et desserts d''excellence pour sublimer vos receptions les plus prestigieuses.', 'Gastronomique', 85.00, 15, 100, NULL, 'Commande 7 jours a l''avance minimum. Supplement de 10 EUR par personne pour le service en salle. Vaisselle et nappage inclus. Degressif a partir de 50 convives.', '/images/menus/prestige.jpg', true, '2026-07-08 08:23:00.645772+00', '2026-07-08 08:23:00.645772+00');
INSERT INTO public.menus (id, name, description, theme, price, min_persons, max_persons, stock, conditions, image_url, is_available, created_at, updated_at) VALUES ('9a4dc881-c8c2-4668-bd7d-7c2b6e7da2e1', 'Menu Tradition', 'Un voyage au coeur des saveurs traditionnelles francaises. Des recettes authentiques revisitees avec soin par notre chef, pour retrouver le gout des bons plats d''autrefois. Ideal pour les repas de famille et les celebrations conviviales.', 'Terroir', 65.00, 10, 80, NULL, 'Commande 5 jours a l''avance minimum. Possibilite d''adapter les plats selon vos preferences. Service en buffet ou a l''assiette.', '/images/menus/tradition.jpg', true, '2026-07-08 08:23:00.650909+00', '2026-07-08 08:23:00.650909+00');
INSERT INTO public.menus (id, name, description, theme, price, min_persons, max_persons, stock, conditions, image_url, is_available, created_at, updated_at) VALUES ('abae418e-d1cf-41f5-8a7c-186bad0fc7bb', 'Menu Mediterranee', 'Les saveurs ensoleillees de la Mediterranee s''invitent a votre table. Des produits frais, des herbes aromatiques et des preparations legeres qui evoquent la douceur du sud. Parfait pour les evenements estivaux et les repas en plein air.', 'Mediterraneen', 55.00, 10, 60, NULL, 'Commande 4 jours a l''avance minimum. Menu ideal pour les evenements en exterieur. Options sans gluten disponibles sur demande.', '/images/menus/mediterranee.jpg', true, '2026-07-08 08:23:00.655303+00', '2026-07-08 08:23:00.655303+00');
INSERT INTO public.menus (id, name, description, theme, price, min_persons, max_persons, stock, conditions, image_url, is_available, created_at, updated_at) VALUES ('974a58a5-9999-45f3-bfb4-814d2590ffc1', 'Menu Vegetarien Gourmet', 'Une cuisine vegetarienne creative et gourmande qui met a l''honneur les legumes de saison et les cereales nobles. Prouvez que la gastronomie vegetarienne peut etre aussi raffinee qu''inventive. Chaque plat est une celebration du vegetal.', 'Vegetarien', 50.00, 8, 50, NULL, 'Commande 4 jours a l''avance minimum. Adaptation vegan possible sur demande. Tous les produits sont issus de l''agriculture biologique ou raisonnee.', '/images/menus/vegetarien.jpg', true, '2026-07-08 08:23:00.65869+00', '2026-07-08 08:23:00.65869+00');
INSERT INTO public.menus (id, name, description, theme, price, min_persons, max_persons, stock, conditions, image_url, is_available, created_at, updated_at) VALUES ('05cc4fc6-89d2-4bdb-bf62-da873b7d57e6', 'Menu Ocean', 'Une ode aux tresors de la mer. Poissons frais, crustaces et coquillages sublimes par notre chef pour un festin marin d''exception. Les produits sont selectionnes chaque matin aupres de nos pecheurs partenaires de la cote atlantique.', 'Fruits de mer', 70.00, 10, 60, NULL, 'Commande 5 jours a l''avance minimum. Arrivage frais quotidien, le menu peut varier selon la peche du jour. Supplement plateau de fruits de mer : 20 EUR/personne.', '/images/menus/ocean.jpg', true, '2026-07-08 08:23:00.662583+00', '2026-07-08 08:23:00.662583+00');
INSERT INTO public.menus (id, name, description, theme, price, min_persons, max_persons, stock, conditions, image_url, is_available, created_at, updated_at) VALUES ('aa2ae884-c6a8-4f47-92c5-4b154b40ba3f', 'Menu Brunch', 'Un brunch genereux et convivial, melant preparations sucrees et salees. Viennoiseries fraiches, oeufs prepares a votre gout, charcuterie fine et patisseries maison. L''art du brunch a la francaise pour vos matinees gourmandes.', 'Brunch', 35.00, 20, 100, NULL, 'Commande 3 jours a l''avance minimum. Service de 10h a 14h. Boissons chaudes incluses (cafe, the, chocolat). Jus de fruits frais en supplement.', '/images/menus/brunch.jpg', true, '2026-07-08 08:23:00.666321+00', '2026-07-08 08:23:00.666321+00');
INSERT INTO public.menus (id, name, description, theme, price, min_persons, max_persons, stock, conditions, image_url, is_available, created_at, updated_at) VALUES ('e72115ea-b7dd-42a4-bcf2-622f1b9e8d6f', 'Menu Cocktail', 'Des bouchees raffinées et des pieces cocktail elegantes pour animer vos receptions debout. Un assortiment savant de saveurs sucrees et salees, ideal pour les vernissages, lancements et soirees networking.', 'Cocktail', 45.00, 20, 150, NULL, 'Commande 4 jours a l''avance minimum. 10 pieces par personne incluses. Service de 2 heures inclus. Supplement pour pieces supplementaires ou service prolonge.', '/images/menus/cocktail.jpg', true, '2026-07-08 08:23:00.670127+00', '2026-07-08 08:23:00.670127+00');
INSERT INTO public.menus (id, name, description, theme, price, min_persons, max_persons, stock, conditions, image_url, is_available, created_at, updated_at) VALUES ('af269e0b-f268-4438-95c1-fa01f4555530', 'Menu Entreprise', 'La solution ideale pour vos dejeuners d''affaires, seminaires et evenements corporate. Un menu equilibre et savoureux qui allie efficacite et qualite gastronomique. Presentation soignee pour une image professionnelle impeccable.', 'Business', 55.00, 10, 200, NULL, 'Commande 3 jours a l''avance minimum. Facturation entreprise possible. Options dietetiques et allergenes prises en compte. Livraison a l''heure garantie.', '/images/menus/entreprise.jpg', true, '2026-07-08 08:23:00.67359+00', '2026-07-08 08:23:00.67359+00');


--
-- Data for Name: menu_dietary_regimes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES ('93c569d6-436b-418a-a54c-79156c6ae4d8', '0120a1ae-d6df-4d02-97eb-47575ae1e7f2');
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES ('9a4dc881-c8c2-4668-bd7d-7c2b6e7da2e1', '0120a1ae-d6df-4d02-97eb-47575ae1e7f2');
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES ('9a4dc881-c8c2-4668-bd7d-7c2b6e7da2e1', 'ba6fdc00-9faf-4cb2-acef-476ec4fd5b9b');
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES ('abae418e-d1cf-41f5-8a7c-186bad0fc7bb', '0120a1ae-d6df-4d02-97eb-47575ae1e7f2');
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES ('abae418e-d1cf-41f5-8a7c-186bad0fc7bb', '96d30a43-6659-4cb8-88de-38aa7fd4888f');
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES ('974a58a5-9999-45f3-bfb4-814d2590ffc1', '0120a1ae-d6df-4d02-97eb-47575ae1e7f2');
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES ('974a58a5-9999-45f3-bfb4-814d2590ffc1', 'e5880c20-c464-428f-a5d6-d2a6409c8aab');
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES ('974a58a5-9999-45f3-bfb4-814d2590ffc1', 'f7bce9b8-42b9-48ab-a5fa-32930975fecc');
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES ('05cc4fc6-89d2-4bdb-bf62-da873b7d57e6', '0120a1ae-d6df-4d02-97eb-47575ae1e7f2');
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES ('05cc4fc6-89d2-4bdb-bf62-da873b7d57e6', 'f7bce9b8-42b9-48ab-a5fa-32930975fecc');
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES ('05cc4fc6-89d2-4bdb-bf62-da873b7d57e6', '96d30a43-6659-4cb8-88de-38aa7fd4888f');
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES ('aa2ae884-c6a8-4f47-92c5-4b154b40ba3f', '0120a1ae-d6df-4d02-97eb-47575ae1e7f2');
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES ('aa2ae884-c6a8-4f47-92c5-4b154b40ba3f', 'e5880c20-c464-428f-a5d6-d2a6409c8aab');
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES ('aa2ae884-c6a8-4f47-92c5-4b154b40ba3f', 'ba6fdc00-9faf-4cb2-acef-476ec4fd5b9b');
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES ('e72115ea-b7dd-42a4-bcf2-622f1b9e8d6f', '0120a1ae-d6df-4d02-97eb-47575ae1e7f2');
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES ('e72115ea-b7dd-42a4-bcf2-622f1b9e8d6f', 'e5880c20-c464-428f-a5d6-d2a6409c8aab');
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES ('e72115ea-b7dd-42a4-bcf2-622f1b9e8d6f', '96d30a43-6659-4cb8-88de-38aa7fd4888f');
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES ('af269e0b-f268-4438-95c1-fa01f4555530', '0120a1ae-d6df-4d02-97eb-47575ae1e7f2');
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES ('af269e0b-f268-4438-95c1-fa01f4555530', 'ba6fdc00-9faf-4cb2-acef-476ec4fd5b9b');
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES ('af269e0b-f268-4438-95c1-fa01f4555530', 'f7bce9b8-42b9-48ab-a5fa-32930975fecc');
INSERT INTO public.menu_dietary_regimes (menu_id, dietary_regime_id) VALUES ('af269e0b-f268-4438-95c1-fa01f4555530', 'e5880c20-c464-428f-a5d6-d2a6409c8aab');


--
-- Data for Name: menu_dishes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('93c569d6-436b-418a-a54c-79156c6ae4d8', '57e566cd-2ea1-4351-9575-d13390076acf');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('93c569d6-436b-418a-a54c-79156c6ae4d8', '867b90b1-588a-498c-87da-9e095ea5068a');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('93c569d6-436b-418a-a54c-79156c6ae4d8', '03923ec7-9827-4bea-afa0-9371bf21fac6');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('93c569d6-436b-418a-a54c-79156c6ae4d8', '36506418-b90a-4322-a2fc-f066e412153b');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('93c569d6-436b-418a-a54c-79156c6ae4d8', 'b04c9f0f-693d-43fb-b7e2-90e946f633b8');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('9a4dc881-c8c2-4668-bd7d-7c2b6e7da2e1', '86363de1-1f9a-4cec-ad33-ea216c55158b');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('9a4dc881-c8c2-4668-bd7d-7c2b6e7da2e1', 'd30ecd0b-2aa9-40bb-933d-8249069a23f9');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('9a4dc881-c8c2-4668-bd7d-7c2b6e7da2e1', '4e5c8548-ff6a-461d-bd29-3e5fc96dbd33');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('9a4dc881-c8c2-4668-bd7d-7c2b6e7da2e1', 'bedaee30-1ecd-4467-8b79-07ecbd6b9e53');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('abae418e-d1cf-41f5-8a7c-186bad0fc7bb', '0d7f71a7-5f59-4175-bdb9-799dd763611b');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('abae418e-d1cf-41f5-8a7c-186bad0fc7bb', '96cd11c7-a230-49b6-adbf-75b5993f6369');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('abae418e-d1cf-41f5-8a7c-186bad0fc7bb', '6316e2f0-5742-476b-986f-23ea596a8a15');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('abae418e-d1cf-41f5-8a7c-186bad0fc7bb', 'b3dd5dc0-b42a-4fe0-ac0d-f1da1b8f8358');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('974a58a5-9999-45f3-bfb4-814d2590ffc1', '1455a962-f971-4b83-b1f8-cf1b49c5c981');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('974a58a5-9999-45f3-bfb4-814d2590ffc1', '41c1ce96-da9d-4d49-8ce8-706eb47881e3');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('974a58a5-9999-45f3-bfb4-814d2590ffc1', 'e9e4629f-a1aa-4286-a5fb-c97c09c770c5');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('974a58a5-9999-45f3-bfb4-814d2590ffc1', 'fb96714c-48a5-436d-87b8-d6f54c975f4f');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('05cc4fc6-89d2-4bdb-bf62-da873b7d57e6', 'cd841965-c1fb-4910-ba99-65f88222b20c');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('05cc4fc6-89d2-4bdb-bf62-da873b7d57e6', 'b69386a9-dc96-4e7c-b66e-bff96d75a20e');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('05cc4fc6-89d2-4bdb-bf62-da873b7d57e6', '6316e2f0-5742-476b-986f-23ea596a8a15');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('05cc4fc6-89d2-4bdb-bf62-da873b7d57e6', 'd853edc5-4018-4f8d-93da-9e1c6480d16e');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('aa2ae884-c6a8-4f47-92c5-4b154b40ba3f', '300b31c4-4c11-440e-ab0a-f80e2afdfd6f');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('aa2ae884-c6a8-4f47-92c5-4b154b40ba3f', '4cdc3256-b63f-48bb-a382-551dd0345388');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('aa2ae884-c6a8-4f47-92c5-4b154b40ba3f', 'bedaee30-1ecd-4467-8b79-07ecbd6b9e53');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('aa2ae884-c6a8-4f47-92c5-4b154b40ba3f', '15eec81a-905a-445f-86c4-0333b1138c34');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('e72115ea-b7dd-42a4-bcf2-622f1b9e8d6f', '0d7f71a7-5f59-4175-bdb9-799dd763611b');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('e72115ea-b7dd-42a4-bcf2-622f1b9e8d6f', 'cd841965-c1fb-4910-ba99-65f88222b20c');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('e72115ea-b7dd-42a4-bcf2-622f1b9e8d6f', '57e566cd-2ea1-4351-9575-d13390076acf');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('e72115ea-b7dd-42a4-bcf2-622f1b9e8d6f', 'e9e4629f-a1aa-4286-a5fb-c97c09c770c5');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('e72115ea-b7dd-42a4-bcf2-622f1b9e8d6f', '36506418-b90a-4322-a2fc-f066e412153b');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('af269e0b-f268-4438-95c1-fa01f4555530', '300b31c4-4c11-440e-ab0a-f80e2afdfd6f');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('af269e0b-f268-4438-95c1-fa01f4555530', '88d72e27-4eeb-4643-9e0a-0eb0bae5c222');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('af269e0b-f268-4438-95c1-fa01f4555530', 'af6ffd47-41be-4573-8973-5749e326afa1');
INSERT INTO public.menu_dishes (menu_id, dish_id) VALUES ('af269e0b-f268-4438-95c1-fa01f4555530', 'd853edc5-4018-4f8d-93da-9e1c6480d16e');


--
-- Data for Name: operating_hours; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.operating_hours (id, day_of_week, open_time, close_time, is_closed) VALUES ('41ad7f67-c779-42ab-b7b2-0ce7af7ef0ce', 0, NULL, NULL, true);
INSERT INTO public.operating_hours (id, day_of_week, open_time, close_time, is_closed) VALUES ('1245b434-7499-4943-87b6-bcfc3e51c8e2', 1, '09:00:00', '18:00:00', false);
INSERT INTO public.operating_hours (id, day_of_week, open_time, close_time, is_closed) VALUES ('53759680-874c-46bf-8ff7-1c2bcbb6ba8c', 2, '09:00:00', '18:00:00', false);
INSERT INTO public.operating_hours (id, day_of_week, open_time, close_time, is_closed) VALUES ('2fb43a80-0e2a-4fee-af42-3f1987c21729', 3, '09:00:00', '18:00:00', false);
INSERT INTO public.operating_hours (id, day_of_week, open_time, close_time, is_closed) VALUES ('fd4b5be5-fe7d-4022-8c82-876e3066861f', 4, '09:00:00', '18:00:00', false);
INSERT INTO public.operating_hours (id, day_of_week, open_time, close_time, is_closed) VALUES ('26023f7c-6963-43a0-94d0-a65732fbe2b8', 5, '09:00:00', '18:00:00', false);
INSERT INTO public.operating_hours (id, day_of_week, open_time, close_time, is_closed) VALUES ('d7b9b448-12b5-4441-a622-8123d4ecdd7a', 6, '10:00:00', '17:00:00', false);


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."user" (id, email, password, role, admin, first_name, last_name, phone, address, city, postal_code, is_active, email_verified, last_login_at, preferred_language, created_at, updated_at) VALUES ('1578103c-145c-47a0-98bd-eb4b3fa10c81', 'admin@viteetgourmand.fr', '$2b$10$fbU9MzS6haV5dEKazadiBexqS4pBSX8oh2HZ86cnQ1KKwobQE28iC', 'ADMIN', true, 'Admin', 'Vite & Gourmand', NULL, NULL, NULL, NULL, true, true, NULL, 'fr', '2026-07-08 08:23:00.810978+00', '2026-07-08 08:23:00.810978+00');
INSERT INTO public."user" (id, email, password, role, admin, first_name, last_name, phone, address, city, postal_code, is_active, email_verified, last_login_at, preferred_language, created_at, updated_at) VALUES ('b043bc93-27c0-468f-a300-b7a9385d6b0a', 'client@viteetgourmand.fr', '$2b$10$NU8LGLkD8ayVjHm37L0R1.5qF5W26GiCGeYeucB45t/h1uCzdToda', 'USER', false, 'Camille', 'Client', '0600000000', '10 rue des Gourmets', 'Bordeaux', '33000', true, true, NULL, 'fr', '2026-07-08 08:23:00.944552+00', '2026-07-08 08:23:00.944552+00');


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.orders (id, user_id, status, guest_email, guest_name, guest_phone, delivery_address, delivery_city, delivery_postal_code, delivery_zone_id, delivery_date, delivery_fee, total_price, notes, rejection_reason, rejected_by, rejected_at, material_return_deadline, created_at, updated_at, material_penalty_applied, penalty_amount) VALUES ('8e155962-db2d-49c2-8153-671ab5bcabb2', 'b043bc93-27c0-468f-a300-b7a9385d6b0a', 'PENDING', NULL, NULL, NULL, '10 rue des Gourmets', 'Bordeaux', '33000', 'baaf2df9-6097-45a1-b8d1-c9b7b07c517a', NULL, 0.00, 1275.00, 'Commande de démonstration', NULL, NULL, NULL, NULL, '2026-07-08 08:23:01.028333+00', '2026-07-08 08:23:01.028333+00', false, NULL);
INSERT INTO public.orders (id, user_id, status, guest_email, guest_name, guest_phone, delivery_address, delivery_city, delivery_postal_code, delivery_zone_id, delivery_date, delivery_fee, total_price, notes, rejection_reason, rejected_by, rejected_at, material_return_deadline, created_at, updated_at, material_penalty_applied, penalty_amount) VALUES ('cf875713-3d1d-4513-8dde-e5aaf3a11211', 'b043bc93-27c0-468f-a300-b7a9385d6b0a', 'PENDING', NULL, NULL, NULL, '10 rue des Gourmets', 'Bordeaux', '33000', 'baaf2df9-6097-45a1-b8d1-c9b7b07c517a', NULL, 0.00, 650.00, 'Commande de démonstration', NULL, NULL, NULL, NULL, '2026-07-08 08:23:01.107147+00', '2026-07-08 08:23:01.107147+00', false, NULL);


--
-- Data for Name: order_history; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.order_history (id, order_id, old_status, new_status, changed_by, reason, contact_mode, created_at) VALUES ('eb3e9dae-4026-4972-9ddc-5986e26e9d9e', '8e155962-db2d-49c2-8153-671ab5bcabb2', NULL, 'PENDING', 'b043bc93-27c0-468f-a300-b7a9385d6b0a', NULL, NULL, '2026-07-08 08:23:01.05277+00');
INSERT INTO public.order_history (id, order_id, old_status, new_status, changed_by, reason, contact_mode, created_at) VALUES ('087aaefb-0d0b-4b47-a26c-beac49931de1', 'cf875713-3d1d-4513-8dde-e5aaf3a11211', NULL, 'PENDING', 'b043bc93-27c0-468f-a300-b7a9385d6b0a', NULL, NULL, '2026-07-08 08:23:01.119005+00');


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.order_items (id, order_id, menu_id, quantity, unit_price, line_total, discount_applied, created_at) VALUES ('0731246e-53bd-4c1b-881a-561e53e91460', '8e155962-db2d-49c2-8153-671ab5bcabb2', '93c569d6-436b-418a-a54c-79156c6ae4d8', 15, 85.00, 1275.00, false, '2026-07-08 08:23:01.037495+00');
INSERT INTO public.order_items (id, order_id, menu_id, quantity, unit_price, line_total, discount_applied, created_at) VALUES ('c54a35c8-552b-4a07-8698-acdb99c599bd', 'cf875713-3d1d-4513-8dde-e5aaf3a11211', '9a4dc881-c8c2-4668-bd7d-7c2b6e7da2e1', 10, 65.00, 650.00, false, '2026-07-08 08:23:01.113518+00');


--
-- Data for Name: page_contents; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.page_contents (id, page, section, content, updated_at, updated_by) VALUES ('1b852da9-b062-4bc0-9195-cdcf34896f01', 'home', 'hero', '{"image": "/images/hero-bg.jpg", "title": "Vite & Gourmand", "cta_link": "/menus", "cta_text": "Decouvrir nos menus", "subtitle": "Traiteur d''exception a Bordeaux", "description": "Des menus raffines pour vos evenements professionnels et prives. Notre equipe de chefs passionnes met son savoir-faire au service de vos receptions pour creer des moments gustatifs inoubliables."}', '2026-07-08 08:23:01.164426+00', NULL);
INSERT INTO public.page_contents (id, page, section, content, updated_at, updated_by) VALUES ('5c61bfaa-90b0-4e91-835c-8a0a611a175d', 'home', 'features', '{"items": [{"icon": "award", "title": "Qualite premium", "description": "Des ingredients soigneusement selectionnes aupres de producteurs locaux et des preparations realisees par des chefs experimentes."}, {"icon": "leaf", "title": "Produits frais", "description": "Tous nos plats sont prepares le jour meme avec des produits frais de saison, pour garantir une fraicheur et des saveurs optimales."}, {"icon": "truck", "title": "Livraison soignee", "description": "Une livraison ponctuelle et soignee dans toute la metropole bordelaise, avec un conditionnement adapte pour preserver la qualite."}, {"icon": "settings", "title": "Sur mesure", "description": "Chaque evenement est unique. Nous adaptons nos menus a vos besoins, preferences alimentaires et contraintes specifiques."}]}', '2026-07-08 08:23:01.170953+00', NULL);
INSERT INTO public.page_contents (id, page, section, content, updated_at, updated_by) VALUES ('fd7b5c40-f1a3-4a2a-9db0-ae7d4178bb25', 'home', 'values', '{"items": [{"icon": "map-pin", "title": "Circuit court", "description": "Nous privilegions les producteurs locaux et les circuits courts pour soutenir l''economie regionale et reduire notre empreinte carbone."}, {"icon": "chef-hat", "title": "Excellence culinaire", "description": "Notre equipe de chefs diplomes met tout son savoir-faire au service de la gastronomie francaise pour sublimer chaque plat."}, {"icon": "heart", "title": "Satisfaction client", "description": "Votre satisfaction est notre priorite. Nous vous accompagnons de la commande a la degustation pour un service irreprochable."}, {"icon": "recycle", "title": "Eco-responsabilite", "description": "Emballages recyclables, lutte contre le gaspillage alimentaire et gestion responsable des dechets : nous nous engageons pour la planete."}]}', '2026-07-08 08:23:01.17557+00', NULL);
INSERT INTO public.page_contents (id, page, section, content, updated_at, updated_by) VALUES ('e013ba52-7da7-4253-a044-c82d4d461d2e', 'home', 'testimonials', '{"title": "Ce que disent nos clients", "display_count": 3}', '2026-07-08 08:23:01.180275+00', NULL);
INSERT INTO public.page_contents (id, page, section, content, updated_at, updated_by) VALUES ('79ce564d-2a36-47da-8c7f-a317b6fbfd55', 'menus', 'hero', '{"title": "Nos Menus", "description": "Decouvrez notre selection de menus soigneusement composes pour ravir les palais de vos convives. Du brunch decontracte au diner gastronomique, trouvez la formule ideale pour votre evenement."}', '2026-07-08 08:23:01.183939+00', NULL);
INSERT INTO public.page_contents (id, page, section, content, updated_at, updated_by) VALUES ('024a43a9-54c6-4d11-b738-d2c6b4f4ce46', 'contact', 'content', '{"email": "contact@viteetgourmand.fr", "phone": "05 56 00 00 00", "title": "Contactez-nous", "address": "12 Rue Sainte-Catherine, 33000 Bordeaux", "description": "Une question ? Un devis personnalise ? Notre equipe est a votre ecoute pour vous accompagner dans l''organisation de votre evenement."}', '2026-07-08 08:23:01.186684+00', NULL);
INSERT INTO public.page_contents (id, page, section, content, updated_at, updated_by) VALUES ('52399472-e2e2-4b77-baec-be3474ecdc77', 'legal', 'mentions', '{"content": "Mentions legales\n\nRaison sociale : Vite & Gourmand SARL\nSiege social : 12 Rue Sainte-Catherine, 33000 Bordeaux\nSIRET : 123 456 789 00012\nCapital social : 10 000 EUR\nDirecteur de la publication : Responsable Vite & Gourmand\nHebergeur : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA\n\nConformement a la loi n°78-17 du 6 janvier 1978 relative a l''informatique, aux fichiers et aux libertes, vous disposez d''un droit d''acces, de rectification et de suppression des donnees vous concernant. Pour exercer ce droit, veuillez nous contacter a contact@viteetgourmand.fr."}', '2026-07-08 08:23:01.18974+00', NULL);
INSERT INTO public.page_contents (id, page, section, content, updated_at, updated_by) VALUES ('f64994f9-416a-4e20-83b4-c04040cd3123', 'legal', 'cgv', '{"content": "Conditions Generales de Vente\n\nArticle 1 - Objet\nLes presentes conditions generales de vente regissent les relations contractuelles entre Vite & Gourmand SARL et ses clients dans le cadre de prestations de traiteur.\n\nArticle 2 - Commandes\nToute commande doit etre passee au minimum 3 a 7 jours avant la date de l''evenement selon le menu choisi. Un acompte de 30% est demande a la confirmation de la commande.\n\nArticle 3 - Prix\nLes prix sont indiques en euros TTC. Ils comprennent la preparation des plats et, le cas echeant, les frais de livraison selon la zone geographique.\n\nArticle 4 - Livraison\nLa livraison est effectuee a l''adresse indiquee lors de la commande, dans les creneaux horaires convenus. Des frais de livraison peuvent s''appliquer selon la zone.\n\nArticle 5 - Annulation\nToute annulation effectuee plus de 48 heures avant la date prevue donne lieu au remboursement integral de l''acompte. En deca, l''acompte est conserve.\n\nArticle 6 - Responsabilite\nVite & Gourmand s''engage a fournir des prestations de qualite. Notre responsabilite est limitee au montant de la commande.\n\nArticle 7 - Litiges\nEn cas de litige, une solution amiable sera recherchee. A defaut, les tribunaux de Bordeaux seront competents."}', '2026-07-08 08:23:01.193027+00', NULL);
INSERT INTO public.page_contents (id, page, section, content, updated_at, updated_by) VALUES ('182a0ea0-e0b5-415e-b65b-b54f84b50f8b', 'legal', 'privacy', '{"content": "Politique de Confidentialite\n\nVite & Gourmand SARL s''engage a proteger la vie privee de ses utilisateurs. Cette politique de confidentialite decrit comment nous collectons, utilisons et protegeons vos donnees personnelles.\n\nDonnees collectees\nNous collectons les donnees suivantes : nom, prenom, adresse email, numero de telephone, adresse de livraison, et historique de commandes.\n\nUtilisation des donnees\nVos donnees sont utilisees pour : traiter vos commandes, vous contacter concernant vos reservations, ameliorer nos services, et vous envoyer des communications commerciales (avec votre consentement).\n\nConservation\nVos donnees sont conservees pendant la duree de la relation commerciale et 3 ans apres la derniere commande.\n\nDroits\nConformement au RGPD, vous disposez d''un droit d''acces, de rectification, de suppression, de portabilite et d''opposition sur vos donnees. Pour exercer ces droits, contactez-nous a contact@viteetgourmand.fr.\n\nCookies\nNotre site utilise des cookies fonctionnels et analytiques. Vous pouvez gerer vos preferences via le bandeau cookies."}', '2026-07-08 08:23:01.196677+00', NULL);
INSERT INTO public.page_contents (id, page, section, content, updated_at, updated_by) VALUES ('3155a54c-11f6-40ef-941d-77040c25cfff', 'footer', 'info', '{"siret": "123 456 789 00012", "address": "12 Rue Sainte-Catherine, 33000 Bordeaux", "company_name": "Vite & Gourmand"}', '2026-07-08 08:23:01.199421+00', NULL);


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: user_token; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.migrations_id_seq', 6, true);


--
-- PostgreSQL database dump complete
--


