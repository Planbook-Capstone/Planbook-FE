import PptxGenJS from "pptxgenjs";

// Interface for slide data
export interface SlideData {
  id: string;
  title: string;
  elements: ElementData[];
  isVisible: boolean;
}

export interface ElementData {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  style?: {
    fontSize: number;
    fontFamily: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    color?: string;
    textAlign?: "left" | "center" | "right";
  };
}

// PPTX Export Configuration
const PPTX_CONFIG = {
  // PowerPoint slide dimensions (16:9 ratio)
  slideWidth: 10, // inches
  slideHeight: 5.625, // inches
  
  // Canvas to PowerPoint conversion ratio
  canvasWidth: 960, // pixels
  canvasHeight: 540, // pixels
  
  // Default styles
  defaultFont: "Arial",
  defaultFontSize: 16,
};

/**
 * Convert canvas coordinates to PowerPoint coordinates
 */
function convertCoordinates(x: number, y: number, width: number, height: number) {
  const xInches = (x / PPTX_CONFIG.canvasWidth) * PPTX_CONFIG.slideWidth;
  const yInches = (y / PPTX_CONFIG.canvasHeight) * PPTX_CONFIG.slideHeight;
  const widthInches = (width / PPTX_CONFIG.canvasWidth) * PPTX_CONFIG.slideWidth;
  const heightInches = (height / PPTX_CONFIG.canvasHeight) * PPTX_CONFIG.slideHeight;
  
  return {
    x: xInches,
    y: yInches,
    w: widthInches,
    h: heightInches,
  };
}

/**
 * Convert hex color to PowerPoint color format
 */
function convertColor(hexColor?: string): string {
  if (!hexColor) return "000000";
  return hexColor.replace("#", "");
}

/**
 * Convert font size from pixels to points
 */
function convertFontSize(pixelSize: number): number {
  // Approximate conversion: 1 point = 1.33 pixels
  return Math.round(pixelSize * 0.75);
}

/**
 * Add text element to PowerPoint slide
 */
function addTextElement(slide: any, element: ElementData) {
  if (!element.text || element.type !== "text") return;
  
  const coords = convertCoordinates(element.x, element.y, element.width, element.height);
  const style = element.style || {};
  
  const textOptions = {
    x: coords.x,
    y: coords.y,
    w: coords.w,
    h: coords.h,
    fontSize: convertFontSize(style.fontSize || PPTX_CONFIG.defaultFontSize),
    fontFace: style.fontFamily || PPTX_CONFIG.defaultFont,
    color: convertColor(style.color),
    bold: style.bold || false,
    italic: style.italic || false,
    underline: style.underline || false,
    align: style.textAlign || "left",
    valign: "middle",
    wrap: true,
  };
  
  slide.addText(element.text, textOptions);
}

/**
 * Create PowerPoint presentation from slide data
 */
export async function exportToPPTX(slides: SlideData[], filename: string = "presentation.pptx"): Promise<void> {
  try {
    // Create new presentation
    const pptx = new PptxGenJS();
    
    // Set presentation properties
    pptx.defineLayout({
      name: "LAYOUT_16x9",
      width: PPTX_CONFIG.slideWidth,
      height: PPTX_CONFIG.slideHeight,
    });
    
    pptx.layout = "LAYOUT_16x9";
    
    // Add slides
    slides.forEach((slideData, index) => {
      if (!slideData.isVisible) return; // Skip hidden slides
      
      // Create new slide
      const slide = pptx.addSlide();
      
      // Add slide title as metadata (optional)
      slide.addNotes(`Slide ${index + 1}: ${slideData.title}`);
      
      // Add elements to slide
      slideData.elements.forEach((element) => {
        switch (element.type) {
          case "text":
            addTextElement(slide, element);
            break;
          // Add more element types here (images, shapes, etc.)
          default:
            console.warn(`Unsupported element type: ${element.type}`);
        }
      });
    });
    
    // Generate and download PPTX file
    await pptx.writeFile({ fileName: filename });
    
    console.log(`✅ PPTX exported successfully: ${filename}`);
  } catch (error) {
    console.error("❌ Error exporting PPTX:", error);
    throw new Error(`Failed to export PPTX: ${error}`);
  }
}

/**
 * Export single slide to PPTX
 */
export async function exportSingleSlideToPPTX(slideData: SlideData, filename: string = "slide.pptx"): Promise<void> {
  return exportToPPTX([slideData], filename);
}

/**
 * Get export preview data
 */
export function getExportPreview(slides: SlideData[]) {
  const visibleSlides = slides.filter(slide => slide.isVisible);
  const totalElements = visibleSlides.reduce((sum, slide) => sum + slide.elements.length, 0);
  
  return {
    totalSlides: visibleSlides.length,
    totalElements,
    slideDetails: visibleSlides.map(slide => ({
      title: slide.title,
      elementCount: slide.elements.length,
      hasText: slide.elements.some(el => el.type === "text"),
    })),
  };
}

/**
 * Validate slide data before export
 */
export function validateSlideData(slides: SlideData[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!slides || slides.length === 0) {
    errors.push("No slides to export");
  }
  
  const visibleSlides = slides.filter(slide => slide.isVisible);
  if (visibleSlides.length === 0) {
    errors.push("No visible slides to export");
  }
  
  slides.forEach((slide, index) => {
    if (!slide.id) {
      errors.push(`Slide ${index + 1}: Missing ID`);
    }
    
    if (!slide.title) {
      errors.push(`Slide ${index + 1}: Missing title`);
    }
    
    slide.elements.forEach((element, elemIndex) => {
      if (!element.id) {
        errors.push(`Slide ${index + 1}, Element ${elemIndex + 1}: Missing ID`);
      }
      
      if (element.type === "text" && !element.text) {
        errors.push(`Slide ${index + 1}, Element ${elemIndex + 1}: Text element has no content`);
      }
    });
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
