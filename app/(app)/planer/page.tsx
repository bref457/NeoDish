import { createClient } from '@/lib/supabase/server'
import WeekGrid from '@/components/planer/WeekGrid'

export default async function PlanerPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: recipes } = await supabase
    .from('recipes')
    .select('*')
    .order('name')

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Wochenplaner</h1>
      <WeekGrid
        initialRecipes={recipes ?? []}
        userId={user!.id}
      />
    </div>
  )
}
