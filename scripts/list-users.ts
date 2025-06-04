import 'dotenv/config'
import { supabaseAdmin } from '../lib/supabase/admin.js'

const { data, error } = await supabaseAdmin.auth.admin.listUsers()

if (error) {
  console.error('✗ listUsers error:', error.message)
  process.exit(1)
}

console.log(`✓ ${data.users.length} users`)
// 詳細表示: created_at | email | role | provider | email_confirmed
for (const u of data.users) {
  const role       = u.user_metadata?.role ?? '—'
  const provider   = u.identities?.[0]?.provider ?? '—'
  const confirmed  = u.email_confirmed_at ? '✓' : '✗'
  const created_at = new Date(u.created_at).toLocaleString()

  console.log(
    `${created_at} | ${u.email} | role:${role} | provider:${provider} | confirmed:${confirmed}`
  )
}