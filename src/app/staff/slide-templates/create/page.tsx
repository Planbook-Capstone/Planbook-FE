"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SlideEditorLayout from "@/components/ui/slide-editor/SlideEditorLayout";
import { useCreateSlideTemplateService } from "@/services/slideTemplateServices";
import { toast } from "sonner";
import { useSlideTemplateContext } from "@/contexts/SlideTemplateContext";
import { convertGoogleSlideJsonToEditor } from "@/utils/googleSlidesConverter";
import sampleData from "@/data/sample-presentation.json";

export default function CreateSlideTemplatePage() {
  const router = useRouter();
  const createMutation = useCreateSlideTemplateService();
  const { tempData, clearTempData } = useSlideTemplateContext();
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  // Check temp data từ Context
  useEffect(() => {
    if (!tempData) {
      // Nếu không có data, redirect về trang danh sách
      toast.error("Không tìm thấy dữ liệu template!");
      router.push("/staff/slide-templates");
      return;
    }
  }, [tempData, router]);

  // Handle save từ slide editor
  const handleSave = async (slides: any[], textBlocks: string) => {
    if (!tempData) {
      toast.error("Không tìm thấy dữ liệu template!");
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

      // Prepare full data để POST API
      const fullData = {
        name: tempData.name,
        description: tempData.description,
        imageBlocks: tempData.imageBlocks,
        textBlocks: parsedTextBlocks,
      };
      console.log(fullData);
      // POST API tạo template
      await createMutation.mutateAsync(fullData);

      toast.success("Template đã được tạo thành công!");

      // Clear temp data và redirect về trang danh sách
      // clearTempData();
      // router.push("/staff/slide-templates");
    } catch (error: any) {
      console.error("Error creating slide template:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo template!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel - clear temp data và quay về trang danh sách
  const handleCancel = () => {
    clearTempData();
    router.push("/staff/slide-templates");
  };

  //Test
  const handleLoadSampleData = async () => {
    setIsLoading(true);
    try {
      // Convert Google Slides JSON to editor format
      const convertedData = convertGoogleSlideJsonToEditor(sampleData);

      // Transform to match SlideEditorLayout expected format
      const editorSlides = convertedData.slides.map((slide: any) => ({
        id: slide.id,
        elements: slide.elements.map((element: any) => {
          // Debug logging for problematic coordinates
          if (
            element.x < 0 ||
            element.y < 0 ||
            element.x > 960 ||
            element.y > 540
          ) {
            console.warn(`🚨 Problematic element after conversion:`, {
              id: element.id,
              type: element.type,
              coordinates: { x: element.x, y: element.y },
              size: { width: element.width, height: element.height },
              text: element.text?.slice(0, 50) + "...",
            });
          }

          return {
            id: element.id,
            type: element.type,
            x: element.x,
            y: element.y,
            width: element.width,
            height: element.height,
            text: element.text || "",
            style: element.style || {},
            // Add any additional properties needed
          };
        }),
      }));

      setSlides(editorSlides);
      setHasLoadedData(true);

      console.log("✅ Loaded sample data:", convertedData);
      console.log("📊 Slides:", editorSlides.length);
      console.log(
        "📄 Elements total:",
        editorSlides.reduce(
          (total: number, slide: any) => total + slide.elements.length,
          0
        )
      );
    } catch (error) {
      console.error("❌ Failed to load sample data:", error);
      alert("Failed to load sample data. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!tempData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-questrial">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-calsans text-gray-900">
              Tạo Template: {tempData.name}
            </h1>
            {tempData.description && (
              <p className="text-sm text-gray-600 font-questrial mt-1">
                {tempData.description}
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
          initialSlides={slides}
          onSave={handleSave}
          onCancel={handleCancel}
          onLoadSampleData={handleLoadSampleData}
        />
      </div>
    </div>
  );
}
