import 'dotenv/config'
import { supabaseAdmin } from '../lib/supabase/admin.ts'

const users = [
  { email: 'tanaka@example.com',  password: 'password123', role: 'student' },
  { email: 'sato@example.com',    password: 'password123', role: 'student' },
  { email: 'takahashi@example.com', password: 'password123', role: 'company' },
]

for (const u of users) {
  const { error } = await supabaseAdmin.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true,
    user_metadata: { role: u.role },
  })
  console.log(error ? `✗ ${u.email} ${error.message}` : `✓ ${u.email}`)
}