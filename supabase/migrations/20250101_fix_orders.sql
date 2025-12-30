-- Fix schema to link orders to products and inventory

-- Add 'items' column to orders to store snapshot of products bought
ALTER TABLE public.orders 
ADD COLUMN items jsonb DEFAULT '[]';

-- Add 'order_id' to inventory to track which order consumed it
ALTER TABLE public.inventory
ADD COLUMN order_id uuid REFERENCES public.orders(id);

-- Add index for performance
CREATE INDEX idx_inventory_order_id ON public.inventory(order_id);
