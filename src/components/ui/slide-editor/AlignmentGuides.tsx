"use client";

import React from "react";
import { AlignmentGuide } from "@/hooks/useSnapAlignment";

interface AlignmentGuidesProps {
  guides: AlignmentGuide[];
  canvasWidth?: number;
  canvasHeight?: number;
}

export default function AlignmentGuides({
  guides,
  canvasWidth = 960,
  canvasHeight = 540,
}: AlignmentGuidesProps) {
  if (guides.length === 0) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-50"
      style={{
        width: canvasWidth,
        height: canvasHeight,
      }}
    >
      {guides.map((guide) => (
        <div
          key={guide.id}
          className="absolute"
          style={{
            backgroundColor:
              guide.style === "dashed"
                ? "transparent"
                : guide.color || "#ef4444",
            border:
              guide.style === "dashed"
                ? `1px dashed ${guide.color || "#ef4444"}`
                : "none",
            ...(guide.type === "vertical"
              ? {
                  left: guide.position,
                  top: guide.start,
                  width: guide.style === "dashed" ? "0px" : "1px",
                  height: guide.end - guide.start,
                  borderLeft:
                    guide.style === "dashed"
                      ? `1px dashed ${guide.color || "#ef4444"}`
                      : "none",
                  borderTop: "none",
                  borderRight: "none",
                  borderBottom: "none",
                }
              : {
                  left: guide.start,
                  top: guide.position,
                  width: guide.end - guide.start,
                  height: guide.style === "dashed" ? "0px" : "1px",
                  borderTop:
                    guide.style === "dashed"
                      ? `1px dashed ${guide.color || "#ef4444"}`
                      : "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "none",
                }),
            boxShadow:
              guide.style === "solid" ? "0 0 2px rgba(0,0,0,0.3)" : "none",
            animation: "fadeInGuide 0.1s ease-out",
            opacity: 0.9,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes fadeInGuide {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
