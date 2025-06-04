import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { CompanySidebar } from "@/components/company-sidebar"

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <CompanySidebar />
      <main className="flex-1 overflow-hidden">
        <div className="h-full">{children}</div>
      </main>
    </SidebarProvider>
  )
}
