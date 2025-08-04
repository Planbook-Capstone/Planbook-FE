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
import { useSearchParams, useRouter } from "next/navigation";
import { useBookTypeByIdService } from "@/services/bookTypeServices";
import { toast } from "sonner";
import { BookLessonSelectorModal } from "@/components/modals/BookLessonSelectorModal";
import { TemplateSelector } from "@/components/modals/TemplateSelector";
import { WEBSOCKET_CONFIG } from "@/config/websocket";
import { useAppStore } from "@/store";
import {
  useCreateToolResultService,
  useToolResultByIdService,
  useUpdateToolResultService,
} from "@/services/toolResultService";
import { SaveToolResultModal } from "@/components/modals/SaveToolResultModal";

// Helper function to normalize text from API (convert object to string)
const normalizeTextFromAPI = (text: any): string => {
  if (typeof text === "string") {
    return text;
  }

  if (typeof text === "object" && text !== null) {
    // Convert object like {"0": "line1", "1": "line2"} to "line1\nline2"
    const keys = Object.keys(text).sort((a, b) => parseInt(a) - parseInt(b));
    return keys.map((key) => text[key]).join("\n");
  }

  return String(text || "");
};

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
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [completedResultId, setCompletedResultId] = useState<string | null>(
    null
  );

  // Loading progress state for AI generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationMessage, setGenerationMessage] = useState("");
  const [slideName, setSlideName] = useState<string>();

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
    if (websocketData?.result_id) {
      setCompletedResultId(websocketData.result_id);
      setIsGenerating(false);
      toast.success("Tạo slide hoàn thành!", {
        id: "slide-generation", // Replace loading toast
      });
    }
    setFinalData(websocketData);

    // Handle progress updates
    if (websocketData?.type === "progress") {
      const progress = websocketData.progress || 0;
      const message = websocketData.message || "";
      const status = websocketData.status || "";

      setGenerationProgress(progress);
      setGenerationMessage(message);

      // Start generation tracking
      if (
        progress > 0 &&
        progress < 100 &&
        websocketData?.tool_code === bookType?.data?.code
      ) {
        setIsGenerating(true);
        // Show progress toast with AI icon
        toast.loading(
          <div className="flex items-center gap-2">
            <img
              src="/loading/loading_AI.gif"
              alt="AI Loading"
              className="w-5 h-5"
            />
            <span>Đã hoàn thành slide ({progress}%)</span>
          </div>,
          {
            id: "slide-generation", // Use same ID to update existing toast
          }
        );
      }

      // Complete generation
      if (
        progress >= 100 ||
        status === "completed" ||
        websocketData?.result_id
      ) {
        setIsGenerating(false);
        toast.success("Tạo slide hoàn thành!", {
          id: "slide-generation", // Replace loading toast
        });
      }
    }

    const newSlides = websocketData?.partial_result?.processed_template?.slides;
    if (newSlides && newSlides.length > 0) {
      // Normalize text in all slides before setting
      const normalizedSlides = newSlides.map((slide: any) => {
        console.log("🔍 Processing slide:", {
          id: slide.id,
          hasElements: !!slide.elements,
          hasSlideData: !!slide.slideData,
          slideDataElements: slide.slideData?.elements?.length || 0,
        });

        // Debug slide background
        console.log("🎨 Slide background data:", {
          slideId: slide.id,
          slideBackground: slide.background,
          slideDataBackground: slide.slideData?.background,
          hasSlideData: !!slide.slideData,
        });

        // Process elements in slideData.elements (the actual elements)
        const normalizedSlideDataElements =
          slide.slideData?.elements?.map((element: any) => {
            console.log("🔍 Processing slideData element:", {
              id: element.id,
              type: element.type,
              originalText: element.text,
              textType: typeof element.text,
              isObject: typeof element.text === "object",
            });

            const normalizedText = element.text
              ? normalizeTextFromAPI(element.text)
              : element.text;

            console.log("✅ Normalized text:", {
              original: element.text,
              normalized: normalizedText,
              normalizedType: typeof normalizedText,
            });

            return {
              ...element,
              text: normalizedText,
            };
          }) || [];

        return {
          ...slide,
          // Keep original elements array (might be empty)
          elements: slide.elements || [],
          // Update slideData.elements with normalized text
          slideData: {
            ...slide.slideData,
            elements: normalizedSlideDataElements,
          },
        };
      });

      console.log("🔄 Normalized slides:", normalizedSlides);
      setSlides(normalizedSlides);
      setHasLoadedData(true);
      setShouldAutoNavigate(true); // Enable auto-navigation for WebSocket data

      // Note: SlideEditorLayout will handle the current slide index internally
    }
  }, [websocketData]);
  const searchParams = useSearchParams();
  const query = searchParams.get("bookTypeId");
  const router = useRouter();

  const { data: bookType } = useBookTypeByIdService(query || "");

  // Create tool result service
  const { mutate: updateToolResult, isPending: isSaving } =
    useUpdateToolResultService();

  // Get completed tool result
  const { data: toolResult } = useToolResultByIdService(
    completedResultId || "",
    {
      enabled: !!completedResultId,
    }
  );

  // Console log when tool result is completed
  useEffect(() => {
    if (toolResult?.data) {
      setSlideName(toolResult.data.name);
    }
  }, [toolResult]);

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
      // toast.error(
      //   `${error?.response?.data || "Có lỗi xảy ra khi gửi dữ liệu"}`
      // );
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
            text: element.text
              ? normalizeTextFromAPI(element.text)
              : element.text || "",
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
  const handleBookLessonConfirm = (
    bookId: string,
    lessonId: string,
    prompt?: string
  ) => {
    setSelectedBookId(bookId);
    setSelectedLessonId(lessonId);
    // Set user prompt if provided
    if (prompt) {
      setUserPrompt(prompt);
    }
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
        input: { user_config: userPrompt, data: templateDetail?.data },
        workspaceId: 1,
      };

      console.log({ user_config: userPrompt, data: payload.input });

      executeTool(payload, {
        onSuccess: (response: any) => {
          toast.success("Gửi dữ liệu thành công!");

          // Start generation tracking
          setIsGenerating(true);
          setGenerationProgress(0);
          setGenerationMessage("Đang khởi tạo...");

          toast.loading(
            <div className="flex items-center gap-2">
              <img
                src="/loading/loading_AI.gif"
                alt="AI Loading"
                className="w-5 h-5"
              />
              <span>AI đang tạo slide cho bạn...</span>
            </div>,
            {
              id: "slide-generation",
            }
          );

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

  // Function to export current slides as JSON data
  const exportSlidesAsJson = () => {
    if (!slides || slides.length === 0) {
      return null;
    }

    return {
      slides: slides.map((slide) => ({
        id: slide.id,
        elements: slide.slideData?.elements || slide.elements || [],
        background: slide.slideData?.background || slide.background || null,
      })),
      totalSlides: slides.length,
      createdAt: new Date().toISOString(),
    };
  };

  // Function to handle save lesson plan
  const handleSaveLessonPlan = (name: string, description: string) => {
    if (!user?.id) {
      toast.error("Không tìm thấy thông tin người dùng!");
      return;
    }

    if (!selectedTemplateId) {
      toast.error("Không tìm thấy template ID!");
      return;
    }

    if (!selectedLessonId) {
      toast.error("Không tìm thấy lesson ID!");
      return;
    }

    if (!completedResultId) {
      toast.error("Không tìm thấy result ID!");
      return;
    }

    const exportedData = exportSlidesAsJson();
    if (!exportedData) {
      toast.error("Không có dữ liệu slide để lưu!");
      return;
    }

    const payload = {
      userId: user.id,
      workspaceId: 1,
      type: "SLIDE",
      templateId: parseInt(selectedTemplateId),
      name: name,
      description: description,
      data: exportedData,
      status: "ARCHIVED",
      lessonIds: [parseInt(selectedLessonId)],
      updatedAt: new Date().toISOString(),
    };

    updateToolResult(
      { id: completedResultId || "", data: payload },
      {
        onSuccess: () => {
          toast.success("Lưu thành công!");
          setShowSaveModal(false);
          // Stay on current page after save
          setTimeout(() => {
            router.push("/home");
          }, 1000);
        },
        onError: (error: any) => {
          toast.error(
            `Lưu thất bại: ${
              error?.response?.data?.message ||
              error?.message ||
              "Có lỗi xảy ra"
            }`
          );
        },
      }
    );
  };

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
        <div className="h-screen flex flex-col">
          <SlideEditorLayout
            initialSlides={slides}
            templateData={{
              name: slideName || "Mẫu slide",
              description: templateDetail?.data?.description || "",
            }}
            onLoadSampleData={handleLoadSampleData}
            onClearData={handleClearData}
            isLoadingData={isLoading}
            hasLoadedData={hasLoadedData}
            userRole={user?.role}
            autoNavigateToLast={shouldAutoNavigate} // Auto navigate to newest slide from WebSocket
            onAutoNavigated={() => setShouldAutoNavigate(false)} // Reset flag after navigation
            isGenerating={isGenerating}
            generationProgress={generationProgress}
            totalSlides={websocketData?.partial_result?.total_slides || 0}
            onSave={(slides, textBlocks) => setShowSaveModal(true)}
          />
        </div>
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

      {/* Save Lesson Plan Modal */}
      <SaveToolResultModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveLessonPlan}
        isLoading={isSaving}
        initialData={null}
      />
    </div>
  );
}
