"use client";
import {
  Calendar,
  History,
  Home,
  Inbox,
  Search,
  Settings,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

// Menu items.
const items = [
  {
    title: "Trang chủ",
    url: "/home",
    icon: Home,
  },
  {
    title: "Hồ sơ cá nhân",
    url: "/auth/profile",
    icon: User,
  },
  {
    title: "Lịch sử đơn hàng",
    url: "/auth/order-history",
    icon: History,
  },

  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-none bg-white">
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="p-3 mt-5">
            <Image
              src="/images/planbook.svg"
              alt="planbook"
              height="90"
              width="150"
            />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="p-3">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
