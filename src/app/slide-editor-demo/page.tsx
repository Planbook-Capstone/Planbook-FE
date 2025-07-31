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
import { useSearchParams } from "next/navigation";
import { useBookTypeByIdService } from "@/services/bookTypeServices";
import { toast } from "sonner";
import { BookLessonSelectorModal } from "@/components/modals/BookLessonSelectorModal";
import { TemplateSelector } from "@/components/modals/TemplateSelector";
import { WEBSOCKET_CONFIG } from "@/config/websocket";
import { useAppStore } from "@/store";

export default function SlideEditorDemo() {
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedData, setHasLoadedData] = useState(false);
  const [isProcessingTemplate, setIsProcessingTemplate] = useState(false);
  const [shouldAutoNavigate, setShouldAutoNavigate] = useState(false);
  const [showBookLessonModal, setShowBookLessonModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string>();
  const [selectedLessonId, setSelectedLessonId] = useState<string>();
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(); // Default to "6"
  const [isAutoProcessing, setIsAutoProcessing] = useState(false);
  const [shouldTriggerAfterTemplateLoad, setShouldTriggerAfterTemplateLoad] =
    useState(false);

  const {
    data: templateDetail,
    isLoading: isLoadingTemplate,
    error,
  } = useSlideTemplateDetailByIdService(selectedTemplateId);

  // Process JSON template service
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
    console.log("🔍 WebSocket data received:", websocketData);
    setFinalData(websocketData);
    const newSlides = websocketData?.partial_result?.processed_template?.slides;
    if (newSlides && newSlides.length > 0) {
      setSlides(newSlides);
      setHasLoadedData(true);
      setShouldAutoNavigate(true); // Enable auto-navigation for WebSocket data

      // Note: SlideEditorLayout will handle the current slide index internally
    }
  }, [websocketData]);
  const searchParams = useSearchParams();
  const query = searchParams.get("bookTypeId");

  const { data: bookType } = useBookTypeByIdService(query || "");

  // Console.log template - Don't auto-trigger, wait for user action
  useEffect(() => {
    if (templateDetail) {
      // Auto-trigger if flag is set (after user selected template)
      if (
        shouldTriggerAfterTemplateLoad &&
        selectedBookId &&
        selectedLessonId
      ) {
        setShouldTriggerAfterTemplateLoad(false); // Reset flag
        triggerManualFunctions();
      }
    }
    if (error) {
      toast.error(
        `${error?.response?.data || "Có lỗi xảy ra khi gửi dữ liệu"}`
      );
    }
  }, [
    templateDetail,
    error,
    shouldTriggerAfterTemplateLoad,
    selectedBookId,
    selectedLessonId,
  ]);

  // Auto show book/lesson modal first on load (optional)
  useEffect(() => {
    if (!selectedBookId && !selectedLessonId) {
      const timer = setTimeout(() => {
        setShowBookLessonModal(true);
      }, 1000); // Show after 1 second

      return () => clearTimeout(timer);
    }
  }, [selectedBookId, selectedLessonId]);

  // Function để post data về BE
  const handleProcessTemplate = async (templateData: any) => {
    // Check if book and lesson are selected
    if (!selectedBookId || !selectedLessonId) {
      setShowBookLessonModal(true);
      return;
    }

    try {
      setIsProcessingTemplate(true);
    } catch (error: any) {
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
    } catch (error: any) {
      toast.error(
        `Lỗi khi tải dữ liệu mẫu: ${error?.message || "Có lỗi xảy ra"}`
      );
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
    // Auto show template selector after book/lesson selection
    setTimeout(() => {
      setShowTemplateSelector(true);
    }, 500);
  };

  // Handle template selection - Only trigger when user clicks "Chọn mẫu này"
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);

    // Set flag to trigger after template loads
    setShouldTriggerAfterTemplateLoad(true);
  };

  // Extract manual trigger functions
  const triggerManualFunctions = () => {
    // Check if we have all required information
    if (!selectedBookId || !selectedLessonId) {
      toast.error("Vui lòng chọn sách và bài học trước khi xử lý!");
      setShowBookLessonModal(true);
      return;
    }

    if (!selectedTemplateId || !templateDetail?.data) {
      toast.error("Vui lòng chọn template trước khi xử lý!");
      setShowTemplateSelector(true);
      return;
    }

    setIsAutoProcessing(true);
    toast.success("Bắt đầu xử lý template...");

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
        workspaceId: 1,
      };

      executeTool(payload, {
        onSuccess: (response: any) => {
          toast.success("Gửi dữ liệu thành công!");
          toast.success("Vui lòng chờ trong giây lát...");

          setEnabled(true);
          setIsAutoProcessing(false);
        },
        onError: (error: any) => {
          toast.error(
            `Gửi dữ liệu thất bại: ${
              error?.response?.data?.message ||
              error?.message ||
              "Có lỗi xảy ra khi xử lý"
            }`
          );
          setIsAutoProcessing(false);
        },
      });
    }

    if (templateDetail) {
      handleProcessTemplate(templateDetail);
    }
  };

  const { user, setUser } = useAppStore();

  // Test function to toggle role for development
  const toggleRole = () => {
    if (user) {
      setUser({
        ...user,
        role: user.role === "teacher" ? "admin" : "teacher",
      });
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
            </div>
          </div>
        </div>
      )}

      {selectedTemplateId && (
        <SlideEditorLayout
          initialSlides={slides}
          onLoadSampleData={handleLoadSampleData}
          onClearData={handleClearData}
          isLoadingData={isLoading}
          hasLoadedData={hasLoadedData}
          userRole={user?.role}
          autoNavigateToLast={shouldAutoNavigate} // Auto navigate to newest slide from WebSocket
          onAutoNavigated={() => setShouldAutoNavigate(false)} // Reset flag after navigation
        />
      )}

      {/* Template Selector Modal */}
      {selectedLessonId && (
        <TemplateSelector
          isOpen={showTemplateSelector}
          onClose={() => setShowTemplateSelector(false)}
          onSelectTemplate={handleTemplateSelect}
          title="Chọn mẫu slide"
        />
      )}

      {/* Book & Lesson Selector Modal */}
      {!selectedBookId && (
        <BookLessonSelectorModal
          isOpen={showBookLessonModal}
          onClose={() => setShowBookLessonModal(false)}
          onConfirm={handleBookLessonConfirm}
          title="Chọn sách và bài học"
        />
      )}
    </div>
  );
}
