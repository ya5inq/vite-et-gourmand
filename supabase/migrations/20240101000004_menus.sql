-- Migration: menus
-- Menus composed of dishes, with dietary regime associations

-- Menus table
CREATE TABLE public.menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  theme text,
  price numeric(10,2) NOT NULL,
  min_persons integer NOT NULL DEFAULT 1,
  max_persons integer,
  stock integer,
  conditions text,
  image_url text,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Junction table: menu <-> dishes
CREATE TABLE public.menu_dishes (
  menu_id uuid NOT NULL REFERENCES public.menus(id) ON DELETE CASCADE,
  dish_id uuid NOT NULL REFERENCES public.dishes(id) ON DELETE CASCADE,
  PRIMARY KEY (menu_id, dish_id)
);

-- Junction table: menu <-> dietary regimes
CREATE TABLE public.menu_dietary_regimes (
  menu_id uuid NOT NULL REFERENCES public.menus(id) ON DELETE CASCADE,
  dietary_regime_id uuid NOT NULL REFERENCES public.dietary_regimes(id) ON DELETE CASCADE,
  PRIMARY KEY (menu_id, dietary_regime_id)
);
