import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl,
  serviceKey,
  { auth: { persistSession: false } }   // ← CLI 用なのでセッション保存不要
)