import { BarChart3, Briefcase, Users, MessageSquare, Settings, Building2, Plus, FileText, Star } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
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
    badge: 5,
  },
  {
    title: "メッセージ",
    url: "/company/messages",
    icon: MessageSquare,
    badge: 3,
  },
  {
    title: "フィードバック",
    url: "/company/feedback",
    icon: Star,
  },
  {
    title: "設定",
    url: "/company/settings",
    icon: Settings,
  },
]

export function CompanySidebar() {
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
                      {item.badge && (
                        <Badge className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5">{item.badge}</Badge>
                      )}
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
            <p className="text-sm font-semibold">株式会社テックスタート</p>
            <p className="text-xs text-gray-600">管理者</p>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
