'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ChevronLeft, ChevronRight, Copy, Printer, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'

function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function formatWeekStart(date: Date): string {
  return date.toISOString().split('T')[0]
}

function formatWeekLabel(monday: Date): string {
  const sunday = addDays(monday, 6)
  const fmt = (d: Date) => `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`
  return `${fmt(monday)} – ${fmt(sunday)}`
}

type AggregatedIngredient = {
  name: string
  quantity: number | null
  unit: string | null
  key: string
}

export default function EinkaufslistePage() {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()))
  const [ingredients, setIngredients] = useState<AggregatedIngredient[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const loadIngredients = useCallback(async () => {
    setLoading(true)
    const weekStartStr = formatWeekStart(weekStart)

    const { data: mealPlans, error } = await supabase
      .from('meal_plans')
      .select('recipe_id')
      .eq('week_start', weekStartStr)
      .not('recipe_id', 'is', null)

    if (error) {
      toast.error('Fehler beim Laden')
      setLoading(false)
      return
    }

    const recipeIds = [...new Set(mealPlans?.map((mp) => mp.recipe_id).filter(Boolean))]

    if (recipeIds.length === 0) {
      setIngredients([])
      setLoading(false)
      return
    }

    const { data: ings, error: ingError } = await supabase
      .from('ingredients')
      .select('name, quantity, unit')
      .in('recipe_id', recipeIds)

    if (ingError) {
      toast.error('Fehler beim Laden der Zutaten')
      setLoading(false)
      return
    }

    // Aggregate: same name + same unit → sum quantities
    const map = new Map<string, AggregatedIngredient>()
    for (const ing of ings ?? []) {
      const key = `${ing.name.toLowerCase()}__${(ing.unit ?? '').toLowerCase()}`
      const existing = map.get(key)
      if (existing) {
        existing.quantity =
          existing.quantity != null && ing.quantity != null
            ? existing.quantity + ing.quantity
            : existing.quantity ?? ing.quantity
      } else {
        map.set(key, {
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          key,
        })
      }
    }

    setIngredients([...map.values()].sort((a, b) => a.name.localeCompare(b.name)))
    setLoading(false)
  }, [weekStart, supabase])

  useEffect(() => {
    loadIngredients()
  }, [loadIngredients])

  function formatIngredient(ing: AggregatedIngredient): string {
    const qty = ing.quantity != null ? ing.quantity : ''
    const unit = ing.unit ?? ''
    const amount = [qty, unit].filter(Boolean).join(' ')
    return amount ? `${amount} ${ing.name}` : ing.name
  }

  function handleCopy() {
    const text = ingredients.map(formatIngredient).join('\n')
    navigator.clipboard.writeText(text)
    toast.success('In Zwischenablage kopiert')
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Einkaufsliste</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
            <Copy className="h-4 w-4" />
            Kopieren
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
            <Printer className="h-4 w-4" />
            Drucken
          </Button>
        </div>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setWeekStart((w) => addDays(w, -7))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">{formatWeekLabel(weekStart)}</div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setWeekStart((w) => addDays(w, 7))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="mb-4" />

      {loading ? (
        <div className="text-center text-muted-foreground py-12">Laden...</div>
      ) : ingredients.length === 0 ? (
        <div className="text-center text-muted-foreground py-12 flex flex-col items-center gap-2">
          <ShoppingCart className="h-8 w-8 opacity-30" />
          <p>Keine Rezepte für diese Woche geplant.</p>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">
              {ingredients.length} Zutat{ingredients.length !== 1 ? 'en' : ''}
            </span>
          </div>
          {ingredients.map((ing) => (
            <div
              key={ing.key}
              className="flex items-center gap-3 py-2 border-b border-dashed border-muted last:border-0"
            >
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 print:hidden" />
              <span className="flex-1 text-sm">{ing.name}</span>
              {(ing.quantity != null || ing.unit) && (
                <Badge variant="outline" className="text-xs shrink-0">
                  {ing.quantity != null ? ing.quantity : ''} {ing.unit ?? ''}
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
