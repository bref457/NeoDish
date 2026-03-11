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
    <div className="px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">Wochenplaner</h1>
      <WeekGrid
        initialRecipes={recipes ?? []}
        userId={user!.id}
      />
    </div>
  )
}
