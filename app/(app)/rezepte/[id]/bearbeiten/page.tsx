import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import RecipeForm from '@/components/rezepte/RecipeForm'
import AddToShoppingListButton from '../AddToShoppingListButton'
import { ChevronLeft } from 'lucide-react'

export default async function RezeptBearbeitenPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: recipe } = await supabase
    .from('recipes')
    .select('*, ingredients(*)')
    .eq('id', id)
    .single()

  if (!recipe) notFound()

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link
        href={`/rezepte/${id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ChevronLeft className="h-4 w-4" />
        Zurück
      </Link>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Rezept bearbeiten</h1>
        {recipe.ingredients?.length > 0 && (
          <AddToShoppingListButton ingredients={recipe.ingredients} recipeName={recipe.name} />
        )}
      </div>
      <RecipeForm recipe={recipe} />
    </div>
  )
}
