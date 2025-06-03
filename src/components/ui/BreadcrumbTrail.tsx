"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  beforeIcon?: ReactNode;
  afterIcon?: ReactNode;
}

interface BreadcrumbTrailProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbTrail({ items, className }: BreadcrumbTrailProps) {
  const router = useRouter();

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        const classNameText = cn(
          "inline-flex items-center gap-1 text-sm text-black",
          item.active
            ? "text-lg font-calsans text-black"
            : "text-muted-foreground font-questrial hover:text-foreground !text-black"
        );

        const content = item.href ? (
          <Link
            href={item.href}
            onClick={item.onClick}
            className={classNameText}
          >
            {item.beforeIcon}
            {item.label}
            {item.afterIcon}
          </Link>
        ) : item.onClick ? (
          <button onClick={item.onClick} className={classNameText}>
            {item.beforeIcon}
            {item.label}
            {item.afterIcon}
          </button>
        ) : (
          <span className={classNameText}>
            {item.beforeIcon}
            {item.label}
            {item.afterIcon}
          </span>
        );

        return (
          <div key={index} className="flex items-center gap-2">
            {content}
            {!isLast && <div className="h-5 border-l border-gray-300" />}
          </div>
        );
      })}
    </div>
  );
}
