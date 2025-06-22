"use client";
import { Layout, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { DetailHeader } from "@/components/organisms/header/DetailHeader";
import {
  ChevronLeft,
  AlertCircle,
  Download,
  Settings,
  BarChart3,
  FileText,
  Plus,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { getPageLabel, getPageActions } from "@/utils/pathToLabel";

interface ToolLayoutProps {
  children: React.ReactNode;
}

// Icon mapping for actions
const iconMap: Record<string, any> = {
  Plus: <Plus className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
  AlertCircle: <AlertCircle className="w-4 h-4" />,
  Download: <Download className="w-4 h-4" />,
  BarChart3: <BarChart3 className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
};

export default function ToolLayout({ children }: ToolLayoutProps) {
  const pathname = usePathname();
  const pageLabel = getPageLabel(pathname);
  const rawActions = getPageActions(pathname);

  // Convert string icons to React components
  const pageActions = rawActions.map((action) => ({
    ...action,
    icon: iconMap[action.icon] || action.icon,
  }));

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="h-screen">
      <DetailHeader
        breadcrumbs={[
          {
            label: "Quay lại",
            href: "/home",
            onClick: () => console.log("Back"),
            beforeIcon: <ChevronLeft className="w-4 h-4" />,
          },
          {
            label: pageLabel,
            active: true,
          },
        ]}
        actions={pageActions}
      />
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
  );
}
