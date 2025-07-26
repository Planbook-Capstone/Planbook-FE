export interface ExtractedImage {
  src: string; // base64 data URL
  name: string; // original filename
  path: string; // path in PPTX
  type: string; // image type (png, jpg, etc.)
}

// Table data structures for editing
export interface TableCell {
  text: string;
  rowspan?: number;
  colspan?: number;
  style?: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    align?: "left" | "center" | "right";
    verticalAlign?: "top" | "middle" | "bottom";
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
}

export interface TableRow {
  cells: TableCell[];
  height?: number;
}

// Slide element types
export type SlideElementType = "text" | "image" | "shape" | "table" | "group";

// Unified slide element types
export type SlideElement =
  | {
      type: "text";
      x: number;
      y: number;
      text: string;
      style?: {
        fontSize?: number;
        fontFamily?: string;
        color?: string;
      };
    }
  | {
      type: "image";
      x: number;
      y: number;
      width: number;
      height: number;
      src: string;
      name?: string;
    }
  | {
      type: "shape";
      x: number;
      y: number;
      width: number;
      height: number;
      svgPath: string;
      fill?: string;
      border?: string;
      shapeType?: string;
      shapeId?: string;
    }
  | {
      type: "group";
      x: number;
      y: number;
      width: number;
      height: number;
      children: SlideElement[];
      svgPath: string;
    }
  | {
      type: "table";
      x: number;
      y: number;
      width: number;
      height: number;
      rows: TableRow[];
      svgPath?: string; // For display fallback
    };

export interface PptxSlide {
  slideNumber: number;
  elements: SlideElement[];
  // Backward compatibility - deprecated
  texts: Array<{
    text: string;
    x?: number;
    y?: number;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
  }>;
  images: Array<{
    src: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    name?: string;
  }>;
  shapes: Array<{
    type: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fill?: string;
    border?: string;
    text?: string;
    svgPath?: string;
    shapeId?: string;
    tableData?: TableRow[]; // For table editing
    groupChildren?: any[]; // For group ungroup functionality
  }>;
}

export interface PptxParseResult {
  slides: PptxSlide[];
  images: ExtractedImage[]; // All extracted images
  metadata: {
    totalSlides: number;
    title?: string;
    author?: string;
    createdDate?: string;
  };
}

export interface Transform {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface ParseError {
  slide: number;
  error: any;
  message: string;
}
