"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import SlideEditorLayout from "@/components/ui/slide-editor/SlideEditorLayout";
import {
  useSlideTemplateByIdService,
  useUpdateSlideTemplateService,
} from "@/services/slideTemplateServices";
import { toast } from "sonner";

export default function EditSlideTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.id as string;

  const { data: template, isLoading: isLoadingTemplate } =
    useSlideTemplateByIdService(templateId);
  const updateMutation = useUpdateSlideTemplateService();

  const [isLoading, setIsLoading] = useState(false);

  // Handle save từ slide editor
  const handleSave = async (slides: any[], textBlocks: string) => {
    if (!template) {
      toast.error("Không tìm thấy template!");
      return;
    }

    try {
      setIsLoading(true);

      // Parse textBlocks JSON string
      let parsedTextBlocks = {};
      try {
        parsedTextBlocks = JSON.parse(textBlocks);
      } catch (error) {
        console.error("Error parsing textBlocks:", error);
      }

      // Prepare data để PUT API
      const updateData = {
        name: template.name,
        description: template.description,
        imageBlocks: template.imageBlocks,
        textBlocks: parsedTextBlocks,
      };

      // PUT API update template
      await updateMutation.mutateAsync({
        id: templateId,
        data: updateData,
      });

      toast.success("Template đã được cập nhật thành công!");

      // Redirect về trang danh sách
      router.push("/staff/slide-templates");
    } catch (error: any) {
      console.error("Error updating slide template:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật template!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function để convert textBlocks thành slide editor format
  const convertTextBlocksToSlideEditor = (textBlocks: Record<string, any>) => {
    const slides: any[] = [];

    Object.entries(textBlocks).forEach(([key, value]) => {
      // Parse key: slide_1_text_1 -> slideIndex: 0, elementIndex: 0
      const match = key.match(/slide_(\d+)_text_(\d+)/);
      if (match) {
        const slideIndex = parseInt(match[1]) - 1;
        const elementIndex = parseInt(match[2]) - 1;

        // Ensure slide exists
        if (!slides[slideIndex]) {
          slides[slideIndex] = {
            id: `slide_${slideIndex + 1}`,
            elements: [],
          };
        }

        // Add text element
        slides[slideIndex].elements.push({
          id: `element_${elementIndex + 1}`,
          type: "text",
          text: value.text,
          style: value.style,
          x: value.position?.x || 0,
          y: value.position?.y || 0,
          width: value.position?.width || 200,
          height: value.position?.height || 50,
        });
      }
    });

    return { slides };
  };

  // Handle cancel - quay về trang danh sách
  const handleCancel = () => {
    router.push("/staff/slide-templates");
  };

  if (isLoadingTemplate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-questrial">Đang tải template...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 font-questrial mb-4">
            Không tìm thấy template!
          </p>
          <button
            onClick={() => router.push("/staff/slide-templates")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-questrial"
          >
            Quay về danh sách
          </button>
        </div>
      </div>
    );
  }

  // Convert textBlocks thành format cho slide editor
  const initialSlideData = template.textBlocks
    ? convertTextBlocksToSlideEditor(template.textBlocks)
    : { slides: [] };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-calsans text-gray-900">
              Chỉnh sửa Template: {template.name}
            </h1>
            {template.description && (
              <p className="text-sm text-gray-600 font-questrial mt-1">
                {template.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-questrial"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                // Trigger save từ slide editor
                // SlideEditorLayout sẽ cần expose save function
              }}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-questrial flex items-center gap-2"
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {isLoading ? "Đang lưu..." : "Lưu Template"}
            </button>
          </div>
        </div>
      </div>

      {/* Slide Editor */}
      <div className="flex-1">
        <SlideEditorLayout
          initialSlides={initialSlideData.slides}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
