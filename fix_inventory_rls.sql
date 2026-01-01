-- Fix: Allow sellers to insert inventory for their own products
create policy "Sellers can insert their own inventory" on public.inventory
  for insert with check (
    auth.uid() in (select seller_id from public.products where id = product_id)
  );

-- Fix: Allow sellers to delete their own inventory
create policy "Sellers can delete their own inventory" on public.inventory
  for delete using (
    auth.uid() in (select seller_id from public.products where id = inventory.product_id)
  );

-- Fix: Allow sellers to update (e.g. mark as locked/sold - though usually system does this)
-- For now sticking to insert/delete as requested.
