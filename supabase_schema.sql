-- RLS is enabled by default on auth.users, so we don't need to alter it.
-- alter table auth.users enable row level security;

-- Create public users table to extend auth.users
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  phone text, -- Added phone number
  full_name text, -- Added full name caching
  role text check (role in ('buyer', 'seller', 'admin')) default 'buyer',
  wallet_balance numeric default 0,
  kyc_status text default 'none',
  created_at timestamptz default now()
);

alter table public.users enable row level security;

create policy "Users can view their own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.users
  for update using (auth.uid() = id);

-- Trigger to create public user on auth signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, phone, full_name)
  values (
    new.id, 
    new.email,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Products Table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price numeric not null,
  type text check (type in ('serial_key', 'file', 'direct_api')) not null,
  input_schema jsonb, -- For dynamic forms
  supplier_config jsonb, -- For API integration details (admin only)
  seller_id uuid references public.users(id),
  created_at timestamptz default now()
);

alter table public.products enable row level security;

create policy "Anyone can view products" on public.products
  for select using (true);

create policy "Sellers can create products" on public.products
  for insert with check (
    auth.uid() in (select id from public.users where role = 'seller' or role = 'admin')
  );

-- Inventory Table
create table public.inventory (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) not null,
  secret_data text not null, -- Should be encrypted ideally
  status text check (status in ('available', 'locked', 'sold')) default 'available',
  created_at timestamptz default now()
);

alter table public.inventory enable row level security;

create policy "Sellers can view their own inventory" on public.inventory
  for select using (
    auth.uid() in (select seller_id from public.products where id = inventory.product_id)
  );

-- Orders Table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  buyer_id uuid references public.users(id) not null,
  total numeric not null,
  status text check (status in ('pending', 'escrow', 'complete', 'disputed', 'refunded')) default 'pending',
  escrow_release_at timestamptz,
  created_at timestamptz default now()
);

alter table public.orders enable row level security;

create policy "Users can view their own orders" on public.orders
  for select using (auth.uid() = buyer_id);

-- Disputes Table
create table public.disputes (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) not null,
  chat_log jsonb default '[]',
  status text default 'open',
  created_at timestamptz default now()
);

alter table public.disputes enable row level security;

create policy "Participants can view disputes" on public.disputes
  for select using (
    auth.uid() in (
      select buyer_id from public.orders where id = disputes.order_id
    )
    -- OR seller logic needed here for complex query
  );
