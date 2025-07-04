"use client";

import React from "react";
import { TableCell } from "@/components/ui/table-cell";
import { cn } from "@/lib/utils";

interface TableHeaderProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function TableHeader({
  value,
  onChange,
  className,
  placeholder = "Header...",
  disabled = false,
}: TableHeaderProps) {
  return (
    <TableCell
      value={value}
      onChange={onChange}
      isHeader={true}
      className={cn(
        "bg-blue-50 border-blue-200 font-calsans text-blue-900",
        className
      )}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}
