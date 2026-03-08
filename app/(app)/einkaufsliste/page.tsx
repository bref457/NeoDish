'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Trash2, CheckCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

type ShoppingItem = {
  id: string
  name: string
  quantity: number | null
  unit: string | null
  checked: boolean
  recipe_name: string | null
  week_start: string | null
}

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
  const fmt = (d: Date) => `${d.getDate()}.${d.getMonth() + 1}.`
  return `${fmt(monday)} – ${fmt(sunday)}${sunday.getFullYear()}`
}

// Group recipe names for a list of items
function groupByRecipe(items: ShoppingItem[]): Map<string, ShoppingItem[]> {
  const map = new Map<string, ShoppingItem[]>()
  for (const item of items) {
    const key = item.recipe_name ?? '—'
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(item)
  }
  return map
}

const RECIPE_COLORS = [
  'bg-terra/15 text-terra border-terra/30',
  'bg-olive/15 text-olive border-olive/30',
  'bg-aubergine/15 text-aubergine border-aubergine/30',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-sky-100 text-sky-700 border-sky-200',
]

export default function EinkaufslistePage() {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()))
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const weekStartStr = formatWeekStart(weekStart)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('shopping_list_items')
      .select('id, name, quantity, unit, checked, recipe_name, week_start')
      .eq('week_start', weekStartStr)
      .order('recipe_name')
      .order('checked')
      .order('created_at')

    if (error) toast.error('Fehler beim Laden')
    else setItems(data ?? [])
    setLoading(false)
  }, [weekStartStr, supabase])

  useEffect(() => { load() }, [load])

  async function toggleItem(item: ShoppingItem) {
    const { error } = await supabase
      .from('shopping_list_items')
      .update({ checked: !item.checked })
      .eq('id', item.id)
    if (error) { toast.error('Fehler'); return }
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, checked: !i.checked } : i))
  }

  async function deleteItem(id: string) {
    const { error } = await supabase.from('shopping_list_items').delete().eq('id', id)
    if (error) { toast.error('Fehler'); return }
    setItems(prev => prev.filter(i => i.id !== id))
  }

  async function deleteChecked() {
    const ids = items.filter(i => i.checked).map(i => i.id)
    if (ids.length === 0) return
    const { error } = await supabase.from('shopping_list_items').delete().in('id', ids)
    if (error) { toast.error('Fehler'); return }
    setItems(prev => prev.filter(i => !i.checked))
    toast.success('Erledigte gelöscht')
  }

  async function deleteAll() {
    if (!confirm('Alle Artikel dieser Woche löschen?')) return
    const { error } = await supabase.from('shopping_list_items').delete().eq('week_start', weekStartStr)
    if (error) { toast.error('Fehler'); return }
    setItems([])
    toast.success('Liste geleert')
  }

  const unchecked = items.filter(i => !i.checked)
  const checked = items.filter(i => i.checked)

  // Assign stable color per recipe name
  const recipeNames = [...new Set(items.map(i => i.recipe_name ?? '—'))]
  const recipeColor = (name: string | null) =>
    RECIPE_COLORS[recipeNames.indexOf(name ?? '—') % RECIPE_COLORS.length]

  return (
    <div className="max-w-xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Einkaufsliste</h1>
        <div className="flex gap-2">
          {checked.length > 0 && (
            <Button variant="outline" size="sm" onClick={deleteChecked} className="gap-1.5 text-muted-foreground">
              <CheckCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Erledigte löschen</span>
            </Button>
          )}
          {items.length > 0 && (
            <Button variant="outline" size="sm" onClick={deleteAll} className="gap-1.5 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Alle löschen</span>
            </Button>
          )}
        </div>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" onClick={() => setWeekStart(w => addDays(w, -7))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <div className="text-sm font-semibold">{formatWeekLabel(weekStart)}</div>
          {weekStartStr === formatWeekStart(getMonday(new Date())) && (
            <div className="text-xs text-primary font-medium">Diese Woche</div>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => setWeekStart(w => addDays(w, 7))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="mb-4" />

      {loading ? (
        <div className="text-center text-muted-foreground py-12">Laden...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-muted-foreground py-16 flex flex-col items-center gap-3">
          <ShoppingCart className="h-10 w-10 opacity-25" />
          <p className="font-semibold">Keine Artikel für diese Woche</p>
          <p className="text-sm">
            Öffne ein Rezept und tippe auf{' '}
            <span className="font-semibold text-foreground">„Zur Einkaufsliste"</span>
          </p>
        </div>
      ) : (
        <div className="space-y-0.5">
          {unchecked.length > 0 && (
            <p className="text-xs text-muted-foreground mb-3">
              {unchecked.length} Artikel noch zu kaufen
            </p>
          )}

          {unchecked.map(item => (
            <ItemRow
              key={item.id}
              item={item}
              colorClass={recipeColor(item.recipe_name)}
              onToggle={toggleItem}
              onDelete={deleteItem}
            />
          ))}

          {checked.length > 0 && unchecked.length > 0 && <Separator className="my-4" />}

          {checked.length > 0 && (
            <>
              <p className="text-xs text-muted-foreground mb-2 pt-1">{checked.length} erledigt</p>
              {checked.map(item => (
                <ItemRow
                  key={item.id}
                  item={item}
                  colorClass={recipeColor(item.recipe_name)}
                  onToggle={toggleItem}
                  onDelete={deleteItem}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function ItemRow({
  item,
  colorClass,
  onToggle,
  onDelete,
}: {
  item: ShoppingItem
  colorClass: string
  onToggle: (item: ShoppingItem) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-muted/50 last:border-0 group">
      <input
        type="checkbox"
        checked={item.checked}
        onChange={() => onToggle(item)}
        className="h-4 w-4 rounded shrink-0 accent-primary cursor-pointer"
      />
      <div className="flex-1 min-w-0">
        <span className={`text-sm ${item.checked ? 'line-through text-muted-foreground' : 'font-medium'}`}>
          {item.name}
        </span>
        {item.recipe_name && (
          <span className={`ml-2 inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${colorClass} ${item.checked ? 'opacity-40' : ''}`}>
            {item.recipe_name}
          </span>
        )}
      </div>
      {(item.quantity != null || item.unit) && (
        <span className={`text-xs text-muted-foreground shrink-0 tabular-nums ${item.checked ? 'opacity-40' : ''}`}>
          {item.quantity != null ? item.quantity : ''}{item.unit ? ` ${item.unit}` : ''}
        </span>
      )}
      <button
        onClick={() => onDelete(item.id)}
        className="opacity-0 group-hover:opacity-100 md:transition-opacity text-muted-foreground hover:text-destructive ml-1 shrink-0"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
