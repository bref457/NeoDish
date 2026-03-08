import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      {/* pb-20 reserves space for the mobile bottom tab bar */}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
    </div>
  )
}
