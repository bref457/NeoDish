import { createBrowserClient } from '@supabase/ssr'

// Provide fallback empty strings so the build doesn't throw;
// real values must be set at runtime via .env.local
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  )
}
