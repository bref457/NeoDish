'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Recipe, Ingredient } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import IngredientList, { IngredientInput } from './IngredientList'
import { toast } from 'sonner'

interface RecipeFormProps {
  recipe?: Recipe & { ingredients?: Ingredient[] }
}

export default function RecipeForm({ recipe }: RecipeFormProps) {
  const [name, setName] = useState(recipe?.name ?? '')
  const [description, setDescription] = useState(recipe?.description ?? '')
  const [prepTime, setPrepTime] = useState(recipe?.prep_time_minutes?.toString() ?? '')
  const [servings, setServings] = useState(recipe?.servings?.toString() ?? '')
  const [imageUrl, setImageUrl] = useState(recipe?.image_url ?? '')
  const [ingredients, setIngredients] = useState<IngredientInput[]>(
    recipe?.ingredients?.map((i) => ({
      name: i.name,
      quantity: i.quantity?.toString() ?? '',
      unit: i.unit ?? '',
    })) ?? []
  )
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Nicht angemeldet')

      if (recipe) {
        // Update
        const { error: recipeError } = await supabase
          .from('recipes')
          .update({
            name: name.trim(),
            description: description.trim() || null,
            prep_time_minutes: prepTime ? parseInt(prepTime) : null,
            servings: servings ? parseInt(servings) : null,
            image_url: imageUrl.trim() || null,
          })
          .eq('id', recipe.id)

        if (recipeError) throw recipeError

        // Replace ingredients
        await supabase.from('ingredients').delete().eq('recipe_id', recipe.id)
      } else {
        // Insert
        const { data: newRecipe, error: recipeError } = await supabase
          .from('recipes')
          .insert({
            user_id: user.id,
            name: name.trim(),
            description: description.trim() || null,
            prep_time_minutes: prepTime ? parseInt(prepTime) : null,
            servings: servings ? parseInt(servings) : null,
            image_url: imageUrl.trim() || null,
          })
          .select()
          .single()

        if (recipeError) throw recipeError

        const recipeId = newRecipe.id
        const validIngredients = ingredients.filter((i) => i.name.trim())
        if (validIngredients.length > 0) {
          const { error: ingError } = await supabase.from('ingredients').insert(
            validIngredients.map((i) => ({
              recipe_id: recipeId,
              name: i.name.trim(),
              quantity: i.quantity ? parseFloat(i.quantity) : null,
              unit: i.unit.trim() || null,
            }))
          )
          if (ingError) throw ingError
        }

        toast.success('Rezept gespeichert')
        router.push(`/rezepte/${recipeId}`)
        return
      }

      // Insert new ingredients for update case
      const validIngredients = ingredients.filter((i) => i.name.trim())
      if (validIngredients.length > 0) {
        const { error: ingError } = await supabase.from('ingredients').insert(
          validIngredients.map((i) => ({
            recipe_id: recipe!.id,
            name: i.name.trim(),
            quantity: i.quantity ? parseFloat(i.quantity) : null,
            unit: i.unit.trim() || null,
          }))
        )
        if (ingError) throw ingError
      }

      toast.success('Rezept aktualisiert')
      router.push(`/rezepte/${recipe!.id}`)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Fehler beim Speichern')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Spaghetti Bolognese"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kurze Beschreibung des Rezepts..."
              disabled={loading}
              rows={3}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prepTime">Zubereitungszeit (Minuten)</Label>
              <Input
                id="prepTime"
                type="number"
                min="0"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                placeholder="30"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servings">Portionen</Label>
              <Input
                id="servings"
                type="number"
                min="1"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                placeholder="4"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Foto-URL (optional)</Label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              disabled={loading}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Zutaten</Label>
            <IngredientList
              ingredients={ingredients}
              onChange={setIngredients}
              disabled={loading}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Speichern...' : recipe ? 'Aktualisieren' : 'Rezept erstellen'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Abbrechen
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
