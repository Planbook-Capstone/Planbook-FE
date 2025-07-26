import { useState, useCallback, useMemo } from "react";

// Element interface for snap calculations
export interface SnapElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Alignment guide line interface
export interface AlignmentGuide {
  id: string;
  type: "vertical" | "horizontal";
  position: number; // x for vertical, y for horizontal
  start: number; // start coordinate of the line
  end: number; // end coordinate of the line
  color?: string;
  style?: "solid" | "dashed"; // line style
}

// Snap result interface
export interface SnapResult {
  x: number;
  y: number;
  snapped: boolean;
  guides: AlignmentGuide[];
}

// Snap configuration
export interface SnapConfig {
  threshold: number; // Distance threshold for snapping (default: 6px)
  showGuides: boolean; // Whether to show alignment guides
  snapToCanvas: boolean; // Whether to snap to canvas edges
  canvasWidth: number; // Canvas width for edge snapping
  canvasHeight: number; // Canvas height for edge snapping
}

// Default snap configuration
const DEFAULT_SNAP_CONFIG: SnapConfig = {
  threshold: 6,
  showGuides: true,
  snapToCanvas: true,
  canvasWidth: 960,
  canvasHeight: 540,
};

export function useSnapAlignment(config: Partial<SnapConfig> = {}) {
  const snapConfig = { ...DEFAULT_SNAP_CONFIG, ...config };
  const [alignmentGuides, setAlignmentGuides] = useState<AlignmentGuide[]>([]);

  // Calculate element edges and center points
  const getElementBounds = useCallback((element: SnapElement) => {
    return {
      left: element.x,
      right: element.x + element.width,
      top: element.y,
      bottom: element.y + element.height,
      centerX: element.x + element.width / 2,
      centerY: element.y + element.height / 2,
    };
  }, []);

  // Calculate snap positions for an element
  const calculateSnap = useCallback(
    (draggedElement: SnapElement, otherElements: SnapElement[]): SnapResult => {
      const { threshold, snapToCanvas, canvasWidth, canvasHeight } = snapConfig;

      let snapX = draggedElement.x;
      let snapY = draggedElement.y;
      let snapped = false;
      const guides: AlignmentGuide[] = [];

      const draggedBounds = getElementBounds(draggedElement);

      // Canvas edge snap points
      const canvasSnapPoints = snapToCanvas
        ? [
            { type: "vertical" as const, position: 0 }, // Left edge
            { type: "vertical" as const, position: canvasWidth }, // Right edge
            { type: "vertical" as const, position: canvasWidth / 2 }, // Center vertical
            { type: "horizontal" as const, position: 0 }, // Top edge
            { type: "horizontal" as const, position: canvasHeight }, // Bottom edge
            { type: "horizontal" as const, position: canvasHeight / 2 }, // Center horizontal
          ]
        : [];

      // Check for perfect center alignment (both X and Y center)
      const canvasCenterX = canvasWidth / 2;
      const canvasCenterY = canvasHeight / 2;
      const elementCenterX = draggedElement.x + draggedElement.width / 2;
      const elementCenterY = draggedElement.y + draggedElement.height / 2;

      // Perfect center snap (higher priority)
      if (
        Math.abs(elementCenterX - canvasCenterX) <= threshold &&
        Math.abs(elementCenterY - canvasCenterY) <= threshold
      ) {
        snapX = canvasCenterX - draggedElement.width / 2;
        snapY = canvasCenterY - draggedElement.height / 2;
        snapped = true;

        // Add both center guide lines for perfect center
        guides.push({
          id: "canvas-perfect-center-x",
          type: "vertical",
          position: canvasCenterX,
          start: 0,
          end: canvasHeight,
          color: "#ef4444", // Light red solid for perfect center
          style: "solid",
        });
        guides.push({
          id: "canvas-perfect-center-y",
          type: "horizontal",
          position: canvasCenterY,
          start: 0,
          end: canvasWidth,
          color: "#ef4444", // Light red solid for perfect center
          style: "solid",
        });
      }

      // Check snap to canvas edges
      canvasSnapPoints.forEach((snapPoint) => {
        if (snapPoint.type === "vertical") {
          // Snap left edge to canvas
          if (Math.abs(draggedBounds.left - snapPoint.position) <= threshold) {
            snapX = snapPoint.position;
            snapped = true;
            guides.push({
              id: `canvas-left-${snapPoint.position}`,
              type: "vertical",
              position: snapPoint.position,
              start: 0,
              end: canvasHeight,
              color: "#ef4444", // Light red solid for canvas edges
              style: "solid",
            });
          }
          // Snap right edge to canvas
          else if (
            Math.abs(draggedBounds.right - snapPoint.position) <= threshold
          ) {
            snapX = snapPoint.position - draggedElement.width;
            snapped = true;
            guides.push({
              id: `canvas-right-${snapPoint.position}`,
              type: "vertical",
              position: snapPoint.position,
              start: 0,
              end: canvasHeight,
              color: "#ef4444", // Light red solid for canvas edges
              style: "solid",
            });
          }
          // Snap center to canvas center
          else if (
            Math.abs(draggedBounds.centerX - snapPoint.position) <= threshold
          ) {
            snapX = snapPoint.position - draggedElement.width / 2;
            snapped = true;
            guides.push({
              id: `canvas-center-x-${snapPoint.position}`,
              type: "vertical",
              position: snapPoint.position,
              start: 0,
              end: canvasHeight,
              color: "#ef4444", // Light red solid for canvas center
              style: "solid",
            });
          }
        } else {
          // Snap top edge to canvas
          if (Math.abs(draggedBounds.top - snapPoint.position) <= threshold) {
            snapY = snapPoint.position;
            snapped = true;
            guides.push({
              id: `canvas-top-${snapPoint.position}`,
              type: "horizontal",
              position: snapPoint.position,
              start: 0,
              end: canvasWidth,
              color: "#ef4444", // Light red solid for canvas edges
              style: "solid",
            });
          }
          // Snap bottom edge to canvas
          else if (
            Math.abs(draggedBounds.bottom - snapPoint.position) <= threshold
          ) {
            snapY = snapPoint.position - draggedElement.height;
            snapped = true;
            guides.push({
              id: `canvas-bottom-${snapPoint.position}`,
              type: "horizontal",
              position: snapPoint.position,
              start: 0,
              end: canvasWidth,
              color: "#ef4444", // Light red solid for canvas edges
              style: "solid",
            });
          }
          // Snap center to canvas center
          else if (
            Math.abs(draggedBounds.centerY - snapPoint.position) <= threshold
          ) {
            snapY = snapPoint.position - draggedElement.height / 2;
            snapped = true;
            guides.push({
              id: `canvas-center-y-${snapPoint.position}`,
              type: "horizontal",
              position: snapPoint.position,
              start: 0,
              end: canvasWidth,
              color: "#ef4444", // Light red solid for canvas center
              style: "solid",
            });
          }
        }
      });

      // Check snap to other elements
      otherElements.forEach((otherElement) => {
        if (otherElement.id === draggedElement.id) return;

        const otherBounds = getElementBounds(otherElement);

        // Vertical alignment checks
        // Left edge alignment
        if (Math.abs(draggedBounds.left - otherBounds.left) <= threshold) {
          snapX = otherBounds.left;
          snapped = true;
          guides.push({
            id: `left-align-${otherElement.id}`,
            type: "vertical",
            position: otherBounds.left,
            start: Math.min(draggedBounds.top, otherBounds.top) - 20,
            end: Math.max(draggedBounds.bottom, otherBounds.bottom) + 20,
            color: "#ef4444", // Light red dashed for element alignment
            style: "dashed",
          });
        }

        // Right edge alignment
        if (Math.abs(draggedBounds.right - otherBounds.right) <= threshold) {
          snapX = otherBounds.right - draggedElement.width;
          snapped = true;
          guides.push({
            id: `right-align-${otherElement.id}`,
            type: "vertical",
            position: otherBounds.right,
            start: Math.min(draggedBounds.top, otherBounds.top) - 20,
            end: Math.max(draggedBounds.bottom, otherBounds.bottom) + 20,
            color: "#ef4444", // Light red dashed for element alignment
            style: "dashed",
          });
        }

        // Center X alignment
        if (
          Math.abs(draggedBounds.centerX - otherBounds.centerX) <= threshold
        ) {
          snapX = otherBounds.centerX - draggedElement.width / 2;
          snapped = true;
          guides.push({
            id: `center-x-align-${otherElement.id}`,
            type: "vertical",
            position: otherBounds.centerX,
            start: Math.min(draggedBounds.top, otherBounds.top) - 20,
            end: Math.max(draggedBounds.bottom, otherBounds.bottom) + 20,
            color: "#ef4444", // Light red dashed for element alignment
            style: "dashed",
          });
        }

        // Horizontal alignment checks
        // Top edge alignment
        if (Math.abs(draggedBounds.top - otherBounds.top) <= threshold) {
          snapY = otherBounds.top;
          snapped = true;
          guides.push({
            id: `top-align-${otherElement.id}`,
            type: "horizontal",
            position: otherBounds.top,
            start: Math.min(draggedBounds.left, otherBounds.left) - 20,
            end: Math.max(draggedBounds.right, otherBounds.right) + 20,
            color: "#ef4444", // Light red dashed for element alignment
            style: "dashed",
          });
        }

        // Bottom edge alignment
        if (Math.abs(draggedBounds.bottom - otherBounds.bottom) <= threshold) {
          snapY = otherBounds.bottom - draggedElement.height;
          snapped = true;
          guides.push({
            id: `bottom-align-${otherElement.id}`,
            type: "horizontal",
            position: otherBounds.bottom,
            start: Math.min(draggedBounds.left, otherBounds.left) - 20,
            end: Math.max(draggedBounds.right, otherBounds.right) + 20,
            color: "#ef4444", // Light red dashed for element alignment
            style: "dashed",
          });
        }

        // Center Y alignment
        if (
          Math.abs(draggedBounds.centerY - otherBounds.centerY) <= threshold
        ) {
          snapY = otherBounds.centerY - draggedElement.height / 2;
          snapped = true;
          guides.push({
            id: `center-y-align-${otherElement.id}`,
            type: "horizontal",
            position: otherBounds.centerY,
            start: Math.min(draggedBounds.left, otherBounds.left) - 20,
            end: Math.max(draggedBounds.right, otherBounds.right) + 20,
            color: "#ef4444", // Light red dashed for element alignment
            style: "dashed",
          });
        }
      });

      return {
        x: snapX,
        y: snapY,
        snapped,
        guides,
      };
    },
    [snapConfig, getElementBounds]
  );

  // Handle drag with snap
  const handleDragWithSnap = useCallback(
    (
      draggedElement: SnapElement,
      otherElements: SnapElement[],
      onPositionChange?: (x: number, y: number) => void
    ) => {
      const snapResult = calculateSnap(draggedElement, otherElements);

      if (snapConfig.showGuides) {
        setAlignmentGuides(snapResult.guides);
      }

      if (onPositionChange && snapResult.snapped) {
        onPositionChange(snapResult.x, snapResult.y);
      }

      return snapResult;
    },
    [calculateSnap, snapConfig.showGuides]
  );

  // Clear alignment guides
  const clearGuides = useCallback(() => {
    setAlignmentGuides([]);
  }, []);

  // Get snap points for an element (useful for debugging)
  const getSnapPoints = useCallback(
    (element: SnapElement) => {
      const bounds = getElementBounds(element);
      return {
        left: bounds.left,
        right: bounds.right,
        top: bounds.top,
        bottom: bounds.bottom,
        centerX: bounds.centerX,
        centerY: bounds.centerY,
      };
    },
    [getElementBounds]
  );

  // Align element to center of canvas
  const alignToCanvasCenter = useCallback(
    (element: SnapElement): { x: number; y: number } => {
      const { canvasWidth, canvasHeight } = snapConfig;
      return {
        x: (canvasWidth - element.width) / 2,
        y: (canvasHeight - element.height) / 2,
      };
    },
    [snapConfig]
  );

  // Align element horizontally to center
  const alignToHorizontalCenter = useCallback(
    (element: SnapElement): { x: number; y: number } => {
      const { canvasWidth } = snapConfig;
      return {
        x: (canvasWidth - element.width) / 2,
        y: element.y, // Keep current Y position
      };
    },
    [snapConfig]
  );

  // Align element vertically to center
  const alignToVerticalCenter = useCallback(
    (element: SnapElement): { x: number; y: number } => {
      const { canvasHeight } = snapConfig;
      return {
        x: element.x, // Keep current X position
        y: (canvasHeight - element.height) / 2,
      };
    },
    [snapConfig]
  );

  return {
    // Main functions
    calculateSnap,
    handleDragWithSnap,
    clearGuides,

    // State
    alignmentGuides,

    // Utilities
    getSnapPoints,
    getElementBounds,

    // Alignment functions
    alignToCanvasCenter,
    alignToHorizontalCenter,
    alignToVerticalCenter,

    // Config
    snapConfig,
  };
}
