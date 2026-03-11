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
              Dein persönlicher Essenswochenplaner
            </h1>
            <p className="text-primary-foreground/70 text-lg leading-relaxed">
              Plane deine Mahlzeiten, entdecke neue Rezepte und vergiss nie wieder was auf der Einkaufsliste.
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
    </div>
  )
}
