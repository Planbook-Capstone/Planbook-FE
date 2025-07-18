"use client";

import React from "react";
import Image from "next/image";

interface GalleryImage {
  src: string;
  thumbnail?: string;
  width?: number;
  height?: number;
  caption?: string;
  isSelected?: boolean;
}

interface GalleryProps {
  images: GalleryImage[];
  onSelect: (index: number) => void;
  enableImageSelection?: boolean;
  rowHeight?: number;
  margin?: number;
  className?: string;
}

export function Gallery({
  images,
  onSelect,
  enableImageSelection = false,
  rowHeight = 120,
  margin = 8,
  className = "",
}: GalleryProps) {
  return (
    <div className={`gallery-container ${className}`}>
      <style jsx global>{`
        .gallery-container .masonry-grid {
          column-count: 2;
          column-gap: ${margin}px;
          column-fill: balance;
        }

        .gallery-container .masonry-item {
          break-inside: avoid;
          margin-bottom: ${margin}px;
          display: inline-block;
          width: 100%;
        }
      `}</style>

      <div className="masonry-grid">
        {images.map((image, index) => (
          <div key={index} className="masonry-item">
            <div
              className={`group relative cursor-pointer rounded-xl overflow-hidden bg-white shadow-sm border-2 transition-all duration-200 hover:shadow-md hover:transform hover:scale-[1.02] ${
                image.isSelected
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-300 hover:border-blue-300"
              }`}
              onClick={() => onSelect(index)}
            >
              <Image
                src={image.thumbnail || image.src}
                alt={image.caption || `Image ${index + 1}`}
                width={image.width || 150}
                height={image.height || rowHeight}
                className="w-full h-auto object-cover"
                style={{ aspectRatio: "auto" }}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {/* Caption on hover */}
              {image.caption && (
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs text-white font-medium truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {image.caption}
                  </p>
                </div>
              )}

              {/* Selected indicator */}
              {image.isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
