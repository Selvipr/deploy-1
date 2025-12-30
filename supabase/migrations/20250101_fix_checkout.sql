-- Fix RLS: Allow authenticated users to create their own orders
CREATE POLICY "Users can create their own orders" ON public.orders
FOR INSERT WITH CHECK (
    auth.uid() = buyer_id
);

-- Add checkout fields
ALTER TABLE public.orders
ADD COLUMN payment_method text,
ADD COLUMN contact_email text,
ADD COLUMN delivery_info jsonb; -- For miscellaneous delivery notes or future structure
