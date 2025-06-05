// lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const createSupabaseServerClient = async () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Cookie: (await cookies()).toString() } } }
  )
  return supabase
}