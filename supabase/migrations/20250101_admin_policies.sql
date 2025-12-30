-- Admin Policies
-- Allow admins to view ALL rows in key tables

-- Users
CREATE POLICY "Admins can view all profiles" ON public.users
FOR SELECT USING (
  auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
);

CREATE POLICY "Admins can update all profiles" ON public.users
FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
);

-- Orders
CREATE POLICY "Admins can view all orders" ON public.orders
FOR SELECT USING (
  auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
);

CREATE POLICY "Admins can update all orders" ON public.orders
FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
);

-- Inventory
CREATE POLICY "Admins can view all inventory" ON public.inventory
FOR SELECT USING (
  auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
);

-- Disputes
CREATE POLICY "Admins can view all disputes" ON public.disputes
FOR SELECT USING (
  auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
);

-- Helper to make yourself admin (Replace EMAIL with your email)
-- UPDATE public.users SET role = 'admin' WHERE email = 'your_email@example.com';
