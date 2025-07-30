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
  Edit,
  Footprints,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { getPageLabel, getPageActions } from "@/utils/pathToLabel";
import { HeaderProvider, useHeader } from "@/contexts/HeaderContext";
import { ChatButton } from "@/components/ui/chat-button";
import ChatBox from "@/components/organisms/chat-box";
import type { BreadcrumbItem } from "@/components/ui/BreadcrumbTrail";

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
  Edit: <Edit className="w-4 h-4" />,
  Footprints: <Footprints className="w-4 h-4" />,
};

function ToolLayoutContent({ children }: ToolLayoutProps) {
  const pathname = usePathname();
  const pageLabel = getPageLabel(pathname);
  const rawActions = getPageActions(pathname);
  const { breadcrumbs, actions, hideDefaultHeader } = useHeader();

  // Convert string icons to React components
  const pageActions = rawActions.map((action) => ({
    ...action,
    icon: iconMap[action.icon] || action.icon,
  }));

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Use context breadcrumbs and actions if available, otherwise use default
  const finalBreadcrumbs =
    breadcrumbs.length > 0
      ? breadcrumbs
      : (() => {
          const defaultBreadcrumbs: BreadcrumbItem[] = [
            {
              label: "Quay lại",
              href: "/home",
              onClick: () => console.log("Back"),
              beforeIcon: <ChevronLeft className="w-4 h-4" />,
            },
          ];

          // Add exam-instances breadcrumb if current path is exam-templates
          if (pathname === "/exam-templates") {
            defaultBreadcrumbs.push({
              label: "Quản lý phiên kiểm tra",
              href: "/exam-instances",
            });
          }

          // Add current page breadcrumb
          defaultBreadcrumbs.push({
            label: pageLabel,
            active: true,
          });

          return defaultBreadcrumbs;
        })();

  const finalActions = actions.length > 0 ? actions : pageActions;

  return (
    <Layout className="h-screen">
      {!hideDefaultHeader && (
        <DetailHeader breadcrumbs={finalBreadcrumbs} actions={finalActions} />
      )}
      <Content className="h-full" style={{ height: "100%" }}>
        <div
          style={{
            minHeight: 360,
            height: "100%",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            position: "relative",
          }}
          className="font-questrial"
        >
          {children}
        </div>
      </Content>
    </Layout>
  );
}

export default function ToolLayout({ children }: ToolLayoutProps) {
  return (
    <HeaderProvider>
      <ChatBox
        position="bottom-left"
        size="md"
        variant="default"
        title="PlanBook AI Assistant"
        placeholder="Nhập câu hỏi của bạn..."
        showBadge={true}
      />
      <ToolLayoutContent>{children}</ToolLayoutContent>
    </HeaderProvider>
  );
}
