'use client'

import Link from 'next/link'
import { Recipe } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Users, Trash2 } from 'lucide-react'

interface RecipeCardProps {
  recipe: Recipe
  onDelete?: (id: string) => void
}

export default function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">
            <Link href={`/rezepte/${recipe.id}`} className="hover:text-primary">
              {recipe.name}
            </Link>
          </CardTitle>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(recipe.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {recipe.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
        )}
        <div className="flex gap-2 flex-wrap">
          {recipe.prep_time_minutes != null && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <Clock className="h-3 w-3" />
              {recipe.prep_time_minutes} min
            </Badge>
          )}
          {recipe.servings != null && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <Users className="h-3 w-3" />
              {recipe.servings} Port.
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
