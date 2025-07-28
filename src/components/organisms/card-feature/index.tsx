import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import React from "react";

interface CardFeatureProps {
  icon?: React.ReactNode | string; // Support both ReactNode and base64 string
  title?: string;
  description?: string;
  href?: string;
  id?: string;
}

const CardFeature = ({
  id,
  icon,
  title,
  description,
  href = "/",
}: CardFeatureProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("bookTypeId", id || "");
    router.push(href + `?${params.toString()}`);
  };

  // Function to render icon based on type
  const renderIcon = () => {
    if (!icon) return null;

    // If icon is a string (base64), render as image
    if (typeof icon === "string") {
      // Check if it's base64 data URL or just base64 string
      const isDataUrl = icon.startsWith("data:");
      const imageSrc = isDataUrl ? icon : `data:image/svg+xml;base64,${icon}`;

      return (
        <div className="w-11 h-11 flex items-center justify-center">
          <img
            src={imageSrc}
            alt={title || "Feature icon"}
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback if image fails to load
              console.error("Failed to load icon:", icon);
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      );
    }

    // If icon is ReactNode, render directly
    return icon;
  };

  return (
    <div
      onClick={handleClick}
      className="w-full flex justify-between items-center gap-1 border border-[#DFDFDF] px-2.5 py-3.5 rounded-2xl cursor-pointer  hover:bg-[#FAFAFA]"
    >
      <div className="w-full flex items-center justify-center">
        {renderIcon()}
      </div>
      <div className="w-full flex flex-col gap-1">
        <h1 className="font-calsans text-base">{title}</h1>
        <p className="text-sm truncate w-4/5">{description}</p>
      </div>
    </div>
  );
};

export default CardFeature;
