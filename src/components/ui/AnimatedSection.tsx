"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, forwardRef } from "react";
import { useParallax } from "react-scroll-parallax";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?:
    | "fadeIn"
    | "slideUp"
    | "slideLeft"
    | "slideRight"
    | "scale"
    | "rotate";
  delay?: number;
  duration?: number;
  parallaxY?: [number, number];
  parallaxScale?: [number, number];
  parallaxRotate?: [number, number];
}

export const AnimatedSection = forwardRef<HTMLDivElement, AnimatedSectionProps>(
  (
    {
      children,
      className,
      animation = "fadeIn",
      delay = 0,
      duration = 1000,
      parallaxY,
      parallaxScale,
      parallaxRotate,
    },
    forwardedRef
  ) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Only use parallax if parallax props are provided
    const parallax =
      parallaxY || parallaxScale || parallaxRotate
        ? useParallax<HTMLDivElement>({
            translateY: parallaxY,
            scale: parallaxScale,
            rotate: parallaxRotate,
          })
        : null;

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
          }
        },
        { threshold: 0.1 }
      );

      const currentRef = parallax?.ref?.current || sectionRef.current;
      if (currentRef) {
        observer.observe(currentRef);
      }

      return () => observer.disconnect();
    }, [delay, parallax]);

    const getAnimationClass = () => {
      if (!isVisible) {
        switch (animation) {
          case "fadeIn":
            return "opacity-0";
          case "slideUp":
            return "opacity-0 translate-y-10";
          case "slideLeft":
            return "opacity-0 translate-x-10";
          case "slideRight":
            return "opacity-0 -translate-x-10";
          case "scale":
            return "opacity-0 scale-95";
          case "rotate":
            return "opacity-0 rotate-3";
          default:
            return "opacity-0";
        }
      }

      switch (animation) {
        case "fadeIn":
          return "opacity-100";
        case "slideUp":
          return "opacity-100 translate-y-0";
        case "slideLeft":
          return "opacity-100 translate-x-0";
        case "slideRight":
          return "opacity-100 translate-x-0";
        case "scale":
          return "opacity-100 scale-100";
        case "rotate":
          return "opacity-100 rotate-0";
        default:
          return "opacity-100";
      }
    };

    // Combine refs properly
    const combineRefs = (node: HTMLDivElement | null) => {
      // Set parallax ref if exists
      if (parallax?.ref) {
        (
          parallax.ref as React.MutableRefObject<HTMLDivElement | null>
        ).current = node;
      }

      // Set section ref
      sectionRef.current = node;

      // Set forwarded ref
      if (forwardedRef) {
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else {
          forwardedRef.current = node;
        }
      }
    };

    return (
      <div
        ref={combineRefs}
        className={cn(
          "transition-all ease-out w-auto",
          getAnimationClass(),
          className
        )}
        style={{
          transitionDuration: `${duration}ms`,
        }}
      >
        {children}
      </div>
    );
  }
);

AnimatedSection.displayName = "AnimatedSection";
