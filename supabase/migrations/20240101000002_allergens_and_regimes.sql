-- Migration: allergens and dietary regimes
-- Reference tables for food allergens and dietary regimes

-- Allergens table
CREATE TABLE public.allergens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  icon text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Dietary regimes table
CREATE TABLE public.dietary_regimes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
