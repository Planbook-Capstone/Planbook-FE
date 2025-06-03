"use client";
import { Layout, Menu, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { LogoutOutlined } from "@ant-design/icons";
import { useState } from "react";
import "./index.scss";
import { adminItems, adminMenuItems, getLabel } from "@/constants/menuItem";
import Header from "@/components/organisms/header";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SidebarMenu } from "@/components/molecules/sidebar-menu";
import Account from "@/components/molecules/account";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [currentItem, setCurrentItem] = useState(adminMenuItems[0]);
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
            <Account src={"/images/avatarLogo.png"} />
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
        <Header title={getLabel(currentItem?.key)} />
        <Content>
          <div
            style={{
              minHeight: 360,
              height: "100%",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              position: "relative",
            }}
          >
            {children}
          </div>
        </Content>
      </div>
    </Layout>
  );
}
