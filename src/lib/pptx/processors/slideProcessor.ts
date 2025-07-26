import { PptxSlide, ExtractedImage, TableRow, TableCell } from "../types";
import { extractPosition } from "../utils/transform";
import { parseShapeProperties } from "../parsers/shapeParser";
import { processGroupShape } from "../parsers/groupParser";

// Extract text from paragraph runs (inline)
const extractTextFromRuns = (runs: any[]): string => {
  if (!runs || runs.length === 0) return "";
  return runs
    .map((run: any) => {
      const textElement = run["a:t"];
      if (Array.isArray(textElement)) {
        return textElement.join("");
      }
      return textElement || "";
    })
    .join("");
};

// Check if shape is text-only (text box without visual shape)
const isTextOnlyShape = (shape: any, hasText: boolean): boolean => {
  if (!hasText) return false;

  // Check if shape has preset geometry that indicates it's a text box
  const spPr = shape["p:spPr"]?.[0];
  const prstGeom = spPr?.["a:prstGeom"]?.[0];

  if (prstGeom) {
    const shapeType = prstGeom.$?.prst || prstGeom.$.prst || prstGeom.prst;
    // Common text box shape types
    if (shapeType === "rect" || shapeType === "textBox") {
      // Check if it has no fill or stroke (invisible background)
      const noFill = spPr?.["a:noFill"];
      const solidFill = spPr?.["a:solidFill"];
      const ln = spPr?.["a:ln"];

      // If it's a rectangle with text but no visible styling, treat as text-only
      if (noFill || (!solidFill && !ln)) {
        return true;
      }
    }
  }

  return false;
};

// Process individual shape
const processShape = (shape: any, slide: PptxSlide) => {
  try {
    let hasText = false;

    // Extract text from text body
    const textBody = shape["p:txBody"]?.[0];
    if (textBody) {
      const paragraphs = textBody["a:p"] || [];

      paragraphs.forEach((paragraph: any) => {
        const runs = paragraph["a:r"] || [];
        const text = extractTextFromRuns(runs);

        if (text.trim()) {
          hasText = true;
          // Try to extract position from transform
          const spPr = shape["p:spPr"]?.[0];
          const position = extractPosition(spPr);

          slide.texts.push({
            text: text.trim(),
            x: position.x,
            y: position.y,
            fontSize: 12, // Could extract from run properties
            fontFamily: "Arial", // Default
            color: "#000000", // Default
          });
          console.log(
            `Added text: "${text.trim()}" at (${position.x}, ${position.y})`
          );
        }
      });
    }

    // Only create shape if it's NOT a text-only element
    const spPr = shape["p:spPr"]?.[0];
    if (spPr && !isTextOnlyShape(shape, hasText)) {
      console.log(
        "Shape has spPr and is not text-only, attempting to parse shape properties"
      );
      try {
        const shapeData = parseShapeProperties(spPr);
        if (shapeData) {
          // Extract shapeId for tracing/debugging
          const shapeId = shape?.["p:nvSpPr"]?.[0]?.["p:cNvPr"]?.[0]?.$?.id;
          if (shapeId) {
            shapeData.shapeId = shapeId;
          }

          slide.shapes.push(shapeData);
          console.log(
            `Added shape: ${shapeData.type} at (${shapeData.x}, ${
              shapeData.y
            })${shapeId ? ` (id: ${shapeId})` : ""}`
          );
        } else {
          console.log("parseShapeProperties returned null");
        }
      } catch (shapeError) {
        console.warn("Error parsing shape properties:", shapeError);
      }
    } else if (hasText) {
      console.log("Skipping shape creation for text-only element");
    } else {
      console.log("Shape has no spPr");
    }
  } catch (err) {
    console.warn("Error processing shape:", err);
  }
};

// Process graphic frame (tables, charts)
const processGraphicFrame = (frame: any, slide: PptxSlide) => {
  try {
    console.log("Processing graphic frame");
    // Check if it's a table
    const graphic = frame["a:graphic"]?.[0];
    const graphicData = graphic?.["a:graphicData"]?.[0];

    if (graphicData?.["a:tbl"]) {
      console.log("Found table in graphic frame");
      const table = graphicData["a:tbl"][0];
      const tableData = parseTable(table);

      if (tableData && tableData.length > 0) {
        // Extract actual position and size from frame
        const spPr = frame["p:spPr"]?.[0];
        const xfrm = spPr?.["a:xfrm"]?.[0];
        const off = xfrm?.["a:off"]?.[0]?.$;
        const ext = xfrm?.["a:ext"]?.[0]?.$;

        const x = off ? Math.round(parseInt(off.x || "0") / 12700) : 0;
        const y = off ? Math.round(parseInt(off.y || "0") / 12700) : 0;
        const width = ext ? Math.round(parseInt(ext.cx || "0") / 12700) : 400;
        const height = ext ? Math.round(parseInt(ext.cy || "0") / 12700) : 200;

        // Add table with structured data for editing (no SVG needed)
        slide.shapes.push({
          type: "table",
          x,
          y,
          width,
          height,
          fill: "transparent",
          border: "1px solid #000000",
          // Store structured data for editing - this is what frontend needs
          tableData: tableData,
        });

        console.log(
          `Added table: ${tableData.length}x${
            tableData[0]?.cells?.length || 0
          } at (${x}, ${y})`
        );
      }
    }
  } catch (err) {
    console.warn("Error processing graphic frame:", err);
  }
};

// Process picture element
const processPicture = (
  picture: any,
  slide: PptxSlide,
  extractedImages: ExtractedImage[],
  index: number
) => {
  try {
    console.log(`Processing picture ${index}`);
    const actualImage = extractedImages[index] || null;

    // Extract actual dimensions from spPr
    const spPr = picture["p:spPr"]?.[0];
    const xfrm = spPr?.["a:xfrm"]?.[0];
    const off = xfrm?.["a:off"]?.[0]?.$;
    const ext = xfrm?.["a:ext"]?.[0]?.$;

    const x = off ? Math.round(parseInt(off.x || "0") / 12700) : 0;
    const y = off ? Math.round(parseInt(off.y || "0") / 12700) : 0;
    const width = ext ? Math.round(parseInt(ext.cx || "0") / 12700) : 200;
    const height = ext ? Math.round(parseInt(ext.cy || "0") / 12700) : 150;

    slide.images.push({
      src: actualImage ? actualImage.src : "/images/placeholder-image.svg",
      x,
      y,
      width,
      height,
      name: actualImage ? actualImage.name : `Image ${index + 1}`,
    });

    console.log(
      `Added image: ${
        actualImage?.name || "placeholder"
      } at (${x}, ${y}) size ${width}x${height}`
    );
  } catch (err) {
    console.warn("Error processing picture:", err);
  }
};

// Parse table data with structured format for editing
const parseTable = (table: any): TableRow[] | null => {
  try {
    const rows = table["a:tr"] || [];
    const tableData: TableRow[] = [];

    rows.forEach((row: any) => {
      const cells = row["a:tc"] || [];
      const rowCells: TableCell[] = [];

      cells.forEach((cell: any) => {
        const txBody = cell["a:txBody"]?.[0];
        let cellText = "";
        let cellStyle: TableCell["style"] = {};

        if (txBody) {
          const paragraphs = txBody["a:p"] || [];

          paragraphs.forEach((paragraph: any) => {
            const runs = paragraph["a:r"] || [];
            cellText += extractTextFromRuns(runs);

            // Extract text formatting from first run
            if (runs.length > 0) {
              const firstRun = runs[0];
              const rPr = firstRun["a:rPr"]?.[0];

              if (rPr) {
                // Font size
                const sz = rPr["a:sz"]?.[0]?.$?.val;
                if (sz) {
                  cellStyle.fontSize = parseInt(sz) / 100; // Convert from half-points
                }

                // Font family
                const latin = rPr["a:latin"]?.[0]?.$?.typeface;
                if (latin) {
                  cellStyle.fontFamily = latin;
                }

                // Bold
                const b = rPr["a:b"];
                if (b) {
                  cellStyle.bold = true;
                }

                // Italic
                const i = rPr["a:i"];
                if (i) {
                  cellStyle.italic = true;
                }

                // Color
                const solidFill = rPr["a:solidFill"]?.[0];
                if (solidFill) {
                  const srgbClr = solidFill["a:srgbClr"]?.[0]?.$?.val;
                  if (srgbClr) {
                    cellStyle.color = `#${srgbClr}`;
                  }
                }
              }
            }
          });
        }

        // Extract cell properties
        const tcPr = cell["a:tcPr"]?.[0];
        if (tcPr) {
          // Background color
          const solidFill = tcPr["a:solidFill"]?.[0];
          if (solidFill) {
            const srgbClr = solidFill["a:srgbClr"]?.[0]?.$?.val;
            if (srgbClr) {
              cellStyle.backgroundColor = `#${srgbClr}`;
            }
          }

          // Text alignment
          const anchor = tcPr["a:anchor"]?.[0]?.$?.val;
          if (anchor) {
            cellStyle.verticalAlign =
              anchor === "t" ? "top" : anchor === "ctr" ? "middle" : "bottom";
          }
        }

        rowCells.push({
          text: cellText.trim(),
          style: Object.keys(cellStyle).length > 0 ? cellStyle : undefined,
        });
      });

      if (rowCells.length > 0) {
        tableData.push({ cells: rowCells });
      }
    });

    console.log("table:" + JSON.stringify(tableData));

    return tableData.length > 0 ? tableData : null;
  } catch (err) {
    console.warn("Error parsing table:", err);
    return null;
  }
};

// Process all elements in shape tree (recursive for groups)
export const processShapeTreeElements = (
  shapeTree: any,
  slide: PptxSlide,
  extractedImages: ExtractedImage[]
) => {
  // Process regular shapes (p:sp)
  const shapes = shapeTree["p:sp"] || [];
  shapes.forEach((shape: any) => processShape(shape, slide));

  // Process grouped shapes (p:grpSp) - RECURSIVE with proper transform
  const groupShapes = shapeTree["p:grpSp"] || [];
  groupShapes.forEach((group: any) => {
    console.log("Processing group shape:", Object.keys(group));
    // Use dedicated group processor with transform handling
    processGroupShape(group, slide, extractedImages);
  });

  // Process connection shapes (p:cxnSp)
  const connectionShapes = shapeTree["p:cxnSp"] || [];
  connectionShapes.forEach((cxnShape: any) => {
    console.log("Processing connection shape");
    processShape(cxnShape, slide);
  });

  // Process graphic frames (tables, charts, etc.)
  const graphicFrames = shapeTree["p:graphicFrame"] || [];
  graphicFrames.forEach((frame: any) => {
    console.log("Processing graphic frame");
    processGraphicFrame(frame, slide);
  });

  // Process pictures (p:pic)
  const pictures = shapeTree["p:pic"] || [];
  pictures.forEach((picture: any, index: number) => {
    console.log("Processing picture");
    processPicture(picture, slide, extractedImages, index);
  });
};
