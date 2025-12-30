-- Fix Check Constraints on Orders Table to allow 'completed' status
-- Also add constraints for wallet check to be safe

BEGIN;

-- 1. Orders Status Check
-- Try to drop common names for the constraint
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS order_status_check;
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_fkey; -- unlikely but check

-- Add the correct constraint including 'escrow' and 'completed'
ALTER TABLE public.orders 
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'escrow', 'completed', 'disputed', 'refunded', 'cancelled'));

-- 2. Users Wallet Check (optional but good practice, ensures no negative balance)
-- Remove if it exists to ensure definition matches
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_wallet_balance_check;

ALTER TABLE public.users 
ADD CONSTRAINT users_wallet_balance_check 
CHECK (wallet_balance >= 0);

COMMIT;
