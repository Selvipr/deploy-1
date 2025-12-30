-- Create system_settings table to store global configs like exchange rates
create table if not exists public.system_settings (
  key text primary key,
  value text not null,
  description text
);

-- Insert default RUB rate (example 1 USD = 90 RUB)
insert into public.system_settings (key, value, description)
values ('rub_rate', '90', 'Exchange rate: 1 USD = X RUB')
on conflict (key) do nothing;

-- Enable RLS
alter table public.system_settings enable row level security;

-- Policy: Everyone can read settings (needed for frontend pricing)
create policy "Everyone can view settings" on public.system_settings
  for select using (true);

-- Policy: Only admins can update settings
create policy "Admins can update settings" on public.system_settings
  for update using (
    exists (
      select 1 from public.users 
      where users.id = auth.uid() 
      and users.role = 'admin'
    )
  );

-- Policy: Only admins can insert settings (setup)
create policy "Admins can insert settings" on public.system_settings
  for insert with check (
    exists (
      select 1 from public.users 
      where users.id = auth.uid() 
      and users.role = 'admin'
    )
  );
