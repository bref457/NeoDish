'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function DeleteRecipeButton({ id }: { id: string }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    if (!confirm('Rezept wirklich löschen?')) return

    const { error } = await supabase.from('recipes').delete().eq('id', id)
    if (error) {
      toast.error('Fehler beim Löschen')
    } else {
      toast.success('Rezept gelöscht')
      router.push('/rezepte')
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      className="gap-1.5 text-destructive hover:text-destructive"
    >
      <Trash2 className="h-4 w-4" />
      Löschen
    </Button>
  )
}
