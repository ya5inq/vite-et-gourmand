-- Migration: link guest orders to users
-- Associates anonymous orders with user accounts when they register/login with the same email

-- 1. Function to migrate guest orders to a user account
CREATE OR REPLACE FUNCTION public.link_guest_orders_to_user(p_user_id uuid, p_email text)
RETURNS integer AS $$
DECLARE
  updated_count integer;
BEGIN
  -- Update all guest orders with matching email to be owned by the user
  UPDATE public.orders
  SET
    user_id = p_user_id,
    updated_at = now()
  WHERE
    user_id IS NULL
    AND guest_email IS NOT NULL
    AND lower(trim(guest_email)) = lower(trim(p_email));

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update the handle_new_user trigger to also link guest orders
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Create user profile
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'user');

  -- Link any existing guest orders to this new user
  PERFORM public.link_guest_orders_to_user(NEW.id, NEW.email);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Migrate existing guest orders for users who already have accounts
-- This runs once during migration to catch any existing cases
DO $$
DECLARE
  r RECORD;
  migrated_count integer;
  total_migrated integer := 0;
BEGIN
  -- Find all users whose email matches a guest order
  FOR r IN
    SELECT DISTINCT u.id, u.email
    FROM auth.users u
    INNER JOIN public.orders o ON lower(trim(o.guest_email)) = lower(trim(u.email))
    WHERE o.user_id IS NULL
  LOOP
    UPDATE public.orders
    SET
      user_id = r.id,
      updated_at = now()
    WHERE
      user_id IS NULL
      AND lower(trim(guest_email)) = lower(trim(r.email));

    GET DIAGNOSTICS migrated_count = ROW_COUNT;
    total_migrated := total_migrated + migrated_count;

    RAISE NOTICE 'Migrated % orders for user %', migrated_count, r.email;
  END LOOP;

  RAISE NOTICE 'Total guest orders migrated: %', total_migrated;
END $$;

-- 4. Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.link_guest_orders_to_user(uuid, text) TO authenticated;
