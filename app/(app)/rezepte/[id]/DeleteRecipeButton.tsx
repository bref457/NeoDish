'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/ui/confirm-dialog'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function DeleteRecipeButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    setLoading(true)
    const { error } = await supabase.from('recipes').delete().eq('id', id)
    if (error) {
      toast.error('Fehler beim Löschen')
    } else {
      toast.success('Rezept gelöscht')
      router.push('/rezepte')
    }
    setLoading(false)
    setOpen(false)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5 text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
        Löschen
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Rezept löschen?"
        description="Das Rezept wird unwiderruflich gelöscht."
        confirmLabel="Löschen"
        onConfirm={handleDelete}
        loading={loading}
      />
    </>
  )
}
