"use client";

import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { BsStars } from "react-icons/bs";

interface AnswerSheetOptionProps {
  label: string;
  description?: string;
  selected?: boolean;
  isRecommend?: boolean;
  onSelect?: () => void;
}

export default function AnswerSheetOption({
  label,
  description,
  selected,
  isRecommend = false,
  onSelect,
}: AnswerSheetOptionProps) {
  return (
    <Button
      variant="outline"
      size="default"
      onClick={onSelect}
      className={cn(
        "w-full justify-start text-left px-4 py-3 flex gap-2 items-center",
        selected && "border-black bg-gray-50"
      )}
    >
      {isRecommend && <BsStars />}
      <div className="font-medium">{label}</div>
      {description && (
        <div className="text-gray-500 text-xs"> {description}</div>
      )}
    </Button>
  );
}
