// app/api/auth/line/callback/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import { v5 as uuidv5 } from 'uuid'
const UUID_NAMESPACE = 'cde90f60-6f8a-4d61-9d87-8f2e9b2e9eaf' // 固定のネームスペースUUID

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')!
    const { host, protocol } = new URL(req.url)
    const origin = `${protocol}//${host}`

    // ここで origin の存在を確認（必要に応じて処理を追加可能）

const redirect_uri = `${origin}/auth/line/callback`

    // 1) トークン取得
    const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        client_id: process.env.LINE_CLIENT_ID!,
        client_secret: process.env.LINE_CLIENT_SECRET!,
      }),
    })
    const tokenData = await tokenRes.json()
    if (tokenData.error) {
      return NextResponse.redirect(`${origin}/auth/student/register?error=LINEトークン取得失敗`)
    }

    // 2) プロフィール取得
    const profileRes = await fetch('https://api.line.me/v2/profile', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const profile = await profileRes.json() as {
      userId: string
      displayName: string
      pictureUrl?: string
    }

    // 分割して姓・名を取得
    const [firstName, ...restName] = profile.displayName.split(' ')
    const lastName = restName.join(' ')

    // 2.5) Supabase Auth にユーザー登録／既存ユーザー取得 (Admin API)
    const lineUserId = profile.userId
    const id = uuidv5(profile.userId, UUID_NAMESPACE)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      id,
      email: `${profile.userId}@line.local`,
      user_metadata: {
        full_name: profile.displayName,
        avatar_url: profile.pictureUrl ?? null,
      },
      email_confirm: true,
      password: crypto.randomUUID(),
    })
    if (authError || !authData?.user) {
      console.error('Auth admin createUser error:', authError)
      return NextResponse.json(
        { error: 'Auth create user failed', details: authError?.message },
        { status: 500 }
      )
    }
    const supabaseUserId = authData.user.id

    // 3) Supabase 側に upsert
    const { error: studentsError } = await supabaseAdmin
      .from('students')
      .upsert(
        [
          {
            id:         supabaseUserId,
            user_id:    supabaseUserId,
            name:       profile.displayName,
            email:      `${profile.userId}@line.local`,
            university: '',          // NOT NULL 制約用
            phone:      null,
            location:   null,
            status:     'active',    // default と同じ
            avatar_url: profile.pictureUrl ?? null,
            major:      null,
            year:       null,
            faculty:    null,
          }
        ],
        { onConflict: 'id' }
      )
    if (studentsError) {
      console.error('Students table upsert error:', studentsError)
      return NextResponse.json(
        { error: 'Students upsert failed', details: studentsError.message },
        { status: 500 }
      )
    }

    // 4) Profile テーブルにも upsert（または insert）する場合
    const { error: profilesError } = await supabaseAdmin
      .from('profiles')
      .upsert(
        [
          {
            user_id:    supabaseUserId,
            first_name: firstName  || null,
            last_name:  lastName   || null,
            full_name:  profile.displayName,
            avatar_url: profile.pictureUrl ?? null,
            phone:      null,
            year:       null,
            location:   null,
            bio:        null,
            university: null,
            faculty:    null,
            email:      `${profile.userId}@line.local`,
            is_verified:true,
          }
        ],
        { onConflict: 'user_id' }
      )
    if (profilesError) {
      console.error('Profiles table upsert error:', profilesError)
      return NextResponse.json(
        { error: 'Profiles upsert failed', details: profilesError.message },
        { status: 500 }
      )
    }

    // 5) 自前 JWT 発行＋Cookie セット
    const token = jwt.sign(
      { sub: supabaseUserId, name: profile.displayName },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )
    const response = NextResponse.redirect(`${origin}/auth/student/register/complete`)
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 3600,
      sameSite: 'lax',
    })
    return response
  } catch (error) {
    console.error("LINE callback error:", error)
    return NextResponse.json(
      {
        error: "LINE callback failed",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}