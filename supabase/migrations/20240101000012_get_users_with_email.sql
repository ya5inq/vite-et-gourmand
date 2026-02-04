-- Migration: get users with email function
-- Creates a function to retrieve users with their email (staff only)

CREATE OR REPLACE FUNCTION public.get_users_with_email()
RETURNS TABLE (
  id uuid,
  email text,
  first_name text,
  last_name text,
  role text,
  created_at timestamptz
) AS $$
DECLARE
  caller_role text;
BEGIN
  -- Get the caller's role
  SELECT p.role::text INTO caller_role
  FROM public.profiles p
  WHERE p.id = auth.uid();

  -- Only allow admin/employee users to call this function
  IF caller_role IS NULL OR caller_role NOT IN ('admin', 'employee') THEN
    RAISE EXCEPTION 'Access denied: staff role required';
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    u.email::text,
    p.first_name,
    p.last_name,
    p.role::text,
    p.created_at
  FROM public.profiles p
  INNER JOIN auth.users u ON u.id = p.id
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (function checks role internally)
GRANT EXECUTE ON FUNCTION public.get_users_with_email() TO authenticated;
