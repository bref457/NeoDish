'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'

export type IngredientInput = {
  name: string
  quantity: string
  unit: string
}

interface IngredientListProps {
  ingredients: IngredientInput[]
  onChange: (ingredients: IngredientInput[]) => void
  disabled?: boolean
}

export default function IngredientList({ ingredients, onChange, disabled }: IngredientListProps) {
  function add() {
    onChange([...ingredients, { name: '', quantity: '', unit: '' }])
  }

  function remove(index: number) {
    onChange(ingredients.filter((_, i) => i !== index))
  }

  function update(index: number, field: keyof IngredientInput, value: string) {
    const updated = ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    )
    onChange(updated)
  }

  return (
    <div className="space-y-2">
      {ingredients.map((ing, i) => (
        <div key={i} className="flex gap-2 items-center">
          <Input
            placeholder="Zutat"
            value={ing.name}
            onChange={(e) => update(i, 'name', e.target.value)}
            disabled={disabled}
            className="flex-1"
          />
          <Input
            placeholder="Menge"
            value={ing.quantity}
            onChange={(e) => update(i, 'quantity', e.target.value)}
            disabled={disabled}
            className="w-20"
            type="number"
            min="0"
            step="any"
          />
          <Input
            placeholder="Einheit"
            value={ing.unit}
            onChange={(e) => update(i, 'unit', e.target.value)}
            disabled={disabled}
            className="w-24"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(i)}
            disabled={disabled}
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={add}
        disabled={disabled}
        className="gap-1.5"
      >
        <Plus className="h-4 w-4" />
        Zutat hinzufügen
      </Button>
    </div>
  )
}
