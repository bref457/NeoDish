export type Recipe = {
  id: string
  user_id: string
  name: string
  description: string | null
  image_url: string | null
  prep_time_minutes: number | null
  servings: number | null
  created_at: string
  ingredients?: Ingredient[]
}

export type Ingredient = {
  id: string
  recipe_id: string
  name: string
  quantity: number | null
  unit: string | null
}

export type MealPlan = {
  id: string
  user_id: string
  week_start: string
  day_of_week: number
  meal_slot: MealSlotType
  recipe_id: string | null
  created_at: string
  recipe?: Recipe | null
}

export type MealSlotType = 'fruehstueck' | 'mittagessen' | 'abendessen'

export const MEAL_SLOT_LABELS: Record<MealSlotType, string> = {
  fruehstueck: 'Frühstück',
  mittagessen: 'Mittagessen',
  abendessen: 'Abendessen',
}

export const DAY_LABELS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
export const DAY_LABELS_FULL = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']
export const MEAL_SLOTS: MealSlotType[] = ['fruehstueck', 'mittagessen', 'abendessen']
