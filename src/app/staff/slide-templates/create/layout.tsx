"use client";
import { Layout, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutProps) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    // Ẩn body scroll và set overflow
    document.body.style.overflow = "hidden";

    // Cleanup khi component unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-white"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: "#fff",
      }}
    >
      <Layout className="h-full w-full">
        <Content className="h-full" style={{ height: "100%" }}>
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
    </div>
  );
}
