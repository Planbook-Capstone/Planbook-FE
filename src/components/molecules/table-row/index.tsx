"use client";

import React from "react";
import { TableCell } from "@/components/ui/table-cell";
import { TableHeader } from "@/components/ui/table-header";
import { cn } from "@/lib/utils";

interface TableRowProps {
  cells: string[];
  onCellChange: (cellIndex: number, value: string) => void;
  isHeader?: boolean;
  className?: string;
  disabled?: boolean;
}

export function TableRow({
  cells,
  onCellChange,
  isHeader = false,
  className,
  disabled = false,
}: TableRowProps) {
  const handleCellChange = (cellIndex: number, value: string) => {
    onCellChange(cellIndex, value);
  };

  return (
    <tr className={cn("", className)}>
      {cells.map((cellValue, cellIndex) => {
        if (isHeader) {
          return (
            <TableHeader
              key={cellIndex}
              value={cellValue}
              onChange={(value) => handleCellChange(cellIndex, value)}
              placeholder={`Header ${cellIndex + 1}`}
              className="!font-calsans font-normal"
              disabled={disabled}
            />
          );
        }

        return (
          <TableCell
            key={cellIndex}
            value={cellValue}
            onChange={(value) => handleCellChange(cellIndex, value)}
            placeholder={`Cell ${cellIndex + 1}`}
            disabled={disabled}
          />
        );
      })}
    </tr>
  );
}
