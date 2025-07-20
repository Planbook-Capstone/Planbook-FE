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
  } = useSlideTemplateByIdService("5");

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

  // Function để merge template slides với processed slides
  const mergeTemplateWithProcessedSlides = (
    templateSlides: any[],
    processedSlides: any[]
  ) => {
    console.log("🔄 Merging template slides with processed slides...");

    // Tạo map từ title để dễ tìm kiếm
    const processedSlidesMap = new Map();
    processedSlides.forEach((slide) => {
      processedSlidesMap.set(slide.title, slide);
    });

    // Merge slides
    const mergedSlides = templateSlides.map((templateSlide) => {
      const processedSlide = processedSlidesMap.get(templateSlide.title);

      if (!processedSlide) {
        // Nếu không có processed slide tương ứng, giữ nguyên template slide
        console.log(`⚠️ No processed slide found for: ${templateSlide.title}`);
        return templateSlide;
      }

      // Lọc elements từ template: chỉ giữ images, loại bỏ text
      const templateNonTextElements = templateSlide.elements.filter(
        (element: any) => element.type !== "text"
      );

      // Lấy text elements từ processed slide
      const processedTextElements = processedSlide.elements.filter(
        (element: any) => element.type === "text"
      );

      // Merge: images từ template + text từ processed
      const mergedElements = [
        ...templateNonTextElements, // Images, shapes, etc từ template
        ...processedTextElements, // Text content từ processed
      ];

      console.log(`✅ Merged slide: ${templateSlide.title}`, {
        templateNonText: templateNonTextElements.length,
        processedText: processedTextElements.length,
        total: mergedElements.length,
      });

      return {
        ...templateSlide, // Giữ structure từ template
        elements: mergedElements, // Elements đã merge
        // Có thể giữ background, isVisible từ template
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

      // Merge template slides với processed slides
      const templateSlides = templateData.slides;
      const processedSlides = result.data.processed_template.slides;

      const mergedSlides = mergeTemplateWithProcessedSlides(
        templateSlides,
        processedSlides
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
