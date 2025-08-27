"use client";

import React, { useEffect, useRef, useState } from "react";
import SpotlightCard from "@/components/ui/SpotlightCard";

interface CarouselItem {
  id: string;
  src: string;
  spotlightColor: string;
  isFree?: boolean;
}

interface InfiniteCarouselProps {
  items: CarouselItem[];
  autoPlaySpeed?: number; // milliseconds
  className?: string;
}

const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({
  items,
  autoPlaySpeed = 3000,
  className = "",
}) => {
  const [translateX, setTranslateX] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Create multiple copies for seamless infinite scroll
  const duplicatedItems = [...items, ...items, ...items, ...items];
  const totalItems = duplicatedItems.length;

  // Smooth continuous animation using requestAnimationFrame
  const animate = () => {
    if (!isHovered) {
      setTranslateX((prev) => {
        const speed = 0.03; // Adjust speed here (lower = slower, higher = faster)
        const newTranslateX = prev - speed;

        // Reset position seamlessly when we've scrolled one full set
        // For fit-content, use a simpler approach - reset after scrolling enough
        const resetThreshold = 50; // Reset after scrolling 50% (adjust as needed)
        if (Math.abs(newTranslateX) >= resetThreshold) {
          return 0; // Reset to start position
        }

        return newTranslateX;
      });
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered, items.length]);

  return (
    <div
      className={`relative overflow-hidden py-5 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-tour="illustrations"
    >
      <div
        ref={carouselRef}
        className="flex"
        style={{
          transform: `translateX(${translateX}%)`,
          width: "fit-content", // Let container size itself based on content
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex-shrink-0 px-1"
            style={{ width: "fit-content" }} // Each item sizes itself
          >
            <SpotlightCard
              className="!p-0 !bg-transparent !border-0 w-full aspect-[4/3] max-w-64 mx-auto rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-110"
              spotlightColor={item.spotlightColor}
            >
              <img
                src={item.src}
                alt={`Carousel item ${item.id}`}
                className="w-full h-full object-cover"
              />
              {item.isFree && (
                <div className="absolute px-2 top-4 right-0 rounded-l-xs bg-rose-700 text-white">
                  <span>Miễn phí</span>
                </div>
              )}
            </SpotlightCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteCarousel;
