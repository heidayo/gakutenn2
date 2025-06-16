"use client";

import { BarChart3, Briefcase, Users, MessageSquare, Settings, Building2, Plus, FileText, Star, Calendar } from "lucide-react"
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "ダッシュボード",
    url: "/company/[companyID]/dashboard",
    icon: BarChart3,
  },
  {
    title: "求人管理",
    url: "/company/[companyID]/jobs",
    icon: Briefcase,
  },
  {
    title: "応募者管理",
    url: "/company/[companyID]/applications",
    icon: Users,
  },
  {
    title: "面接管理",
    url: "/company/[companyID]/interviews",
    icon: Calendar,
  },
  {
    title: "メッセージ",
    url: "/company/[companyID]/messages",
    icon: MessageSquare,
  },
  {
    title: "フィードバック",
    url: "/company/[companyID]/feedback",
    icon: Star,
  },
]

export function CompanySidebar() {
  const [companyName, setCompanyName] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [companyId, setCompanyId] = useState<string>("");

  const pathname = usePathname()

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return
      // ---------- companies から直接取得 ----------
      // ① user_id で紐付く会社
      let companyRow: { id: string; name: string } | null = null
      let companyErr: any = null

      const { data: byUser, error: errByUser } = await supabase
        .from("companies")
        .select("id, name")
        .eq("user_id", user.id)
        .maybeSingle()

      if (byUser?.id) {
        companyRow = byUser
      } else if (user.email) {
        // ② fallback: email が一致
        const { data: byEmail, error: errByEmail } = await supabase
          .from("companies")
          .select("id, name")
          .eq("email", user.email)
          .maybeSingle()

        companyRow = byEmail
        companyErr = errByEmail
      } else {
        companyErr = errByUser
      }

      // ---------- ③ URL から抽出 ----------
      if (!companyRow) {
        const match = pathname.match(/^\/company\/([0-9a-fA-F-]{36})/)
        if (match) {
          const urlCompanyId = match[1]
          const { data: byId, error: errById } = await supabase
            .from("companies")
            .select("id, name")
            .eq("id", urlCompanyId)
            .maybeSingle()

          if (byId?.id) {
            companyRow = byId
            companyErr = errById
          }
        }
      }

      if (companyRow?.id) {
        setCompanyId(companyRow.id)
        setCompanyName(companyRow.name)
      } else {
        console.error("企業取得失敗:", companyErr || "not found")
      }

      // ---------- プロフィール名 ----------
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .maybeSingle()

      if (profile?.full_name) setFullName(profile.full_name)
    }

    fetchProfile()
  }, [])

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <Logo variant="vertical" size="sm" />
        <p className="text-xs text-gray-600 text-center mt-2">企業管理画面</p>
      </SidebarHeader>

      <SidebarContent className="px-4 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const disabled = companyId === ""
                const finalUrl = disabled ? "#" : item.url.replace("[companyID]", companyId)

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={finalUrl}
                        aria-disabled={disabled}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-lg",
                          disabled
                            ? "text-gray-400 pointer-events-none"
                            : "hover:bg-gray-100"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel>クイックアクション</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  {(() => {
                    const disabledQA = companyId === ""
                    return (
                      <Link
                        href={disabledQA ? "#" : `/company/${companyId}/jobs/create`}
                        aria-disabled={disabledQA}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-lg",
                          disabledQA
                            ? "text-gray-400 pointer-events-none"
                            : "hover:bg-gray-100"
                        )}
                      >
                        <Plus className="h-4 w-4" />
                        <span>新規求人作成</span>
                      </Link>
                    )
                  })()}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  {(() => {
                    const disabledQA = companyId === ""
                    return (
                      <Link
                        href={disabledQA ? "#" : `/company/${companyId}/applications`}
                        aria-disabled={disabledQA}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-lg",
                          disabledQA
                            ? "text-gray-400 pointer-events-none"
                            : "hover:bg-gray-100"
                        )}
                      >
                        <FileText className="h-4 w-4" />
                        <span>応募者確認</span>
                      </Link>
                    )
                  })()}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t px-6 py-4">
        {(() => {
          const disabledFooter = companyId === ""
          const footerHref = disabledFooter ? "#" : `/company/${companyId}/dashboard`
          return (
            <Link
              href={footerHref}
              aria-disabled={disabledFooter}
              className={cn(
                "flex items-center space-x-3",
                disabledFooter ? "pointer-events-none" : "hover:opacity-80"
              )}
            >
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Building2 className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">
                  {companyName || "会社名"}
                </p>
              </div>
            </Link>
          )
        })()}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
