import JSZip from "jszip";
import { parseStringPromise } from "xml2js";
import { PptxSlide, PptxParseResult, ParseError } from "./types";
import { extractImagesFromPptx } from "./extractors/imageExtractor";
import { parseSlideXml } from "./parsers/slideXmlParser";

// Main PPTX parser function
export const parsePptx = async (
  arrayBuffer: ArrayBuffer
): Promise<PptxParseResult> => {
  console.log("Starting PPTX parsing...");

  try {
    const zip = await JSZip.loadAsync(arrayBuffer);
    const slides: PptxSlide[] = [];
    const errors: ParseError[] = [];

    // Extract all images from media folder
    console.log("Extracting images from PPTX...");
    const extractedImages = await extractImagesFromPptx(zip);
    console.log(`Extracted ${extractedImages.length} images`);

    // Get all slide files
    const slideFiles = Object.keys(zip.files)
      .filter((fileName) => fileName.startsWith("ppt/slides/slide"))
      .sort((a, b) => {
        const aNum = parseInt(a.match(/slide(\d+)\.xml$/)?.[1] || "0");
        const bNum = parseInt(b.match(/slide(\d+)\.xml$/)?.[1] || "0");
        return aNum - bNum;
      });

    console.log(`Found ${slideFiles.length} slides:`, slideFiles);

    // Parse each slide
    for (let i = 0; i < slideFiles.length; i++) {
      const fileName = slideFiles[i];
      const slideNumber = i + 1;

      console.log(`\nProcessing slide ${slideNumber}: ${fileName}`);

      try {
        const slideXml = await zip.files[fileName].async("string");
        const slide = await parseSlideXml(
          slideXml,
          slideNumber,
          extractedImages
        );
        slides.push(slide);
        console.log(
          `Completed slide ${slideNumber}: ${slide.texts.length} texts, ${slide.images.length} images, ${slide.shapes.length} shapes`
        );
      } catch (error) {
        const parseError: ParseError = {
          slide: slideNumber,
          error,
          message: `Failed to parse slide ${slideNumber}: ${error}`,
        };
        errors.push(parseError);
        console.error(`Error processing slide ${slideNumber}:`, error);

        // Add empty slide to maintain order
        slides.push({
          slideNumber,
          elements: [],
          texts: [],
          images: [],
          shapes: [],
        });
      }
    }

    // Log error summary
    if (errors.length > 0) {
      console.warn(
        `Failed to parse ${errors.length} slides:`,
        errors.map((e) => e.slide).join(", ")
      );
    }

    // Extract metadata
    const metadata = {
      totalSlides: slides.length,
      title: undefined,
      author: undefined,
      createdDate: undefined,
    };

    // Try to extract presentation metadata
    try {
      const corePropsFile = zip.files["docProps/core.xml"];
      if (corePropsFile) {
        const corePropsXml = await corePropsFile.async("string");
        const corePropsResult = await parseStringPromise(corePropsXml);

        metadata.title =
          corePropsResult?.["cp:coreProperties"]?.["dc:title"]?.[0] ||
          undefined;
        metadata.author =
          corePropsResult?.["cp:coreProperties"]?.["dc:creator"]?.[0] ||
          undefined;
        metadata.createdDate =
          corePropsResult?.["cp:coreProperties"]?.["dcterms:created"]?.[0]?._ ||
          undefined;
      }
    } catch (metadataError) {
      console.warn("Could not extract metadata:", metadataError);
    }

    return {
      slides,
      images: extractedImages,
      metadata,
    };
  } catch (error) {
    console.error("Error parsing PPTX:", error);
    throw new Error(`Failed to parse PPTX: ${error}`);
  }
};

// Export types and utilities for external use
export * from "./types";
export { parseSlideXml } from "./parsers/slideXmlParser";
