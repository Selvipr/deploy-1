-- FIX INFINITE RECURSION IN RLS
-- The previous policy caused recursion because it queried 'public.users' to check for admin status,
-- while 'public.users' itself was protected by that same policy.

-- 1. Create a Helper Function to check Admin status securely (Bypassing RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER -- Critical: Runs with owner permissions, bypassing RLS
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
$$;

-- 2. Update USERS Policies to use the helper
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

CREATE POLICY "Users can view own profile" ON public.users
FOR SELECT USING (
  auth.uid() = id 
  OR 
  is_admin() -- Uses the secure function, no recursion
);

CREATE POLICY "Users can update own profile" ON public.users
FOR UPDATE USING (
  auth.uid() = id 
  OR 
  is_admin()
);

-- 3. Update ORDERS Policies (Good practice to use the helper here too)
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders; -- Drop old one if exists

CREATE POLICY "Users can view own orders" ON public.orders
FOR SELECT USING (
  auth.uid() = buyer_id 
  OR 
  is_admin()
);

-- 4. Update INVENTORY Policies
DROP POLICY IF EXISTS "Admins can view all inventory" ON public.inventory;

CREATE POLICY "Admins can view all inventory" ON public.inventory
FOR SELECT USING (
  is_admin()
);
