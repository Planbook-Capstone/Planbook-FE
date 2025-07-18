/**
 * Test utility for Google Slides converter
 */

import { convertGoogleSlideJsonToEditor } from "./googleSlidesConverter";
import sampleData from "@/data/sample-presentation.json";

/**
 * Test the converter with sample data
 */
export function testGoogleSlidesConverter() {
  console.log("🚀 Testing Google Slides Converter...");
  
  try {
    const result = convertGoogleSlideJsonToEditor(sampleData);
    
    console.log("✅ Conversion successful!");
    console.log("📊 Results:");
    console.log(`- Title: ${result.metadata.title}`);
    console.log(`- Slides: ${result.slides.length}`);
    console.log(`- Canvas: ${result.canvasSize.width} × ${result.canvasSize.height}`);
    
    result.slides.forEach((slide, index) => {
      console.log(`\n📄 ${slide.name}:`);
      console.log(`  - Elements: ${slide.elements.length}`);
      
      slide.elements.forEach((element, elemIndex) => {
        if (element.type === "text") {
          console.log(`    ${elemIndex + 1}. TEXT: "${element.text?.substring(0, 30)}..." at (${element.x}, ${element.y}) ${element.width}×${element.height}`);
          console.log(`       Style: ${element.style?.fontFamily} ${element.style?.fontSize}px ${element.style?.bold ? "Bold" : ""} ${element.style?.italic ? "Italic" : ""}`);
        } else {
          console.log(`    ${elemIndex + 1}. SHAPE: ${element.shapeType} at (${element.x}, ${element.y}) ${element.width}×${element.height}`);
        }
      });
    });
    
    return result;
  } catch (error) {
    console.error("❌ Conversion failed:", error);
    throw error;
  }
}

/**
 * Validate converted data structure
 */
export function validateConvertedData(data: any): boolean {
  const errors: string[] = [];
  
  // Check required properties
  if (!data.slides || !Array.isArray(data.slides)) {
    errors.push("Missing or invalid slides array");
  }
  
  if (!data.canvasSize || typeof data.canvasSize.width !== "number" || typeof data.canvasSize.height !== "number") {
    errors.push("Missing or invalid canvasSize");
  }
  
  if (!data.metadata || typeof data.metadata.title !== "string") {
    errors.push("Missing or invalid metadata");
  }
  
  // Check slides structure
  data.slides?.forEach((slide: any, index: number) => {
    if (!slide.id || typeof slide.id !== "string") {
      errors.push(`Slide ${index}: missing or invalid id`);
    }
    
    if (!slide.name || typeof slide.name !== "string") {
      errors.push(`Slide ${index}: missing or invalid name`);
    }
    
    if (!slide.elements || !Array.isArray(slide.elements)) {
      errors.push(`Slide ${index}: missing or invalid elements array`);
    }
    
    // Check elements structure
    slide.elements?.forEach((element: any, elemIndex: number) => {
      if (!element.id || typeof element.id !== "string") {
        errors.push(`Slide ${index}, Element ${elemIndex}: missing or invalid id`);
      }
      
      if (!["text", "shape", "image"].includes(element.type)) {
        errors.push(`Slide ${index}, Element ${elemIndex}: invalid type "${element.type}"`);
      }
      
      if (typeof element.x !== "number" || typeof element.y !== "number" || 
          typeof element.width !== "number" || typeof element.height !== "number") {
        errors.push(`Slide ${index}, Element ${elemIndex}: invalid position or size`);
      }
      
      if (element.type === "text" && typeof element.text !== "string") {
        errors.push(`Slide ${index}, Element ${elemIndex}: text element missing text property`);
      }
    });
  });
  
  if (errors.length > 0) {
    console.error("❌ Validation errors:");
    errors.forEach(error => console.error(`  - ${error}`));
    return false;
  }
  
  console.log("✅ Data structure validation passed!");
  return true;
}

/**
 * Compare original vs converted data
 */
export function compareData() {
  console.log("🔍 Comparing original vs converted data...");
  
  const original = sampleData;
  const converted = convertGoogleSlideJsonToEditor(sampleData);
  
  console.log("\n📊 Comparison:");
  console.log(`Original slides: ${original.slides.length}`);
  console.log(`Converted slides: ${converted.slides.length}`);
  
  original.slides.forEach((originalSlide: any, index: number) => {
    const convertedSlide = converted.slides[index];
    if (!convertedSlide) return;
    
    const originalElements = originalSlide.elements?.filter((el: any) => 
      el.type !== "unknown" && 
      (el.properties?.hasText || el.properties?.shapeType !== "TEXT_BOX")
    ) || [];
    
    console.log(`\nSlide ${index + 1}:`);
    console.log(`  Original elements: ${originalElements.length}`);
    console.log(`  Converted elements: ${convertedSlide.elements.length}`);
    
    // Check if conversion preserved important data
    originalElements.forEach((originalEl: any, elemIndex: number) => {
      const convertedEl = convertedSlide.elements[elemIndex];
      if (convertedEl && originalEl.text) {
        const textMatch = convertedEl.text === originalEl.text;
        console.log(`    Element ${elemIndex + 1}: Text preserved: ${textMatch ? "✅" : "❌"}`);
        if (!textMatch) {
          console.log(`      Original: "${originalEl.text?.substring(0, 30)}..."`);
          console.log(`      Converted: "${convertedEl.text?.substring(0, 30)}..."`);
        }
      }
    });
  });
}

// Export for console testing
if (typeof window !== "undefined") {
  (window as any).testGoogleSlidesConverter = testGoogleSlidesConverter;
  (window as any).validateConvertedData = validateConvertedData;
  (window as any).compareData = compareData;
}
