"use client";

import React, { useState, useRef, useEffect } from "react";
import { VideoElement as VideoElementType } from "@/types";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";
// Removed useDraggable import - implementing custom drag logic

interface VideoElementProps {
  element: VideoElementType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<VideoElementType>) => void;
  onDelete: () => void;
  isEditing?: boolean;
  onStartEditing?: () => void;
  onStopEditing?: () => void;
}

export default function VideoElement({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  isEditing = false,
  onStartEditing,
  onStopEditing,
}: VideoElementProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(element.muted ?? true);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Selection state managed by parent
  const [controlsTimer, setControlsTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  // Custom drag functionality
  const [isDragging, setIsDragging] = useState(false);
  const [dragStarted, setDragStarted] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't drag if clicking on video controls
    if ((e.target as HTMLElement).closest(".video-controls")) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startElementX = element.x;
    const startElementY = element.y;
    let hasMoved = false;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      // Only start dragging if mouse moved more than 3px (threshold)
      if (!hasMoved && (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3)) {
        hasMoved = true;
        setIsDragging(true);
        setDragStarted(true);
      }

      if (hasMoved) {
        onUpdate({
          x: startElementX + deltaX,
          y: startElementY + deltaY,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);

      // If no movement occurred, treat as click (select)
      if (!hasMoved) {
        onSelect();
      }

      setDragStarted(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Simple resize state
  const [isResizing, setIsResizing] = useState(false);

  // Simple resize handler
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = element.width;
    const startHeight = element.height;
    const startElementX = element.x;
    const startElementY = element.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startElementX;
      let newY = startElementY;

      // Handle different resize directions
      switch (direction) {
        case "se": // Southeast (bottom-right)
          newWidth = Math.max(50, startWidth + deltaX);
          newHeight = Math.max(50, startHeight + deltaY);
          break;
        case "sw": // Southwest (bottom-left)
          newWidth = Math.max(50, startWidth - deltaX);
          newHeight = Math.max(50, startHeight + deltaY);
          newX = startElementX + (startWidth - newWidth);
          break;
        case "ne": // Northeast (top-right)
          newWidth = Math.max(50, startWidth + deltaX);
          newHeight = Math.max(50, startHeight - deltaY);
          newY = startElementY + (startHeight - newHeight);
          break;
        case "nw": // Northwest (top-left)
          newWidth = Math.max(50, startWidth - deltaX);
          newHeight = Math.max(50, startHeight - deltaY);
          newX = startElementX + (startWidth - newWidth);
          newY = startElementY + (startHeight - newHeight);
          break;
        case "e": // East (right)
          newWidth = Math.max(50, startWidth + deltaX);
          break;
        case "w": // West (left)
          newWidth = Math.max(50, startWidth - deltaX);
          newX = startElementX + (startWidth - newWidth);
          break;
        case "n": // North (top)
          newHeight = Math.max(50, startHeight - deltaY);
          newY = startElementY + (startHeight - newHeight);
          break;
        case "s": // South (bottom)
          newHeight = Math.max(50, startHeight + deltaY);
          break;
      }

      onUpdate({
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY,
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const video = videoRef.current;
    if (!video) return;

    // Temporarily enable pointer events for video interaction
    video.style.pointerEvents = "auto";

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }

    // Disable pointer events again after a short delay
    setTimeout(() => {
      video.style.pointerEvents = "none";
    }, 100);
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const newMuted = !isMuted;
    setIsMuted(newMuted);
    video.muted = newMuted;
    onUpdate({ muted: newMuted });
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;

    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStartEditing) {
      onStartEditing();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      onDelete();
    } else if (e.key === "Escape" && isEditing && onStopEditing) {
      onStopEditing();
    }
  };

  return (
    <div
      className={`absolute group ${
        isDragging
          ? "cursor-grabbing"
          : isSelected
          ? "cursor-move"
          : "cursor-pointer"
      } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        zIndex: element.zIndex || 1,
        transform: element.rotation
          ? `rotate(${element.rotation}deg)`
          : undefined,
      }}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      tabIndex={0}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        // Delay hiding controls to prevent flickering
        if (controlsTimer) clearTimeout(controlsTimer);
        const timer = setTimeout(() => setShowControls(false), 500);
        setControlsTimer(timer);
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={element.src}
        className="w-full h-full object-cover rounded pointer-events-none"
        muted={isMuted}
        loop={element.loop}
        autoPlay={false}
        preload="metadata"
        onError={(e) => {
          console.error("Video load error:", e);
        }}
      />

      {/* Video Controls Overlay - Show on hover or when selected */}
      {(showControls || isSelected) && (
        <div className="video-controls absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Center Play Button - Only show when not playing */}
          {!isPlaying && (
            <button
              onClick={handlePlayPause}
              className="p-4 bg-black bg-opacity-60 rounded-full text-white hover:bg-opacity-80 transition-all transform hover:scale-110 pointer-events-auto"
            >
              <Play className="w-8 h-8" />
            </button>
          )}

          {/* Minimal Controls when playing - top right corner */}
          {isPlaying && (
            <div className="absolute top-2 right-2 flex gap-2 pointer-events-auto">
              <button
                onClick={handlePlayPause}
                className="p-2 bg-black bg-opacity-50 rounded text-white hover:bg-opacity-70 transition-colors"
              >
                <Pause className="w-4 h-4" />
              </button>
              <button
                onClick={handleMuteToggle}
                className="p-2 bg-black bg-opacity-50 rounded text-white hover:bg-opacity-70 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Selection Handles */}
      {isSelected && (
        <>
          {/* Corner resize handles */}
          <div
            className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full cursor-nw-resize"
            onMouseDown={(e) => handleResizeStart(e, "nw")}
          />
          <div
            className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full cursor-ne-resize"
            onMouseDown={(e) => handleResizeStart(e, "ne")}
          />
          <div
            className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full cursor-sw-resize"
            onMouseDown={(e) => handleResizeStart(e, "sw")}
          />
          <div
            className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full cursor-se-resize"
            onMouseDown={(e) => handleResizeStart(e, "se")}
          />

          {/* Edge resize handles */}
          <div
            className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full cursor-n-resize"
            onMouseDown={(e) => handleResizeStart(e, "n")}
          />
          <div
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full cursor-s-resize"
            onMouseDown={(e) => handleResizeStart(e, "s")}
          />
          <div
            className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full cursor-w-resize"
            onMouseDown={(e) => handleResizeStart(e, "w")}
          />
          <div
            className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full cursor-e-resize"
            onMouseDown={(e) => handleResizeStart(e, "e")}
          />
        </>
      )}

      {/* Video Info Badge */}
      {isSelected && (
        <div className="absolute -top-8 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          Video: {element.width}×{element.height}
        </div>
      )}
    </div>
  );
}
