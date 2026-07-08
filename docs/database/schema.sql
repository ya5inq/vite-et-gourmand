-- ============================================================
-- Vite & Gourmand — Schéma de la base PostgreSQL
-- ------------------------------------------------------------
-- Généré depuis les migrations TypeORM (6 migrations, 18 tables).
-- Ordre d'exécution :
--   1. psql ... -f schema.sql   (structure : tables, contraintes, index)
--   2. psql ... -f seed.sql     (jeu de données initial)
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
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: dishes_category_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.dishes_category_enum AS ENUM (
    'entree',
    'plat',
    'dessert'
);


--
-- Name: order_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.order_status AS ENUM (
    'PENDING',
    'ACCEPTED',
    'PREPARING',
    'DELIVERING',
    'DELIVERED',
    'AWAITING_MATERIAL_RETURN',
    'COMPLETED',
    'REJECTED',
    'CANCELLED'
);


--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role_enum AS ENUM (
    'USER',
    'EMPLOYEE',
    'ADMIN'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: allergens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.allergens (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    icon character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_messages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50),
    subject character varying(255),
    message text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: delivery_zones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.delivery_zones (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    postal_code character varying(20),
    city character varying(255),
    distance_km numeric(6,2) DEFAULT '0'::numeric NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: dietary_regimes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dietary_regimes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: dish_allergens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dish_allergens (
    dish_id uuid NOT NULL,
    allergen_id uuid NOT NULL
);


--
-- Name: dishes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dishes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    category public.dishes_category_enum NOT NULL,
    price numeric(10,2),
    image_url text,
    is_available boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: menu_dietary_regimes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.menu_dietary_regimes (
    menu_id uuid NOT NULL,
    dietary_regime_id uuid NOT NULL
);


--
-- Name: menu_dishes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.menu_dishes (
    menu_id uuid NOT NULL,
    dish_id uuid NOT NULL
);


--
-- Name: menus; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.menus (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    theme character varying(255),
    price numeric(10,2) NOT NULL,
    min_persons integer DEFAULT 1 NOT NULL,
    max_persons integer,
    stock integer,
    conditions text,
    image_url text,
    is_available boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: operating_hours; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.operating_hours (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    day_of_week integer NOT NULL,
    open_time time without time zone,
    close_time time without time zone,
    is_closed boolean DEFAULT false NOT NULL,
    CONSTRAINT chk_operating_hours_day CHECK (((day_of_week >= 0) AND (day_of_week <= 6)))
);


--
-- Name: order_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_history (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid NOT NULL,
    old_status public.order_status,
    new_status public.order_status NOT NULL,
    changed_by uuid,
    reason text,
    contact_mode character varying(50),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid NOT NULL,
    menu_id uuid NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    line_total numeric(10,2) NOT NULL,
    discount_applied boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    status public.order_status DEFAULT 'PENDING'::public.order_status NOT NULL,
    guest_email character varying(255),
    guest_name character varying(255),
    guest_phone character varying(50),
    delivery_address character varying(255),
    delivery_city character varying(255),
    delivery_postal_code character varying(20),
    delivery_zone_id uuid,
    delivery_date date,
    delivery_fee numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    total_price numeric(10,2) NOT NULL,
    notes text,
    rejection_reason text,
    rejected_by uuid,
    rejected_at timestamp with time zone,
    material_return_deadline timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    material_penalty_applied boolean DEFAULT false NOT NULL,
    penalty_amount numeric(10,2),
    CONSTRAINT chk_orders_user_or_guest CHECK (((user_id IS NOT NULL) OR (guest_email IS NOT NULL)))
);


--
-- Name: page_contents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.page_contents (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    page text NOT NULL,
    section text NOT NULL,
    content jsonb DEFAULT '{}'::jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid
);


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    order_id uuid NOT NULL,
    rating integer NOT NULL,
    comment text,
    is_approved boolean DEFAULT false NOT NULL,
    approved_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_review_rating CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public.user_role_enum DEFAULT 'USER'::public.user_role_enum NOT NULL,
    admin boolean DEFAULT false NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    phone character varying,
    address character varying,
    city character varying,
    postal_code character varying,
    is_active boolean DEFAULT true NOT NULL,
    email_verified boolean DEFAULT false NOT NULL,
    last_login_at timestamp with time zone,
    preferred_language character varying DEFAULT 'fr'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_token (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    value character varying(255) NOT NULL,
    can_be_refreshed boolean NOT NULL,
    token_type character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    expiration_date timestamp with time zone NOT NULL
);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: page_contents pk_0c86f4f6_page_contents_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_contents
    ADD CONSTRAINT pk_0c86f4f6_page_contents_id PRIMARY KEY (id);


--
-- Name: operating_hours pk_185daa0b_operating_hours_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.operating_hours
    ADD CONSTRAINT pk_185daa0b_operating_hours_id PRIMARY KEY (id);


--
-- Name: order_history pk_1d0d328e_order_history_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_history
    ADD CONSTRAINT pk_1d0d328e_order_history_id PRIMARY KEY (id);


--
-- Name: reviews pk_3c910644_reviews_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT pk_3c910644_reviews_id PRIMARY KEY (id);


--
-- Name: migrations pk_52aa138a_migrations_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT pk_52aa138a_migrations_id PRIMARY KEY (id);


--
-- Name: dishes pk_56982e50_dishes_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dishes
    ADD CONSTRAINT pk_56982e50_dishes_id PRIMARY KEY (id);


--
-- Name: user_token pk_767768b1_user_token_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_token
    ADD CONSTRAINT pk_767768b1_user_token_id PRIMARY KEY (id);


--
-- Name: dietary_regimes pk_a2808f92_dietary_regimes_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dietary_regimes
    ADD CONSTRAINT pk_a2808f92_dietary_regimes_id PRIMARY KEY (id);


--
-- Name: delivery_zones pk_bfd866f2_delivery_zones_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_zones
    ADD CONSTRAINT pk_bfd866f2_delivery_zones_id PRIMARY KEY (id);


--
-- Name: menus pk_c184e40b_menus_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT pk_c184e40b_menus_id PRIMARY KEY (id);


--
-- Name: menu_dishes pk_cd4aadc4_menu_dishes_menu_id_dish_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_dishes
    ADD CONSTRAINT pk_cd4aadc4_menu_dishes_menu_id_dish_id PRIMARY KEY (menu_id, dish_id);


--
-- Name: order_items pk_d1bd21af_order_items_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT pk_d1bd21af_order_items_id PRIMARY KEY (id);


--
-- Name: menu_dietary_regimes pk_d5ecee31_menu_dietary_regimes_menu_id_dieta...gime_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_dietary_regimes
    ADD CONSTRAINT "pk_d5ecee31_menu_dietary_regimes_menu_id_dieta...gime_id" PRIMARY KEY (menu_id, dietary_regime_id);


--
-- Name: contact_messages pk_dac5fc80_contact_messages_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT pk_dac5fc80_contact_messages_id PRIMARY KEY (id);


--
-- Name: allergens pk_dd0321c4_allergens_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.allergens
    ADD CONSTRAINT pk_dd0321c4_allergens_id PRIMARY KEY (id);


--
-- Name: user pk_e8701ad4_user_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT pk_e8701ad4_user_id PRIMARY KEY (id);


--
-- Name: dish_allergens pk_eb349eba_dish_allergens_dish_id_allergen_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dish_allergens
    ADD CONSTRAINT pk_eb349eba_dish_allergens_dish_id_allergen_id PRIMARY KEY (dish_id, allergen_id);


--
-- Name: orders pk_ecd57eb9_orders_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT pk_ecd57eb9_orders_id PRIMARY KEY (id);


--
-- Name: user uq_40c27bdc_user_email; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT uq_40c27bdc_user_email UNIQUE (email);


--
-- Name: allergens uq_cb8f654a_allergens_name; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.allergens
    ADD CONSTRAINT uq_cb8f654a_allergens_name UNIQUE (name);


--
-- Name: user_token uq_d91328d8_user_token_value; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_token
    ADD CONSTRAINT uq_d91328d8_user_token_value UNIQUE (value);


--
-- Name: dietary_regimes uq_ebdd50a5_dietary_regimes_name; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dietary_regimes
    ADD CONSTRAINT uq_ebdd50a5_dietary_regimes_name UNIQUE (name);


--
-- Name: operating_hours uq_f0bc00ba_operating_hours_day_of_week; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.operating_hours
    ADD CONSTRAINT uq_f0bc00ba_operating_hours_day_of_week UNIQUE (day_of_week);


--
-- Name: reviews uq_f5bd779b_reviews_order_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT uq_f5bd779b_reviews_order_id UNIQUE (order_id);


--
-- Name: page_contents uq_page_content_page_section; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_contents
    ADD CONSTRAINT uq_page_content_page_section UNIQUE (page, section);


--
-- Name: idx_506c6ef5_dish_allergens_allergen_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_506c6ef5_dish_allergens_allergen_id ON public.dish_allergens USING btree (allergen_id);


--
-- Name: idx_5eec9353_menu_dietary_regimes_menu_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_5eec9353_menu_dietary_regimes_menu_id ON public.menu_dietary_regimes USING btree (menu_id);


--
-- Name: idx_5f120eff_menu_dietary_regimes_dietary_regime_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_5f120eff_menu_dietary_regimes_dietary_regime_id ON public.menu_dietary_regimes USING btree (dietary_regime_id);


--
-- Name: idx_758219a9_menu_dishes_dish_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_758219a9_menu_dishes_dish_id ON public.menu_dishes USING btree (dish_id);


--
-- Name: idx_814858be_dish_allergens_dish_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_814858be_dish_allergens_dish_id ON public.dish_allergens USING btree (dish_id);


--
-- Name: idx_c881878f_menu_dishes_menu_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_c881878f_menu_dishes_menu_id ON public.menu_dishes USING btree (menu_id);


--
-- Name: idx_contact_message_is_read; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contact_message_is_read ON public.contact_messages USING btree (is_read);


--
-- Name: idx_delivery_zone_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_delivery_zone_is_active ON public.delivery_zones USING btree (is_active);


--
-- Name: idx_dish_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_dish_category ON public.dishes USING btree (category);


--
-- Name: idx_menu_theme; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_menu_theme ON public.menus USING btree (theme);


--
-- Name: idx_order_history_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_history_order_id ON public.order_history USING btree (order_id);


--
-- Name: idx_order_item_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_item_order_id ON public.order_items USING btree (order_id);


--
-- Name: idx_order_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_status ON public.orders USING btree (status);


--
-- Name: idx_order_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_user_id ON public.orders USING btree (user_id);


--
-- Name: idx_review_is_approved; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_review_is_approved ON public.reviews USING btree (is_approved);


--
-- Name: reviews fk_068c49af_reviews_order_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fk_068c49af_reviews_order_id FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: menu_dishes fk_2b98316f_menu_dishes_menu_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_dishes
    ADD CONSTRAINT fk_2b98316f_menu_dishes_menu_id FOREIGN KEY (menu_id) REFERENCES public.menus(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: menu_dietary_regimes fk_2df0e9c6_menu_dietary_regimes_dietary_regime_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_dietary_regimes
    ADD CONSTRAINT fk_2df0e9c6_menu_dietary_regimes_dietary_regime_id FOREIGN KEY (dietary_regime_id) REFERENCES public.dietary_regimes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: menu_dishes fk_31c8b663_menu_dishes_dish_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_dishes
    ADD CONSTRAINT fk_31c8b663_menu_dishes_dish_id FOREIGN KEY (dish_id) REFERENCES public.dishes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_history fk_34ac4769_order_history_order_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_history
    ADD CONSTRAINT fk_34ac4769_order_history_order_id FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders fk_5797bcb7_orders_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_5797bcb7_orders_user_id FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- Name: order_history fk_77f0c762_order_history_changed_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_history
    ADD CONSTRAINT fk_77f0c762_order_history_changed_by FOREIGN KEY (changed_by) REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- Name: dish_allergens fk_8927c8f5_dish_allergens_allergen_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dish_allergens
    ADD CONSTRAINT fk_8927c8f5_dish_allergens_allergen_id FOREIGN KEY (allergen_id) REFERENCES public.allergens(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_token fk_9fe210f3_user_token_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_token
    ADD CONSTRAINT fk_9fe210f3_user_token_user_id FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: order_items fk_a414b628_order_items_menu_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_a414b628_order_items_menu_id FOREIGN KEY (menu_id) REFERENCES public.menus(id) ON DELETE RESTRICT;


--
-- Name: reviews fk_bddc8332_reviews_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fk_bddc8332_reviews_user_id FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: menu_dietary_regimes fk_c0ac2952_menu_dietary_regimes_menu_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_dietary_regimes
    ADD CONSTRAINT fk_c0ac2952_menu_dietary_regimes_menu_id FOREIGN KEY (menu_id) REFERENCES public.menus(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_items fk_c2a0cb18_order_items_order_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_c2a0cb18_order_items_order_id FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders fk_cbd29292_orders_delivery_zone_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_cbd29292_orders_delivery_zone_id FOREIGN KEY (delivery_zone_id) REFERENCES public.delivery_zones(id) ON DELETE SET NULL;


--
-- Name: dish_allergens fk_f1d83afc_dish_allergens_dish_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dish_allergens
    ADD CONSTRAINT fk_f1d83afc_dish_allergens_dish_id FOREIGN KEY (dish_id) REFERENCES public.dishes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: page_contents fk_page_contents_updated_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_contents
    ADD CONSTRAINT fk_page_contents_updated_by FOREIGN KEY (updated_by) REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--


