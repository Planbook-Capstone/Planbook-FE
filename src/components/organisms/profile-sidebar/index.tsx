"use client";
import {
  Calendar,
  History,
  Home,
  Inbox,
  LogOut,
  Search,
  Settings,
  Trash,
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
import { useAuth } from "@/hooks/useAuth";

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
    title: "Thùng rác",
    url: "/auth/trash",
    icon: Trash,
  },

  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Đăng xuất",
    url: "#",
    icon: LogOut,
    isLogout: true,
  },
];

export function AppSidebar() {
  const { logout } = useAuth();

  const handleItemClick = (item: any) => {
    if (item.isLogout) {
      logout();
    }
  };

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
            <SidebarMenu className="p-3 flex items-start justify-start ">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild={!item.isLogout}>
                    {item.isLogout ? (
                      <button
                        onClick={() => handleItemClick(item)}
                        className="flex justify-center items-center gap-2 w-full text-left hover:bg-gray-100 rounded-md"
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="text-base">{item.title}</span>
                      </button>
                    ) : (
                      <a href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span className="text-base">{item.title}</span>
                      </a>
                    )}
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
