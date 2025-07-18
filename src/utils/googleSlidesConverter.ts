/**
 * Google Slides JSON to Slide Editor Converter
 * Converts Google Slides API data to our slide editor format
 */

// Constants for conversion
const EMU_TO_PX = 96 / 914400; // 1 EMU = 96/914400 pixels

/**
 * Convert EMU units to pixels
 */
function emuToPx(value: number): number {
  return value * EMU_TO_PX;
}

// ✅ Web-safe fonts for fallback
const webSafeFonts = [
  "Arial",
  "Verdana",
  "Tahoma",
  "Trebuchet MS",
  "Times New Roman",
  "Georgia",
  "Garamond",
  "Courier New",
  "Brush Script MT",
  "Helvetica",
  "Impact",
  "Calibri",
  "Comic Sans MS",
  "Lucida Console",
  "Palatino",
  "Book Antiqua",
];

/**
 * Font family normalization with fallback
 */
function normalizeFontFamily(font: string): string {
  if (!font) return "Arial";

  const normalizedFont = font.trim();
  const lowerFont = normalizedFont.toLowerCase();

  // Check if font exists in web-safe fonts
  const matched = webSafeFonts.find((f) => f.toLowerCase() === lowerFont);
  if (matched) return matched;

  // Check for common font variations
  const fontMappings: Record<string, string> = {
    "open sans": "Arial",
    roboto: "Arial",
    montserrat: "Arial",
    outfit: "Arial",
    lato: "Arial",
    "source sans pro": "Arial",
    nunito: "Arial",
    poppins: "Arial",
    inter: "Arial",
    "work sans": "Arial",
  };

  const mappedFont = fontMappings[lowerFont];
  if (mappedFont) return mappedFont;

  // Fallback to Arial for unknown fonts
  console.warn(`Unknown font "${font}", falling back to Arial`);
  return "Arial";
}

/**
 * Safe scale value validation
 */
function safeScale(value: number, defaultValue = 1): number {
  if (typeof value !== "number" || isNaN(value) || !isFinite(value)) {
    return defaultValue;
  }
  if (Math.abs(value) < 0.01) {
    return defaultValue; // Avoid extremely small values
  }
  return Math.abs(value);
}

/**
 * Text alignment mapping
 */
function mapTextAlignment(alignment: string): "left" | "center" | "right" {
  const alignmentMap: Record<string, "left" | "center" | "right"> = {
    START: "left",
    CENTER: "center",
    END: "right",
    JUSTIFIED: "left", // Fallback for justified text
  };

  return alignmentMap[alignment?.toUpperCase()] || "left";
}

/**
 * Convert Google Slides color object to CSS color string
 */
function rgbaColor(color: any): string {
  if (!color) return "transparent";

  // Handle theme colors
  if (color.themeColor) {
    // Map common theme colors to default values
    const themeColorMap: Record<string, string> = {
      DARK1: "#000000",
      DARK2: "#1f1f1f",
      LIGHT1: "#ffffff",
      LIGHT2: "#f5f5f5",
      ACCENT1: "#4285f4",
      ACCENT2: "#ea4335",
      ACCENT3: "#fbbc04",
      ACCENT4: "#34a853",
      ACCENT5: "#ff6d01",
      ACCENT6: "#9c27b0",
    };
    return themeColorMap[color.themeColor] || "#000000";
  }

  // Handle RGB colors
  if (
    typeof color.red === "number" ||
    typeof color.green === "number" ||
    typeof color.blue === "number"
  ) {
    const r = Math.round((color.red || 0) * 255);
    const g = Math.round((color.green || 0) * 255);
    const b = Math.round((color.blue || 0) * 255);
    return `rgb(${r}, ${g}, ${b})`;
  }

  return "transparent";
}

/**
 * Extract text color from Google Slides element
 */
function extractTextColor(element: any): string {
  // Google Slides doesn't always export text color directly
  // Try to extract from various possible locations
  const textStyle = element.properties?.textStyle;

  if (textStyle?.color) {
    return rgbaColor(textStyle.color);
  }

  // Default to black
  return "#000000";
}

/**
 * Convert text element from Google Slides
 */
function convertTextElement(
  element: any,
  slideIndex: number,
  elementIndex: number
): any {
  const id = element.objectId || `el-${slideIndex}-${elementIndex}`;

  // Convert position and size
  const x = emuToPx(element.position?.x || 0);
  const y = emuToPx(element.position?.y || 0);
  const rawWidth = emuToPx(element.size?.width?.magnitude || 0);
  const rawHeight = emuToPx(element.size?.height?.magnitude || 0);

  // Apply transform scaling with safety checks
  const scaleX = safeScale(element.transform?.scaleX, 1);
  const scaleY = safeScale(element.transform?.scaleY, 1);
  const width = rawWidth * scaleX;
  const height = rawHeight * scaleY;

  // Extract rotation (in radians, convert to degrees)
  const rotation = element.transform?.rotation || 0;
  const rotationDegrees = rotation * (180 / Math.PI);

  // Extract text styles
  const textStyle = element.properties?.textStyle || {};
  const shapeStyle = element.properties?.shapeStyle || {};
  const textAlignment = element.properties?.textAlignment || {};

  const fontSize = textStyle.fontSize?.magnitude || 14;
  const fontFamily = normalizeFontFamily(textStyle.fontFamily);
  const bold = textStyle.bold || false;
  const italic = textStyle.italic || false;
  const underline = textStyle.underline || false;
  const textColor = extractTextColor(element);
  const backgroundColor = rgbaColor(shapeStyle.backgroundColor);
  const textAlign = mapTextAlignment(textAlignment.alignment);

  return {
    id,
    type: "text" as const,
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(width),
    height: Math.round(height),
    text: element.text?.trim?.() || "",
    rotation: Math.round(rotationDegrees),
    style: {
      fontSize,
      fontFamily,
      bold,
      italic,
      underline,
      color: textColor,
      backgroundColor,
      textAlign,
    },
  };
}

/**
 * Convert Google Slides element to slide editor element
 */
function convertElement(
  element: any,
  slideIndex: number,
  elementIndex: number
): any {
  // Skip unknown elements
  if (element.type === "unknown") {
    return null;
  }

  const isTextBox = element.properties?.shapeType === "TEXT_BOX";
  const hasText = element.properties?.hasText && element.text;

  // ✅ Only process text boxes with text content
  if (isTextBox && hasText) {
    return convertTextElement(element, slideIndex, elementIndex);
  }

  // ✅ Skip all non-text elements (images, shapes, etc.)
  return null;
}

/**
 * Main conversion function: Google Slides JSON to Slide Editor format
 */
export function convertGoogleSlideJsonToEditor(data: any) {
  if (!data || !data.slides) {
    throw new Error("Invalid Google Slides data: missing slides array");
  }

  const slides = data.slides.map((slide: any, slideIndex: number) => {
    const elements =
      slide.elements
        ?.map((element: any, elementIndex: number) =>
          convertElement(element, slideIndex, elementIndex)
        )
        .filter((element: any) => element !== null) || [];

    return {
      id: slide.slide_id || `slide-${slideIndex}`,
      name: `Slide ${slide.slide_index + 1}`,
      elements,
    };
  });

  return {
    slides,
    canvasSize: {
      width: 960, // Standard PPTX width in pixels
      height: 540, // Standard PPTX height in pixels (16:9 ratio)
    },
    metadata: {
      title: data.title || "Untitled Presentation",
      presentationId: data.presentation_id,
      slideCount: data.slide_count || slides.length,
      createdTime: data.created_time,
      lastModifiedTime: data.last_modified_time,
      webViewLink: data.web_view_link,
    },
  };
}

/**
 * Type definitions for the converted data
 */
export interface ConvertedSlideElement {
  id: string;
  type: "text" | "shape" | "image";
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  style?: {
    fontSize?: number;
    fontFamily?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    color?: string;
    backgroundColor?: string;
    textAlign?: string;
  };
  shapeType?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  svgPath?: string;
}

export interface ConvertedSlide {
  id: string;
  name: string;
  elements: ConvertedSlideElement[];
}

export interface ConvertedPresentation {
  slides: ConvertedSlide[];
  canvasSize: {
    width: number;
    height: number;
  };
  metadata: {
    title: string;
    presentationId?: string;
    slideCount: number;
    createdTime?: string;
    lastModifiedTime?: string;
    webViewLink?: string;
  };
}
