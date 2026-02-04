-- Migration: Fix guest order creation
-- Creates an RPC function to allow guest orders bypassing RLS issues

-- 1. Create function to create guest orders (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION public.create_guest_order(
  p_guest_name text,
  p_guest_email text,
  p_guest_phone text,
  p_total_price numeric,
  p_delivery_address text,
  p_delivery_city text,
  p_delivery_postal_code text,
  p_delivery_zone_id uuid,
  p_delivery_date date,
  p_delivery_fee numeric DEFAULT 0,
  p_notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id uuid;
BEGIN
  -- Validate required fields
  IF p_guest_name IS NULL OR p_guest_name = '' THEN
    RAISE EXCEPTION 'Guest name is required';
  END IF;
  
  IF p_guest_email IS NULL OR p_guest_email = '' THEN
    RAISE EXCEPTION 'Guest email is required';
  END IF;
  
  IF p_guest_phone IS NULL OR p_guest_phone = '' THEN
    RAISE EXCEPTION 'Guest phone is required';
  END IF;

  -- Insert the order
  INSERT INTO public.orders (
    user_id,
    guest_name,
    guest_email,
    guest_phone,
    total_price,
    delivery_address,
    delivery_city,
    delivery_postal_code,
    delivery_zone_id,
    delivery_date,
    delivery_fee,
    notes,
    status
  ) VALUES (
    NULL,  -- No user_id for guest orders
    p_guest_name,
    p_guest_email,
    p_guest_phone,
    p_total_price,
    p_delivery_address,
    p_delivery_city,
    p_delivery_postal_code,
    p_delivery_zone_id,
    p_delivery_date,
    p_delivery_fee,
    p_notes,
    'pending'
  )
  RETURNING id INTO v_order_id;

  RETURN v_order_id;
END;
$$;

-- 2. Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION public.create_guest_order TO anon;
GRANT EXECUTE ON FUNCTION public.create_guest_order TO authenticated;

-- 3. Create function to add order items for guest orders
CREATE OR REPLACE FUNCTION public.add_guest_order_items(
  p_order_id uuid,
  p_items jsonb  -- Array of {menu_id, quantity, unit_price}
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_item jsonb;
  v_order_exists boolean;
BEGIN
  -- Verify the order exists and is a guest order
  SELECT EXISTS(
    SELECT 1 FROM public.orders 
    WHERE id = p_order_id 
    AND user_id IS NULL 
    AND guest_email IS NOT NULL
  ) INTO v_order_exists;
  
  IF NOT v_order_exists THEN
    RAISE EXCEPTION 'Order not found or is not a guest order';
  END IF;

  -- Insert each item
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO public.order_items (
      order_id,
      menu_id,
      quantity,
      unit_price
    ) VALUES (
      p_order_id,
      (v_item->>'menu_id')::uuid,
      (v_item->>'quantity')::integer,
      (v_item->>'unit_price')::numeric
    );
  END LOOP;
END;
$$;

-- 4. Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION public.add_guest_order_items TO anon;
GRANT EXECUTE ON FUNCTION public.add_guest_order_items TO authenticated;

-- 5. Update RLS policy to be more permissive for guest inserts
-- Drop and recreate the insert policy with explicit anon role check
DROP POLICY IF EXISTS "orders_insert_user_or_guest" ON public.orders;

CREATE POLICY "orders_insert_authenticated" ON public.orders FOR INSERT
  WITH CHECK (
    -- Authenticated users can insert orders for themselves
    auth.uid() IS NOT NULL AND user_id = auth.uid()
  );

-- Note: Guest orders should use the create_guest_order RPC function
-- which uses SECURITY DEFINER to bypass RLS

-- 6. Allow guests to view their order by ID (for confirmation page)
-- This version only requires the order ID (UUID is hard to guess)
CREATE OR REPLACE FUNCTION public.get_guest_order_by_id(p_order_id uuid)
RETURNS TABLE (
  id uuid,
  status public.order_status,
  total_price numeric,
  delivery_address text,
  delivery_city text,
  delivery_postal_code text,
  delivery_date date,
  delivery_fee numeric,
  notes text,
  guest_name text,
  guest_email text,
  guest_phone text,
  created_at timestamptz,
  rejection_reason text,
  rejected_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.status,
    o.total_price,
    o.delivery_address,
    o.delivery_city,
    o.delivery_postal_code,
    o.delivery_date,
    o.delivery_fee,
    o.notes,
    o.guest_name,
    o.guest_email,
    o.guest_phone,
    o.created_at,
    o.rejection_reason,
    o.rejected_at
  FROM public.orders o
  WHERE o.id = p_order_id
    AND o.user_id IS NULL
    AND o.guest_email IS NOT NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_guest_order_by_id TO anon;
GRANT EXECUTE ON FUNCTION public.get_guest_order_by_id TO authenticated;

-- 7. Function to get order items for a guest order
CREATE OR REPLACE FUNCTION public.get_guest_order_items(p_order_id uuid)
RETURNS TABLE (
  id uuid,
  quantity integer,
  unit_price numeric,
  menu_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return items if the order is a guest order
  IF NOT EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = p_order_id 
    AND orders.user_id IS NULL 
    AND orders.guest_email IS NOT NULL
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    oi.id,
    oi.quantity,
    oi.unit_price,
    m.name as menu_name
  FROM public.order_items oi
  JOIN public.menus m ON m.id = oi.menu_id
  WHERE oi.order_id = p_order_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_guest_order_items TO anon;
GRANT EXECUTE ON FUNCTION public.get_guest_order_items TO authenticated;
