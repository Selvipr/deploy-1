-- Add 'type' column to inventory table to distinguish between keys and files
ALTER TABLE public.inventory 
ADD COLUMN type text CHECK (type IN ('serial_key', 'file')) DEFAULT 'serial_key';
