-- Migration: RLS policies
-- Row Level Security for all tables

-- ============================================================
-- Enable RLS on ALL tables
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dietary_regimes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dish_allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_dietary_regimes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operating_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES
-- ============================================================

-- Users can read their own profile
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT USING (id = auth.uid());

-- Employees and admins can read all profiles
CREATE POLICY profiles_select_staff ON public.profiles
  FOR SELECT USING (public.get_user_role() IN ('employee', 'admin'));

-- Users can update their own profile
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ============================================================
-- ALLERGENS
-- ============================================================

-- Anyone can read allergens (including anonymous)
CREATE POLICY allergens_select_all ON public.allergens
  FOR SELECT USING (true);

-- Employees and admins can insert allergens
CREATE POLICY allergens_insert_staff ON public.allergens
  FOR INSERT WITH CHECK (public.get_user_role() IN ('employee', 'admin'));

-- Employees and admins can update allergens
CREATE POLICY allergens_update_staff ON public.allergens
  FOR UPDATE USING (public.get_user_role() IN ('employee', 'admin'))
  WITH CHECK (public.get_user_role() IN ('employee', 'admin'));

-- Employees and admins can delete allergens
CREATE POLICY allergens_delete_staff ON public.allergens
  FOR DELETE USING (public.get_user_role() IN ('employee', 'admin'));

-- ============================================================
-- DIETARY REGIMES
-- ============================================================

CREATE POLICY dietary_regimes_select_all ON public.dietary_regimes
  FOR SELECT USING (true);

CREATE POLICY dietary_regimes_insert_staff ON public.dietary_regimes
  FOR INSERT WITH CHECK (public.get_user_role() IN ('employee', 'admin'));

CREATE POLICY dietary_regimes_update_staff ON public.dietary_regimes
  FOR UPDATE USING (public.get_user_role() IN ('employee', 'admin'))
  WITH CHECK (public.get_user_role() IN ('employee', 'admin'));

CREATE POLICY dietary_regimes_delete_staff ON public.dietary_regimes
  FOR DELETE USING (public.get_user_role() IN ('employee', 'admin'));

-- ============================================================
-- DISHES
-- ============================================================

CREATE POLICY dishes_select_all ON public.dishes
  FOR SELECT USING (true);

CREATE POLICY dishes_insert_staff ON public.dishes
  FOR INSERT WITH CHECK (public.get_user_role() IN ('employee', 'admin'));

CREATE POLICY dishes_update_staff ON public.dishes
  FOR UPDATE USING (public.get_user_role() IN ('employee', 'admin'))
  WITH CHECK (public.get_user_role() IN ('employee', 'admin'));

CREATE POLICY dishes_delete_staff ON public.dishes
  FOR DELETE USING (public.get_user_role() IN ('employee', 'admin'));

-- ============================================================
-- DISH_ALLERGENS
-- ============================================================

CREATE POLICY dish_allergens_select_all ON public.dish_allergens
  FOR SELECT USING (true);

CREATE POLICY dish_allergens_insert_staff ON public.dish_allergens
  FOR INSERT WITH CHECK (public.get_user_role() IN ('employee', 'admin'));

CREATE POLICY dish_allergens_update_staff ON public.dish_allergens
  FOR UPDATE USING (public.get_user_role() IN ('employee', 'admin'))
  WITH CHECK (public.get_user_role() IN ('employee', 'admin'));

CREATE POLICY dish_allergens_delete_staff ON public.dish_allergens
  FOR DELETE USING (public.get_user_role() IN ('employee', 'admin'));

-- ============================================================
-- MENUS
-- ============================================================

CREATE POLICY menus_select_all ON public.menus
  FOR SELECT USING (true);

CREATE POLICY menus_insert_staff ON public.menus
  FOR INSERT WITH CHECK (public.get_user_role() IN ('employee', 'admin'));

CREATE POLICY menus_update_staff ON public.menus
  FOR UPDATE USING (public.get_user_role() IN ('employee', 'admin'))
  WITH CHECK (public.get_user_role() IN ('employee', 'admin'));

CREATE POLICY menus_delete_staff ON public.menus
  FOR DELETE USING (public.get_user_role() IN ('employee', 'admin'));

-- ============================================================
-- MENU_DISHES
-- ============================================================

CREATE POLICY menu_dishes_select_all ON public.menu_dishes
  FOR SELECT USING (true);

CREATE POLICY menu_dishes_insert_staff ON public.menu_dishes
  FOR INSERT WITH CHECK (public.get_user_role() IN ('employee', 'admin'));

CREATE POLICY menu_dishes_update_staff ON public.menu_dishes
  FOR UPDATE USING (public.get_user_role() IN ('employee', 'admin'))
  WITH CHECK (public.get_user_role() IN ('employee', 'admin'));

CREATE POLICY menu_dishes_delete_staff ON public.menu_dishes
  FOR DELETE USING (public.get_user_role() IN ('employee', 'admin'));

-- ============================================================
-- MENU_DIETARY_REGIMES
-- ============================================================

CREATE POLICY menu_dietary_regimes_select_all ON public.menu_dietary_regimes
  FOR SELECT USING (true);

CREATE POLICY menu_dietary_regimes_insert_staff ON public.menu_dietary_regimes
  FOR INSERT WITH CHECK (public.get_user_role() IN ('employee', 'admin'));

CREATE POLICY menu_dietary_regimes_update_staff ON public.menu_dietary_regimes
  FOR UPDATE USING (public.get_user_role() IN ('employee', 'admin'))
  WITH CHECK (public.get_user_role() IN ('employee', 'admin'));

CREATE POLICY menu_dietary_regimes_delete_staff ON public.menu_dietary_regimes
  FOR DELETE USING (public.get_user_role() IN ('employee', 'admin'));

-- ============================================================
-- ORDERS
-- ============================================================

-- Users can read their own orders
CREATE POLICY orders_select_own ON public.orders
  FOR SELECT USING (user_id = auth.uid());

-- Employees and admins can read all orders
CREATE POLICY orders_select_staff ON public.orders
  FOR SELECT USING (public.get_user_role() IN ('employee', 'admin'));

-- Authenticated users can create their own orders
CREATE POLICY orders_insert_own ON public.orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Employees and admins can update any order
CREATE POLICY orders_update_staff ON public.orders
  FOR UPDATE USING (public.get_user_role() IN ('employee', 'admin'))
  WITH CHECK (public.get_user_role() IN ('employee', 'admin'));

-- ============================================================
-- ORDER_HISTORY
-- ============================================================

-- Users can read history of their own orders
CREATE POLICY order_history_select_own ON public.order_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_history.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- Employees and admins can read all order history
CREATE POLICY order_history_select_staff ON public.order_history
  FOR SELECT USING (public.get_user_role() IN ('employee', 'admin'));

-- Employees and admins can insert order history entries
CREATE POLICY order_history_insert_staff ON public.order_history
  FOR INSERT WITH CHECK (public.get_user_role() IN ('employee', 'admin'));

-- ============================================================
-- DELIVERY_ZONES
-- ============================================================

CREATE POLICY delivery_zones_select_all ON public.delivery_zones
  FOR SELECT USING (true);

CREATE POLICY delivery_zones_insert_admin ON public.delivery_zones
  FOR INSERT WITH CHECK (public.get_user_role() = 'admin');

CREATE POLICY delivery_zones_update_admin ON public.delivery_zones
  FOR UPDATE USING (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

CREATE POLICY delivery_zones_delete_admin ON public.delivery_zones
  FOR DELETE USING (public.get_user_role() = 'admin');

-- ============================================================
-- REVIEWS
-- ============================================================

-- Anyone can read approved reviews
CREATE POLICY reviews_select_approved ON public.reviews
  FOR SELECT USING (is_approved = true);

-- Employees and admins can read all reviews (including unapproved)
CREATE POLICY reviews_select_staff ON public.reviews
  FOR SELECT USING (public.get_user_role() IN ('employee', 'admin'));

-- Authenticated users can create a review for their own order
CREATE POLICY reviews_insert_own ON public.reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Employees and admins can update reviews (moderate)
CREATE POLICY reviews_update_staff ON public.reviews
  FOR UPDATE USING (public.get_user_role() IN ('employee', 'admin'))
  WITH CHECK (public.get_user_role() IN ('employee', 'admin'));

-- ============================================================
-- PAGE_CONTENTS
-- ============================================================

CREATE POLICY page_contents_select_all ON public.page_contents
  FOR SELECT USING (true);

CREATE POLICY page_contents_insert_staff ON public.page_contents
  FOR INSERT WITH CHECK (public.get_user_role() IN ('employee', 'admin'));

CREATE POLICY page_contents_update_staff ON public.page_contents
  FOR UPDATE USING (public.get_user_role() IN ('employee', 'admin'))
  WITH CHECK (public.get_user_role() IN ('employee', 'admin'));

CREATE POLICY page_contents_delete_staff ON public.page_contents
  FOR DELETE USING (public.get_user_role() IN ('employee', 'admin'));

-- ============================================================
-- OPERATING_HOURS
-- ============================================================

CREATE POLICY operating_hours_select_all ON public.operating_hours
  FOR SELECT USING (true);

CREATE POLICY operating_hours_insert_staff ON public.operating_hours
  FOR INSERT WITH CHECK (public.get_user_role() IN ('employee', 'admin'));

CREATE POLICY operating_hours_update_staff ON public.operating_hours
  FOR UPDATE USING (public.get_user_role() IN ('employee', 'admin'))
  WITH CHECK (public.get_user_role() IN ('employee', 'admin'));

CREATE POLICY operating_hours_delete_staff ON public.operating_hours
  FOR DELETE USING (public.get_user_role() IN ('employee', 'admin'));

-- ============================================================
-- CONTACT_MESSAGES
-- ============================================================

-- Anyone can create a contact message (including anonymous visitors)
CREATE POLICY contact_messages_insert_all ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Employees and admins can read contact messages
CREATE POLICY contact_messages_select_staff ON public.contact_messages
  FOR SELECT USING (public.get_user_role() IN ('employee', 'admin'));

-- Employees and admins can update contact messages (mark as read)
CREATE POLICY contact_messages_update_staff ON public.contact_messages
  FOR UPDATE USING (public.get_user_role() IN ('employee', 'admin'))
  WITH CHECK (public.get_user_role() IN ('employee', 'admin'));
