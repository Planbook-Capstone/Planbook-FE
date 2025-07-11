"use client";

import React from "react";
import { TableCell } from "@/components/ui/table-cell";
import { TableHeader } from "@/components/ui/table-header";
import { cn } from "@/lib/utils";

interface CellContent {
  text?: string;
  image?: {
    url: string;
    name?: string;
  };
}

interface TableRowProps {
  cells: (string | CellContent)[];
  onCellChange: (cellIndex: number, value: string | CellContent) => void;
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
  const handleCellChange = (cellIndex: number, value: string | CellContent) => {
    onCellChange(cellIndex, value);
  };

  return (
    <tr className={cn("", className)}>
      {cells.map((cellValue, cellIndex) => {
        if (isHeader) {
          // Headers are always strings
          const headerValue = typeof cellValue === 'string' ? cellValue : cellValue?.text || '';
          return (
            <TableHeader
              key={cellIndex}
              value={headerValue}
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
