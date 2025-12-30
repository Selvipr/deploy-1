-- Manual Fix for User "admin@123" (UID: ee838d47-3b43-4017-b190-47d37360a292)
-- Run this in Supabase SQL Editor to force-create the profile

INSERT INTO public.users (id, email, full_name, role, wallet_balance)
VALUES (
    'ee838d47-3b43-4017-b190-47d37360a292', -- UID from your screenshot
    'admin@123',                            -- Email from your screenshot
    'Admin User',                           -- Default Name
    'admin',                                -- Role (Setting to Admin so you can access dashboard)
    1000.00                                 -- Starting Wallet Balance
)
ON CONFLICT (id) DO UPDATE 
SET 
    role = 'admin',
    wallet_balance = 1000.00;

-- Also verify Policies are enabled (Just to be safe)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
