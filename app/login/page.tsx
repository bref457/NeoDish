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

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/planer')
    router.refresh()
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
            <span className="text-xl font-semibold">Dishboard</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold">Willkommen zurück</h2>
            <p className="text-muted-foreground mt-1">Melde dich an um weiterzumachen</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Passwort</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Passwort vergessen?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Anmelden...' : 'Anmelden'}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Noch kein Konto?{' '}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Registrieren
            </Link>
          </p>
        </div>
    </div>
  )
}
