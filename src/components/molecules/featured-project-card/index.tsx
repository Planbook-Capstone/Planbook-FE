"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface Stat {
  value: string;
  label: string;
}

interface FeaturedProjectCardProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  stats?: Stat[];
  tags?: string[];
  className?: string;
  imageClassName?: string;
}

export const FeaturedProjectCard = ({
  title,
  subtitle,
  description,
  image,
  stats = [],
  tags = [],
  className,
  imageClassName,
}: FeaturedProjectCardProps) => {
  return (
    <div
      className={cn(
        "group rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
        className
      )}
    >
      {/* IMAGE + OVERLAY */}
      <div className="relative w-full">
        <Image
          src={image}
          alt={title}
          width={1200}
          height={800}
          className={cn("w-full object-cover rounded-t-3xl", imageClassName)}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-t-3xl pointer-events-none" />

        {/* Content inside image */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
          <div>
            {/* TAGS - thêm ::before bằng Tailwind */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 relative">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="relative px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium before:content-['•'] before:mr-1 before:text-white before:inline-block"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Subtitle */}
            <div className="text-white/80 text-sm font-medium mb-2">
              {subtitle}
            </div>
          </div>

          <div>
            {/* Description */}
            <p className="text-white/90 text-sm mb-4 line-clamp-3">
              {description}
            </p>

            {/* Stats */}
            {stats.length > 0 && (
              <div className="flex gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-white">
                    <div className="text-lg font-bold">{stat.value}</div>
                    <div className="text-xs text-white/80">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TITLE bên dưới ảnh */}
      <div className="bg-white px-6 py-4 rounded-b-3xl">
        <h3 className="text-gray-900 text-2xl font-calsans leading-tight">
          {title}
        </h3>
      </div>
    </div>
  );
};
