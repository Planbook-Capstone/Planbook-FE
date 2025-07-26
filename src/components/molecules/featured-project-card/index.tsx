"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface Stat {
  value: string;
  label: string;
}

interface FeaturedProjectCardProps {
  title: string;
  image: string;
  tags?: string[];
  className?: string;
  imageClassName?: string;
  tagsPosition?: "top" | "bottom";
  tagClassName?: string;
}

export const FeaturedProjectCard = ({
  title,
  image,
  tags = [],
  className,
  imageClassName,
  tagsPosition = "bottom",
  tagClassName,
}: FeaturedProjectCardProps) => {
  const renderTags = () => {
    if (tags.length === 0) return null;

    return (
      <div
        className={cn(
          "flex flex-wrap",
          tagsPosition === "top" ? "mb-4" : "mt-4"
        )}
      >
        {tags.map((tag, index) => (
          <span
            key={index}
            className={cn(
              "relative px-3 py-1 bg-white backdrop-blur-sm rounded-full text-neutral-900 text-sm font-medium",
              tagClassName
            )}
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300",
        className
      )}
    >
      {/* IMAGE + OVERLAY */}
      <div className="relative w-full rounded-3xl overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={1200}
          height={800}
          className={cn("w-full object-cover rounded-3xl", imageClassName)}
        />

        <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
          <div className="flex justify-between items-start">
            {tagsPosition === "top" && renderTags()}
            <button className="bg-lime-400 w-32 text-black p-2 rounded-full opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-300 ml-auto">
              →
            </button>
          </div>

          {tagsPosition === "bottom" && renderTags()}
        </div>
      </div>
    </div>
  );
};
