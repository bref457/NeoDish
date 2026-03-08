'use client'

import { useState } from 'react'
import { MealPlan, MealSlotType, Recipe, MEAL_SLOT_LABELS, MEAL_SLOTS, DAY_LABELS } from '@/lib/types'
import { cn } from '@/lib/utils'
import { X, ChefHat, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MobilePlanerViewProps {
  days: { index: number; label: string; date: Date }[]
  mealPlans: (MealPlan & { recipe?: Recipe | null })[]
  recipes: Recipe[]
  weekLabel: string
  loading: boolean
  onAssign: (dayIndex: number, slot: MealSlotType, recipeId: string) => void
  onClear: (mealPlanId: string) => void
  onPrevWeek: () => void
  onNextWeek: () => void
}

export default function MobilePlanerView({
  days,
  mealPlans,
  recipes,
  weekLabel,
  loading,
  onAssign,
  onClear,
  onPrevWeek,
  onNextWeek,
}: MobilePlanerViewProps) {
  const todayIdx = days.findIndex(d => d.date.toDateString() === new Date().toDateString())
  const [selectedDay, setSelectedDay] = useState(todayIdx >= 0 ? todayIdx : 0)
  const [pickerSlot, setPickerSlot] = useState<MealSlotType | null>(null)
  const [search, setSearch] = useState('')

  const day = days[selectedDay]
  const filteredRecipes = recipes.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  function openPicker(slot: MealSlotType) {
    setPickerSlot(prev => prev === slot ? null : slot)
    setSearch('')
  }

  function pickRecipe(recipe: Recipe) {
    if (!pickerSlot) return
    onAssign(day.index, pickerSlot, recipe.id)
    setPickerSlot(null)
    setSearch('')
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={onPrevWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-semibold text-muted-foreground">
          {loading ? 'Laden...' : weekLabel}
        </span>
        <Button variant="outline" size="sm" onClick={onNextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {days.map(({ index, date }) => {
          const isToday = date.toDateString() === new Date().toDateString()
          const isSelected = selectedDay === index
          const hasEntries = MEAL_SLOTS.some(slot =>
            mealPlans.some(mp => mp.day_of_week === index && mp.meal_slot === slot && mp.recipe_id)
          )
          return (
            <button
              key={index}
              onClick={() => { setSelectedDay(index); setPickerSlot(null) }}
              className={cn(
                'flex flex-col items-center gap-0.5 min-w-[52px] py-2.5 px-2 rounded-2xl font-semibold transition-colors shrink-0 relative',
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : isToday
                  ? 'bg-primary/15 text-primary'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <span className="text-xs">{DAY_LABELS[index]}</span>
              <span className="text-base leading-none">{date.getDate()}</span>
              {hasEntries && !isSelected && (
                <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-primary opacity-60" />
              )}
            </button>
          )
        })}
      </div>

      {/* Meal slots for selected day */}
      <div className="space-y-3">
        {MEAL_SLOTS.map(slot => {
          const mealPlan = mealPlans.find(
            mp => mp.day_of_week === day.index && mp.meal_slot === slot
          )
          const recipe = mealPlan?.recipe
          const isOpen = pickerSlot === slot

          return (
            <div key={slot} className="rounded-2xl border bg-card overflow-hidden shadow-sm">
              {/* Slot header */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40">
                <span className="font-semibold text-sm">{MEAL_SLOT_LABELS[slot]}</span>
                {recipe && mealPlan && (
                  <button
                    onClick={() => { onClear(mealPlan.id); setPickerSlot(null) }}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1 -mr-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Slot content — tap to open picker */}
              <button
                onClick={() => openPicker(slot)}
                className="w-full text-left px-4 py-4 active:bg-accent/50 transition-colors"
              >
                {recipe ? (
                  <div>
                    <p className="font-semibold">{recipe.name}</p>
                    {recipe.prep_time_minutes != null && (
                      <p className="text-sm text-muted-foreground mt-0.5">{recipe.prep_time_minutes} min</p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Tippen um Rezept zu wählen…</p>
                )}
              </button>

              {/* Inline recipe picker */}
              {isOpen && (
                <div className="border-t">
                  <div className="p-3">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Rezept suchen…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full text-sm border rounded-xl px-3 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="max-h-52 overflow-y-auto">
                    {filteredRecipes.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                        <ChefHat className="h-6 w-6 opacity-30" />
                        <p className="text-sm">Keine Rezepte gefunden</p>
                      </div>
                    ) : (
                      filteredRecipes.map(r => (
                        <button
                          key={r.id}
                          onClick={() => pickRecipe(r)}
                          className="w-full text-left px-4 py-3.5 hover:bg-accent active:bg-accent transition-colors border-t first:border-0 text-sm font-medium"
                        >
                          {r.name}
                          {r.prep_time_minutes != null && (
                            <span className="text-muted-foreground font-normal ml-2 text-xs">{r.prep_time_minutes} min</span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                  <div className="border-t p-2">
                    <button
                      onClick={() => setPickerSlot(null)}
                      className="w-full text-center text-sm text-muted-foreground py-2 rounded-xl hover:bg-muted transition-colors"
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
