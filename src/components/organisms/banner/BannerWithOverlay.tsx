"use client";

import React from "react";
import GridDistortion from "./GridDistortion";
import BannerOverlay from "./BannerOverlay";

interface BannerWithOverlayProps {
  imageSrc?: string;
  videoSrc?: string;
  userName?: string;
  onSearch?: (query: string) => void;
  className?: string;
  height?: string;
  grid?: number;
  mouse?: number;
  strength?: number;
  relaxation?: number;
}

const BannerWithOverlay = ({
  imageSrc = "/images/background/abstract-bg.svg",
  videoSrc,
  userName = "Nguyễn Văn A",
  onSearch,
  className = "",
  height = "h-96",
  grid = 10,
  mouse = 0.1,
  strength = 0.15,
  relaxation = 0.9,
}: BannerWithOverlayProps) => {
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    onSearch?.(query);
  };

  return (
    <div
      className={`relative ${height} rounded-2xl overflow-hidden ${className}`}
    >
      {/* Background with GridDistortion */}
      <GridDistortion
        imageSrc={imageSrc}
        videoSrc={videoSrc}
        grid={grid}
        mouse={mouse}
        strength={strength}
        relaxation={relaxation}
        className="w-full h-full"
      />

      {/* Overlay with greeting and search */}
      <BannerOverlay userName={userName} onSearch={handleSearch} />
    </div>
  );
};

export default BannerWithOverlay;
