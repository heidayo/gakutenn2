import "@/lib/supabase/client";
import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import Providers from "./providers";

export const metadata: Metadata = {
  title: '学転インターン',
  description: '学生向けキャリア転換インターンプラットフォーム',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
