import { parseStringPromise } from "xml2js";
import { PptxSlide, ExtractedImage, SlideElement } from "../types";
import { processShapeTreeElements } from "../processors/slideProcessor";

// Convert legacy arrays to unified elements array (inline)
const convertToUnifiedElements = (slide: PptxSlide) => {
  const elements: SlideElement[] = [];

  // Convert texts
  slide.texts.forEach((text) => {
    elements.push({
      type: "text",
      x: text.x || 0,
      y: text.y || 0,
      text: text.text,
      style: {
        fontSize: text.fontSize,
        fontFamily: text.fontFamily,
        color: text.color,
      },
    });
  });

  // Convert images
  slide.images.forEach((image) => {
    elements.push({
      type: "image",
      x: image.x || 0,
      y: image.y || 0,
      width: image.width || 200,
      height: image.height || 150,
      src: image.src,
      name: image.name,
    });
  });

  // Convert shapes
  slide.shapes.forEach((shape) => {
    if (shape.type === "group") {
      elements.push({
        type: "group",
        x: shape.x || 0,
        y: shape.y || 0,
        width: shape.width || 0,
        height: shape.height || 0,
        children: [],
        svgPath: shape.svgPath || "",
      });
    } else if (shape.type === "table" && shape.tableData) {
      elements.push({
        type: "table",
        x: shape.x || 0,
        y: shape.y || 0,
        width: shape.width || 400,
        height: shape.height || 200,
        rows: shape.tableData,
        svgPath: shape.svgPath,
      });
    } else {
      elements.push({
        type: "shape",
        x: shape.x || 0,
        y: shape.y || 0,
        width: shape.width || 100,
        height: shape.height || 100,
        svgPath: shape.svgPath || "",
        fill: shape.fill,
        border: shape.border,
        shapeType: shape.type,
        shapeId: shape.shapeId,
      });
    }
  });

  slide.elements = elements;
  console.log(
    `Unified ${elements.length} elements: ${elements
      .map((e) => e.type)
      .join(", ")}`
  );
};

// Parse individual slide XML with image mapping
export const parseSlideXml = async (
  slideXml: string,
  slideNumber: number,
  extractedImages: ExtractedImage[] = []
): Promise<PptxSlide> => {
  const slide: PptxSlide = {
    slideNumber,
    elements: [], // New unified elements array
    // Backward compatibility
    texts: [],
    images: [],
    shapes: [],
  };

  try {
    const result = await parseStringPromise(slideXml);
    const slideData = result["p:sld"];

    if (!slideData) {
      console.warn(`❌ No slide data found for slide ${slideNumber}`);
      return slide;
    }

    const commonSlideData = slideData["p:cSld"]?.[0];
    if (!commonSlideData) {
      console.warn(`❌ No common slide data found for slide ${slideNumber}`);
      return slide;
    }

    const shapeTree = commonSlideData["p:spTree"]?.[0];
    if (!shapeTree) {
      console.warn(`❌ No shape tree found for slide ${slideNumber}`);
      return slide;
    }

    console.log(
      `🔍 Processing slide ${slideNumber}, shapeTree keys:`,
      Object.keys(shapeTree)
    );

    // Process all types of elements
    processShapeTreeElements(shapeTree, slide, extractedImages);

    // Convert legacy arrays to unified elements array
    convertToUnifiedElements(slide);

    console.log(
      `Slide ${slideNumber} processed: ${slide.elements.length} elements (${slide.texts.length} texts, ${slide.images.length} images, ${slide.shapes.length} shapes)`
    );

    // Debug: log elements with tables
    const tableElements = slide.elements.filter((el) => el.type === "table");
    if (tableElements.length > 0) {
      console.log(
        `Found ${tableElements.length} table elements:`,
        tableElements
      );
    }

    return slide;
  } catch (error) {
    console.error(`❌ Error parsing slide ${slideNumber}:`, error);
    return {
      slideNumber,
      elements: [],
      texts: [],
      images: [],
      shapes: [],
    };
  }
};
