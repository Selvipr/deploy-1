-- Add profile fields to users table
ALTER TABLE public.users 
ADD COLUMN full_name text,
ADD COLUMN avatar_url text,
ADD COLUMN phone text;
