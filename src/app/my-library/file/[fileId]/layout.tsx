"use client";
import React from "react";
import { theme } from "antd";
import { DetailHeader } from "@/components/organisms/header/DetailHeader";
import { Download, Share2, ChevronLeft, Settings } from "lucide-react";
import { getLibraryTypeName } from "@/constants";
import { useToolResultByIdService } from "@/services/toolResultService";
import { DowloadIcon } from "@/constants/icon";
import DocumentInfoPanel, {
  CustomButton,
} from "@/components/organisms/document-panel";
import { useRouter } from "next/navigation";

interface FileLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    fileId: string;
  }>;
}
export default function FileLayout({ children, params }: FileLayoutProps) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { fileId } = React.use(params);
  const router = useRouter();

  const { data } = useToolResultByIdService(fileId);

  // Create custom buttons based on document type
  const customButtons: CustomButton[] = React.useMemo(() => {
    const buttons: CustomButton[] = [];

    if (data?.data?.type === "SLIDE") {
      buttons.push({
        label: "Chỉnh sửa",
        onClick: () => {
          router.push(`/results/slide/${fileId}`);
        },
        variant: "custom",
        icon: <Settings className="w-4 h-4" />,
        className: "text-sm py-3",
      });
    } else if (data?.data?.type === "LESSON_PLAN") {
      buttons.push({
        label: "Chỉnh sửa",
        onClick: () => {
          router.push(`/results/lesson-plan/${fileId}?lessonId=${data?.data?.lessonIds[0]}`);
        },
        variant: "custom",
        icon: <Settings className="w-4 h-4" />,
        className: "text-sm py-3",
      });
    } else if (data?.data?.type === "EXAM") {
      buttons.push({
        label: "Chỉnh sửa",
        onClick: () => {
          router.push(`/results/exam/${fileId}`);
        },
        variant: "custom",
        icon: <Settings className="w-4 h-4" />,
        className: "text-sm py-3",
      });
    }

    return buttons;
  }, [data?.data?.type, fileId, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DetailHeader
        breadcrumbs={[
          {
            label: "Thư viện",
            href: "/my-library",
            onClick: () => console.log("Back to library"),
            beforeIcon: <ChevronLeft className="w-4 h-4" />,
          },
          {
            label: getLibraryTypeName(data?.data?.type),
            href: `/my-library/${data?.data?.type}`,
            onClick: () => console.log("Back to category"),
          },
          {
            label: `${data?.data?.name}`,
            active: true,
          },
        ]}
        // actions={[
        //   {
        //     label: "Tải về máy",
        //     icon: DowloadIcon,
        //     onClick: () => alert("Download file!"),
        //     variant: "default",
        //   },
        //   {
        //     label: "Chia sẻ",
        //     icon: <Share2 className="w-4 h-4" />,
        //     onClick: () => alert("Share file!"),
        //     variant: "outline",
        //   },
        // ]}
      />
      <div
        className={
          data?.data?.type === "SLIDE"
            ? "grid md:grid-cols-5 p-5"
            : "grid md:grid-cols-3 p-5"
        }
      >
        <div className="h-full">
          <DocumentInfoPanel
            documentInfo={data?.data}
            variant={data?.data?.type !== "EXAM" ? "secondary" : "primary"}
            customButtons={customButtons}
          />
        </div>
        <div
          style={{
            background:
              data?.data?.type === "SLIDE" ? "transparent" : colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
          className={`overflow-y-auto ${
            data?.data?.type === "SLIDE"
              ? "min-h-auto col-span-4"
              : "min-h-screen col-span-2 shadow-sm border"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
