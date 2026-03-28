'use client'

import { useState } from 'react'
import { MessageSquarePlus, X, Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, name, email }),
      })
      if (!res.ok) throw new Error()
      toast.success('Danke für dein Feedback!')
      setContent('')
      setName('')
      setEmail('')
      setOpen(false)
    } catch {
      toast.error('Fehler beim Senden. Bitte nochmal versuchen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 bg-orange-600 text-white rounded-full pl-4 pr-3 py-3 shadow-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
        title="Feedback geben"
      >
        <span className="text-sm font-medium whitespace-nowrap">Dein Feedback zählt!</span>
        <MessageSquarePlus className="h-5 w-5 flex-shrink-0" />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Feedback geben</h2>
              <button onClick={() => setOpen(false)} className="p-1 rounded-md hover:bg-accent transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="fb-name">Name *</Label>
                <Input
                  id="fb-name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Dein Name"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fb-email">E-Mail *</Label>
                <Input
                  id="fb-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@beispiel.ch"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fb-content">Feedback *</Label>
                <Textarea
                  id="fb-content"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Was läuft gut? Was kann besser werden?"
                  rows={4}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !content.trim()}
                className="w-full bg-orange-600 text-white hover:bg-orange-700"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                {loading ? 'Wird gesendet…' : 'Feedback senden'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
