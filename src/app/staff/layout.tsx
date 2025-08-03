"use client";
import { Layout, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { staffItems, staffMenuItems, getLabel } from "@/constants/menuItem";
import Header from "@/components/organisms/header";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SidebarMenu } from "@/components/molecules/sidebar-menu";
import { usePathname } from "next/navigation";
import { SlideTemplateProvider } from "@/contexts/SlideTemplateContext";
import AvatarButton from "@/components/organisms/avatar-button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [currentItem, setCurrentItem] = useState(staffMenuItems[0]);
  const pathname = usePathname();
  const title =
    getLabel(pathname.replace("/staff/", ""), "staff") ||
    getLabel(pathname?.split("/")[2], "staff");
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <SlideTemplateProvider>
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
            <SidebarMenu
              menuItems={staffItems}
              defaultActiveKey="/"
              basePath="/staff"
            />

            <div className="flex flex-col justify-center items-center w-full gap-3">
              <Button variant={"menuitem"}>
                <Image
                  alt="notification"
                  src="/icons/bell.svg"
                  width="35"
                  height="35"
                />
              </Button>
              <AvatarButton />
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
    </SlideTemplateProvider>
  );
}
