'use client'

import { useDroppable } from '@dnd-kit/core'
import { MealPlan, MealSlotType, Recipe } from '@/lib/types'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface MealSlotProps {
  dayIndex: number
  slot: MealSlotType
  mealPlan?: MealPlan & { recipe?: Recipe | null }
  onClear?: (mealPlanId: string) => void
}

export default function MealSlot({ dayIndex, slot, mealPlan, onClear }: MealSlotProps) {
  const droppableId = `${dayIndex}-${slot}`
  const { isOver, setNodeRef } = useDroppable({ id: droppableId })

  const recipe = mealPlan?.recipe

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-h-[90px] rounded-lg border-2 border-dashed p-2.5 transition-colors relative text-sm',
        isOver
          ? 'border-primary bg-primary/10'
          : recipe
            ? 'border-transparent bg-primary/5'
            : 'border-muted-foreground/20 hover:border-muted-foreground/40'
      )}
    >
      {recipe ? (
        <div className="flex items-start justify-between gap-1">
          <span className="font-medium text-foreground leading-tight line-clamp-2 flex-1">
            {recipe.name}
          </span>
          {onClear && mealPlan && (
            <button
              onClick={() => onClear(mealPlan.id)}
              className="shrink-0 text-muted-foreground hover:text-destructive transition-colors mt-0.5"
              title="Slot leeren"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      ) : (
        <span className="text-muted-foreground/40 text-xs">Rezept hierher ziehen</span>
      )}
    </div>
  )
}
