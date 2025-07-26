import PptxGenJS from "pptxgenjs";

// Interface for slide data
export interface SlideData {
  id: string;
  title: string;
  elements: ElementData[];
  isVisible: boolean;
  background?: string; // Background color, gradient, or image URL
}

export interface ElementData {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  src?: string; // For image elements
  alt?: string; // For image elements
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
function convertCoordinates(
  x: number,
  y: number,
  width: number,
  height: number
) {
  const xInches = (x / PPTX_CONFIG.canvasWidth) * PPTX_CONFIG.slideWidth;
  const yInches = (y / PPTX_CONFIG.canvasHeight) * PPTX_CONFIG.slideHeight;
  const widthInches =
    (width / PPTX_CONFIG.canvasWidth) * PPTX_CONFIG.slideWidth;
  const heightInches =
    (height / PPTX_CONFIG.canvasHeight) * PPTX_CONFIG.slideHeight;

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
 * Safe font fallback to prevent PPTX font issues
 */
function safeFont(font: string): string {
  const allowedFonts = [
    "Arial",
    "Verdana",
    "Tahoma",
    "Times New Roman",
    "Calibri",
    "Georgia",
  ];
  if (!font) return "Arial";

  const normalizedFont = font.trim();
  const lowerFont = normalizedFont.toLowerCase();

  const matched = allowedFonts.find((f) => f.toLowerCase() === lowerFont);
  return matched || "Arial";
}

/**
 * Add text element to PowerPoint slide
 */
function addTextElement(slide: any, element: ElementData) {
  if (!element.text || element.type !== "text") return;

  const coords = convertCoordinates(
    element.x,
    element.y,
    element.width,
    element.height
  );
  const style = element.style || {};

  const fontSize = convertFontSize(
    (style as any).fontSize || PPTX_CONFIG.defaultFontSize
  );

  const textOptions = {
    x: coords.x,
    y: coords.y,
    w: coords.w, // ✅ Keep exact canvas dimensions
    h: coords.h, // ✅ Keep exact canvas dimensions
    fontSize: fontSize,
    fontFace: safeFont((style as any).fontFamily || PPTX_CONFIG.defaultFont), // ✅ Use safe font
    color: convertColor((style as any).color),
    bold: (style as any).bold || false,
    italic: (style as any).italic || false,
    underline: (style as any).underline || false,
    align: (style as any).textAlign || "left",
    valign: "top",
    wrap: true,
    autoFit: false,
    shrinkText: true,
    breakLine: true, // Allow manual line breaks (\n)
  };

  slide.addText(element.text, textOptions);
}

/**
 * Extract first color from gradient string for fallback
 */
function extractFirstColorFromGradient(gradientString: string): string {
  // Support both 6-digit and 3-digit hex colors
  const colorMatches = gradientString.match(/#[0-9a-fA-F]{3,6}/g);
  if (colorMatches && colorMatches.length > 0) {
    let firstColor = colorMatches[0];
    // Convert 3-digit hex to 6-digit if needed
    if (firstColor.length === 4) {
      firstColor =
        "#" +
        firstColor[1] +
        firstColor[1] +
        firstColor[2] +
        firstColor[2] +
        firstColor[3] +
        firstColor[3];
    }
    return firstColor;
  }
  return "#ffffff"; // Default fallback
}

/**
 * Set slide background
 */
async function setSlideBackground(slide: any, background?: string) {
  if (!background || background === "#ffffff") return; // Skip white/default background

  try {
    // Handle solid colors
    if (background.startsWith("#")) {
      slide.background = { color: convertColor(background) };
      return;
    }

    // Handle gradients - PptxGenJS doesn't support gradients well, so convert to solid color
    if (background.startsWith("linear-gradient")) {
      console.warn(
        "Gradient backgrounds are not fully supported in PPTX export. Using first color as solid background."
      );

      // Extract first color from gradient as fallback
      const firstColor = extractFirstColorFromGradient(background);
      slide.background = { color: convertColor(firstColor) };
      return;
    }

    // Handle background images - add as full-size image element instead of slide.background
    if (background.startsWith("url(")) {
      const imageUrl = background.slice(4, -1); // Remove url() wrapper

      try {
        // Convert any image URL (blob, cloud URL, or base64) to base64
        const base64 = await convertImageToBase64(imageUrl);

        // Add as full-size background image element instead of slide.background
        slide.addImage({
          data: base64,
          x: 0,
          y: 0,
          w: "100%",
          h: "100%",
        });
      } catch (error) {
        console.warn("Failed to load background image for PPTX export:", error);
      }
      return;
    }
  } catch (error) {
    console.error("Error setting slide background:", error);
  }
}

/**
 * Get image dimensions from blob/data URL
 */
async function getImageDimensions(
  imageSrc: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
    img.src = imageSrc;
  });
}

/**
 * Calculate aspect ratio fit dimensions (like object-cover)
 */
function calculateAspectRatioFit(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number; x: number; y: number } {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  const width = srcWidth * ratio;
  const height = srcHeight * ratio;

  // Center the image within the container
  const x = (maxWidth - width) / 2;
  const y = (maxHeight - height) / 2;

  return { width, height, x, y };
}

/**
 * Convert GIF to static image (first frame) using Canvas
 */
async function convertGifToStaticImage(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        // Create canvas to capture first frame
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Set canvas size to image size
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Draw the image (this captures the first frame for GIFs)
        ctx.drawImage(img, 0, 0);

        // Convert to PNG base64
        const base64 = canvas.toDataURL("image/png");
        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image for GIF conversion"));
    };

    img.src = imageUrl;
  });
}

/**
 * Convert image URL to base64 data URL
 */
async function convertImageToBase64(imageUrl: string): Promise<string> {
  try {
    // If already base64, return as is
    if (imageUrl.startsWith("data:image/")) {
      return imageUrl;
    }

    // Check if it's a GIF - convert to static image first
    if (
      imageUrl.toLowerCase().includes(".gif") ||
      imageUrl.toLowerCase().includes("gif")
    ) {
      console.log("Converting GIF to static image for PPTX compatibility...");
      return await convertGifToStaticImage(imageUrl);
    }

    // Fetch the image from URL (works for both blob URLs and cloud URLs)
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }

    const blob = await response.blob();

    // Double-check if it's a GIF by MIME type
    if (blob.type === "image/gif") {
      console.log("Detected GIF by MIME type, converting to static image...");
      const blobUrl = URL.createObjectURL(blob);
      const staticImage = await convertGifToStaticImage(blobUrl);
      URL.revokeObjectURL(blobUrl); // Clean up
      return staticImage;
    }

    // Validate file size (max 5MB for PPTX compatibility)
    if (blob.size > 5 * 1024 * 1024) {
      throw new Error("Image too large for PPTX export (>5MB)");
    }

    // Convert blob to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Validate base64 format
        if (result && result.startsWith("data:image/")) {
          resolve(result);
        } else {
          reject(new Error("Invalid image format"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read image"));
      reader.readAsDataURL(blob);
    });

    return base64;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
}

/**
 * Add image element to PowerPoint slide
 */
async function addImageElement(slide: any, element: ElementData) {
  if (!element.src || element.type !== "image") return;

  const coords = convertCoordinates(
    element.x,
    element.y,
    element.width,
    element.height
  );

  try {
    // Convert any image URL (blob, cloud URL, or base64) to base64
    const imageSrc = await convertImageToBase64(element.src);

    const imageOptions = {
      x: coords.x,
      y: coords.y,
      w: coords.w,
      h: coords.h,
      data: imageSrc,
    };

    slide.addImage(imageOptions);
  } catch (error) {
    console.error("Error adding image to slide:", error);
    // Add a placeholder text if image fails
    const textOptions = {
      x: coords.x,
      y: coords.y,
      w: coords.w,
      h: coords.h,
      fontSize: 12,
      fontFace: "Arial",
      color: "666666",
      align: "center",
      valign: "middle",
    };
    slide.addText(`[Image: ${element.alt || "Failed to load"}]`, textOptions);
  }
}

/**
 * Create PowerPoint presentation from slide data
 */
export async function exportToPPTX(
  slides: SlideData[],
  filename: string = "presentation.pptx"
): Promise<void> {
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

    // Add slides with async image processing
    for (const [index, slideData] of slides.entries()) {
      if (!slideData.isVisible) continue; // Skip hidden slides

      // Create new slide
      const slide = pptx.addSlide();

      // Add slide title as metadata (optional)
      slide.addNotes(`Slide ${index + 1}: ${slideData.title}`);

      // Set slide background
      await setSlideBackground(slide, slideData.background);

      // Add elements to slide (process images async)
      for (const element of slideData.elements) {
        switch (element.type) {
          case "text":
            addTextElement(slide, element);
            break;
          case "image":
            await addImageElement(slide, element);
            break;
          default:
            console.warn(`Unsupported element type: ${element.type}`);
        }
      }
    }

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
export async function exportSingleSlideToPPTX(
  slideData: SlideData,
  filename: string = "slide.pptx"
): Promise<void> {
  return exportToPPTX([slideData], filename);
}

/**
 * Get export preview data
 */
export function getExportPreview(slides: SlideData[]) {
  const visibleSlides = slides.filter((slide) => slide.isVisible);
  const totalElements = visibleSlides.reduce(
    (sum, slide) => sum + slide.elements.length,
    0
  );

  return {
    totalSlides: visibleSlides.length,
    totalElements,
    slideDetails: visibleSlides.map((slide) => ({
      title: slide.title,
      elementCount: slide.elements.length,
      hasText: slide.elements.some((el) => el.type === "text"),
      hasImages: slide.elements.some((el) => el.type === "image"),
      textCount: slide.elements.filter((el) => el.type === "text").length,
      imageCount: slide.elements.filter((el) => el.type === "image").length,
    })),
  };
}

/**
 * Validate slide data before export
 */
export function validateSlideData(slides: SlideData[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!slides || slides.length === 0) {
    errors.push("No slides to export");
  }

  const visibleSlides = slides.filter((slide) => slide.isVisible);
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
        errors.push(
          `Slide ${index + 1}, Element ${
            elemIndex + 1
          }: Text element has no content`
        );
      }

      if (element.type === "image" && !element.src) {
        errors.push(
          `Slide ${index + 1}, Element ${
            elemIndex + 1
          }: Image element has no source`
        );
      }

      // Validate image URLs and warn about GIF conversion
      if (element.type === "image" && element.src) {
        const src = element.src;

        // Warn about potential accessibility issues
        if (
          !src.startsWith("data:image/") &&
          !src.startsWith("blob:") &&
          !src.startsWith("http://") &&
          !src.startsWith("https://")
        ) {
          console.warn(
            `Slide ${index + 1}, Element ${
              elemIndex + 1
            }: Image source may not be accessible: ${src}`
          );
        }

        // Info about GIF conversion
        if (
          src.toLowerCase().includes(".gif") ||
          src.toLowerCase().includes("gif")
        ) {
          console.info(
            `Slide ${index + 1}, Element ${
              elemIndex + 1
            }: GIF will be converted to static image (first frame) for PPTX compatibility`
          );
        }
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
