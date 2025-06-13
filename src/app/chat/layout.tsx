"use client";
import { Layout, Menu, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { LogoutOutlined } from "@ant-design/icons";
import { useState } from "react";
import { adminItems, adminMenuItems, getLabel } from "@/constants/menuItem";
import Header from "@/components/organisms/header";
import { DetailHeader } from "@/components/organisms/header/DetailHeader";
import { AlertCircle, ChevronLeft } from "lucide-react";

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
    <Layout>
      <DetailHeader
        breadcrumbs={[
          {
            label: "Quay lại",
            href: "/",
            onClick: () => console.log("Back"),
            beforeIcon: <ChevronLeft className="w-4 h-4" />,
          },
          {
            label: "Điền biểu mẫu",
            active: true,
          },
        ]}
        actions={[
          {
            label: "Báo cáo",
            icon: <AlertCircle className="w-4 h-4" />,
            onClick: () => alert("Báo cáo!"),
            variant: "outline",
          },
        ]}
      />
      <Content>
        <div
          style={{
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            position: "relative",
          }}
        >
          {children}
        </div>
      </Content>
    </Layout>
  );
}
