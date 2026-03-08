'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { CalendarDays, BookOpen, ShoppingCart, LogOut, ChefHat } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/planer', label: 'Planer', icon: CalendarDays },
  { href: '/rezepte', label: 'Rezepte', icon: BookOpen },
  { href: '/einkaufsliste', label: 'Einkaufsliste', icon: ShoppingCart },
]

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        <div className="flex items-center gap-2 font-semibold text-primary mr-4">
          <ChefHat className="h-5 w-5" />
          <span className="hidden sm:inline">Essenswochenplaner</span>
        </div>
        <div className="flex items-center gap-1 flex-1">
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
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Abmelden</span>
        </Button>
      </div>
    </nav>
  )
}
