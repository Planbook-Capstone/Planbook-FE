"use client";

import React, { useState, useEffect } from "react";
import { SlideEditorLayout } from "@/components/ui/slide-editor";
import { useRouter } from "next/navigation";
import { useToolResultByIdService, useUpdateToolResultService } from "@/services/toolResultService";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import Loading from "@/components/ui/loading";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function SlideResultEdit({ params }: Props) {
  const { id } = React.use(params);
  const router = useRouter();
  const { user } = useAppStore();

  const [slides, setSlides] = useState<any[]>([]);
  const [toolResultData, setToolResultData] = useState<any>(null);

  // Fetch tool result data
  const {
    data: toolResult,
    isLoading,
    error,
  } = useToolResultByIdService(id);

  // Update service
  const { mutate: updateToolResult, isPending: isUpdating } = useUpdateToolResultService();

  // Load slides from tool result data
  useEffect(() => {
    if (toolResult?.data) {
      setToolResultData(toolResult.data);
      
      // Check if this is a SLIDE type
      if (toolResult.data.type !== "SLIDE") {
        toast.error("Đây không phải là slide có thể chỉnh sửa!");
        router.push("/my-library");
        return;
      }

      // Extract slides from data
      const slideData = toolResult.data.data;
      if (slideData?.slides) {
        setSlides(slideData.slides);
      }
    }
  }, [toolResult, router]);

  // Handle save function - UPDATE existing tool result directly
  const handleSave = (currentSlides: any[]) => {
    if (!user?.id) {
      toast.error("Không tìm thấy thông tin người dùng!");
      return;
    }

    if (!toolResultData) {
      toast.error("Không tìm thấy dữ liệu tool result!");
      return;
    }

    // Use current slides from editor (always up-to-date)
    const slidesToSave = currentSlides;

    // Export current slides as JSON data
    console.log("🔍 Slides to save:", slidesToSave);
    
    const exportedData = {
      slides: slidesToSave.map((slide) => {
        console.log("🔍 Processing slide:", slide);
        return {
          id: slide.id,
          elements: slide.elements || [],
          background: slide.background || "#ffffff",
        };
      }),
      totalSlides: slidesToSave.length,
      createdAt: new Date().toISOString(),
    };
    
    console.log("🔍 Exported data:", exportedData);

    const payload = {
      ...toolResultData,
      data: exportedData,
      updatedAt: new Date().toISOString(),
    };

    // Update existing record
    updateToolResult(
      { id: id, data: payload },
      {
        onSuccess: () => {
          toast.success("Lưu slide thành công!");
          // Redirect to SLIDE library after 1 second
          setTimeout(() => {
            router.push("/my-library/SLIDE");
          }, 1000);
        },
        onError: (error: any) => {
          toast.error(
            `Lưu slide thất bại: ${
              error?.response?.data?.message ||
              error?.message ||
              "Có lỗi xảy ra"
            }`
          );
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">Không thể tải dữ liệu slide</p>
          <button
            onClick={() => router.push("/my-library")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Quay lại thư viện
          </button>
        </div>
      </div>
    );
  }

  if (!toolResultData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="h-screen relative">
      <div className="h-screen flex flex-col">
        <SlideEditorLayout
          initialSlides={slides}
          userRole={user?.role}
          onSave={(currentSlides, textBlocks) => {
            console.log("🔍 onSave called with slides:", currentSlides);
            handleSave(currentSlides);
          }}
          templateData={{
            name: toolResultData.name,
            description: toolResultData.description,
          }}
        />
      </div>
    </div>
  );
}
