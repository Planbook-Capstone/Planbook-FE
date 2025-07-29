"use client";

import React, { useState, useEffect } from "react";
import { SlideEditorLayout } from "@/components/ui/slide-editor";
import { convertGoogleSlideJsonToEditor } from "@/utils/googleSlidesConverter";
import sampleData from "@/data/sample-presentation.json";
import { Upload, FileText, Loader2 } from "lucide-react";
import {
  useSlideTemplateByIdService,
  useProcessJsonTemplateService,
  useSlideTemplateDetailByIdService,
} from "@/services/slideTemplateServices";
import Loading from "@/components/ui/loading";
import { useExecuteToolService } from "@/services/executeToolServices";
import { useSimpleWebSocket } from "@/hooks/useSimpleWebSocket";
import { WEBSOCKET_CONFIG } from "@/components/templates/lesson-plan/constants";
import { useSearchParams } from "next/navigation";
import { useBookTypeByIdService } from "@/services/bookTypeServices";
import { toast } from "sonner";
import { BookLessonSelectorModal } from "@/components/modals/BookLessonSelectorModal";
import { TemplateSelector } from "@/components/modals/TemplateSelector";

export default function SlideEditorDemo() {
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedData, setHasLoadedData] = useState(false);
  const [isProcessingTemplate, setIsProcessingTemplate] = useState(false);
  const [shouldAutoNavigate, setShouldAutoNavigate] = useState(false);
  const [showBookLessonModal, setShowBookLessonModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("6"); // Default to "6"
  const [isAutoProcessing, setIsAutoProcessing] = useState(false);

  // Get template
  // const {
  //   data: template,
  //   isLoading: isLoadingTemplate,
  //   error,
  // } = useSlideTemplateByIdService("6");

  const {
    data: templateDetail,
    isLoading: isLoadingTemplate,
    error,
  } = useSlideTemplateDetailByIdService(selectedTemplateId);

  // Process JSON template service
  const processJsonMutation = useProcessJsonTemplateService();
  const { mutate: executeTool } = useExecuteToolService();
  const [wsUrl] = useState(WEBSOCKET_CONFIG.url);
  const [topic] = useState(WEBSOCKET_CONFIG.topic);
  const [enabled, setEnabled] = useState(true);
  const {
    data: websocketData,
    isConnected,
    error: socketError,
    sendMessage,
    reconnect,
  } = useSimpleWebSocket({
    url: wsUrl,
    topic: topic,
    enabled: enabled,
  });
  const [finalData, setFinalData] = useState<any>(null);

  useEffect(() => {
    setFinalData(websocketData);
    console.log(
      "🔍 websocketData received:",
      websocketData?.partial_result?.processed_template?.slides
    );

    const newSlides = websocketData?.partial_result?.processed_template?.slides;
    if (newSlides && newSlides.length > 0) {
      setSlides(newSlides);
      setHasLoadedData(true);
      setShouldAutoNavigate(true); // Enable auto-navigation for WebSocket data

      // Auto navigate to the last slide (newest)
      console.log(`🎯 Auto navigating to slide ${newSlides.length} (latest)`);
      // Note: SlideEditorLayout will handle the current slide index internally
    }
  }, [websocketData]);
  const searchParams = useSearchParams();
  const query = searchParams.get("bookTypeId");

  const { data: bookType } = useBookTypeByIdService(query || "");

  // Execute tool when data is ready
  // useEffect(() => {
  //   if (bookType?.data?.id && templateDetail?.data) {
  //     const payload = {
  //       toolId: bookType.data.id,
  //       toolType: "INTERNAL",
  //       book_id: 4,
  //       lesson_id: "42",
  //       input: templateDetail.data,
  //     };

  //     executeTool(payload, {
  //       onSuccess: (e: any) => {
  //         toast.success("Gửi dữ liệu thành công!");
  //         console.log(e.data.task_id);
  //         setEnabled(true);
  //       },
  //       onError: (error) => {
  //         toast.error("Gửi dữ liệu thất bại!");
  //         console.error(error);
  //       },
  //     });
  //   }
  // }, [bookType?.data?.id, templateDetail?.data, executeTool]);

  // Console.log template - Don't auto-trigger, wait for user action
  useEffect(() => {
    if (templateDetail) {
      console.log("🎯 Template loaded:", templateDetail);
      // Don't auto-trigger here, wait for user to click "Chọn mẫu này"
    }
    if (error) {
      console.error("❌ Error loading template:", error);
    }
  }, [templateDetail, error]);

  // Auto show book/lesson modal first on load (optional)
  useEffect(() => {
    if (!selectedBookId && !selectedLessonId) {
      const timer = setTimeout(() => {
        setShowBookLessonModal(true);
      }, 1000); // Show after 1 second

      return () => clearTimeout(timer);
    }
  }, [selectedBookId, selectedLessonId]);

  // User can choose template anytime, no dependency on book/lesson selection

  // Function để lọc ra chỉ giữ lại elements có type "text" từ template
  const filterTextElementsFromTemplate = (templateData: any) => {
    console.log("🔍 Filtering to keep only text elements from template...");

    if (!templateData?.data?.textBlocks?.slides) {
      console.log("❌ No slides found in template");
      return null;
    }

    const originalSlides = templateData.data.textBlocks.slides;

    // Clone template structure và chỉ giữ text elements
    const filteredTemplate = {
      ...templateData.data.textBlocks,
      slides: originalSlides.map((slide: any) => {
        // Chỉ giữ lại elements có type là "text"
        const textElements = slide.elements.filter(
          (element: any) => element.type === "text"
        );

        console.log(`📄 Slide "${slide.title}":`, {
          originalElements: slide.elements.length,
          textElements: textElements.length,
          filteredOut: slide.elements.length - textElements.length,
        });

        return {
          ...slide,
          elements: textElements,
        };
      }),
    };

    console.log("✅ Filtered template (text only):", {
      totalSlides: filteredTemplate.slides.length,
      originalElementsCount: originalSlides.reduce(
        (sum: number, slide: any) => sum + slide.elements.length,
        0
      ),
      filteredElementsCount: filteredTemplate.slides.reduce(
        (sum: number, slide: any) => sum + slide.elements.length,
        0
      ),
    });

    return filteredTemplate;
  };

  // Function để post data về BE
  const handleProcessTemplate = async (templateData: any) => {
    // Check if book and lesson are selected
    if (!selectedBookId || !selectedLessonId) {
      setShowBookLessonModal(true);
      return;
    }

    try {
      setIsProcessingTemplate(true);
      console.log("📤 Posting template data to BE...");
      console.log("📚 Using Book ID:", selectedBookId);
      console.log("📖 Using Lesson ID:", selectedLessonId);

      const result = await processJsonMutation.mutateAsync({
        lesson_id: selectedLessonId,
        book_id: selectedBookId,
        template: templateData, // Template data từ API
        config_prompt: "", // Trống
      });

      // console.log("✅ Process result:", result);

      // // Merge processed slides với template elements
      // const processedSlides = result.data.processed_template.slides;

      // const mergedSlides = mergeProcessedSlidesWithTemplate(
      //   processedSlides,
      //   template.data.textBlocks.slides
      // );

      // Set merged slides vào editor
      // setSlides(mergedSlides);
      // setHasLoadedData(true);
    } catch (error) {
      console.error("❌ Error processing template:", error);
    } finally {
      setIsProcessingTemplate(false);
    }
  };

  // Reset auto-navigate flag when manually loading data
  const handleLoadSampleData = async () => {
    setIsLoading(true);
    setShouldAutoNavigate(false); // Don't auto-navigate for manual data load
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

  const handleClearData = () => {
    setSlides([]);
    setHasLoadedData(false);
    setShouldAutoNavigate(false); // Reset auto-navigate flag
  };

  // Handle book and lesson selection
  const handleBookLessonConfirm = (bookId: string, lessonId: string) => {
    setSelectedBookId(bookId);
    setSelectedLessonId(lessonId);
    console.log("✅ Selected Book ID:", bookId);
    console.log("✅ Selected Lesson ID:", lessonId);

    // Auto show template selector after book/lesson selection
    setTimeout(() => {
      setShowTemplateSelector(true);
    }, 500);
  };

  // Handle template selection - Only trigger when user clicks "Chọn mẫu này"
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    console.log("✅ Selected Template ID:", templateId);

    // Trigger manual functions when user selects template (clicks "Chọn mẫu này")
    setTimeout(() => {
      triggerManualFunctions();
    }, 500); // Small delay to ensure template data is loaded
  };

  // Extract manual trigger functions
  const triggerManualFunctions = () => {
    // Check if we have all required information
    if (!selectedBookId || !selectedLessonId) {
      toast.error("⚠️ Vui lòng chọn sách và bài học trước khi xử lý!");
      setShowBookLessonModal(true);
      return;
    }

    if (!selectedTemplateId || !templateDetail?.data) {
      toast.error("⚠️ Vui lòng chọn template trước khi xử lý!");
      setShowTemplateSelector(true);
      return;
    }

    console.log("🚀 Triggering processing with:", {
      bookId: selectedBookId,
      lessonId: selectedLessonId,
      templateId: selectedTemplateId,
    });
    setIsAutoProcessing(true);
    toast.success("🚀 Bắt đầu xử lý template...");

    // Manually trigger executeTool
    if (
      bookType?.data?.id &&
      templateDetail?.data &&
      selectedBookId &&
      selectedLessonId
    ) {
      const payload = {
        toolId: bookType.data.id,
        toolType: "INTERNAL",
        book_id: parseInt(selectedBookId),
        lesson_id: selectedLessonId,
        input: templateDetail.data,
      };

      executeTool(payload, {
        onSuccess: (e: any) => {
          toast.success("Gửi dữ liệu thành công!");
          console.log("✅ Task ID:", e.data.task_id);
          setEnabled(true);
          setIsAutoProcessing(false);
        },
        onError: (error) => {
          toast.error("Gửi dữ liệu thất bại!");
          console.error(error);
          setIsAutoProcessing(false);
        },
      });
    }

    // Manually trigger template processing
    if (templateDetail) {
      console.log("🎯 Trigger - Template processing:", templateDetail);
      handleProcessTemplate(templateDetail);
    }
  };

  return (
    <div className="h-screen relative">
      {/* Loading overlay khi đang process template */}
      {isProcessingTemplate && (
        <div className="fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
            <div className="flex flex-col items-center gap-3">
              <Loading />
              <span className="text-gray-700 font-questrial">
                Đang xử lý template...
              </span>
            </div>
          </div>
        </div>
      )}

      <SlideEditorLayout
        initialSlides={slides}
        onLoadSampleData={handleLoadSampleData}
        onClearData={handleClearData}
        isLoadingData={isLoading}
        hasLoadedData={hasLoadedData}
        autoNavigateToLast={shouldAutoNavigate} // Auto navigate to newest slide from WebSocket
        onAutoNavigated={() => setShouldAutoNavigate(false)} // Reset flag after navigation
      />

      {/* Template Selection Info */}
      <div className="absolute top-4 left-4 z-50 bg-purple-50 border border-purple-200 rounded-lg p-3 max-w-sm">
        <h4 className="font-semibold text-purple-800 mb-2">🎨 Template:</h4>
        <div className="space-y-1 text-xs">
          <p>
            <strong>Template ID:</strong> {selectedTemplateId}
          </p>
          {templateDetail?.data?.name && (
            <p>
              <strong>Tên:</strong> {templateDetail.data.name}
            </p>
          )}
          {isAutoProcessing && (
            <p className="text-orange-600 font-medium">
              🚀 Đang xử lý tự động...
            </p>
          )}
        </div>
        <button
          onClick={() => setShowTemplateSelector(true)}
          className="mt-2 px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
          disabled={isAutoProcessing}
        >
          Thay đổi template
        </button>
      </div>

      {/* Workflow Progress Indicator */}
      <div className="absolute top-32 left-4 z-50 bg-white border border-gray-200 rounded-lg p-4 max-w-sm shadow-lg">
        <h4 className="font-semibold text-gray-800 mb-3">📋 Tiến trình:</h4>

        {/* Step 1 */}
        <div
          className={`flex items-center gap-2 mb-2 ${
            selectedBookId && selectedLessonId
              ? "text-green-600"
              : "text-gray-500"
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              selectedBookId && selectedLessonId
                ? "bg-green-500 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {selectedBookId && selectedLessonId ? "✓" : "1"}
          </span>
          <span className="text-sm">Chọn sách & bài học</span>
        </div>

        {/* Step 2 */}
        <div
          className={`flex items-center gap-2 mb-2 ${
            selectedTemplateId !== "6" ? "text-green-600" : "text-gray-500"
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              selectedTemplateId !== "6"
                ? "bg-green-500 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {selectedTemplateId !== "6" ? "✓" : "2"}
          </span>
          <span className="text-sm">Chọn template</span>
        </div>

        {/* Step 3 */}
        <div
          className={`flex items-center gap-2 ${
            isAutoProcessing ? "text-orange-600" : "text-gray-500"
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              isAutoProcessing
                ? "bg-orange-500 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {isAutoProcessing ? "⏳" : "3"}
          </span>
          <span className="text-sm">Xử lý template</span>
        </div>

        {/* Current step info */}
        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
          {!selectedBookId || !selectedLessonId ? (
            <p>👆 Bắt đầu bằng việc chọn sách và bài học</p>
          ) : selectedTemplateId === "6" ? (
            <p>👆 Tiếp theo, chọn template slide</p>
          ) : isAutoProcessing ? (
            <p>⏳ Đang xử lý, vui lòng chờ...</p>
          ) : (
            <p>✅ Sẵn sàng! Template sẽ được xử lý khi bạn chọn.</p>
          )}
        </div>
      </div>

      {/* Action Buttons - Step by step workflow */}
      <div className="absolute bottom-4 right-4 z-50 flex gap-2">
        {/* Step 1: Book/Lesson Selector Button */}
        <button
          onClick={() => setShowBookLessonModal(true)}
          className={`px-4 py-2 rounded-lg transition-colors shadow-lg ${
            selectedBookId && selectedLessonId
              ? "bg-green-600 text-white"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {selectedBookId && selectedLessonId ? "✅" : "1️⃣"} Chọn sách & bài học
        </button>

        {/* Step 2: Template Selector Button - Only show after step 1 */}
        {selectedBookId && selectedLessonId && (
          <button
            onClick={() => setShowTemplateSelector(true)}
            className={`px-4 py-2 rounded-lg transition-colors shadow-lg ${
              selectedTemplateId !== "6"
                ? "bg-purple-600 text-white"
                : "bg-purple-500 text-white hover:bg-purple-600"
            }`}
          >
            {selectedTemplateId !== "6" ? "✅" : "2️⃣"} Chọn template
          </button>
        )}

        {/* Manual Trigger Button - For debugging */}
        <button
          onClick={triggerManualFunctions}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
          disabled={
            !bookType?.data?.id || !templateDetail?.data || isAutoProcessing
          }
        >
          🚀 Manual Trigger
        </button>
      </div>

      {/* Template Selector Modal */}
      <TemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelectTemplate={handleTemplateSelect}
        title="Chọn mẫu slide"
      />

      {/* Book & Lesson Selector Modal */}
      <BookLessonSelectorModal
        isOpen={showBookLessonModal}
        onClose={() => setShowBookLessonModal(false)}
        onConfirm={handleBookLessonConfirm}
        title="Chọn sách và bài học để xử lý template"
      />
    </div>
  );
}
