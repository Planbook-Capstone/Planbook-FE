import { Transform } from "../types";

// Extract transform from spPr (dùng chung cho position và group transform)
export const extractTransform = (spPr: any): Transform => {
  try {
    const xfrm = spPr?.["a:xfrm"]?.[0];
    const off = xfrm?.["a:off"]?.[0]?.$;
    const ext = xfrm?.["a:ext"]?.[0]?.$;

    const result: Transform = { x: 0, y: 0 };

    if (off) {
      result.x = Math.round(parseInt(off.x || "0") / 12700);
      result.y = Math.round(parseInt(off.y || "0") / 12700);
    }

    if (ext) {
      result.width = Math.round(parseInt(ext.cx || "0") / 12700);
      result.height = Math.round(parseInt(ext.cy || "0") / 12700);
    }

    return result;
  } catch (err) {
    console.warn("Error extracting transform:", err);
  }

  return { x: 0, y: 0 };
};

// Extract position from transform (backward compatibility)
export const extractPosition = (spPr: any): { x: number; y: number } => {
  const transform = extractTransform(spPr);
  return { x: transform.x, y: transform.y };
};
