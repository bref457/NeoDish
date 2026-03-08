'use client'

import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Recipe } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, GripVertical, Clock } from 'lucide-react'

function DraggableRecipe({ recipe }: { recipe: Recipe }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `recipe-${recipe.id}`,
    data: { recipe },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 rounded-md border bg-background hover:bg-accent transition-colors cursor-grab active:cursor-grabbing select-none"
    >
      <div {...listeners} {...attributes} className="text-muted-foreground shrink-0">
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight truncate">{recipe.name}</p>
        {recipe.prep_time_minutes != null && (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
            <Clock className="h-2.5 w-2.5" />
            {recipe.prep_time_minutes} min
          </div>
        )}
      </div>
    </div>
  )
}

interface RecipeSidebarProps {
  recipes: Recipe[]
}

export default function RecipeSidebar({ recipes }: RecipeSidebarProps) {
  const [search, setSearch] = useState('')

  const filtered = recipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-56 shrink-0 flex flex-col gap-3 border rounded-lg p-3 bg-muted/30">
      <div className="font-semibold text-sm">Rezepte</div>
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Suchen..."
          className="pl-7 h-8 text-sm"
        />
      </div>
      <ScrollArea className="flex-1 max-h-[calc(100vh-220px)]">
        <div className="space-y-1.5 pr-1">
          {filtered.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              {search ? 'Keine Treffer' : 'Noch keine Rezepte'}
            </p>
          )}
          {filtered.map((recipe) => (
            <DraggableRecipe key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </ScrollArea>
      <Badge variant="outline" className="text-[10px] justify-center">
        {recipes.length} Rezept{recipes.length !== 1 ? 'e' : ''}
      </Badge>
    </div>
  )
}
