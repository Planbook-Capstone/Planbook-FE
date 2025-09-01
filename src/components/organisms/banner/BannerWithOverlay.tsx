"use client";

import React from "react";
import GridDistortion from "./GridDistortion";
import BannerOverlay from "./BannerOverlay";

interface QuickAction {
  title: string;
  href: string;
}

interface BannerWithOverlayProps {
  imageSrc?: string;
  videoSrc?: string;
  title?: string;
  subtitle?: string;
  onSearch?: (query: string) => void;
  className?: string;
  height?: string;
  grid?: number;
  mouse?: number;
  strength?: number;
  relaxation?: number;
  searchClassName?: string;
  quickActions?: QuickAction[];
  hideSearch?: boolean;
}

const BannerWithOverlay = ({
  imageSrc = "/images/background/abstract-bg.svg",
  videoSrc,
  title,
  subtitle,
  onSearch,
  className = "",
  height = "h-96",
  grid = 10,
  mouse = 0.1,
  strength = 0.15,
  relaxation = 0.9,
  searchClassName = "",
  quickActions,
  hideSearch = false,
}: BannerWithOverlayProps) => {
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
      <BannerOverlay
        searchClassName={searchClassName}
        title={title}
        subtitle={subtitle}
        onSearch={onSearch}
        // quickActions={quickActions}
        hideSearch={hideSearch}
      />
    </div>
  );
};

export default BannerWithOverlay;
