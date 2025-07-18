"use client";

import React, { useState } from "react";
import { SlideEditorLayout } from "@/components/ui/slide-editor";
import { convertGoogleSlideJsonToEditor } from "@/utils/googleSlidesConverter";
import sampleData from "@/data/sample-presentation.json";
import { Upload, FileText, Loader2 } from "lucide-react";

export default function SlideEditorDemo() {
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedData, setHasLoadedData] = useState(false);

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
