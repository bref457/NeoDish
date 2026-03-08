import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Clock, Users, ChevronLeft, Pencil } from 'lucide-react'
import DeleteRecipeButton from './DeleteRecipeButton'

export default async function RezeptDetailPage({
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
        href="/rezepte"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ChevronLeft className="h-4 w-4" />
        Zurück
      </Link>

      <div className="flex items-start justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">{recipe.name}</h1>
        <div className="flex gap-2 shrink-0">
          <Link
            href={`/rezepte/${id}/bearbeiten`}
            className="inline-flex items-center gap-1.5 h-7 px-2.5 text-[0.8rem] font-medium rounded-[min(var(--radius-md),12px)] border border-border bg-background hover:bg-muted transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            Bearbeiten
          </Link>
          <DeleteRecipeButton id={id} />
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {recipe.prep_time_minutes != null && (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3.5 w-3.5" />
            {recipe.prep_time_minutes} Minuten
          </Badge>
        )}
        {recipe.servings != null && (
          <Badge variant="secondary" className="gap-1">
            <Users className="h-3.5 w-3.5" />
            {recipe.servings} Portionen
          </Badge>
        )}
      </div>

      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt={recipe.name}
          className="w-full max-h-64 object-cover rounded-lg mb-4"
        />
      )}

      {recipe.description && (
        <>
          <p className="text-muted-foreground mb-4">{recipe.description}</p>
          <Separator className="mb-4" />
        </>
      )}

      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3">Zutaten</h2>
          <ul className="space-y-1">
            {recipe.ingredients.map((ing: { id: string; name: string; quantity: number | null; unit: string | null }) => (
              <li key={ing.id} className="flex gap-2 text-sm">
                <span className="text-muted-foreground w-24 text-right shrink-0">
                  {ing.quantity != null ? ing.quantity : ''}
                  {ing.unit ? ` ${ing.unit}` : ''}
                </span>
                <span>{ing.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
