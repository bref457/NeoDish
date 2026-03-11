'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChefHat, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <ChefHat className="h-6 w-6" />
          </div>
          <span className="text-xl font-semibold">Dishboard</span>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center mx-auto text-2xl">
              ✉️
            </div>
            <h2 className="text-2xl font-bold">E-Mail versendet</h2>
            <p className="text-muted-foreground">
              Wir haben eine E-Mail an <strong>{email}</strong> geschickt. Klicke auf den Link um dein Passwort zurückzusetzen.
            </p>
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-primary hover:underline mt-4">
              <ArrowLeft className="h-4 w-4" />
              Zurück zum Login
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Passwort vergessen</h2>
              <p className="text-muted-foreground mt-1">
                Gib deine E-Mail ein – wir schicken dir einen Reset-Link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="du@beispiel.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Senden...' : 'Reset-Link senden'}
              </Button>
            </form>

            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück zum Login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
