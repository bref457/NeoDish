import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ChefHat, CalendarDays, BookOpen, ShoppingCart, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: CalendarDays,
    title: 'Wochenplanung',
    description: 'Plane alle Mahlzeiten für die ganze Woche auf einen Blick. Morgens, mittags, abends.',
  },
  {
    icon: BookOpen,
    title: 'Rezeptsammlung',
    description: 'Speichere deine Lieblingsrezepte und greife jederzeit darauf zurück.',
  },
  {
    icon: ShoppingCart,
    title: 'Einkaufsliste',
    description: 'Füge Zutaten direkt aus Rezepten zur Einkaufsliste hinzu – kein Vergessen mehr.',
  },
]

const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const mockMeals = [
  ['Porridge', 'Nudeln', 'Salat', 'Rührei', 'Müsli', 'Pancakes', 'Toast'],
  ['—', 'Suppe', 'Sandwich', 'Reste', '—', 'Pasta', 'Salat'],
  ['Pasta', 'Curry', 'Risotto', 'Burger', 'Pizza', 'Steak', 'Suppe'],
]
const mealLabels = ['Frühstück', 'Mittag', 'Abend']

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/planer')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <ChefHat className="h-5 w-5" />
          </div>
          <span className="font-semibold text-lg tracking-tight">Dishboard</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
          >
            Anmelden
          </Link>
          <Link
            href="/register"
            className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Registrieren
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <ChefHat className="h-3.5 w-3.5" />
          Dein persönlicher Essenswochenplaner
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-6 max-w-3xl mx-auto">
          Essen planen,{' '}
          <span className="text-primary">stressfrei</span>{' '}
          kochen
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
          Plane deine Mahlzeiten für die ganze Woche, verwalte deine Rezepte und erstelle automatisch deine Einkaufsliste.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Kostenlos starten
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-xl font-medium hover:bg-muted transition-colors text-sm"
          >
            Bereits ein Konto? Anmelden
          </Link>
        </div>
      </section>

      {/* Mock Preview */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
          {/* Mock header bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
            <div className="w-3 h-3 rounded-full bg-destructive/40" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/40" />
            <div className="w-3 h-3 rounded-full bg-green-400/40" />
            <span className="text-xs text-muted-foreground ml-2 font-mono">essen.neo457.ch/planer</span>
          </div>
          {/* Mock planner grid */}
          <div className="p-4 overflow-x-auto">
            <div className="grid grid-cols-8 gap-1.5 min-w-[600px]">
              {/* Header row */}
              <div className="text-xs text-muted-foreground font-medium p-2" />
              {days.map((day) => (
                <div
                  key={day}
                  className="text-xs font-semibold text-center p-2 rounded-lg bg-primary/10 text-primary"
                >
                  {day}
                </div>
              ))}
              {/* Meal rows */}
              {mealLabels.map((label, rowIdx) => (
                <>
                  <div
                    key={label}
                    className="text-xs text-muted-foreground font-medium p-2 flex items-center"
                  >
                    {label}
                  </div>
                  {mockMeals[rowIdx].map((meal, colIdx) => (
                    <div
                      key={`${rowIdx}-${colIdx}`}
                      className={`text-xs p-2 rounded-lg text-center truncate ${
                        meal === '—'
                          ? 'text-muted-foreground/40 bg-muted/20'
                          : 'bg-primary/5 text-foreground font-medium'
                      }`}
                    >
                      {meal}
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Alles was du brauchst</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div
          className="auth-panel-left rounded-2xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full blur-3xl" style={{ background: 'oklch(0.58 0.13 38 / 0.15)' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl" style={{ background: 'oklch(0.52 0.09 130 / 0.08)' }} />
          </div>
          <h2 className="text-3xl font-bold mb-3 relative">Bereit loszulegen?</h2>
          <p className="mb-8 relative" style={{ color: 'oklch(0.93 0.01 60 / 0.55)' }}>
            Kostenlos registrieren und sofort mit der Wochenplanung starten.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity relative"
            style={{ background: 'oklch(0.78 0.10 38)', color: 'oklch(0.16 0.025 45)' }}
          >
            Jetzt starten
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Dishboard
      </footer>
    </div>
  )
}
