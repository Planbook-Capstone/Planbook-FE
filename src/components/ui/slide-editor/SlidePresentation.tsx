"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { SlideElement } from "@/types";

interface Slide {
  id: string;
  title: string;
  elements: SlideElement[];
  isVisible: boolean;
  background?: string;
}

interface SlidePresentationProps {
  slides: Slide[];
  isOpen: boolean;
  onClose: () => void;
  initialSlideIndex?: number;
  transitionType?: string;
}

export default function SlidePresentation({
  slides,
  isOpen,
  onClose,
  initialSlideIndex = 0,
  transitionType = "fade",
}: SlidePresentationProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialSlideIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextSlideIndex, setNextSlideIndex] = useState<number | null>(null);

  // Filter visible slides
  const visibleSlides = slides.filter((slide) => slide.isVisible);
  const currentSlide = visibleSlides[currentSlideIndex];

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (!showControls) return;

    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls]);

  // Show controls on mouse move
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
  }, []);

  // Get transition class based on selected transition type and direction
  const getTransitionClass = useCallback(
    (direction: "next" | "prev") => {
      if (transitionType === "slide") {
        return direction === "next" ? "slide-right" : "slide-left";
      }
      return transitionType; // fade, zoom, etc.
    },
    [transitionType]
  );

  // Navigation functions with slide transitions
  const goToNextSlide = useCallback(() => {
    if (currentSlideIndex < visibleSlides.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setSelectedElementId(null);
      setNextSlideIndex(currentSlideIndex + 1);

      // Update container background immediately for smooth transition
      const nextSlide = visibleSlides[currentSlideIndex + 1];
      if (nextSlide) {
        // This will trigger the CSS transition on the container
        setTimeout(() => {
          setCurrentSlideIndex(currentSlideIndex + 1);
        }, 100); // Small delay to let background transition start
      }

      // Wait for transition to complete
      setTimeout(() => {
        setNextSlideIndex(null);
        setIsTransitioning(false);
      }, 600); // Increased duration for smoother animation
    }
  }, [currentSlideIndex, visibleSlides.length, isTransitioning]);

  const goToPrevSlide = useCallback(() => {
    if (currentSlideIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setSelectedElementId(null);
      setNextSlideIndex(currentSlideIndex - 1);

      // Update container background immediately for smooth transition
      const prevSlide = visibleSlides[currentSlideIndex - 1];
      if (prevSlide) {
        // This will trigger the CSS transition on the container
        setTimeout(() => {
          setCurrentSlideIndex(currentSlideIndex - 1);
        }, 100); // Small delay to let background transition start
      }

      // Wait for transition to complete
      setTimeout(() => {
        setNextSlideIndex(null);
        setIsTransitioning(false);
      }, 600); // Increased duration for smoother animation
    }
  }, [currentSlideIndex, isTransitioning]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (currentSlideIndex < visibleSlides.length - 1) {
        setCurrentSlideIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false); // Stop at the end
      }
    }, 5000); // 5 seconds per slide

    return () => clearInterval(interval);
  }, [isPlaying, currentSlideIndex, visibleSlides.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowRight":
        case " ": // Spacebar
          event.preventDefault();
          goToNextSlide();
          break;
        case "ArrowLeft":
          event.preventDefault();
          goToPrevSlide();
          break;
        case "Escape":
          event.preventDefault();
          onClose();
          break;
        case "p":
        case "P":
          event.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, goToNextSlide, goToPrevSlide, onClose]);

  // Handle click navigation
  const handleSlideClick = useCallback(
    (event: React.MouseEvent) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const slideWidth = rect.width;

      // If clicked on right half, go to next slide
      if (clickX > slideWidth / 2) {
        goToNextSlide();
      } else {
        // If clicked on left half, go to previous slide
        goToPrevSlide();
      }
    },
    [goToNextSlide, goToPrevSlide]
  );

  // Helper function to clean background color
  const getCleanBackgroundColor = (
    backgroundColor?: string
  ): string | undefined => {
    if (!backgroundColor) return undefined;

    // List of values that should be treated as "no background"
    const transparentValues = [
      "transparent",
      "",
      "rgba(0, 0, 0, 0)",
      "rgba(255, 255, 255, 0)",
      "rgba(0,0,0,0)",
      "rgba(255,255,255,0)",
      "inherit",
      "initial",
      "unset",
    ];

    if (transparentValues.includes(backgroundColor.toLowerCase().trim())) {
      return undefined;
    }

    return backgroundColor;
  };

  // Force clean background - always return transparent for debugging
  const getDebugBackgroundColor = (backgroundColor?: string): string => {
    const cleaned = getCleanBackgroundColor(backgroundColor);
    // For debugging: force all backgrounds to be transparent
    return cleaned || "transparent";
  };

  // Calculate scale factor for presentation mode
  const getScaleFactor = () => {
    // Assume editor canvas is 800x600, presentation is fullscreen
    // Scale based on window size vs standard slide size
    const standardWidth = 800;
    const standardHeight = 600;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Use the smaller scale to maintain aspect ratio
    const scaleX = windowWidth / standardWidth;
    const scaleY = windowHeight / standardHeight;
    return Math.min(scaleX, scaleY, 2.5); // Cap at 2.5x for readability
  };

  // Render slide element
  const renderElement = (element: SlideElement) => {
    const style: React.CSSProperties = {
      position: "absolute",
      left: `${(element.x / 960) * 100}%`, // Convert to percentage
      top: `${(element.y / 540) * 100}%`,
      width: `${(element.width / 960) * 100}%`,
      height: `${(element.height / 540) * 100}%`,
      zIndex: element.zIndex || 0,
    };

    if (element.type === "text") {
      const textElement = element as any;

      // Text element styling

      return (
        <div
          key={element.id}
          className="presentation-text-element"
          style={{
            ...style,
            fontSize: `${
              (textElement.style?.fontSize || 16) * getScaleFactor()
            }px`, // Scale for presentation
            fontFamily: textElement.style?.fontFamily || "Arial",
            fontWeight: textElement.style?.bold ? "bold" : "normal",
            fontStyle: textElement.style?.italic ? "italic" : "normal",
            textDecoration: textElement.style?.underline ? "underline" : "none",
            color: textElement.style?.color || "#000000",
            textAlign: textElement.style?.textAlign || "left",
            backgroundColor: "transparent", // Force transparent for debugging
            // Force override any background-related properties
            backgroundImage: "none",
            backgroundClip: "initial",
            backgroundOrigin: "initial",
            backgroundAttachment: "initial",
            backgroundRepeat: "initial",
            backgroundPosition: "initial",
            backgroundSize: "initial",
            display: "flex",
            alignItems: "flex-start",
            justifyContent:
              textElement.style?.textAlign === "center"
                ? "center"
                : textElement.style?.textAlign === "right"
                ? "flex-end"
                : "flex-start",
            padding: "8px",
            wordWrap: "break-word",
            overflow: "hidden",
            whiteSpace: "pre-wrap", // Allow line breaks in presentation mode
            border: "none",
            outline: "none",
            boxShadow: "none",
            // Additional resets
            margin: "0",
            textShadow: "none",
            zIndex: element.zIndex || 0,
          }}
        >
          {textElement.text}
        </div>
      );
    }

    if (element.type === "image") {
      const imageElement = element as any;
      return (
        <img
          key={element.id}
          src={imageElement.src}
          alt={imageElement.alt || "Slide image"}
          style={{
            ...style,
            objectFit: "contain",
          }}
        />
      );
    }

    if (element.type === "video") {
      const videoElement = element as any;
      return (
        <video
          key={element.id}
          src={videoElement.src}
          style={{
            ...style,
            objectFit: "contain",
          }}
          controls={videoElement.controls !== false}
          autoPlay={videoElement.autoplay}
          loop={videoElement.loop}
          muted={videoElement.muted !== false} // Default to muted for presentation
          preload="metadata"
        />
      );
    }

    if (element.type === "shape") {
      const shapeElement = element as any;
      const { shapeType, fill, stroke, strokeWidth, opacity, rotation } =
        shapeElement;

      // Calculate actual dimensions for presentation
      const actualWidth = (element.width / 960) * window.innerWidth;
      const actualHeight = (element.height / 540) * window.innerHeight;

      const svgStyle: React.CSSProperties = {
        ...style,
        opacity: opacity !== undefined ? opacity : 1,
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        transformOrigin: "center center",
      };

      const shapeStyle = {
        fill: fill || "#3b82f6",
        stroke: stroke || "#1e40af",
        strokeWidth: strokeWidth || 2,
      };

      // Use actual dimensions for viewBox to maintain proper scaling
      const viewBoxWidth = Math.max(actualWidth, 100);
      const viewBoxHeight = Math.max(actualHeight, 100);
      const strokeOffset = (strokeWidth || 2) / 2;

      switch (shapeType) {
        case "rectangle":
          return (
            <div key={element.id} style={svgStyle}>
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              >
                <rect
                  x={strokeOffset}
                  y={strokeOffset}
                  width={viewBoxWidth - strokeOffset * 2}
                  height={viewBoxHeight - strokeOffset * 2}
                  rx="4"
                  {...shapeStyle}
                />
              </svg>
            </div>
          );
        case "circle":
          const radius =
            Math.min(viewBoxWidth, viewBoxHeight) / 2 - strokeOffset;
          const centerX = viewBoxWidth / 2;
          const centerY = viewBoxHeight / 2;
          return (
            <div key={element.id} style={svgStyle}>
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              >
                <circle cx={centerX} cy={centerY} r={radius} {...shapeStyle} />
              </svg>
            </div>
          );
        case "triangle":
          return (
            <div key={element.id} style={svgStyle}>
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              >
                <polygon
                  points={`${viewBoxWidth / 2},${strokeOffset} ${
                    viewBoxWidth - strokeOffset
                  },${viewBoxHeight - strokeOffset} ${strokeOffset},${
                    viewBoxHeight - strokeOffset
                  }`}
                  {...shapeStyle}
                />
              </svg>
            </div>
          );
        case "star":
          const cx = viewBoxWidth / 2;
          const cy = viewBoxHeight / 2;
          const outerRadius =
            Math.min(viewBoxWidth, viewBoxHeight) / 2 - strokeOffset;
          const innerRadius = outerRadius * 0.4;

          const starPoints = [];
          for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI) / 5 - Math.PI / 2;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            starPoints.push(`${x},${y}`);
          }

          return (
            <div key={element.id} style={svgStyle}>
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              >
                <polygon points={starPoints.join(" ")} {...shapeStyle} />
              </svg>
            </div>
          );
        default:
          return (
            <div key={element.id} style={svgStyle}>
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              >
                <rect
                  x={strokeOffset}
                  y={strokeOffset}
                  width={viewBoxWidth - strokeOffset * 2}
                  height={viewBoxHeight - strokeOffset * 2}
                  {...shapeStyle}
                />
              </svg>
            </div>
          );
      }
    }

    if (element.type === "table") {
      const tableElement = element as any;
      const {
        headers,
        rows,
        columnWidths = [],
        rowHeights = [],
        style: tableStyle = {},
        cellStyles = {},
        rowStyles = {},
      } = tableElement;

      const {
        borderColor = "#000000",
        borderWidth = 1,
        headerBackgroundColor = "#f3f4f6",
        cellBackgroundColor = "#ffffff",
        textColor = "#000000",
        fontSize = 14,
        fontFamily = "Arial, sans-serif",
        textAlign = "center",
      } = tableStyle;

      // Calculate column widths
      const defaultColumnWidth = element.width / headers.length;
      const actualColumnWidths = headers.map(
        (_: any, index: number) => columnWidths[index] || defaultColumnWidth
      );

      // Calculate row heights
      const defaultRowHeight = 40;
      const actualRowHeights = [
        defaultRowHeight,
        ...rows.map(
          (_: any, index: number) => rowHeights[index] || defaultRowHeight
        ),
      ];

      // Get cell style function
      const getCellStyle = (rowIndex: number, colIndex: number) => {
        const cellKey = `${rowIndex}-${colIndex}`;
        const cellStyle = cellStyles[cellKey] || {};
        const rowStyle = rowStyles[rowIndex] || {};

        return {
          backgroundColor:
            cellStyle.backgroundColor ||
            rowStyle.backgroundColor ||
            cellBackgroundColor,
          color: cellStyle.textColor || rowStyle.textColor || textColor,
          fontSize: `${
            (cellStyle.fontSize || rowStyle.fontSize || fontSize) *
            getScaleFactor()
          }px`,
          fontWeight: cellStyle.fontWeight || rowStyle.fontWeight || "normal",
          textAlign: cellStyle.textAlign || textAlign,
        };
      };

      return (
        <div
          key={element.id}
          style={{
            ...style,
            fontSize: `${fontSize * getScaleFactor()}px`,
            fontFamily,
            color: textColor,
            overflow: "hidden", // Prevent table overflow
          }}
        >
          <table
            style={{
              width: "100%",
              height: "100%",
              borderCollapse: "collapse",
              borderColor,
              borderWidth,
              tableLayout: "fixed", // Fixed layout for better control
              fontSize: `${fontSize * getScaleFactor() * 0.8}px`, // Smaller font
            }}
          >
            {/* Table Header */}
            {headers.length > 0 && (
              <thead>
                <tr style={{ height: actualRowHeights[0] * getScaleFactor() }}>
                  {headers.map((header: string, index: number) => (
                    <th
                      key={index}
                      style={{
                        border: `${borderWidth}px solid ${borderColor}`,
                        backgroundColor: headerBackgroundColor,
                        textAlign,
                        padding: `${4 * getScaleFactor()}px ${
                          2 * getScaleFactor()
                        }px`,
                        fontWeight: "bold",
                        width: actualColumnWidths[index] * getScaleFactor(),
                        fontSize: `${fontSize * getScaleFactor() * 0.7}px`,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
            )}

            {/* Table Body */}
            <tbody>
              {rows.map((row: string[], rowIndex: number) => (
                <tr
                  key={rowIndex}
                  style={{
                    height: actualRowHeights[rowIndex + 1] * getScaleFactor(),
                  }}
                >
                  {row.map((cell: string, cellIndex: number) => (
                    <td
                      key={cellIndex}
                      style={{
                        border: `${borderWidth}px solid ${borderColor}`,
                        padding: `${4 * getScaleFactor()}px ${
                          2 * getScaleFactor()
                        }px`,
                        width: actualColumnWidths[cellIndex] * getScaleFactor(),
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        ...getCellStyle(rowIndex, cellIndex),
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return null;
  };

  // Get background style for any slide
  const getBackgroundStyle = (slide?: any): React.CSSProperties => {
    const targetSlide = slide || currentSlide;
    if (!targetSlide?.background) {
      return { backgroundColor: "#ffffff" };
    }

    const bg = targetSlide.background;

    if (bg.startsWith("#")) {
      return { backgroundColor: bg };
    }

    if (bg.startsWith("linear-gradient")) {
      return { background: bg };
    }

    if (bg.startsWith("url(")) {
      const imageUrl = bg.slice(4, -1);
      return {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    }

    return { backgroundColor: "#ffffff" };
  };

  if (!isOpen || visibleSlides.length === 0) {
    return null;
  }

  return (
    <>
      {/* CSS to force override any unwanted backgrounds */}
      <style jsx>{`
        .presentation-text-element {
          background-image: none !important;
          background-clip: initial !important;
          background-origin: initial !important;
          background-attachment: initial !important;
          background-repeat: initial !important;
          background-position: initial !important;
          background-size: initial !important;
        }
        .presentation-text-element * {
          background-image: none !important;
          background-clip: initial !important;
          background-origin: initial !important;
          background-attachment: initial !important;
          background-repeat: initial !important;
          background-position: initial !important;
          background-size: initial !important;
        }
      `}</style>

      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{
          zIndex: 10000,
          backgroundColor: "#1a1a1a", // Dark gray instead of pure black
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Controls Overlay */}
        <div
          className={`absolute top-0 left-0 right-0 z-10 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                title={isPlaying ? "Pause (P)" : "Play (P)"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
              <span className="text-white text-sm">
                {currentSlideIndex + 1} / {visibleSlides.length}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              title="Exit (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {currentSlideIndex > 0 && (
            <button
              onClick={goToPrevSlide}
              className="p-3 text-white hover:bg-white/20 rounded-full transition-colors"
              title="Previous slide (←)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
        </div>

        <div
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-10 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {currentSlideIndex < visibleSlides.length - 1 && (
            <button
              onClick={goToNextSlide}
              className="p-3 text-white hover:bg-white/20 rounded-full transition-colors"
              title="Next slide (→)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Slide Content with Transitions */}
        <div
          className={`slide-transition-container cursor-pointer ${
            isTransitioning
              ? `transition-${getTransitionClass(
                  nextSlideIndex! > currentSlideIndex ? "next" : "prev"
                )}`
              : ""
          }`}
          onClick={handleSlideClick}
          style={{
            // Set container background to current slide for smooth transition
            backgroundColor: "#ffffff", // Default white background
            ...getBackgroundStyle(currentSlide),
            transition:
              "background-color 0.6s ease-out, background-image 0.6s ease-out",
            // Full screen slide container
            width: "100vw",
            height: "100vh",
            position: "relative",
          }}
        >
          {/* Current Slide */}
          <div className="slide-current" style={{ background: "transparent" }}>
            {currentSlide?.elements.map(renderElement)}
          </div>

          {/* Next Slide (during transition) */}
          {isTransitioning && nextSlideIndex !== null && (
            <div className="slide-next" style={{ background: "transparent" }}>
              {visibleSlides[nextSlideIndex]?.elements.map(renderElement)}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-10 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="h-1 bg-white/20">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{
                width: `${
                  ((currentSlideIndex + 1) / visibleSlides.length) * 100
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
