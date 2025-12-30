-- Add input_schema column to products table
-- This stores the dynamic form definition (JSON)

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS input_schema jsonb DEFAULT '[]'::jsonb;

-- Comment on column
COMMENT ON COLUMN public.products.input_schema IS 'Defines dynamic input fields required for the product (e.g. Player ID, Region)';
