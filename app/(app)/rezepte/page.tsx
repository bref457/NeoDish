'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Recipe } from '@/lib/types'
import RecipeCard from '@/components/rezepte/RecipeCard'
import ConfirmDialog from '@/components/ui/confirm-dialog'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import { toast } from 'sonner'

export default function RezeptePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
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

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    const { error } = await supabase.from('recipes').delete().eq('id', deleteId)
    if (error) {
      toast.error('Fehler beim Löschen')
    } else {
      setRecipes((prev) => prev.filter((r) => r.id !== deleteId))
      toast.success('Rezept gelöscht')
    }
    setDeleting(false)
    setDeleteId(null)
  }

  const filtered = recipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold shrink-0">Rezeptbuch</h1>
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
          className="inline-flex items-center gap-2 h-10 px-4 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors shrink-0"
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
            <RecipeCard key={recipe.id} recipe={recipe} onDelete={setDeleteId} />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Rezept löschen?"
        description="Das Rezept wird unwiderruflich gelöscht."
        confirmLabel="Löschen"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
