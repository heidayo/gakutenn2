import 'dotenv/config'
import { supabaseAdmin } from '../lib/supabase/admin.js'

const { data, error } = await supabaseAdmin.auth.admin.listUsers()

if (error) {
  console.error('✗ listUsers error:', error.message)
  process.exit(1)
}

console.log(`✓ ${data.users.length} users`)
for (const u of data.users) {
  console.log(`${u.id}  ${u.email}  ${u.user_metadata?.role ?? ''}`)
}