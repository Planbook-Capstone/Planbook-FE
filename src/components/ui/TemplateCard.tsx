"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Palette } from "lucide-react";
import { SlideTemplateResponse } from "@/types";

interface TemplateCardProps {
  template: SlideTemplateResponse;
  onView: (template: SlideTemplateResponse) => void;
  onSelect: (template: SlideTemplateResponse) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onView,
  onSelect,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get all slide images from template
  const slideImages = Object.values(template.imageBlocks ?? {});
  const hasMultipleSlides = slideImages.length > 1;

  // Auto-slideshow effect when hovered
  useEffect(() => {
    if (isHovered && hasMultipleSlides) {
      intervalRef.current = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % slideImages.length);
      }, 1000); // Change slide every 1 second
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Reset to first slide when not hovered
      if (!isHovered) {
        setCurrentSlideIndex(0);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, hasMultipleSlides, slideImages.length]);

  const handleClick = () => {
    onView(template);
  };

  return (
    <div
      className="group relative bg-white rounded-xl border  overflow-hidden hover:shadow-2xl  transition-all duration-500 cursor-pointer transform hover:scale-[1.03] hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Template Thumbnail with Auto-slideshow */}
      <div className="aspect-[16/9] bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
        {slideImages.length > 0 ? (
          <>
            {/* Current slide image with smooth transition */}
            <div className="relative w-full h-full">
              {slideImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${template.name} - Slide ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                    index === currentSlideIndex
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-105"
                  }`}
                />
              ))}
            </div>

            {/* Slide counter - smaller and less intrusive */}
            {hasMultipleSlides && (
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 font-medium">
                {currentSlideIndex + 1}/{slideImages.length}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Palette className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-questrial">
                {template.name}
              </p>
            </div>
          </div>
        )}

        {/* Hover overlay with play icon - only show for single slide templates */}
        {!hasMultipleSlides && (
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
            <div className="bg-white/95 backdrop-blur-md rounded-full p-4 transform scale-50 group-hover:scale-100 transition-all duration-500 shadow-xl border border-white/20">
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-0 h-0 border-l-[12px] border-l-blue-600 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
              </div>
            </div>
          </div>
        )}

        {/* Subtle hover effect - only for single slide templates */}
        {!hasMultipleSlides && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        )}

        {/* Very subtle overlay for multi-slide templates to not interfere with slideshow */}
        {hasMultipleSlides && (
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
        )}

        {/* Shimmer effect on hover - more subtle */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      </div>
    </div>
  );
};
