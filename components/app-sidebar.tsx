"use client"
import { Home, BarChart, Settings, Key, Moon, Sun, PanelLeftClose, PanelLeft } from "lucide-react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const { setTheme, theme } = useTheme()
  const pathname = usePathname()
  const { toggleSidebar, state } = useSidebar()

  // Navigation items with updated paths for /home
  const navItems = [
    {
      title: "Home",
      icon: Home,
      url: "/home",
      isActive: pathname === "/home",
    },
    {
      title: "Insights",
      icon: BarChart,
      url: "/home/insights",
      isActive: pathname === "/home/insights",
    },
    {
      title: "Settings",
      icon: Settings,
      url: "/home/settings",
      isActive: pathname === "/home/settings",
    },
    {
      title: "Key",
      icon: Key,
      url: "/home/key",
      isActive: pathname === "/home/key",
    },
  ]

  return (
    <Sidebar
      collapsible="icon"
      className="bg-[#f3f9ff] border-r border-[#e1e8f0] dark:bg-black dark:border-[#222222]"
      variant="sidebar"
    >
      <SidebarHeader>
        <div className="h-6"></div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2 list-none">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title} className="my-1 list-none">
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={item.isActive}
                className="hover:bg-[#e9edf1] dark:hover:bg-[#222222] data-[active=true]:bg-[#e1f0ff] data-[active=true]:text-[#007fff] dark:data-[active=true]:bg-[#333333] dark:data-[active=true]:text-[#60a5fa]"
              >
                <a href={item.url}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="px-4 py-2">
        {/* Sidebar toggle button */}
        <SidebarMenuItem className="my-1 list-none">
          <SidebarMenuButton
            tooltip={state === "expanded" ? "Collapse sidebar" : "Expand sidebar"}
            className="hover:bg-[#e9edf1] dark:hover:bg-[#222222]"
            onClick={toggleSidebar}
          >
            {state === "expanded" ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
            <span>Toggle sidebar</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {/* Theme toggle button */}
        <SidebarMenuItem className="my-1 list-none">
          <SidebarMenuButton
            tooltip="Toggle theme"
            className="hover:bg-[#e9edf1] dark:hover:bg-[#222222]"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span>Toggle theme</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
