'use client'

import Link from 'next/link'
import { Recipe } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Users, Trash2, Pencil } from 'lucide-react'

interface RecipeCardProps {
  recipe: Recipe
  onDelete?: (id: string) => void
}

export default function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">
            <Link href={`/rezepte/${recipe.id}`} className="hover:text-primary">
              {recipe.name}
            </Link>
          </CardTitle>
          <div className="flex gap-1 shrink-0">
            <Link
              href={`/rezepte/${recipe.id}/bearbeiten`}
              className="inline-flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Bearbeiten"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(recipe.id)}
                title="Löschen"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {recipe.description && (
          <p className="text-base text-muted-foreground line-clamp-2">{recipe.description}</p>
        )}
        <div className="flex gap-2 flex-wrap">
          {recipe.prep_time_minutes != null && (
            <Badge variant="secondary" className="gap-1.5 text-sm py-1">
              <Clock className="h-4 w-4" />
              {recipe.prep_time_minutes} min
            </Badge>
          )}
          {recipe.servings != null && (
            <Badge variant="secondary" className="gap-1.5 text-sm py-1">
              <Users className="h-4 w-4" />
              {recipe.servings} Port.
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
