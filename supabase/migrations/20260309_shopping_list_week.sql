alter table shopping_list_items
  add column if not exists week_start date,
  add column if not exists recipe_name text;
