import { PptxSlide, ExtractedImage } from "../types";
import { extractTransform } from "../utils/transform";

import { parseShapeProperties } from "./shapeParser";

// Process group shape with children parsing for accurate display
export const processGroupShape = (
  group: any,
  slide: PptxSlide,
  extractedImages: ExtractedImage[],
  parentTransform: { x: number; y: number } = { x: 0, y: 0 }
) => {
  const groupTransform = extractTransform(group["p:grpSpPr"]?.[0]) || {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  };

  const combinedTransform = {
    x: parentTransform.x + groupTransform.x,
    y: parentTransform.y + groupTransform.y,
    width: groupTransform.width || 100,
    height: groupTransform.height || 100,
  };

  // Extract group shapeId for tracing
  const shapeId = group?.["p:nvGrpSpPr"]?.[0]?.["p:cNvPr"]?.[0]?.$?.id;

  console.log(
    `Processing group shape at (${combinedTransform.x}, ${
      combinedTransform.y
    }) size ${combinedTransform.width}x${combinedTransform.height}${
      shapeId ? ` (id: ${shapeId})` : ""
    }`
  );

  // Parse children to create accurate group SVG
  const childrenSvg: string[] = [];
  const shapeTree = group["p:spTree"] || group;

  // Parse shapes inside group
  const shapes = shapeTree["p:sp"] || [];
  shapes.forEach((shape: any) => {
    const spPr = shape["p:spPr"]?.[0];
    if (spPr) {
      const shapeData = parseShapeProperties(spPr);
      if (shapeData?.svgPath) {
        const transform = `translate(${shapeData.x}, ${shapeData.y})`;
        childrenSvg.push(
          `<g transform="${transform}">${shapeData.svgPath}</g>`
        );
        console.log(
          `Added child shape: ${shapeData.type} at (${shapeData.x}, ${shapeData.y})`
        );
      }
    }
  });

  // Parse pictures in group
  const pictures = shapeTree["p:pic"] || [];
  pictures.forEach((picture: any, index: number) => {
    const pictureTransform = extractTransform(picture["p:spPr"]?.[0]) || {
      x: 0,
      y: 0,
    };
    const actualImage = extractedImages[index] || null;

    if (actualImage) {
      const transform = `translate(${pictureTransform.x}, ${pictureTransform.y})`;
      const imageSvg = `<image href="${actualImage.src}" width="${
        pictureTransform.width || 200
      }" height="${pictureTransform.height || 150}" />`;
      childrenSvg.push(`<g transform="${transform}">${imageSvg}</g>`);
      console.log(
        `Added group image at (${pictureTransform.x}, ${pictureTransform.y})`
      );
    }
  });

  // Create group SVG with children
  const groupSvg =
    childrenSvg.length > 0
      ? `<g transform="translate(${combinedTransform.x}, ${
          combinedTransform.y
        })">${childrenSvg.join("\n")}</g>`
      : `<rect x="0" y="0" width="${combinedTransform.width}" height="${combinedTransform.height}" fill="none" stroke="#999" stroke-dasharray="5,5" />`;

  // Add group with actual content
  slide.shapes.push({
    type: "group",
    x: combinedTransform.x,
    y: combinedTransform.y,
    width: combinedTransform.width,
    height: combinedTransform.height,
    fill: "transparent",
    border: "none",
    svgPath: groupSvg,
    shapeId: shapeId,
  });

  console.log(`Parsed group with ${childrenSvg.length} children`);
};
