-- NUCLEAR FIX: Reset Policies and Permissions
-- Run this in Supabase SQL Editor

BEGIN;

-- 1. Grant Permissions to authenticated users (just in case)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 2. ORDERS TABLE POLICIES
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
-- ... drop any others potentially named differently

-- Re-create Policies
CREATE POLICY "Users can view own orders" ON public.orders
FOR SELECT USING (
  auth.uid() = buyer_id 
  OR 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can create their own orders" ON public.orders
FOR INSERT WITH CHECK (
  auth.uid() = buyer_id
);

-- 3. USERS TABLE POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.users;

-- Re-create Policies
CREATE POLICY "Users can view own profile" ON public.users
FOR SELECT USING (
  auth.uid() = id
  OR 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can update own profile" ON public.users
FOR UPDATE USING (
  auth.uid() = id
  OR 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Everyone can insert profile via trigger" ON public.users
FOR INSERT WITH CHECK (true); -- Needed for trigger sometimes depending on config, but usually trigger bypasses RLS if SECURITY DEFINER

-- 4. INVENTORY TABLE POLICIES
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view all inventory" ON public.inventory;
DROP POLICY IF EXISTS "Public view available" ON public.inventory;

CREATE POLICY "Public view available" ON public.inventory
FOR SELECT USING (status = 'available');

CREATE POLICY "Admins can view all inventory" ON public.inventory
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- 5. RE-APPLY BACKFILL (Just in case)
INSERT INTO public.users (id, email, role, wallet_balance)
SELECT id, email, 'buyer', 0.00
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

COMMIT;
