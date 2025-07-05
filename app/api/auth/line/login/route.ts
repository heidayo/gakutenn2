// app/api/auth/line/login/route.ts
import crypto from 'crypto'
import { NextResponse } from 'next/server'

export function GET(req: Request) {
  const url = new URL(req.url)
  const origin = url.origin
  const redirect_uri = `${origin}/api/auth/line/callback`
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINE_CLIENT_ID!,
    redirect_uri,
    state: crypto.randomUUID(),
    scope: 'openid profile email',
  })
  return NextResponse.redirect(
    `https://access.line.me/oauth2/v2.1/authorize?${params}`
  )
}