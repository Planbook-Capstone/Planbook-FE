"use client";

import React, { useState, useEffect } from "react";
import { SlideEditorLayout } from "@/components/ui/slide-editor";
import { convertGoogleSlideJsonToEditor } from "@/utils/googleSlidesConverter";
import sampleData from "@/data/sample-presentation.json";
import { Upload, FileText, Loader2 } from "lucide-react";
import {
  useSlideTemplateByIdService,
  useProcessJsonTemplateService,
} from "@/services/slideTemplateServices";

export default function SlideEditorDemo() {
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  // Get template
  const {
    data: template,
    isLoading: isLoadingTemplate,
    error,
  } = useSlideTemplateByIdService("6");

  // Process JSON template service
  const processJsonMutation = useProcessJsonTemplateService();

  // Console.log template số 4
  useEffect(() => {
    if (template) {
      console.log("🎯 Template số 4:", template);

      // Test filter function
      const filteredTemplate = filterTextElementsFromTemplate(template);
      console.log(
        "🎯 Filtered template (text elements only):",
        filteredTemplate
      );

      // Post data về BE khi có template
      handleProcessTemplate(filteredTemplate);
    }
    if (error) {
      console.error("❌ Error loading template 4:", error);
    }
  }, [template, error]);

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

  // Function để merge processed slides với template elements
  const mergeProcessedSlidesWithTemplate = (
    processedSlides: any[],
    templateSlides: any[]
  ) => {
    console.log("🔄 Merging processed slides with template elements...");

    // Tạo map từ title để dễ tìm kiếm template slides
    const templateSlidesMap = new Map();
    templateSlides.forEach((slide) => {
      templateSlidesMap.set(slide.title, slide);
    });

    // Merge slides - dùng processed slides làm gốc
    const mergedSlides = processedSlides.map((processedSlide) => {
      const templateSlide = templateSlidesMap.get(processedSlide.title);

      if (!templateSlide) {
        // Nếu không có template slide tương ứng, giữ nguyên processed slide
        console.log(`⚠️ No template slide found for: ${processedSlide.title}`);
        return processedSlide;
      }

      // Lấy tất cả elements từ processed slide (giữ nguyên)
      const processedElements = [...processedSlide.elements];

      console.log(templateSlide);
      // Lọc elements từ template: chỉ lấy những cái KHÔNG phải text
      const templateNonTextElements = templateSlide.elements.filter(
        (element: any) => element.type !== "text"
      );

      // Merge: giữ nguyên processed elements + thêm non-text elements từ template
      const mergedElements = [
        ...processedElements, // Giữ nguyên tất cả elements từ processed
        ...templateNonTextElements, // Thêm images, shapes, etc từ template
      ];

      console.log(`✅ Merged slide: ${processedSlide.title}`, {
        processedElements: processedElements.length,
        templateNonText: templateNonTextElements.length,
        total: mergedElements.length,
      });

      return {
        ...processedSlide, // Giữ structure từ processed slide
        elements: mergedElements, // Elements đã merge
        // Có thể override background từ template nếu cần
        background: templateSlide.background || processedSlide.background,
      };
    });

    console.log("🎯 Merge completed:", mergedSlides);
    return mergedSlides;
  };

  // Function để post data về BE
  const handleProcessTemplate = async (templateData: any) => {
    try {
      console.log("📤 Posting template data to BE...");

      const result = await processJsonMutation.mutateAsync({
        lesson_id: "1", // Mặc định là 1
        template: templateData, // Template data từ API
        config_prompt: "", // Trống
      });

      console.log("✅ Process result:", result);

      // Merge processed slides với template elements
      const processedSlides = result.data.processed_template.slides;
      const templateSlides = templateData.slides;

      const mergedSlides = mergeProcessedSlidesWithTemplate(
        processedSlides,
        template.data.textBlocks.slides
      );

      // Set merged slides vào editor
      setSlides(mergedSlides);
      setHasLoadedData(true);

      console.log("🎉 Merged slides loaded into editor!");
    } catch (error) {
      console.error("❌ Error processing template:", error);
    }
  };

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

  const handleClearData = () => {
    setSlides([]);
    setHasLoadedData(false);
  };

  return (
    <div className="h-screen">
      <SlideEditorLayout
        initialSlides={slides}
        onLoadSampleData={handleLoadSampleData}
        onClearData={handleClearData}
        isLoadingData={isLoading}
        hasLoadedData={hasLoadedData}
      />
    </div>
  );
}
