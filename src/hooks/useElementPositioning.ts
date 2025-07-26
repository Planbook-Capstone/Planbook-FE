import { useCallback } from "react";

// Canvas dimensions for different slide formats
const CANVAS_DIMENSIONS = {
  "16:9": { width: 960, height: 540 },
  "4:3": { width: 960, height: 720 },
} as const;

// Element positioning strategies
export type PositionStrategy = 
  | "center" 
  | "top-left" 
  | "top-center" 
  | "top-right"
  | "center-left"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "random";

// Element dimensions interface
export interface ElementDimensions {
  width: number;
  height: number;
}

// Position result interface
export interface ElementPosition {
  x: number;
  y: number;
}

// Hook for element positioning
export function useElementPositioning(slideFormat: "16:9" | "4:3" = "16:9") {
  const canvasDimensions = CANVAS_DIMENSIONS[slideFormat];

  // Calculate position based on strategy
  const calculatePosition = useCallback((
    dimensions: ElementDimensions,
    strategy: PositionStrategy = "center",
    offset?: { x?: number; y?: number }
  ): ElementPosition => {
    const { width: canvasWidth, height: canvasHeight } = canvasDimensions;
    const { width: elementWidth, height: elementHeight } = dimensions;
    const offsetX = offset?.x || 0;
    const offsetY = offset?.y || 0;

    switch (strategy) {
      case "center":
        return {
          x: (canvasWidth / 2) - (elementWidth / 2) + offsetX,
          y: (canvasHeight / 2) - (elementHeight / 2) + offsetY,
        };

      case "top-left":
        return {
          x: 50 + offsetX,
          y: 50 + offsetY,
        };

      case "top-center":
        return {
          x: (canvasWidth / 2) - (elementWidth / 2) + offsetX,
          y: 50 + offsetY,
        };

      case "top-right":
        return {
          x: canvasWidth - elementWidth - 50 + offsetX,
          y: 50 + offsetY,
        };

      case "center-left":
        return {
          x: 50 + offsetX,
          y: (canvasHeight / 2) - (elementHeight / 2) + offsetY,
        };

      case "center-right":
        return {
          x: canvasWidth - elementWidth - 50 + offsetX,
          y: (canvasHeight / 2) - (elementHeight / 2) + offsetY,
        };

      case "bottom-left":
        return {
          x: 50 + offsetX,
          y: canvasHeight - elementHeight - 50 + offsetY,
        };

      case "bottom-center":
        return {
          x: (canvasWidth / 2) - (elementWidth / 2) + offsetX,
          y: canvasHeight - elementHeight - 50 + offsetY,
        };

      case "bottom-right":
        return {
          x: canvasWidth - elementWidth - 50 + offsetX,
          y: canvasHeight - elementHeight - 50 + offsetY,
        };

      case "random":
        return {
          x: Math.random() * (canvasWidth - elementWidth - 100) + 50 + offsetX,
          y: Math.random() * (canvasHeight - elementHeight - 100) + 50 + offsetY,
        };

      default:
        return calculatePosition(dimensions, "center", offset);
    }
  }, [canvasDimensions]);

  // Get center position (most common use case)
  const getCenterPosition = useCallback((dimensions: ElementDimensions): ElementPosition => {
    return calculatePosition(dimensions, "center");
  }, [calculatePosition]);

  // Get position with smart placement (avoid overlaps)
  const getSmartPosition = useCallback((
    dimensions: ElementDimensions,
    existingElements: Array<{ x: number; y: number; width: number; height: number }> = [],
    preferredStrategy: PositionStrategy = "center"
  ): ElementPosition => {
    // Try preferred strategy first
    let position = calculatePosition(dimensions, preferredStrategy);
    
    // Check for overlaps
    const hasOverlap = (pos: ElementPosition) => {
      return existingElements.some(existing => {
        const elementRight = pos.x + dimensions.width;
        const elementBottom = pos.y + dimensions.height;
        const existingRight = existing.x + existing.width;
        const existingBottom = existing.y + existing.height;

        return !(
          pos.x >= existingRight ||
          elementRight <= existing.x ||
          pos.y >= existingBottom ||
          elementBottom <= existing.y
        );
      });
    };

    // If no overlap, return preferred position
    if (!hasOverlap(position)) {
      return position;
    }

    // Try alternative strategies
    const strategies: PositionStrategy[] = [
      "center",
      "top-center",
      "bottom-center",
      "center-left",
      "center-right",
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
    ];

    for (const strategy of strategies) {
      position = calculatePosition(dimensions, strategy);
      if (!hasOverlap(position)) {
        return position;
      }
    }

    // If all strategies have overlaps, use random with offset
    let attempts = 0;
    do {
      position = calculatePosition(dimensions, "random");
      attempts++;
    } while (hasOverlap(position) && attempts < 10);

    return position;
  }, [calculatePosition]);

  // Predefined positions for common element types
  const getTextPosition = useCallback((
    textType: "heading" | "subheading" | "body" | "caption" = "body"
  ): ElementPosition => {
    const dimensions = {
      heading: { width: 300, height: 80 },
      subheading: { width: 250, height: 60 },
      body: { width: 200, height: 40 },
      caption: { width: 150, height: 30 },
    };

    return getCenterPosition(dimensions[textType]);
  }, [getCenterPosition]);

  const getImagePosition = useCallback((
    imageSize: "small" | "medium" | "large" = "medium"
  ): ElementPosition => {
    const dimensions = {
      small: { width: 150, height: 150 },
      medium: { width: 250, height: 200 },
      large: { width: 400, height: 300 },
    };

    return getCenterPosition(dimensions[imageSize]);
  }, [getCenterPosition]);

  const getShapePosition = useCallback((
    shapeSize: "small" | "medium" | "large" = "medium"
  ): ElementPosition => {
    const dimensions = {
      small: { width: 100, height: 100 },
      medium: { width: 150, height: 150 },
      large: { width: 200, height: 200 },
    };

    return getCenterPosition(dimensions[shapeSize]);
  }, [getCenterPosition]);

  // Utility functions
  const isPositionValid = useCallback((
    position: ElementPosition,
    dimensions: ElementDimensions
  ): boolean => {
    const { width: canvasWidth, height: canvasHeight } = canvasDimensions;
    
    return (
      position.x >= 0 &&
      position.y >= 0 &&
      position.x + dimensions.width <= canvasWidth &&
      position.y + dimensions.height <= canvasHeight
    );
  }, [canvasDimensions]);

  const clampPosition = useCallback((
    position: ElementPosition,
    dimensions: ElementDimensions
  ): ElementPosition => {
    const { width: canvasWidth, height: canvasHeight } = canvasDimensions;
    
    return {
      x: Math.max(0, Math.min(position.x, canvasWidth - dimensions.width)),
      y: Math.max(0, Math.min(position.y, canvasHeight - dimensions.height)),
    };
  }, [canvasDimensions]);

  return {
    // Core functions
    calculatePosition,
    getCenterPosition,
    getSmartPosition,
    
    // Predefined positions
    getTextPosition,
    getImagePosition,
    getShapePosition,
    
    // Utilities
    isPositionValid,
    clampPosition,
    
    // Canvas info
    canvasDimensions,
  };
}
