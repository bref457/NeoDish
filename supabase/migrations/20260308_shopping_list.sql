create table if not exists shopping_list_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  quantity numeric,
  unit text,
  checked boolean default false not null,
  created_at timestamptz default now() not null
);

alter table shopping_list_items enable row level security;

create policy "Users manage own shopping list"
  on shopping_list_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
