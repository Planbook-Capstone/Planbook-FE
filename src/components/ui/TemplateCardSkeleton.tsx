import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const TemplateCardSkeleton: React.FC = () => {
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden">
      <div
        className={cn(
          "aspect-[16/9] bg-transparent w-full bg-gradient-to-r from-neutral-50 to-gray-100",
          "relative overflow-hidden",
          "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite]",
          "before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent"
        )}
      />
    </div>
  );
};
