import React from "react";
import { LayoutDashboard, FileText, Settings, MessageSquare, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Trend Reports", path: "/reports", icon: FileText },
  { label: "Settings", path: "/settings", icon: Settings },
  { label: "AI Support", path: "/ai-chat", icon: MessageSquare },
  { label: "Landing", path: "/", icon: Home },
];
export function AppSidebar(): JSX.Element {
  const { pathname } = useLocation();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <LayoutDashboard className="text-white h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">InventorySense</span>
        </div>
        <SidebarInput placeholder="Search trends..." />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild isActive={pathname === item.path}>
                  <Link to={item.path}><item.icon /> <span>{item.label}</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-4">
          <div className="p-3 bg-accent rounded-lg border border-border">
            <p className="text-xs font-semibold text-foreground">Pro Account</p>
            <p className="text-[10px] text-muted-foreground mt-1">Unlimited AI Reports Enabled</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}