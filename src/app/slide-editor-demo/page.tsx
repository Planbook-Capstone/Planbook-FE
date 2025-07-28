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

export default function SlideEditorDemo() {
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedData, setHasLoadedData] = useState(false);
  const [isProcessingTemplate, setIsProcessingTemplate] = useState(false);
  const [shouldAutoNavigate, setShouldAutoNavigate] = useState(false);

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
  } = useSlideTemplateDetailByIdService("6");

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

  // Console.log template số 4
  useEffect(() => {
    if (templateDetail) {
      console.log("🎯 Template số 4:", templateDetail);

      // Test filter function
      // const filteredTemplate = filterTextElementsFromTemplate(templateDetail);
      // console.log(
      //   "🎯 Filtered template (text elements only):",
      //   filteredTemplate
      // );

      // Post data về BE khi có template
      handleProcessTemplate(templateDetail);
    }
    if (error) {
      console.error("❌ Error loading template 4:", error);
    }
  }, [templateDetail, error]);

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
    try {
      setIsProcessingTemplate(true);
      console.log("📤 Posting template data to BE...");

      const result = await processJsonMutation.mutateAsync({
        lesson_id: "2",
        book_id: "1",
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

      {/* Debug Button */}
      <div className="absolute bottom-4 right-4 z-50">
        <button
          onClick={() => {
            // Manually trigger executeTool
            if (bookType?.data?.id && templateDetail?.data) {
              const payload = {
                toolId: bookType.data.id,
                toolType: "INTERNAL",
                book_id: 4,
                lesson_id: "42",
                input: templateDetail.data,
              };

              executeTool(payload, {
                onSuccess: (e: any) => {
                  toast.success("Gửi dữ liệu thành công!");

                  setEnabled(true);
                },
                onError: (error) => {
                  toast.error("Gửi dữ liệu thất bại!");
                  console.error(error);
                },
              });
            }

            // Manually trigger template processing
            if (templateDetail) {
              console.log("🎯 Manual trigger - Template số 4:", templateDetail);
              handleProcessTemplate(templateDetail);
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
          disabled={!bookType?.data?.id || !templateDetail?.data}
        >
          🚀 Manual Trigger
        </button>
      </div>
    </div>
  );
}
