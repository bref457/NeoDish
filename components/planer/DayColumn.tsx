import { MealPlan, MealSlotType, MEAL_SLOT_LABELS, MEAL_SLOTS, Recipe } from '@/lib/types'
import MealSlot from './MealSlot'

interface DayColumnProps {
  dayIndex: number
  dayLabel: string
  date: Date
  mealPlans: (MealPlan & { recipe?: Recipe | null })[]
  onClear: (mealPlanId: string) => void
}

export default function DayColumn({
  dayIndex,
  dayLabel,
  date,
  mealPlans,
  onClear,
}: DayColumnProps) {
  const isToday =
    date.toDateString() === new Date().toDateString()

  return (
    <div className="min-w-0">
      <div
        className={`text-center py-2 mb-3 rounded-lg text-sm font-semibold ${
          isToday ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}
      >
        <div>{dayLabel}</div>
        <div className="text-xs font-normal opacity-80">
          {date.getDate()}.{date.getMonth() + 1}.
        </div>
      </div>
      <div className="space-y-2">
        {MEAL_SLOTS.map((slot: MealSlotType) => (
          <div key={slot}>
            <div className="text-xs font-medium text-muted-foreground mb-1 px-0.5">
              {MEAL_SLOT_LABELS[slot]}
            </div>
            <MealSlot
              dayIndex={dayIndex}
              slot={slot}
              mealPlan={mealPlans.find(
                (mp) => mp.day_of_week === dayIndex && mp.meal_slot === slot
              )}
              onClear={onClear}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
