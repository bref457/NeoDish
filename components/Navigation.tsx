'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { CalendarDays, BookOpen, ShoppingCart, LogOut, ChefHat, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/planer', label: 'Planer', icon: CalendarDays },
  { href: '/rezepte', label: 'Rezepte', icon: BookOpen },
  { href: '/einkaufsliste', label: 'Einkaufen', icon: ShoppingCart },
]

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* Top bar — logo + desktop nav + logout */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 font-semibold text-primary shrink-0">
            <ChefHat className="h-5 w-5" />
            <span>Dishboard</span>
            <span className="hidden lg:inline text-muted-foreground font-normal text-xs">
              – der Essenswochenplaner
            </span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 flex-1 ml-4">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  pathname.startsWith(href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>

          <div className="flex-1 md:flex-none" />

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Logout */}
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Abmelden</span>
          </Button>
        </div>
      </nav>

      {/* Mobile bottom tab bar (iPhone-style) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-stretch h-16">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-1 transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Icon className={cn('h-5 w-5 transition-transform duration-150', active && 'scale-110')} />
                <span className="text-[10px] font-medium tracking-wide">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
