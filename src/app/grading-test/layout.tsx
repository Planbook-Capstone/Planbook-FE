"use client";
import { Layout, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { useState } from "react";
import { adminMenuItems } from "@/constants/menuItem";
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
            label: "Chấm điểm tự động",
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
            height: "100%",
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
