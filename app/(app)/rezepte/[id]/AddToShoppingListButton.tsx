'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ShoppingCart, Check } from 'lucide-react'
import { toast } from 'sonner'

type Ingredient = {
  id: string
  name: string
  quantity: number | null
  unit: string | null
}

function getMonday(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d.toISOString().split('T')[0]
}

export default function AddToShoppingListButton({
  ingredients,
  recipeName,
}: {
  ingredients: Ingredient[]
  recipeName: string
}) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const supabase = createClient()

  async function handleAdd() {
    if (ingredients.length === 0) return
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error('Nicht angemeldet'); setLoading(false); return }

    const weekStart = getMonday(new Date())

    const rows = ingredients.map(ing => ({
      user_id: user.id,
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit,
      checked: false,
      week_start: weekStart,
      recipe_name: recipeName,
    }))

    const { error } = await supabase.from('shopping_list_items').insert(rows)

    if (error) {
      toast.error('Fehler beim Hinzufügen')
    } else {
      toast.success(`${ingredients.length} Zutaten zur Einkaufsliste hinzugefügt`)
      setDone(true)
      setTimeout(() => setDone(false), 3000)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleAdd}
      disabled={loading || ingredients.length === 0}
      className="inline-flex items-center gap-1.5 h-7 px-2.5 text-[0.8rem] font-medium rounded-[min(var(--radius-md),12px)] border border-border bg-background hover:bg-muted transition-colors disabled:opacity-50"
    >
      {done ? (
        <Check className="h-3.5 w-3.5 text-primary" />
      ) : (
        <ShoppingCart className="h-3.5 w-3.5" />
      )}
      {done ? 'Hinzugefügt' : 'Zur Einkaufsliste'}
    </button>
  )
}
