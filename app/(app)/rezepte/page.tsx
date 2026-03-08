'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Recipe } from '@/lib/types'
import RecipeCard from '@/components/rezepte/RecipeCard'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import { toast } from 'sonner'

export default function RezeptePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadRecipes()
  }, [])

  async function loadRecipes() {
    setLoading(true)
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('name')

    if (error) {
      toast.error('Fehler beim Laden')
    } else {
      setRecipes(data ?? [])
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Rezept wirklich löschen?')) return

    const { error } = await supabase.from('recipes').delete().eq('id', id)
    if (error) {
      toast.error('Fehler beim Löschen')
    } else {
      setRecipes((prev) => prev.filter((r) => r.id !== id))
      toast.success('Rezept gelöscht')
    }
  }

  const filtered = recipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4 gap-4">
        <h1 className="text-xl font-bold shrink-0">Rezeptbuch</h1>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rezepte suchen..."
            className="pl-8"
          />
        </div>
        <Link
          href="/rezepte/neu"
          className="inline-flex items-center gap-1.5 h-7 px-2.5 text-[0.8rem] font-medium rounded-[min(var(--radius-md),12px)] bg-primary text-primary-foreground hover:bg-primary/80 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          Neues Rezept
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground py-12">Laden...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          {search ? 'Keine Rezepte gefunden.' : 'Noch keine Rezepte. Erstelle dein erstes!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
