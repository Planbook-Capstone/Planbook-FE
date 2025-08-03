"use client";

import React, { useState, useCallback, useEffect } from "react";
import { SlideElement, TextElement as TextElementType } from "@/types";
import SlideEditorHeader from "./SlideEditorHeader";
import SlideEditorSidebar from "./SlideEditorSidebar";
import EditorCanvas from "./EditorCanvas";
import TextToolbar from "./TextToolbar";
import HorizontalSlidePanel from "./HorizontalSlidePanel";
import { SlideEditorDirector } from "./SlideEditorDirector";
import { useSlideExport } from "@/hooks/useSlideExport";
import { SlideData } from "@/utils/pptxExporter";
import { useElementPositioning } from "@/hooks/useElementPositioning";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import BackgroundSidebar from "./BackgroundSidebar";
import MaterialsLibrarySidebar from "./MaterialsLibrarySidebar";
import ShapesSidebar from "./ShapesSidebar";
import ShapeToolbar from "./ShapeToolbar";
import SlidePresentation from "./SlidePresentation";

import { ImageElement, VideoElement, ShapeElement } from "@/types";
import { TextColorProvider } from "./TextColorContext";
import { SlideTemplateTempData } from "@/contexts/SlideTemplateContext";

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

interface Slide {
  id: string;
  title: string;
  elements: SlideElement[];
  isVisible: boolean;
  background?: string; // Background color, gradient, or image URL
}

interface SlideEditorLayoutProps {
  initialSlides?: any[];
  onLoadSampleData?: () => void;
  onClearData?: () => void;
  isLoadingData?: boolean;
  hasLoadedData?: boolean;
  onSave?: (slides: Slide[], textBlocks: string) => void;
  onCancel?: () => void;
  templateData?: SlideTemplateTempData;
  autoNavigateToLast?: boolean; // New prop to control auto-navigation
  onAutoNavigated?: () => void; // Callback when auto-navigation happens
  userRole?: string; // User role to control UI permissions
  // Loading state props for skeleton
  isGenerating?: boolean;
  generationProgress?: number;
  totalSlides?: number;
}

export default function SlideEditorLayout({
  initialSlides,
  templateData,
  onLoadSampleData,
  onClearData,
  isLoadingData = false,
  hasLoadedData = false,
  onSave,
  onCancel,
  autoNavigateToLast = false,
  onAutoNavigated,
  userRole = "admin", // Default to admin for full access
  isGenerating = false,
  generationProgress = 0,
  totalSlides = 0,
}: SlideEditorLayoutProps) {
  // Convert initialSlides to proper format if provided
  const getInitialSlides = (): Slide[] => {
    if (initialSlides && initialSlides.length > 0) {
      // Processing initial slides
      const processedSlides = initialSlides?.map((slide, index) => {
        // Check if data is in slideData property or directly in slide
        const slideData = (slide as any).slideData || slide;

        // Processing slide structure

        return {
          id: slide.id || `slide-${index + 1}`,
          title: slide.title || `Slide ${index + 1}`,
          elements: slideData.elements || slide.elements || [],
          isVisible: slide.isVisible !== undefined ? slide.isVisible : true,
          background:
            slideData.background || (slide as any).background || "#ffffff",
        };
      });
      // Slides processed successfully
      return processedSlides;
    }

    return [
      {
        id: "slide-1",
        title: "Slide 1",
        elements: [],
        isVisible: true,
        background: "#ffffff",
      },
    ];
  };

  // Undo/Redo system for slides
  const {
    state: slides,
    canUndo,
    canRedo,
    pushState: pushSlidesState,
    undo: undoSlides,
    redo: redoSlides,
    replaceState: replaceSlidesState,
  } = useUndoRedo<Slide[]>(getInitialSlides(), 50);

  const [currentSlideId, setCurrentSlideId] = useState<string>(() => {
    const initialSlidesData = getInitialSlides();
    return initialSlidesData[0]?.id || "slide-1";
  });
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [copiedElement, setCopiedElement] = useState<SlideElement | null>(null);
  const [activeTab, setActiveTab] = useState<string>("text"); // "text", "images", "background", or "effects"
  const [selectedTransition] = useState<string>("fade"); // Current selected transition
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  // Update slides when initialSlides prop changes
  useEffect(() => {
    if (initialSlides && initialSlides.length > 0) {
      const newSlides = initialSlides.map((slide, index) => {
        // Check if data is in slideData property or directly in slide
        const slideData = (slide as any).slideData || slide;

        // Normalize text in elements
        const normalizedElements = (
          slideData.elements ||
          slide.elements ||
          []
        ).map((element: any) => ({
          ...element,
          text: element.text
            ? normalizeTextFromAPI(element.text)
            : element.text,
        }));

        return {
          id: slide.id || `slide-${index + 1}`,
          title: slide.title || `Slide ${index + 1}`,
          elements: normalizedElements,
          isVisible: slide.isVisible !== undefined ? slide.isVisible : true,
          background:
            slideData.background || (slide as any).background || "#ffffff",
        };
      });

      // Only update if slides actually changed
      if (JSON.stringify(slides) !== JSON.stringify(newSlides)) {
        // Loading new slides
        replaceSlidesState(newSlides);

        // Auto navigate to the last slide (newest) when slides are updated
        if (autoNavigateToLast) {
          const lastSlideId = newSlides[newSlides.length - 1]?.id || "slide-1";
          setCurrentSlideId(lastSlideId);
          // Auto navigated to last slide

          // Notify parent that auto-navigation happened
          if (onAutoNavigated) {
            onAutoNavigated();
          }
        } else {
          // Keep current slide if it exists, otherwise go to first slide
          const currentExists = newSlides.find(
            (slide) => slide.id === currentSlideId
          );
          if (!currentExists) {
            setCurrentSlideId(newSlides[0]?.id || "slide-1");
          }
        }
        setSelectedElementId(null);

        // Slides updated in editor
      }
    }
  }, [initialSlides]); // Remove slides from dependencies
  const [slideFormat] = useState<"16:9" | "4:3">("16:9");

  // Export functionality
  const { exportSlides, isExporting } = useSlideExport();

  // Element positioning
  const { getCenterPosition } = useElementPositioning(slideFormat);

  // Get current slide
  const currentSlide = slides.find((slide) => slide.id === currentSlideId);
  const elements = currentSlide?.elements || [];

  // Get selected element
  const selectedElement =
    elements.find((el) => el.id === selectedElementId) || null;

  // Helper function to update slides and push to history
  const updateSlides = useCallback(
    (updater: (prev: Slide[]) => Slide[]) => {
      const newSlides = updater(slides);
      pushSlidesState(newSlides);
    },
    [slides, pushSlidesState]
  );

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    console.log("Undo triggered, canUndo:", canUndo);
    const previousState = undoSlides();
    if (previousState) {
      console.log(
        "Undo successful, previous state:",
        previousState.length,
        "slides"
      );
      // Check if current slide still exists, if not switch to first slide
      const currentSlideExists = previousState.some(
        (slide) => slide.id === currentSlideId
      );
      if (!currentSlideExists && previousState.length > 0) {
        setCurrentSlideId(previousState[0].id);
      }
      setSelectedElementId(null); // Clear selection on undo
    } else {
      console.log("Undo failed - no previous state");
    }
  }, [undoSlides, currentSlideId, canUndo]);

  const handleRedo = useCallback(() => {
    const nextState = redoSlides();
    if (nextState) {
      // Check if current slide still exists, if not switch to first slide
      const currentSlideExists = nextState.some(
        (slide) => slide.id === currentSlideId
      );
      if (!currentSlideExists && nextState.length > 0) {
        setCurrentSlideId(nextState[0].id);
      }
      setSelectedElementId(null); // Clear selection on redo
    }
  }, [redoSlides, currentSlideId]);

  // Presentation mode handlers
  const handleStartPresentation = useCallback(() => {
    setIsPresentationMode(true);
  }, []);

  const handleClosePresentation = useCallback(() => {
    setIsPresentationMode(false);
  }, []);

  // Handle copying element
  const handleCopyElement = useCallback(
    (id: string) => {
      const currentSlide = slides.find((slide) => slide.id === currentSlideId);
      if (!currentSlide) return;

      const elementToCopy = currentSlide.elements.find((el) => el.id === id);
      if (elementToCopy) {
        setCopiedElement(elementToCopy);
        // Optional: Show toast notification
        // Element copied successfully
      }
    },
    [currentSlideId, slides]
  );

  // Handle pasting element
  const handlePasteElement = useCallback(() => {
    if (!copiedElement) return;

    // Generate new ID for the pasted element
    const newId = `${copiedElement.type}-${Date.now()}`;

    // Create a copy with new ID and slightly offset position
    const pastedElement: SlideElement = {
      ...copiedElement,
      id: newId,
      x: copiedElement.x + 20, // Offset by 20px
      y: copiedElement.y + 20, // Offset by 20px
    };

    updateSlides((prev) =>
      prev.map((slide) =>
        slide.id === currentSlideId
          ? {
              ...slide,
              elements: [...slide.elements, pastedElement],
            }
          : slide
      )
    );

    // Select the newly pasted element
    setSelectedElementId(newId);
    // Element pasted successfully
  }, [copiedElement, currentSlideId, updateSlides]);

  // Keyboard shortcuts for undo/redo and presentation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if we're in an input field
      const target = event.target as HTMLElement;
      const activeElement = document.activeElement as HTMLElement;

      // Keyboard event handling

      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true" ||
        target.isContentEditable ||
        (activeElement && activeElement.contentEditable === "true") ||
        (activeElement && activeElement.isContentEditable)
      ) {
        // Skipping keyboard shortcuts while editing text
        return;
      }

      // F5 for presentation mode
      if (event.key === "F5") {
        event.preventDefault();
        handleStartPresentation();
        return;
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        !event.shiftKey &&
        event.key === "z"
      ) {
        event.preventDefault();
        handleUndo();
      } else if (
        ((event.ctrlKey || event.metaKey) &&
          event.shiftKey &&
          event.key === "Z") ||
        ((event.ctrlKey || event.metaKey) && event.key === "y")
      ) {
        event.preventDefault();
        handleRedo();
      }

      // Copy element (Ctrl+C)
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "c" &&
        selectedElementId
      ) {
        event.preventDefault();
        handleCopyElement(selectedElementId);
      }

      // Paste element (Ctrl+V)
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "v" &&
        copiedElement
      ) {
        event.preventDefault();
        handlePasteElement();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    handleUndo,
    handleRedo,
    handleStartPresentation,
    selectedElementId,
    copiedElement,
    handleCopyElement,
    handlePasteElement,
  ]);

  // Utility function to normalize zIndex values
  const normalizeZIndex = useCallback(
    (elements: SlideElement[]): SlideElement[] => {
      const normalized = elements
        .slice() // Create a copy to avoid mutating the original array
        .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
        .map((el, index) => ({ ...el, zIndex: index }));

      // Debug logging (uncomment to debug zIndex issues)
      // console.table(normalized.map(e => ({ id: e.id.slice(-8), type: e.type, zIndex: e.zIndex })));

      return normalized;
    },
    []
  );

  // Handle adding new element
  const handleAddElement = useCallback(
    (element: SlideElement) => {
      updateSlides((prev) =>
        prev.map((slide) => {
          if (slide.id !== currentSlideId) return slide;

          // Add new element with high zIndex, then normalize
          const newElements = [
            ...slide.elements,
            {
              ...element,
              zIndex: element.zIndex ?? 9999, // Assign high zIndex initially
            },
          ];

          return {
            ...slide,
            elements: normalizeZIndex(newElements),
          };
        })
      );
      setSelectedElementId(element.id);
    },
    [currentSlideId, normalizeZIndex, updateSlides]
  );

  // Handle updating element
  const handleUpdateElement = useCallback(
    (id: string, updates: Partial<SlideElement>) => {
      updateSlides((prev) =>
        prev.map((slide) =>
          slide.id === currentSlideId
            ? {
                ...slide,
                elements: slide.elements.map((el) =>
                  el.id === id ? ({ ...el, ...updates } as SlideElement) : el
                ),
              }
            : slide
        )
      );
    },
    [currentSlideId, updateSlides]
  );

  // Handle deleting element
  const handleDeleteElement = useCallback(
    (id: string) => {
      updateSlides((prev) =>
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
    [currentSlideId, selectedElementId, updateSlides]
  );

  // Handle adding text element
  const handleAddText = useCallback(() => {
    const centerPosition = getCenterPosition({ width: 200, height: 50 });

    const newTextElement: TextElementType = {
      id: `text-${Date.now()}`,
      type: "text",
      x: centerPosition.x,
      y: centerPosition.y,
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
        verticalAlign: "top",
      },
    };
    handleAddElement(newTextElement);
  }, [getCenterPosition, handleAddElement]);

  // Handle adding heading text (72px, bold)
  const handleAddHeading = useCallback(() => {
    const centerPosition = getCenterPosition({ width: 300, height: 80 });

    const newTextElement: TextElementType = {
      id: `text-${Date.now()}`,
      type: "text",
      x: centerPosition.x,
      y: centerPosition.y,
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
        verticalAlign: "top",
      },
    };
    handleAddElement(newTextElement);
  }, [getCenterPosition, handleAddElement]);

  // Handle adding subheading text (36px, bold)
  const handleAddSubheading = useCallback(() => {
    const centerPosition = getCenterPosition({ width: 250, height: 60 });

    const newTextElement: TextElementType = {
      id: `text-${Date.now()}`,
      type: "text",
      x: centerPosition.x,
      y: centerPosition.y,
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
        verticalAlign: "top",
      },
    };
    handleAddElement(newTextElement);
  }, [getCenterPosition, handleAddElement]);

  // Handle adding body text (18px, normal)
  const handleAddBodyText = useCallback(() => {
    const centerPosition = getCenterPosition({ width: 200, height: 40 });

    const newTextElement: TextElementType = {
      id: `text-${Date.now()}`,
      type: "text",
      x: centerPosition.x,
      y: centerPosition.y,
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
        verticalAlign: "top",
      },
    };
    handleAddElement(newTextElement);
  }, [getCenterPosition, handleAddElement]);

  // Handle updating text style
  const handleUpdateTextStyle = useCallback(
    (id: string, styleUpdates: any) => {
      updateSlides((prev) =>
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
    [currentSlideId, updateSlides]
  );

  // Handle updating shape style
  const handleUpdateShapeStyle = useCallback(
    (id: string, updates: Partial<ShapeElement>) => {
      updateSlides((prev) =>
        prev.map((slide) =>
          slide.id === currentSlideId
            ? {
                ...slide,
                elements: slide.elements.map((el) => {
                  if (el.id === id && el.type === "shape") {
                    return {
                      ...el,
                      ...updates,
                    };
                  }
                  return el;
                }),
              }
            : slide
        )
      );
    },
    [currentSlideId, updateSlides]
  );

  // Handle adding image from URL (for ImageLibrarySidebar)
  const handleAddImageFromUrl = useCallback(
    (imageUrl: string) => {
      const centerPosition = getCenterPosition({ width: 200, height: 150 });

      const imageElement: ImageElement = {
        id: `image-${Date.now()}`,
        type: "image",
        x: centerPosition.x,
        y: centerPosition.y,
        width: 200,
        height: 150,
        src: imageUrl,
      };

      handleAddElement(imageElement);
    },
    [handleAddElement, getCenterPosition]
  );

  // Handle adding video from URL (for ImageLibrarySidebar)
  const handleAddVideoFromUrl = useCallback(
    (videoUrl: string) => {
      const centerPosition = getCenterPosition({ width: 320, height: 240 });

      const videoElement: VideoElement = {
        id: `video-${Date.now()}`,
        type: "video",
        x: centerPosition.x,
        y: centerPosition.y,
        width: 320,
        height: 240,
        src: videoUrl,
        controls: true,
        muted: true, // Start muted for better UX
      };

      handleAddElement(videoElement);
    },
    [handleAddElement, getCenterPosition]
  );

  // Handle adding shape
  const handleAddShape = useCallback(
    (
      shapeType: "rectangle" | "circle" | "triangle" | "star",
      fill?: string,
      stroke?: string
    ) => {
      const centerPosition = getCenterPosition({ width: 150, height: 150 });

      const shapeElement: ShapeElement = {
        id: `shape-${Date.now()}`,
        type: "shape",
        x: centerPosition.x,
        y: centerPosition.y,
        width: 150,
        height: 150,
        shapeType,
        fill: fill || "#3b82f6",
        stroke: stroke || "#1e40af",
        strokeWidth: 2,
      };

      handleAddElement(shapeElement);
    },
    [handleAddElement, getCenterPosition]
  );

  // Handle tab change
  const handleTabChange = useCallback((tabKey: string) => {
    setActiveTab(tabKey);
  }, []);

  // Handle background change
  const handleBackgroundChange = useCallback(
    (background: string) => {
      updateSlides((prev) =>
        prev.map((slide) =>
          slide.id === currentSlideId ? { ...slide, background } : slide
        )
      );
    },
    [currentSlideId, updateSlides]
  );

  // Layer management functions
  const handleBringToFront = useCallback(
    (elementId: string) => {
      updateSlides((prev) =>
        prev.map((slide) => {
          if (slide.id !== currentSlideId) return slide;

          const elements = slide.elements.map((el) =>
            el.id === elementId ? { ...el, zIndex: 9999 } : el
          );

          return {
            ...slide,
            elements: normalizeZIndex(elements),
          };
        })
      );
    },
    [currentSlideId, normalizeZIndex, updateSlides]
  );

  const handleSendToBack = useCallback(
    (elementId: string) => {
      updateSlides((prev) =>
        prev.map((slide) => {
          if (slide.id !== currentSlideId) return slide;

          const elements = slide.elements.map((el) =>
            el.id === elementId ? { ...el, zIndex: -1 } : el
          );

          return {
            ...slide,
            elements: normalizeZIndex(elements),
          };
        })
      );
    },
    [currentSlideId, normalizeZIndex, updateSlides]
  );

  const handleBringForward = useCallback(
    (elementId: string) => {
      updateSlides((prev) =>
        prev.map((slide) => {
          if (slide.id !== currentSlideId) return slide;

          // First normalize to ensure proper ordering
          const normalizedElements = normalizeZIndex(slide.elements);
          const elementIndex = normalizedElements.findIndex(
            (el) => el.id === elementId
          );

          // If element is not found or already at the front, return unchanged
          if (
            elementIndex < 0 ||
            elementIndex === normalizedElements.length - 1
          ) {
            return slide;
          }

          // Swap with the element in front
          const newElements = [...normalizedElements];
          [newElements[elementIndex], newElements[elementIndex + 1]] = [
            newElements[elementIndex + 1],
            newElements[elementIndex],
          ];

          return {
            ...slide,
            elements: normalizeZIndex(newElements),
          };
        })
      );
    },
    [currentSlideId, normalizeZIndex, updateSlides]
  );

  const handleSendBackward = useCallback(
    (elementId: string) => {
      updateSlides((prev) =>
        prev.map((slide) => {
          if (slide.id !== currentSlideId) return slide;

          // First normalize to ensure proper ordering
          const normalizedElements = normalizeZIndex(slide.elements);
          const elementIndex = normalizedElements.findIndex(
            (el) => el.id === elementId
          );

          // If element is not found or already at the back, return unchanged
          if (elementIndex <= 0) {
            return slide;
          }

          // Swap with the element behind
          const newElements = [...normalizedElements];
          [newElements[elementIndex], newElements[elementIndex - 1]] = [
            newElements[elementIndex - 1],
            newElements[elementIndex],
          ];

          return {
            ...slide,
            elements: normalizeZIndex(newElements),
          };
        })
      );
    },
    [currentSlideId, normalizeZIndex, updateSlides]
  );

  // Handle rotation
  const handleRotateLeft = useCallback(
    (elementId: string) => {
      updateSlides((prev) =>
        prev.map((slide) =>
          slide.id === currentSlideId
            ? {
                ...slide,
                elements: slide.elements.map((el) => {
                  if (el.id === elementId) {
                    const currentRotation = (el as any).rotation || 0;
                    return { ...el, rotation: currentRotation - 15 };
                  }
                  return el;
                }),
              }
            : slide
        )
      );
    },
    [currentSlideId, updateSlides]
  );

  const handleRotateRight = useCallback(
    (elementId: string) => {
      updateSlides((prev) =>
        prev.map((slide) =>
          slide.id === currentSlideId
            ? {
                ...slide,
                elements: slide.elements.map((el) => {
                  if (el.id === elementId) {
                    const currentRotation = (el as any).rotation || 0;
                    return { ...el, rotation: currentRotation + 15 };
                  }
                  return el;
                }),
              }
            : slide
        )
      );
    },
    [currentSlideId, updateSlides]
  );

  // Handle adding new slide
  const handleAddSlide = useCallback(() => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title: `Slide ${slides.length + 1}`,
      elements: [],
      isVisible: true,
      background: "#ffffff", // Default white background
    };
    updateSlides((prev) => [...prev, newSlide]);
    setCurrentSlideId(newSlide.id);
  }, [slides.length, updateSlides]);

  // Handle slide selection
  const handleSlideSelect = useCallback((slideId: string) => {
    setCurrentSlideId(slideId);
    setSelectedElementId(null);
  }, []);

  // Handle slide duplication
  const handleSlideDuplicate = useCallback(
    (slideId: string) => {
      const slideIndex = slides.findIndex((s) => s.id === slideId);
      const slideToClone = slides[slideIndex];

      if (slideToClone && slideIndex !== -1) {
        const newSlide: Slide = {
          ...slideToClone,
          id: `slide-${Date.now()}`,
          title: `${slideToClone.title} Copy`,
          elements: slideToClone.elements.map((el) => ({
            ...el,
            id: `${el.id}-copy-${Date.now()}`,
          })),
        };

        // Slide duplicated successfully

        updateSlides((prev) => {
          const updatedSlides = [...prev];
          // Insert new slide right after the original slide
          updatedSlides.splice(slideIndex + 1, 0, newSlide);
          return updatedSlides;
        });

        // Auto-select the new duplicated slide
        setCurrentSlideId(newSlide.id);
      }
    },
    [slides, updateSlides, setCurrentSlideId]
  );

  // Handle slide deletion
  const handleSlideDelete = useCallback(
    (slideId: string) => {
      if (slides.length > 1) {
        updateSlides((prev) => prev.filter((s) => s.id !== slideId));
        if (currentSlideId === slideId) {
          const remainingSlides = slides.filter((s) => s.id !== slideId);
          setCurrentSlideId(remainingSlides[0]?.id || "");
        }
      }
    },
    [slides, currentSlideId, updateSlides]
  );

  // Handle slide visibility toggle
  const handleSlideToggleVisibility = useCallback(
    (slideId: string) => {
      updateSlides((prev) =>
        prev.map((slide) =>
          slide.id === slideId
            ? { ...slide, isVisible: !slide.isVisible }
            : slide
        )
      );
    },
    [updateSlides]
  );

  // Handle slide reorder (drag & drop)
  const handleSlideReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;

      // Reordering slides

      updateSlides((prev) => {
        const updatedSlides = [...prev];
        const [movedSlide] = updatedSlides.splice(fromIndex, 1);
        updatedSlides.splice(toIndex, 0, movedSlide);

        // Slides reordered successfully

        return updatedSlides;
      });

      // If current slide was moved, keep it selected
      if (slides[fromIndex]?.id === currentSlideId) {
        // Current slide was moved, it will be at toIndex now
        setCurrentSlideId(slides[fromIndex].id);
      }
    },
    [updateSlides, slides, currentSlideId, setCurrentSlideId]
  );

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
          src: (element as any).src, // For image elements
          alt: (element as any).alt, // For image elements
        })),
        isVisible: slide.isVisible,
        background: slide.background, // Include background for export
      }));

      const result = await exportSlides(slidesToExport, {
        filename: `presentation-${new Date().toISOString().split("T")[0]}.pptx`,
        includeHiddenSlides: false,
      });

      if (result.success) {
        // Export completed successfully
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

  // Handle export JSON
  const handleExportJSON = useCallback(async () => {
    try {
      // Helper function to convert blob URLs to base64
      const convertBlobToBase64 = async (blobUrl: string): Promise<string> => {
        if (!blobUrl.startsWith("blob:")) return blobUrl;

        try {
          const response = await fetch(blobUrl);
          const blob = await response.blob();
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.warn("Failed to convert blob URL:", error);
          return blobUrl; // Return original if conversion fails
        }
      };

      // Process slides and convert blob URLs to base64
      const processedSlides = await Promise.all(
        slides.map(async (slide) => {
          const processedElements = await Promise.all(
            slide.elements.map(async (element) => {
              const elementData = {
                id: element.id,
                type: element.type,
                x: element.x,
                y: element.y,
                width: element.width,
                height: element.height,
                zIndex: element.zIndex,
                text: (element as any).text,
                style: (element as any).style,
                src: (element as any).src,
                alt: (element as any).alt,
              };

              // Convert blob URLs to base64 for images
              if (elementData.src && elementData.src.startsWith("blob:")) {
                elementData.src = await convertBlobToBase64(elementData.src);
              }

              return elementData;
            })
          );

          // Process background if it's a blob URL
          let processedBackground = slide.background;
          if (
            processedBackground &&
            processedBackground.startsWith("url(blob:")
          ) {
            const blobUrl = processedBackground.slice(4, -1); // Remove url() wrapper
            const base64 = await convertBlobToBase64(blobUrl);
            processedBackground = `url(${base64})`;
          }

          return {
            id: slide.id,
            title: slide.title,
            elements: processedElements,
            isVisible: slide.isVisible,
            background: processedBackground,
          };
        })
      );

      // Create export data with processed slides
      const exportData = {
        version: "1.0",
        createdAt: new Date().toISOString(),
        slideFormat: slideFormat,
        slides: processedSlides,
      };

      // Convert to JSON string
      const jsonString = JSON.stringify(exportData, null, 2);

      // Create and download file
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `slides-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // JSON export completed successfully
      alert("JSON file downloaded successfully!");
    } catch (error) {
      console.error("❌ JSON export failed:", error);
      alert(`JSON export failed: ${error}`);
    }
  }, [slides, slideFormat]);

  // Helper function để convert blob URL thành base64
  const convertBlobToBase64 = async (blobUrl: string): Promise<string> => {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting blob to base64:", error);
      return blobUrl; // Fallback to original URL
    }
  };

  // Helper function để tạo textBlocks JSON string
  const generateTextBlocks = useCallback(async () => {
    try {
      // Process slides và convert blob URLs thành base64
      const processedSlides = await Promise.all(
        slides.map(async (slide) => {
          // Process background
          let processedBackground = slide.background;
          if (slide.background?.startsWith("blob:")) {
            processedBackground = await convertBlobToBase64(slide.background);
          } else if (slide.background?.startsWith("data:")) {
            processedBackground = slide.background; // Giữ nguyên base64
          }

          // Process elements
          const processedElements = await Promise.all(
            slide.elements.map(async (element: any) => {
              if (
                element.type === "image" &&
                element.src?.startsWith("blob:")
              ) {
                // Convert blob URL thành base64
                const base64Src = await convertBlobToBase64(element.src);
                return { ...element, src: base64Src };
              }
              return element;
            })
          );

          return {
            id: slide.id,
            title: slide.title,
            elements: processedElements,
            isVisible: slide.isVisible,
            background: processedBackground,
          };
        })
      );

      // Create export data
      const exportData = {
        version: "1.0",
        createdAt: new Date().toISOString(),
        slideFormat: slideFormat,
        slides: processedSlides,
      };

      // Convert to JSON string
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error("Error generating textBlocks:", error);
      return "{}";
    }
  }, [slides, slideFormat]);

  // Handle import JSON with coordinate validation
  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const importData = JSON.parse(text);

        // Validate JSON structure
        if (!importData.slides || !Array.isArray(importData.slides)) {
          throw new Error("Invalid JSON format: missing slides array");
        }

        // Helper function to clamp coordinates within canvas bounds
        const clampToCanvas = (
          value: number,
          max: number,
          size: number = 0
        ) => {
          // Strict clamping to keep elements fully within canvas
          const minValue = 0; // Don't allow negative coordinates
          const maxValue = Math.max(0, max - size); // Don't allow elements to go beyond canvas
          return Math.max(minValue, Math.min(maxValue, value));
        };

        // Get canvas dimensions for validation (match EditorCanvas dimensions)
        const canvasWidth = slideFormat === "4:3" ? 960 : 960; // Always 960px width
        const canvasHeight = slideFormat === "4:3" ? 720 : 540; // 720px for 4:3, 540px for 16:9

        // Convert imported data to slides format with coordinate validation
        const importedSlides: Slide[] = importData.slides.map(
          (slideData: any, index: number) => ({
            id: slideData.id || `slide-${Date.now()}-${index}`,
            title: slideData.title || `Slide ${index + 1}`,
            elements:
              slideData.elements?.map((elementData: any) => {
                // Validate and clamp coordinates
                const width = Math.max(50, elementData.width || 100); // Minimum 50px width
                const height = Math.max(30, elementData.height || 50); // Minimum 30px height
                const originalX = elementData.x || 0;
                const originalY = elementData.y || 0;
                const x = clampToCanvas(originalX, canvasWidth, width);
                const y = clampToCanvas(originalY, canvasHeight, height);

                // Coordinate clamping applied if needed

                return {
                  id:
                    elementData.id || `element-${Date.now()}-${Math.random()}`,
                  type: elementData.type,
                  x: x,
                  y: y,
                  width: width,
                  height: height,
                  zIndex: elementData.zIndex || 0,
                  text: elementData.text,
                  style: elementData.style,
                  src: elementData.src,
                  alt: elementData.alt,
                };
              }) || [],
            isVisible: slideData.isVisible !== false, // Default to true
            background: slideData.background || "#ffffff",
          })
        );

        // Set imported slides
        replaceSlidesState(importedSlides);

        // Set first slide as current
        if (importedSlides.length > 0) {
          setCurrentSlideId(importedSlides[0].id);
        }

        // Update slide format if available
        if (importData.slideFormat) {
          // Slide format imported
        }

        // JSON import completed successfully
        alert(
          `Successfully imported ${importedSlides.length} slides! Coordinates have been validated and adjusted to fit canvas.`
        );
      } catch (error) {
        console.error("❌ JSON import failed:", error);
        alert(`Import failed: ${error}`);
      }
    };
    input.click();
  }, [slideFormat]);

  const menuItems = [
    {
      label: "Chữ",
      key: "text",
      image: "/icons/academic.svg",
      active: "/icons/academic-active.svg",
    },
    {
      label: "Hình dạng",
      key: "shapes",
      image: "/icons/category.svg",
      active: "/icons/category-active.svg",
    },
    {
      label: "Học liệu",
      key: "materials",
      image: "/icons/folder.svg",
      active: "/icons/folder-active.svg",
    },
    {
      label: "Nền",
      key: "background",
      image: "/icons/diamond.svg",
      active: "/icons/diamond-active.svg",
    },
  ];

  return (
    <TextColorProvider>
      <div
        className="h-screen flex flex-col bg-gray-50"
        style={{ maxWidth: "100vw" }}
      >
        {/* Header */}
        <SlideEditorHeader
          onSave={
            onSave
              ? async () => {
                  const textBlocks = await generateTextBlocks();
                  onSave(slides, textBlocks);
                }
              : handleSave
          }
          templateData={templateData}
          onExportPPTX={handleExportPPTX}
          onExportJSON={handleExportJSON}
          onImport={handleImport}
          onPreview={handleStartPresentation}
          onLoadSampleData={onLoadSampleData}
          onClearData={onClearData}
          onCancel={onCancel}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          slideCount={slides.length}
          currentSlide={slides.findIndex((s) => s.id === currentSlideId) + 1}
          isExporting={isExporting}
          isLoadingData={isLoadingData}
          hasLoadedData={hasLoadedData}
          showTemplateActions={!!(onSave && onCancel)}
          userRole={userRole}
        />

        {/* Main Content */}
        <div className="flex-1 flex w-full " style={{ maxWidth: "100vw" }}>
          {/* SlideEditorDirector - Tab Navigation */}
          <SlideEditorDirector
            menuItems={menuItems}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          {/* Tools Sidebar - Conditional based on active tab */}
          {activeTab === "text" && (
            <SlideEditorSidebar
              onAddText={handleAddText}
              onAddHeading={handleAddHeading}
              onAddSubheading={handleAddSubheading}
              onAddBodyText={handleAddBodyText}
            />
          )}

          {activeTab === "shapes" && (
            <ShapesSidebar onAddShape={handleAddShape} />
          )}

          {activeTab === "materials" && (
            <MaterialsLibrarySidebar
              onAddImage={handleAddImageFromUrl}
              onAddVideo={handleAddVideoFromUrl}
            />
          )}

          {activeTab === "background" && (
            <BackgroundSidebar
              currentBackground={currentSlide?.background || "#ffffff"}
              onBackgroundChange={handleBackgroundChange}
            />
          )}

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col relative overflow-auto w-full">
            {/* Text Formatting Toolbar */}
            {selectedElement && selectedElement.type === "text" && (
              <div className="pt-2 flex justify-center ">
                <TextToolbar
                  selectedElement={selectedElement as TextElementType}
                  onUpdateStyle={handleUpdateTextStyle}
                />
              </div>
            )}

            {/* Shape Formatting Toolbar */}
            {selectedElement && selectedElement.type === "shape" && (
              <div className="pt-2 flex justify-center ">
                <ShapeToolbar
                  selectedElement={selectedElement as ShapeElement}
                  onUpdateStyle={handleUpdateShapeStyle}
                />
              </div>
            )}

            {/* Canvas Area */}
            <div className="flex-1 flex flex-col " style={{ maxWidth: "100%" }}>
              {/* Canvas */}
              <div
                className="flex-1 relative w-full"
                style={{ maxWidth: "100%" }}
              >
                <EditorCanvas
                  elements={elements}
                  onUpdateElement={handleUpdateElement}
                  onDeleteElement={handleDeleteElement}
                  onAddElement={handleAddElement}
                  onSelectElement={setSelectedElementId}
                  onBringToFront={handleBringToFront}
                  onSendToBack={handleSendToBack}
                  onBringForward={handleBringForward}
                  onSendBackward={handleSendBackward}
                  onRotateLeft={handleRotateLeft}
                  onRotateRight={handleRotateRight}
                  onCopyElement={handleCopyElement}
                  onPasteElement={handlePasteElement}
                  slideFormat={slideFormat}
                  background={currentSlide?.background || "#ffffff"}
                  selectedElementId={selectedElementId}
                  hasCopiedElement={!!copiedElement}
                />

                {/* Horizontal Slide Panel */}
                <HorizontalSlidePanel
                  slides={slides.map((slide) => {
                    return slide;
                  })}
                  currentSlideId={currentSlideId}
                  onSlideSelect={handleSlideSelect}
                  onSlideAdd={handleAddSlide}
                  onSlideDuplicate={handleSlideDuplicate}
                  onSlideDelete={handleSlideDelete}
                  onSlideToggleVisibility={handleSlideToggleVisibility}
                  onSlideReorder={handleSlideReorder}
                  isGenerating={isGenerating}
                  generationProgress={generationProgress}
                  totalSlides={totalSlides}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Presentation Modal */}
      <SlidePresentation
        slides={slides}
        isOpen={isPresentationMode}
        onClose={handleClosePresentation}
        initialSlideIndex={slides.findIndex((s) => s.id === currentSlideId)}
        transitionType={selectedTransition}
      />
    </TextColorProvider>
  );
}
