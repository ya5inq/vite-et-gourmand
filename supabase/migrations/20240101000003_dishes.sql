-- Migration: dishes
-- Dishes catalog with allergen associations

-- Create the dish_category enum type
CREATE TYPE public.dish_category AS ENUM ('entree', 'plat', 'dessert');

-- Dishes table
CREATE TABLE public.dishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category public.dish_category NOT NULL,
  price numeric(10,2),
  image_url text,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Junction table: dish <-> allergens
CREATE TABLE public.dish_allergens (
  dish_id uuid NOT NULL REFERENCES public.dishes(id) ON DELETE CASCADE,
  allergen_id uuid NOT NULL REFERENCES public.allergens(id) ON DELETE CASCADE,
  PRIMARY KEY (dish_id, allergen_id)
);
