'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { createClient } from '@/lib/supabase/client'
import { MealPlan, MealSlotType, Recipe, DAY_LABELS } from '@/lib/types'
import DayColumn from './DayColumn'
import RecipeSidebar from './RecipeSidebar'
import MobilePlanerView from './MobilePlanerView'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatWeekStart(date: Date): string {
  return date.toISOString().split('T')[0]
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function formatWeekLabel(monday: Date): string {
  const sunday = addDays(monday, 6)
  const fmt = (d: Date) => `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`
  return `${fmt(monday)} – ${fmt(sunday)}`
}

interface WeekGridProps {
  initialRecipes: Recipe[]
  userId: string
}

export default function WeekGrid({ initialRecipes, userId }: WeekGridProps) {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()))
  const [mealPlans, setMealPlans] = useState<(MealPlan & { recipe?: Recipe | null })[]>([])
  const [recipes] = useState<Recipe[]>(initialRecipes)
  const [activeDragRecipe, setActiveDragRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  )

  const loadMealPlans = useCallback(async () => {
    setLoading(true)
    const weekStartStr = formatWeekStart(weekStart)
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*, recipe:recipes(*)')
      .eq('week_start', weekStartStr)
      .eq('user_id', userId)

    if (error) {
      toast.error('Fehler beim Laden des Wochenplans')
    } else {
      setMealPlans(data ?? [])
    }
    setLoading(false)
  }, [weekStart, userId, supabase])

  useEffect(() => {
    loadMealPlans()
  }, [loadMealPlans])

  // Shared assign logic (used by both DnD and mobile tap)
  async function handleAssign(dayOfWeek: number, mealSlot: MealSlotType, recipeId: string) {
    const recipe = recipes.find(r => r.id === recipeId)
    if (!recipe) return

    const weekStartStr = formatWeekStart(weekStart)
    const existing = mealPlans.find(
      mp => mp.day_of_week === dayOfWeek && mp.meal_slot === mealSlot && mp.week_start === weekStartStr
    )

    if (existing?.recipe_id === recipeId) return

    try {
      if (existing) {
        const { error } = await supabase
          .from('meal_plans')
          .update({ recipe_id: recipeId })
          .eq('id', existing.id)
        if (error) throw error
        setMealPlans(prev =>
          prev.map(mp => mp.id === existing.id ? { ...mp, recipe_id: recipeId, recipe } : mp)
        )
      } else {
        const { data, error } = await supabase
          .from('meal_plans')
          .insert({ user_id: userId, week_start: weekStartStr, day_of_week: dayOfWeek, meal_slot: mealSlot, recipe_id: recipeId })
          .select('*, recipe:recipes(*)')
          .single()
        if (error) throw error
        setMealPlans(prev => [...prev, data])
      }
    } catch {
      toast.error('Fehler beim Speichern')
      loadMealPlans()
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const recipe = event.active.data.current?.recipe as Recipe
    setActiveDragRecipe(recipe ?? null)
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveDragRecipe(null)
    const { active, over } = event
    if (!over) return
    const recipe = active.data.current?.recipe as Recipe
    if (!recipe) return
    const [dayStr, slot] = (over.id as string).split('-')
    await handleAssign(parseInt(dayStr), slot as MealSlotType, recipe.id)
  }

  async function handleClear(mealPlanId: string) {
    try {
      const { error } = await supabase.from('meal_plans').delete().eq('id', mealPlanId)
      if (error) throw error
      setMealPlans(prev => prev.filter(mp => mp.id !== mealPlanId))
    } catch {
      toast.error('Fehler beim Leeren des Slots')
    }
  }

  const days = Array.from({ length: 7 }, (_, i) => ({
    index: i,
    label: DAY_LABELS[i],
    date: addDays(weekStart, i),
  }))

  const weekLabel = formatWeekLabel(weekStart)

  return (
    <>
      {/* Mobile view (< md) */}
      <div className="md:hidden">
        <MobilePlanerView
          days={days}
          mealPlans={mealPlans}
          recipes={recipes}
          weekLabel={weekLabel}
          loading={loading}
          onAssign={handleAssign}
          onClear={handleClear}
          onPrevWeek={() => setWeekStart(w => addDays(w, -7))}
          onNextWeek={() => setWeekStart(w => addDays(w, 7))}
        />
      </div>

      {/* Desktop view (>= md) */}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="hidden md:flex gap-4 h-full">
          <RecipeSidebar recipes={recipes} />

          <div className="flex-1 min-w-0 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setWeekStart(w => addDays(w, -7))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium text-center">
                {loading ? <span className="text-muted-foreground">Laden...</span> : weekLabel}
              </div>
              <Button variant="outline" size="sm" onClick={() => setWeekStart(w => addDays(w, 7))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map(({ index, label, date }) => (
                <DayColumn
                  key={index}
                  dayIndex={index}
                  dayLabel={label}
                  date={date}
                  mealPlans={mealPlans}
                  onClear={handleClear}
                />
              ))}
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeDragRecipe && (
            <div className="bg-background border-2 border-primary rounded-md px-3 py-2 shadow-lg text-sm font-medium pointer-events-none">
              {activeDragRecipe.name}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </>
  )
}
