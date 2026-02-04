-- Migration: cart and rejection features
-- Adds 'rejected' status, guest ordering, and order_items table

-- 1. Add 'rejected' status to the order_status enum
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'rejected' AFTER 'pending';

-- 2. Add rejection fields to orders table
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS rejected_at timestamptz,
  ADD COLUMN IF NOT EXISTS rejected_by uuid REFERENCES auth.users(id);

-- 3. Add guest fields to orders table
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS guest_email text,
  ADD COLUMN IF NOT EXISTS guest_name text,
  ADD COLUMN IF NOT EXISTS guest_phone text;

-- 4. Make user_id nullable for guest orders
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

-- 5. Make menu_id nullable (since we now use order_items)
ALTER TABLE public.orders ALTER COLUMN menu_id DROP NOT NULL;

-- 6. Constraint: either user_id OR guest_email must be provided
ALTER TABLE public.orders
  ADD CONSTRAINT orders_user_or_guest CHECK (user_id IS NOT NULL OR guest_email IS NOT NULL);

-- 7. Create order_items table for multi-menu orders
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_id uuid NOT NULL REFERENCES public.menus(id),
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 8. Enable RLS for order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 9. RLS policies for order_items

-- Users can view their own order items
CREATE POLICY "order_items_select_own" ON public.order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  ));

-- Staff can view all order items
CREATE POLICY "order_items_select_staff" ON public.order_items FOR SELECT
  USING (public.get_user_role() IN ('employee', 'admin'));

-- Users can insert their own order items
CREATE POLICY "order_items_insert_own" ON public.order_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  ));

-- Guests can insert order items for their orders (anon role)
CREATE POLICY "order_items_insert_guest" ON public.order_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id IS NULL
    AND orders.guest_email IS NOT NULL
  ));

-- Staff can manage all order items
CREATE POLICY "order_items_all_staff" ON public.order_items FOR ALL
  USING (public.get_user_role() IN ('employee', 'admin'))
  WITH CHECK (public.get_user_role() IN ('employee', 'admin'));

-- 10. Update orders policies for guest ordering

-- Drop existing insert policy
DROP POLICY IF EXISTS orders_insert_own ON public.orders;

-- Create new insert policy that allows both authenticated users and guests
CREATE POLICY "orders_insert_user_or_guest" ON public.orders FOR INSERT
  WITH CHECK (
    -- Authenticated users can insert orders for themselves
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    -- Guests (anonymous) can insert orders with guest_email
    (auth.uid() IS NULL AND user_id IS NULL AND guest_email IS NOT NULL)
  );

-- Guests can view their own orders (by matching email - requires RPC for security)
-- For now, guests will use the confirmation page with order ID

-- 11. Update the orders select policy to allow staff to see guest info
DROP POLICY IF EXISTS orders_select_own ON public.orders;
CREATE POLICY "orders_select_own" ON public.orders FOR SELECT
  USING (user_id = auth.uid());
