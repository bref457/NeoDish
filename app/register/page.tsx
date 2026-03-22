'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChefHat } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    fetch('/api/welcome-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).catch(() => {})
    setTimeout(() => router.push('/login'), 3000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md px-6">
          {/* Logo */}
          <div className="flex items-center gap-2 justify-center mb-8">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <ChefHat className="h-6 w-6" />
            </div>
            <span className="text-xl font-semibold">NeoDish</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold">Konto erstellen</h2>
            <p className="text-muted-foreground mt-1">Kostenlos registrieren und loslegen</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-700 bg-green-50 dark:bg-green-950/30 dark:text-green-400 p-3 rounded-lg">
                Registrierung erfolgreich! Bitte bestätige deine E-Mail-Adresse. Du wirst weitergeleitet...
              </p>
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

            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mindestens 6 Zeichen"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading || success}>
              {loading ? 'Registrieren...' : 'Konto erstellen'}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Bereits ein Konto?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Anmelden
            </Link>
          </p>
        </div>
    </div>
  )
}
