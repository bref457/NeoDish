'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChefHat, CalendarDays, BookOpen, ShoppingCart } from 'lucide-react'

const features = [
  { icon: CalendarDays, text: 'Wochenplanung auf einen Blick' },
  { icon: BookOpen, text: 'Rezeptsammlung verwalten' },
  { icon: ShoppingCart, text: 'Automatische Einkaufsliste' },
]

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
    setTimeout(() => router.push('/login'), 3000)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="flex items-center gap-3 relative">
          <div className="p-2.5 rounded-xl bg-white/20">
            <ChefHat className="h-6 w-6" />
          </div>
          <span className="text-xl font-semibold tracking-tight">Dishboard</span>
        </div>

        <div className="relative space-y-8">
          <div>
            <h1 className="text-4xl font-bold leading-tight mb-3">
              Starte deinen persönlichen Essenswochenplaner
            </h1>
            <p className="text-primary-foreground/70 text-lg leading-relaxed">
              Erstelle dein Konto und fang sofort an, deine Woche zu planen.
            </p>
          </div>

          <div className="space-y-3">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/15 shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-primary-foreground/85 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-primary-foreground/40 text-xs relative">
          © {new Date().getFullYear()} Dishboard
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <ChefHat className="h-6 w-6" />
            </div>
            <span className="text-xl font-semibold">Dishboard</span>
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
    </div>
  )
}
