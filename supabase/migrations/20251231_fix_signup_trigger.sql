-- Robust Handle New User Trigger
-- Fixes "Database error saving new user" by handling conflicts and nulls gracefully.

-- 1. Create or Replace the Function
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  meta_full_name text;
  meta_phone text;
BEGIN
  -- Extract metadata safely
  meta_full_name := COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '');
  meta_phone := COALESCE(new.raw_user_meta_data->>'phone', '');

  -- Insert into public.users
  INSERT INTO public.users (id, email, full_name, role, wallet_balance, phone)
  VALUES (
    new.id, 
    new.email, 
    meta_full_name, 
    'buyer', 
    0.00,
    meta_phone
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = NULLIF(COALESCE(EXCLUDED.full_name, public.users.full_name), ''),
    phone = NULLIF(COALESCE(EXCLUDED.phone, public.users.phone), '');
    
  RETURN new;
END;
$$;

-- 2. Rercreate the Trigger (Safety Step)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Validation Comment
COMMENT ON FUNCTION public.handle_new_user IS 'Automatically creates public user profile on signup. Robust against duplicates.';
