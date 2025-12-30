-- Create a function to auto-release orders where escrow time has passed
create or replace function release_escrow_orders()
returns table (
  order_id uuid,
  seller_id uuid,
  amount numeric
) 
language plpgsql
security definer
as $$
declare
  r record;
begin
  -- Loop through all eligible orders
  for r in 
    select o.id, o.total, i.seller_id
    from orders o
    join order_items i on i.order_id = o.id
    where o.status = 'escrow' 
    and o.escrow_release_at < now()
  loop
    -- 1. Update Order Status
    update orders 
    set status = 'completed'
    where id = r.id;

    -- 2. Credit Seller
    update users
    set wallet_balance = coalesce(wallet_balance, 0) + r.total
    where id = r.seller_id;

    -- Return the processed order info
    order_id := r.id;
    seller_id := r.seller_id;
    amount := r.total;
    return next;
  end loop;
end;
$$;
