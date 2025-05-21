"use client";
import { Layout, Menu, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { LogoutOutlined } from "@ant-design/icons";
import { useState } from "react";
import "./index.scss";
import { adminMenuItems, getLabel } from "@/constants/menuItem";
import Header from "@/components/organisms/header";
import Image from "next/image";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [currentItem, setCurrentItem] = useState(adminMenuItems[0]);
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout className="min-h-screen">
      <Sider
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ position: "fixed", height: "100vh" }}
      >
        <div className="flex py-9 flex-col justify-between h-full">
          <div className="h-13 w-full flex items-center justify-center">
            <div className="relative h-full w-full">
              <Image
                src="/images/logoPlanbook.png"
                alt="PlanBook Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={adminMenuItems}
            onClick={(e) => setCurrentItem(e)}
          />
          <button className="h-[51px] w-[51px] text-white flex justify-center items-center bg-gradient-to-b from-[#504C51] to-[#323033] rounded-full cursor-pointer">
            <LogoutOutlined className="text-[18px] stroke-white stroke-[10px]" />
          </button>
        </div>
      </Sider>
      <Layout
        style={{ padding: "0 26px 0 106px", background: colorBgContainer }}
      >
        <Header title={getLabel(currentItem?.key)} />
        <Content>
          <div
            style={{
              minHeight: 360,
              height: "88vh",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              position: "relative",
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
