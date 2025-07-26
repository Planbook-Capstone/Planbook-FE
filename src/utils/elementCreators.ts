import { TextElement as TextElementType } from "@/types";
import { ElementPosition, ElementDimensions } from "@/hooks/useElementPositioning";

// Base element creator interface
interface BaseElementConfig {
  id?: string;
  position: ElementPosition;
  dimensions: ElementDimensions;
}

// Text element specific config
interface TextElementConfig extends BaseElementConfig {
  text: string;
  style?: {
    fontSize?: number;
    fontFamily?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    color?: string;
    textAlign?: "left" | "center" | "right";
  };
}

// Default text styles for different types
const TEXT_PRESETS = {
  heading: {
    fontSize: 72,
    fontFamily: "Arial, sans-serif",
    bold: true,
    italic: false,
    underline: false,
    color: "#000000",
    textAlign: "left" as const,
  },
  subheading: {
    fontSize: 36,
    fontFamily: "Arial, sans-serif",
    bold: true,
    italic: false,
    underline: false,
    color: "#000000",
    textAlign: "left" as const,
  },
  body: {
    fontSize: 18,
    fontFamily: "Arial, sans-serif",
    bold: false,
    italic: false,
    underline: false,
    color: "#000000",
    textAlign: "left" as const,
  },
  caption: {
    fontSize: 14,
    fontFamily: "Arial, sans-serif",
    bold: false,
    italic: true,
    underline: false,
    color: "#666666",
    textAlign: "left" as const,
  },
};

// Default dimensions for different text types
const TEXT_DIMENSIONS = {
  heading: { width: 300, height: 80 },
  subheading: { width: 250, height: 60 },
  body: { width: 200, height: 40 },
  caption: { width: 150, height: 30 },
};

/**
 * Create a text element with specified configuration
 */
export function createTextElement(config: TextElementConfig): TextElementType {
  return {
    id: config.id || `text-${Date.now()}`,
    type: "text",
    x: config.position.x,
    y: config.position.y,
    width: config.dimensions.width,
    height: config.dimensions.height,
    text: config.text,
    style: {
      fontSize: 16,
      fontFamily: "Arial, sans-serif",
      bold: false,
      italic: false,
      underline: false,
      color: "#000000",
      textAlign: "left",
      ...config.style,
    },
  };
}

/**
 * Create a heading text element
 */
export function createHeadingElement(
  text: string,
  position: ElementPosition,
  customStyle?: Partial<TextElementConfig["style"]>
): TextElementType {
  return createTextElement({
    text,
    position,
    dimensions: TEXT_DIMENSIONS.heading,
    style: {
      ...TEXT_PRESETS.heading,
      ...customStyle,
    },
  });
}

/**
 * Create a subheading text element
 */
export function createSubheadingElement(
  text: string,
  position: ElementPosition,
  customStyle?: Partial<TextElementConfig["style"]>
): TextElementType {
  return createTextElement({
    text,
    position,
    dimensions: TEXT_DIMENSIONS.subheading,
    style: {
      ...TEXT_PRESETS.subheading,
      ...customStyle,
    },
  });
}

/**
 * Create a body text element
 */
export function createBodyTextElement(
  text: string,
  position: ElementPosition,
  customStyle?: Partial<TextElementConfig["style"]>
): TextElementType {
  return createTextElement({
    text,
    position,
    dimensions: TEXT_DIMENSIONS.body,
    style: {
      ...TEXT_PRESETS.body,
      ...customStyle,
    },
  });
}

/**
 * Create a caption text element
 */
export function createCaptionElement(
  text: string,
  position: ElementPosition,
  customStyle?: Partial<TextElementConfig["style"]>
): TextElementType {
  return createTextElement({
    text,
    position,
    dimensions: TEXT_DIMENSIONS.caption,
    style: {
      ...TEXT_PRESETS.caption,
      ...customStyle,
    },
  });
}

/**
 * Create multiple text elements with smart positioning
 */
export function createTextLayout(
  texts: Array<{
    text: string;
    type: keyof typeof TEXT_PRESETS;
    customStyle?: Partial<TextElementConfig["style"]>;
  }>,
  getSmartPosition: (
    dimensions: ElementDimensions,
    existingElements: Array<{ x: number; y: number; width: number; height: number }>,
    strategy?: string
  ) => ElementPosition
): TextElementType[] {
  const elements: TextElementType[] = [];

  texts.forEach(({ text, type, customStyle }) => {
    const dimensions = TEXT_DIMENSIONS[type];
    const position = getSmartPosition(dimensions, elements, "center");

    const createElement = {
      heading: createHeadingElement,
      subheading: createSubheadingElement,
      body: createBodyTextElement,
      caption: createCaptionElement,
    }[type];

    const element = createElement(text, position, customStyle);
    elements.push(element);
  });

  return elements;
}

/**
 * Create a title slide layout
 */
export function createTitleSlideLayout(
  title: string,
  subtitle: string,
  getSmartPosition: (
    dimensions: ElementDimensions,
    existingElements: Array<{ x: number; y: number; width: number; height: number }>,
    strategy?: string
  ) => ElementPosition
): TextElementType[] {
  return createTextLayout(
    [
      { text: title, type: "heading" },
      { text: subtitle, type: "subheading" },
    ],
    getSmartPosition
  );
}

/**
 * Create a content slide layout
 */
export function createContentSlideLayout(
  title: string,
  content: string[],
  getSmartPosition: (
    dimensions: ElementDimensions,
    existingElements: Array<{ x: number; y: number; width: number; height: number }>,
    strategy?: string
  ) => ElementPosition
): TextElementType[] {
  const texts = [
    { text: title, type: "subheading" as const },
    ...content.map(text => ({ text, type: "body" as const })),
  ];

  return createTextLayout(texts, getSmartPosition);
}

// Export presets and dimensions for external use
export { TEXT_PRESETS, TEXT_DIMENSIONS };
