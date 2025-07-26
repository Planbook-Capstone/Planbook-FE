import JSZip from "jszip";
import { ExtractedImage } from "../types";

// Get MIME type for image extensions
const getMimeType = (extension: string): string => {
  const mimeTypes: { [key: string]: string } = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    bmp: "image/bmp",
    svg: "image/svg+xml",
    webp: "image/webp",
  };
  return mimeTypes[extension] || "image/png";
};

// Extract images from PPTX media folder
export const extractImagesFromPptx = async (
  zip: JSZip
): Promise<ExtractedImage[]> => {
  const images: ExtractedImage[] = [];

  try {
    // Find all files in ppt/media/ folder
    const mediaFiles = Object.keys(zip.files).filter(
      (path) => path.startsWith("ppt/media/") && !path.endsWith("/")
    );

    console.log("Found media files:", mediaFiles);

    for (const path of mediaFiles) {
      try {
        const file = zip.files[path];
        if (!file) continue;

        // Get file extension to determine image type
        const fileName = path.split("/").pop() || "";
        const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";

        // Only process image files
        const imageExtensions = [
          "png",
          "jpg",
          "jpeg",
          "gif",
          "bmp",
          "svg",
          "webp",
        ];
        if (!imageExtensions.includes(fileExtension)) {
          console.log(`Skipping non-image file: ${path}`);
          continue;
        }

        // Convert to base64
        const fileData = await file.async("base64");
        const mimeType = getMimeType(fileExtension);

        images.push({
          src: `data:${mimeType};base64,${fileData}`,
          name: fileName,
          path: path,
          type: fileExtension,
        });

        console.log(`Extracted image: ${fileName} (${fileExtension})`);
      } catch (error) {
        console.error(`Error extracting image ${path}:`, error);
      }
    }
  } catch (error) {
    console.error("Error extracting images from PPTX:", error);
  }

  return images;
};
