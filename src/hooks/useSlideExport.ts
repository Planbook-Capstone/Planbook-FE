import { useState, useCallback } from "react";
import { 
  exportToPPTX, 
  exportSingleSlideToPPTX, 
  getExportPreview, 
  validateSlideData,
  SlideData 
} from "@/utils/pptxExporter";

export interface ExportOptions {
  filename?: string;
  includeHiddenSlides?: boolean;
  format?: "pptx";
}

export interface ExportState {
  isExporting: boolean;
  progress: number;
  error: string | null;
  lastExportedFile: string | null;
}

export function useSlideExport() {
  const [exportState, setExportState] = useState<ExportState>({
    isExporting: false,
    progress: 0,
    error: null,
    lastExportedFile: null,
  });

  // Reset export state
  const resetExportState = useCallback(() => {
    setExportState({
      isExporting: false,
      progress: 0,
      error: null,
      lastExportedFile: null,
    });
  }, []);

  // Export all slides to PPTX
  const exportSlides = useCallback(async (
    slides: SlideData[], 
    options: ExportOptions = {}
  ) => {
    const {
      filename = `presentation-${new Date().toISOString().split('T')[0]}.pptx`,
      includeHiddenSlides = false,
    } = options;

    try {
      setExportState(prev => ({
        ...prev,
        isExporting: true,
        progress: 0,
        error: null,
      }));

      // Validate slide data
      setExportState(prev => ({ ...prev, progress: 10 }));
      const validation = validateSlideData(slides);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
      }

      // Filter slides based on options
      setExportState(prev => ({ ...prev, progress: 20 }));
      const slidesToExport = includeHiddenSlides 
        ? slides 
        : slides.filter(slide => slide.isVisible);

      if (slidesToExport.length === 0) {
        throw new Error("No slides to export");
      }

      // Export to PPTX
      setExportState(prev => ({ ...prev, progress: 50 }));
      await exportToPPTX(slidesToExport, filename);

      // Complete
      setExportState(prev => ({
        ...prev,
        isExporting: false,
        progress: 100,
        lastExportedFile: filename,
      }));

      return {
        success: true,
        filename,
        slideCount: slidesToExport.length,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      setExportState(prev => ({
        ...prev,
        isExporting: false,
        progress: 0,
        error: errorMessage,
      }));

      return {
        success: false,
        error: errorMessage,
      };
    }
  }, []);

  // Export single slide
  const exportSingleSlide = useCallback(async (
    slide: SlideData,
    options: ExportOptions = {}
  ) => {
    const {
      filename = `slide-${slide.title.replace(/\s+/g, "-").toLowerCase()}.pptx`,
    } = options;

    try {
      setExportState(prev => ({
        ...prev,
        isExporting: true,
        progress: 0,
        error: null,
      }));

      // Validate single slide
      setExportState(prev => ({ ...prev, progress: 25 }));
      const validation = validateSlideData([slide]);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
      }

      // Export single slide
      setExportState(prev => ({ ...prev, progress: 75 }));
      await exportSingleSlideToPPTX(slide, filename);

      // Complete
      setExportState(prev => ({
        ...prev,
        isExporting: false,
        progress: 100,
        lastExportedFile: filename,
      }));

      return {
        success: true,
        filename,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      setExportState(prev => ({
        ...prev,
        isExporting: false,
        progress: 0,
        error: errorMessage,
      }));

      return {
        success: false,
        error: errorMessage,
      };
    }
  }, []);

  // Get export preview
  const getPreview = useCallback((slides: SlideData[]) => {
    try {
      return getExportPreview(slides);
    } catch (error) {
      console.error("Error getting export preview:", error);
      return null;
    }
  }, []);

  // Validate slides before export
  const validateSlides = useCallback((slides: SlideData[]) => {
    return validateSlideData(slides);
  }, []);

  return {
    // State
    exportState,
    isExporting: exportState.isExporting,
    progress: exportState.progress,
    error: exportState.error,
    lastExportedFile: exportState.lastExportedFile,

    // Actions
    exportSlides,
    exportSingleSlide,
    getPreview,
    validateSlides,
    resetExportState,
  };
}
