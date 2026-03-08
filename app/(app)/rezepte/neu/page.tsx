import RecipeForm from '@/components/rezepte/RecipeForm'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function NeuesRezeptPage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link
        href="/rezepte"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ChevronLeft className="h-4 w-4" />
        Zurück
      </Link>
      <h1 className="text-xl font-bold mb-4">Neues Rezept</h1>
      <RecipeForm />
    </div>
  )
}
