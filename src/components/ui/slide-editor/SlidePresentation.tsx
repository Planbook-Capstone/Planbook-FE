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

      // Debug: Log all style properties to identify the purple background
      console.log("Text element styles:", {
        id: textElement.id,
        text: textElement.text,
        backgroundColor: textElement.style?.backgroundColor,
        allStyles: textElement.style,
      });

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
        className="fixed inset-0 bg-black flex items-center justify-center"
        style={{ zIndex: 10000 }}
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
            ...getBackgroundStyle(currentSlide),
            transition:
              "background-color 0.6s ease-out, background-image 0.6s ease-out",
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
