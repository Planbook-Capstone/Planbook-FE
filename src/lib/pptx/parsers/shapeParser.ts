import { extractTransform } from "../utils/transform";
import { generateSvgPath } from "../utils/svgGenerator";
import { extractTextBox } from "../utils/extractTextBox";

export const parseShapeProperties = (sp: any, childrenSvg?: string): any => {
  try {
    const spPr = sp?.["p:spPr"]?.[0];
    if (!spPr) return null;

    const transform = extractTransform(spPr);
    const { x, y, width = 100, height = 100 } = transform;

    // Shape type
    const prstGeom = spPr["a:prstGeom"]?.[0];
    const custGeom = spPr["a:custGeom"]?.[0];
    let shapeType = "rect";

    if (prstGeom) {
      shapeType = prstGeom.$?.prst || "rect";
    } else if (custGeom) {
      shapeType = "custom";
    }

    // Fill color
    let fill = "#FFFFFF";
    const solidFill = spPr["a:solidFill"]?.[0];
    if (solidFill) {
      const srgbClr = solidFill["a:srgbClr"]?.[0]?.$?.val;
      const schemeClr = solidFill["a:schemeClr"]?.[0]?.$?.val;
      const schemeMap = {
        accent1: "#4472C4",
        accent2: "#E7E6E6",
        accent3: "#A5A5A5",
        accent4: "#FFC000",
        accent5: "#5B9BD5",
        accent6: "#70AD47",
        dk1: "#000000",
        lt1: "#FFFFFF",
        dk2: "#44546A",
        lt2: "#E7E6E6",
      };
      if (srgbClr) fill = `#${srgbClr}`;
      else if (schemeClr) fill = schemeMap[schemeClr] || "#CCCCCC";
    }

    // Border
    let border = "none";
    const ln = spPr["a:ln"]?.[0];
    if (ln) {
      const w = ln.$?.w ? Math.round(parseInt(ln.$.w) / 12700) : 1;
      let borderColor = "#000000";
      const solidFillLn = ln["a:solidFill"]?.[0];
      if (solidFillLn?.["a:srgbClr"]) {
        borderColor = `#${solidFillLn["a:srgbClr"][0]?.$?.val || "000000"}`;
      }
      border = `${w}px solid ${borderColor}`;
    }

    // SVG path
    const svgPath = generateSvgPath(
      shapeType,
      width,
      height,
      childrenSvg,
      spPr
    );

    const text = extractTextBox(sp);

    return {
      type: "shape",
      shapeType,
      x,
      y,
      width,
      height,
      fill,
      border,
      svgPath,
      text: text || null, // ✅ Add text content if available
      shapeId: sp?.["p:nvSpPr"]?.[0]?.["p:cNvPr"]?.[0]?.$?.id,
    };
  } catch (error) {
    console.error("Error parsing shape:", error);
    return null;
  }
};
