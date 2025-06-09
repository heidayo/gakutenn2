// app/components/footer-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  User,
  MessageSquare,
  LayoutDashboard,
} from "lucide-react";

/** bottom-navigation height（h-16 = 64px）と同じだけ
 *  下マージンを取れば、ページ内容が隠れません。 */
export const footerHeight = "h-16";

const items = [
  { href: "/student", icon: Home, label: "ホーム" },
  { href: "/student/search", icon: Search, label: "探す" },
  { href: "/student/profile", icon: User, label: "プロフィール" },
  { href: "/student/dashboard", icon: LayoutDashboard, label: "ダッシュボード" },
  { href: "/student/feedback", icon: MessageSquare, label: "フィードバック" },
] as const;

export default function FooterNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white">
      <ul className="grid grid-cols-5">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-label={label}
                className={`flex flex-col items-center justify-center space-y-1 ${footerHeight} ${
                  active ? "text-orange-600" : "text-gray-500"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden />
                <span className="text-xs">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}