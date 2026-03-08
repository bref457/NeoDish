'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Trash2, CheckCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

type ShoppingItem = {
  id: string
  name: string
  quantity: number | null
  unit: string | null
  checked: boolean
}

export default function EinkaufslistePage() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('shopping_list_items')
      .select('id, name, quantity, unit, checked')
      .order('checked')
      .order('created_at')

    if (error) toast.error('Fehler beim Laden')
    else setItems(data ?? [])
    setLoading(false)
  }, [supabase])

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
    const checkedIds = items.filter(i => i.checked).map(i => i.id)
    if (checkedIds.length === 0) return
    const { error } = await supabase.from('shopping_list_items').delete().in('id', checkedIds)
    if (error) { toast.error('Fehler'); return }
    setItems(prev => prev.filter(i => !i.checked))
    toast.success('Erledigte Artikel gelöscht')
  }

  async function deleteAll() {
    if (!confirm('Gesamte Einkaufsliste löschen?')) return
    const { error } = await supabase.from('shopping_list_items').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (error) { toast.error('Fehler'); return }
    setItems([])
    toast.success('Liste geleert')
  }

  const unchecked = items.filter(i => !i.checked)
  const checked = items.filter(i => i.checked)

  return (
    <div className="max-w-xl mx-auto p-4">
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

      <Separator className="mb-4" />

      {loading ? (
        <div className="text-center text-muted-foreground py-12">Laden...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-muted-foreground py-16 flex flex-col items-center gap-3">
          <ShoppingCart className="h-10 w-10 opacity-25" />
          <p className="font-medium">Einkaufsliste ist leer</p>
          <p className="text-sm">
            Öffne ein Rezept und tippe auf{' '}
            <span className="font-medium text-foreground">„Zur Einkaufsliste"</span>
          </p>
        </div>
      ) : (
        <div className="space-y-0.5">
          {unchecked.length > 0 && (
            <p className="text-xs text-muted-foreground mb-2">
              {unchecked.length} Artikel noch zu kaufen
            </p>
          )}

          {unchecked.map(item => (
            <ItemRow key={item.id} item={item} onToggle={toggleItem} onDelete={deleteItem} />
          ))}

          {checked.length > 0 && unchecked.length > 0 && (
            <Separator className="my-3" />
          )}

          {checked.length > 0 && (
            <>
              <p className="text-xs text-muted-foreground mb-2 pt-1">{checked.length} erledigt</p>
              {checked.map(item => (
                <ItemRow key={item.id} item={item} onToggle={toggleItem} onDelete={deleteItem} />
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
  onToggle,
  onDelete,
}: {
  item: ShoppingItem
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
      <span className={`flex-1 text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
        {item.name}
      </span>
      {(item.quantity != null || item.unit) && (
        <Badge variant="outline" className={`text-xs shrink-0 ${item.checked ? 'opacity-40' : ''}`}>
          {item.quantity != null ? item.quantity : ''}{item.unit ? ` ${item.unit}` : ''}
        </Badge>
      )}
      <button
        onClick={() => onDelete(item.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive ml-1"
        title="Entfernen"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
