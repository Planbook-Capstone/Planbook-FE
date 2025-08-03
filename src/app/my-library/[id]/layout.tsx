"use client";
import React from "react";
import { Layout, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { DetailHeader } from "@/components/organisms/header/DetailHeader";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { getLibraryTypeName } from "@/constants";

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
}
export default function AdminLayout({ children, params }: AdminLayoutProps) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { id } = React.use(params);

  return (
    <Layout>
      <DetailHeader
        breadcrumbs={[
          {
            label: "Quay lại",
            href: "/my-library",
            onClick: () => console.log("Back"),
            beforeIcon: <ChevronLeft className="w-4 h-4" />,
          },
          {
            label: getLibraryTypeName(id),
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
          className="p-10 font-questrial !text-black"
        >
          {children}
        </div>
      </Content>
    </Layout>
  );
}
