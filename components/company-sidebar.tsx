"use client";

import { BarChart3, Briefcase, Users, MessageSquare, Settings, Building2, Plus, FileText, Star, Calendar } from "lucide-react"
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link"
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

const menuItems = [
  {
    title: "ダッシュボード",
    url: "/company/dashboard",
    icon: BarChart3,
  },
  {
    title: "求人管理",
    url: "/company/jobs",
    icon: Briefcase,
  },
  {
    title: "応募者管理",
    url: "/company/applications",
    icon: Users,
  },
  {
    title: "面接管理",
    url: "/company/interviews",
    icon: Calendar,
  },
  {
    title: "メッセージ",
    url: "/company/messages",
    icon: MessageSquare,
  },
  {
    title: "フィードバック",
    url: "/company/feedback",
    icon: Star,
  },
]

export function CompanySidebar() {
  const [companyName, setCompanyName] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // 企業名を取得
      const { data: company, error: companyError } = await supabase
        .from("companies")
        .select("name")
        .eq("user_id", user.id)
        .single();
      if (companyError) console.error("Error fetching company:", companyError);
      if (company?.name) {
        setCompanyName(company.name);
      }

      // ユーザー氏名を取得
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .single();
      if (profile?.full_name) setFullName(profile.full_name);
    };

    fetchProfile();
  }, []);

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
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel>クイックアクション</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/company/jobs/create"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                    <span>新規求人作成</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/company/applications"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <FileText className="h-4 w-4" />
                    <span>応募者確認</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <Building2 className="h-4 w-4 text-orange-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{companyName || "会社名"}</p>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
