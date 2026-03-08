-- Essenswochenplaner Schema
-- Run this in your Supabase SQL editor

-- recipes
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  description text,
  image_url text,
  prep_time_minutes int,
  servings int,
  created_at timestamptz DEFAULT now()
);

-- ingredients
CREATE TABLE IF NOT EXISTS ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  quantity numeric,
  unit text
);

-- meal_plans
CREATE TABLE IF NOT EXISTS meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  week_start date NOT NULL,
  day_of_week int NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  meal_slot text NOT NULL CHECK (meal_slot IN ('fruehstueck', 'mittagessen', 'abendessen')),
  recipe_id uuid REFERENCES recipes(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, week_start, day_of_week, meal_slot)
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

-- recipes: own rows only
CREATE POLICY "recipes_select" ON recipes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "recipes_insert" ON recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "recipes_update" ON recipes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "recipes_delete" ON recipes FOR DELETE USING (auth.uid() = user_id);

-- ingredients: via recipe ownership
CREATE POLICY "ingredients_select" ON ingredients FOR SELECT
  USING (EXISTS (SELECT 1 FROM recipes WHERE recipes.id = ingredients.recipe_id AND recipes.user_id = auth.uid()));

CREATE POLICY "ingredients_insert" ON ingredients FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM recipes WHERE recipes.id = ingredients.recipe_id AND recipes.user_id = auth.uid()));

CREATE POLICY "ingredients_update" ON ingredients FOR UPDATE
  USING (EXISTS (SELECT 1 FROM recipes WHERE recipes.id = ingredients.recipe_id AND recipes.user_id = auth.uid()));

CREATE POLICY "ingredients_delete" ON ingredients FOR DELETE
  USING (EXISTS (SELECT 1 FROM recipes WHERE recipes.id = ingredients.recipe_id AND recipes.user_id = auth.uid()));

-- meal_plans: own rows only
CREATE POLICY "meal_plans_select" ON meal_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "meal_plans_insert" ON meal_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "meal_plans_update" ON meal_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "meal_plans_delete" ON meal_plans FOR DELETE USING (auth.uid() = user_id);
