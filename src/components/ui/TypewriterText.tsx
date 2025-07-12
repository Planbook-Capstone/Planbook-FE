"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

interface TypewriterTextProps {
  texts: string[];
  className?: string;
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  cursor?: boolean;
  cursorChar?: string;
  loop?: boolean;
  startDelay?: number;
}

export const TypewriterText = ({
  texts,
  className,
  speed = 100,
  deleteSpeed = 50,
  pauseDuration = 2000,
  cursor = true,
  cursorChar = "|",
  loop = true,
  startDelay = 0,
}: TypewriterTextProps) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), startDelay);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.typewriter-container');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [startDelay]);

  useEffect(() => {
    if (!isVisible || texts.length === 0) return;

    const currentFullText = texts[currentTextIndex];

    const typeText = () => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentFullText.length) {
          setCurrentText(currentFullText.slice(0, currentText.length + 1));
          timeoutRef.current = setTimeout(typeText, speed);
        } else {
          // Finished typing, pause then start deleting
          timeoutRef.current = setTimeout(() => {
            if (loop || currentTextIndex < texts.length - 1) {
              setIsDeleting(true);
              typeText();
            }
          }, pauseDuration);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
          timeoutRef.current = setTimeout(typeText, deleteSpeed);
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setCurrentTextIndex((prev) => {
            if (loop) {
              return (prev + 1) % texts.length;
            } else {
              return Math.min(prev + 1, texts.length - 1);
            }
          });
          timeoutRef.current = setTimeout(typeText, speed);
        }
      }
    };

    timeoutRef.current = setTimeout(typeText, speed);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    currentText,
    currentTextIndex,
    isDeleting,
    isVisible,
    texts,
    speed,
    deleteSpeed,
    pauseDuration,
    loop,
  ]);

  return (
    <div className={cn("typewriter-container", className)}>
      <span className="inline-block">
        {currentText}
        {cursor && (
          <span
            className={cn(
              "inline-block ml-1 animate-pulse",
              isVisible ? "opacity-100" : "opacity-0"
            )}
            style={{
              animationDuration: "1s",
            }}
          >
            {cursorChar}
          </span>
        )}
      </span>
    </div>
  );
};
