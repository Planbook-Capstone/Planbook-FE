"use client";

import { cn } from "@/lib/utils";
import { useRef, useEffect, useState } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltMaxAngle?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  glareEnable?: boolean;
  glareMaxOpacity?: number;
}

export const TiltCard = ({
  children,
  className,
  tiltMaxAngle = 15,
  perspective = 1000,
  scale = 1.05,
  speed = 300,
  glareEnable = true,
  glareMaxOpacity = 0.7,
}: TiltCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateX = (mouseY / (rect.height / 2)) * tiltMaxAngle;
      const rotateY = (mouseX / (rect.width / 2)) * tiltMaxAngle;

      card.style.transform = `
        perspective(${perspective}px)
        rotateX(${-rotateX}deg)
        rotateY(${rotateY}deg)
        scale(${scale})
      `;

      if (glare && glareEnable) {
        const glareX = (mouseX / rect.width) * 100;
        const glareY = (mouseY / rect.height) * 100;

        glare.style.background = `
          radial-gradient(
            circle at ${glareX + 50}% ${glareY + 50}%,
            rgba(255, 255, 255, ${glareMaxOpacity}) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 100%
          )
        `;
        glare.style.opacity = "1";
      }
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      card.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      card.style.transform = `
        perspective(${perspective}px)
        rotateX(0deg)
        rotateY(0deg)
        scale(1)
      `;

      if (glare) {
        glare.style.opacity = "0";
      }
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [tiltMaxAngle, perspective, scale, speed, glareEnable, glareMaxOpacity]);

  return (
    <div
      ref={cardRef}
      className={cn("relative transform-gpu will-change-transform", className)}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {children}

      {/* Shadow effect */}
      <div
        className={cn(
          "absolute inset-0 -z-10 rounded-inherit transition-all duration-300",
          isHovered ? "shadow-2xl shadow-black/20" : "shadow-lg shadow-black/10"
        )}
        style={{
          transform: "translateZ(-50px)",
        }}
      />
    </div>
  );
};
