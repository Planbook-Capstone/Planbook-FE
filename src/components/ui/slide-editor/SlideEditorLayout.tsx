"use client";

import React, { useState, useCallback } from "react";
import { SlideElement, TextElement as TextElementType } from "@/types";
import SlideEditorHeader from "./SlideEditorHeader";
import SlideEditorSidebar from "./SlideEditorSidebar";
import EditorCanvas from "./EditorCanvas";
import TextToolbar from "./TextToolbar";
import HorizontalSlidePanel from "./HorizontalSlidePanel";
import { SlideEditorDirector } from "./SlideEditorDirector";
import { useSlideExport } from "@/hooks/useSlideExport";
import { SlideData } from "@/utils/pptxExporter";

interface Slide {
  id: string;
  title: string;
  elements: SlideElement[];
  isVisible: boolean;
}

export default function SlideEditorLayout() {
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: "slide-1",
      title: "Slide 1",
      elements: [],
      isVisible: true,
    },
  ]);
  const [currentSlideId, setCurrentSlideId] = useState<string>("slide-1");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [slideFormat, setSlideFormat] = useState<"16:9" | "4:3">("16:9");

  // Export functionality
  const { exportSlides, isExporting, error: exportError } = useSlideExport();

  // Get current slide
  const currentSlide = slides.find((slide) => slide.id === currentSlideId);
  const elements = currentSlide?.elements || [];

  // Get selected element
  const selectedElement = elements.find(
    (el) => el.id === selectedElementId
  ) as TextElementType | null;

  // Handle adding new element
  const handleAddElement = useCallback(
    (element: SlideElement) => {
      setSlides((prev) =>
        prev.map((slide) =>
          slide.id === currentSlideId
            ? { ...slide, elements: [...slide.elements, element] }
            : slide
        )
      );
      setSelectedElementId(element.id);
    },
    [currentSlideId]
  );

  // Handle updating element
  const handleUpdateElement = useCallback(
    (id: string, updates: Partial<SlideElement>) => {
      setSlides((prev: any) =>
        prev.map((slide: any) =>
          slide.id === currentSlideId
            ? {
                ...slide,
                elements: slide.elements.map((el: any) =>
                  el.id === id ? { ...el, ...updates } : el
                ),
              }
            : slide
        )
      );
    },
    [currentSlideId]
  );

  // Handle deleting element
  const handleDeleteElement = useCallback(
    (id: string) => {
      setSlides((prev) =>
        prev.map((slide) =>
          slide.id === currentSlideId
            ? {
                ...slide,
                elements: slide.elements.filter((el) => el.id !== id),
              }
            : slide
        )
      );
      if (selectedElementId === id) {
        setSelectedElementId(null);
      }
    },
    [currentSlideId, selectedElementId]
  );

  // Handle adding text element
  const handleAddText = useCallback(() => {
    const canvasWidth = slideFormat === "16:9" ? 960 : 960;
    const canvasHeight = slideFormat === "16:9" ? 540 : 720;

    const newTextElement: TextElementType = {
      id: `text-${Date.now()}`,
      type: "text",
      x: Math.random() * (canvasWidth - 200) + 50,
      y: Math.random() * (canvasHeight - 100) + 50,
      width: 200,
      height: 50,
      text: "New Text",
      style: {
        fontSize: 16,
        fontFamily: "Arial, sans-serif",
        bold: false,
        italic: false,
        underline: false,
        color: "#000000",
        textAlign: "left",
      },
    };
    handleAddElement(newTextElement);
  }, [slideFormat, handleAddElement]);

  // Handle adding heading text (72px, bold)
  const handleAddHeading = useCallback(() => {
    const canvasWidth = slideFormat === "16:9" ? 960 : 960;
    const canvasHeight = slideFormat === "16:9" ? 540 : 720;

    const newTextElement: TextElementType = {
      id: `text-${Date.now()}`,
      type: "text",
      x: Math.random() * (canvasWidth - 300) + 50,
      y: Math.random() * (canvasHeight - 100) + 50,
      width: 300,
      height: 80,
      text: "Heading",
      style: {
        fontSize: 72,
        fontFamily: "Arial, sans-serif",
        bold: true,
        italic: false,
        underline: false,
        color: "#000000",
        textAlign: "left",
      },
    };
    handleAddElement(newTextElement);
  }, [slideFormat, handleAddElement]);

  // Handle adding subheading text (36px, bold)
  const handleAddSubheading = useCallback(() => {
    const canvasWidth = slideFormat === "16:9" ? 960 : 960;
    const canvasHeight = slideFormat === "16:9" ? 540 : 720;

    const newTextElement: TextElementType = {
      id: `text-${Date.now()}`,
      type: "text",
      x: Math.random() * (canvasWidth - 250) + 50,
      y: Math.random() * (canvasHeight - 100) + 50,
      width: 250,
      height: 60,
      text: "Subheading",
      style: {
        fontSize: 36,
        fontFamily: "Arial, sans-serif",
        bold: true,
        italic: false,
        underline: false,
        color: "#000000",
        textAlign: "left",
      },
    };
    handleAddElement(newTextElement);
  }, [slideFormat, handleAddElement]);

  // Handle adding body text (18px, normal)
  const handleAddBodyText = useCallback(() => {
    const canvasWidth = slideFormat === "16:9" ? 960 : 960;
    const canvasHeight = slideFormat === "16:9" ? 540 : 720;

    const newTextElement: TextElementType = {
      id: `text-${Date.now()}`,
      type: "text",
      x: Math.random() * (canvasWidth - 200) + 50,
      y: Math.random() * (canvasHeight - 100) + 50,
      width: 200,
      height: 40,
      text: "Body text",
      style: {
        fontSize: 18,
        fontFamily: "Arial, sans-serif",
        bold: false,
        italic: false,
        underline: false,
        color: "#000000",
        textAlign: "left",
      },
    };
    handleAddElement(newTextElement);
  }, [slideFormat, handleAddElement]);

  // Handle updating text style
  const handleUpdateTextStyle = useCallback(
    (id: string, styleUpdates: any) => {
      setSlides((prev) =>
        prev.map((slide) =>
          slide.id === currentSlideId
            ? {
                ...slide,
                elements: slide.elements.map((el) => {
                  if (el.id === id && el.type === "text") {
                    return {
                      ...el,
                      style: { ...el.style, ...styleUpdates },
                    };
                  }
                  return el;
                }),
              }
            : slide
        )
      );
    },
    [currentSlideId]
  );

  // Handle adding new slide
  const handleAddSlide = useCallback(() => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title: `Slide ${slides.length + 1}`,
      elements: [],
      isVisible: true,
    };
    setSlides((prev) => [...prev, newSlide]);
    setCurrentSlideId(newSlide.id);
  }, [slides.length]);

  // Handle slide selection
  const handleSlideSelect = useCallback((slideId: string) => {
    setCurrentSlideId(slideId);
    setSelectedElementId(null);
  }, []);

  // Handle slide duplication
  const handleSlideDuplicate = useCallback(
    (slideId: string) => {
      const slideToClone = slides.find((s) => s.id === slideId);
      if (slideToClone) {
        const newSlide: Slide = {
          ...slideToClone,
          id: `slide-${Date.now()}`,
          title: `${slideToClone.title} Copy`,
          elements: slideToClone.elements.map((el) => ({
            ...el,
            id: `${el.id}-copy-${Date.now()}`,
          })),
        };
        setSlides((prev) => [...prev, newSlide]);
      }
    },
    [slides]
  );

  // Handle slide deletion
  const handleSlideDelete = useCallback(
    (slideId: string) => {
      if (slides.length > 1) {
        setSlides((prev) => prev.filter((s) => s.id !== slideId));
        if (currentSlideId === slideId) {
          const remainingSlides = slides.filter((s) => s.id !== slideId);
          setCurrentSlideId(remainingSlides[0]?.id || "");
        }
      }
    },
    [slides, currentSlideId]
  );

  // Handle slide visibility toggle
  const handleSlideToggleVisibility = useCallback((slideId: string) => {
    setSlides((prev) =>
      prev.map((slide) =>
        slide.id === slideId ? { ...slide, isVisible: !slide.isVisible } : slide
      )
    );
  }, []);

  // Handle save
  const handleSave = useCallback(() => {
    const slideData = {
      id: `slide-${Date.now()}`,
      elements,
      background: "#ffffff",
      format: slideFormat,
    };

    const dataStr = JSON.stringify(slideData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "slide-data.json";
    link.click();

    URL.revokeObjectURL(url);
  }, [elements, slideFormat]);

  // Handle export PPTX
  const handleExportPPTX = useCallback(async () => {
    try {
      // Convert slides to export format
      const slidesToExport: SlideData[] = slides.map((slide) => ({
        id: slide.id,
        title: slide.title,
        elements: slide.elements.map((element) => ({
          id: element.id,
          type: element.type,
          x: element.x,
          y: element.y,
          width: element.width,
          height: element.height,
          text: (element as any).text,
          style: (element as any).style,
        })),
        isVisible: slide.isVisible,
      }));

      const result = await exportSlides(slidesToExport, {
        filename: `presentation-${new Date().toISOString().split("T")[0]}.pptx`,
        includeHiddenSlides: false,
      });

      if (result.success) {
        console.log(
          `✅ Exported ${result.slideCount} slides to ${result.filename}`
        );
        alert(`Successfully exported ${result.slideCount} slides!`);
      } else {
        console.error("❌ Export failed:", result.error);
        alert(`Export failed: ${result.error}`);
      }
    } catch (error) {
      console.error("❌ Export error:", error);
      alert(`Export error: ${error}`);
    }
  }, [slides, exportSlides]);

  // Handle import (placeholder)
  const handleImport = useCallback(() => {
    console.log("Import functionality coming soon...");
  }, []);

  const menuItems = [
    {
      label: "Năm học",
      key: "workspace",
      image: "/icons/academic.svg",
      active: "/icons/academic-active.svg",
    },
    {
      label: "Quản lí sách",
      key: "resource",
      image: "/icons/folder.svg",
      active: "/icons/folder-active.svg",
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <SlideEditorHeader
        onSave={handleSave}
        onExportPPTX={handleExportPPTX}
        onImport={handleImport}
        slideCount={slides.length}
        currentSlide={slides.findIndex((s) => s.id === currentSlideId) + 1}
        isExporting={isExporting}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* SlideEditorDirector - Tab Navigation */}
        <SlideEditorDirector menuItems={menuItems} />

        {/* Tools Sidebar */}
        <SlideEditorSidebar
          onAddText={handleAddText}
          onAddHeading={handleAddHeading}
          onAddSubheading={handleAddSubheading}
          onAddBodyText={handleAddBodyText}
        />

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Text Formatting Toolbar */}
          {selectedElement && selectedElement.type === "text" && (
            <div className="pt-2 flex justify-center ">
              <TextToolbar
                selectedElement={selectedElement}
                onUpdateStyle={handleUpdateTextStyle}
              />
            </div>
          )}

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col">
            {/* Canvas */}
            <div className="flex-1">
              <EditorCanvas
                elements={elements}
                onUpdateElement={handleUpdateElement}
                onDeleteElement={handleDeleteElement}
                onAddElement={handleAddElement}
                onSelectElement={setSelectedElementId}
                slideFormat={slideFormat}
              />
            </div>

            {/* Horizontal Slide Panel */}
            <HorizontalSlidePanel
              slides={slides}
              currentSlideId={currentSlideId}
              onSlideSelect={handleSlideSelect}
              onSlideAdd={handleAddSlide}
              onSlideDuplicate={handleSlideDuplicate}
              onSlideDelete={handleSlideDelete}
              onSlideToggleVisibility={handleSlideToggleVisibility}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
