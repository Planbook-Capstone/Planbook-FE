"use client";
import { Layout, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { adminItems, adminMenuItems, getLabel } from "@/constants/menuItem";
import Header from "@/components/organisms/header";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SidebarMenu } from "@/components/molecules/sidebar-menu";
import Account from "@/components/molecules/account";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout, displayName, avatarUrl, initials, isAuthenticated } =
    useAuth();
  const router = useRouter();
  const [currentItem, setCurrentItem] = useState(adminMenuItems[0]);
  const pathname = usePathname();
  const title =
    getLabel(pathname.replace("/admin/", "")) ||
    getLabel(pathname?.split("/")[2]);
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout className="min-h-screen h-screen !bg-white pr-3">
      <Sider
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          position: "fixed",
          height: "100vh",
          width: "100%",
          background: "white",
        }}
      >
        <div className="flex py-5 flex-col items-center justify-between h-full border-r-[0.5px] border-r-[#DFDFDF]">
          {/* <div className="h-13 w-full flex items-center justify-center">
            <div className="relative h-full w-full">
              <Image
                src="/images/logoPlanbook.png"
                alt="PlanBook Logo"
                fill
                className="object-contain"
              />
            </div>
          </div> */}

          {/* <Menu
            defaultSelectedKeys={["1"]}
            items={adminMenuItems}
            onClick={(e) => setCurrentItem(e)}
          /> */}
          <SidebarMenu menuItems={adminItems} defaultActiveKey="/" />

          <div className="flex flex-col justify-center items-center w-full gap-3">
            <Button variant={"menuitem"}>
              <Image
                alt="notification"
                src="/icons/bell.svg"
                width="35"
                height="35"
              />
            </Button>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="outline-none relative">
                <Avatar className="size-9 rounded-full hover:opacity-75 transition border border-neutral-300">
                  <AvatarImage
                    src={avatarUrl || "/images/avatarLogo.png"}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-md bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="left"
                className="w-52"
                sideOffset={5}
              >
                <div className="cursor-pointer flex items-center justify-start gap-2 px-2.5 py-4">
                  <Avatar className="size-9 hover:opacity-75 transition border border-neutral-300">
                    <AvatarImage
                      src={avatarUrl || "/images/avatarLogo.png"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start justify-center">
                    <p className="text-sm font-medium text-neutral-900">
                      {displayName}
                    </p>
                    <p className="text-xs text-neutral-500">{user?.email}</p>
                  </div>
                </div>

                <DropdownMenuItem
                  onClick={logout}
                  className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
                >
                  <LogOut className="size-4 mr-2" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Sider>
      <div
        style={{
          margin: "15px 0 0 92px",
          background: "white",
          border: "0.5px solid #DFDFDF",
        }}
        className="w-full h-auto rounded-t-lg shadow-xs px-5 overflow-y-scroll"
      >
        <Header title={title || "Tổng quan"} />
        <Content>
          <div
            style={{
              minHeight: 360,
              height: "100%",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              position: "relative",
            }}
            className="font-questrial my-5"
          >
            {children}
          </div>
        </Content>
      </div>
    </Layout>
  );
}
