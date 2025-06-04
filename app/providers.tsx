/* ────────────────────────────────
   app/providers.tsx
──────────────────────────────── */
"use client";

import "@/lib/supabase/client";   // 副作用 import：Supabase を必ずバンドル
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  // ここで ThemeProvider や Zustand Store などをラップしても OK
  return <>{children}</>;
}