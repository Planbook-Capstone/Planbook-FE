"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { TableRow } from "@/components/molecules/table-row";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Plus, Minus } from "lucide-react";

interface CellContent {
  text?: string;
  image?: {
    url: string;
    name?: string;
  };
}

interface TableData {
  headers: string[];
  rows: (string | CellContent)[][];
}

interface TableProps {
  initialData?: TableData;
  onDataChange?: (data: TableData) => void;
  className?: string;
  disabled?: boolean;
  showControls?: boolean;
  minRows?: number;
  minCols?: number;
  maxRows?: number;
  maxCols?: number;
}

export function Table({
  initialData,
  onDataChange,
  className,
  disabled = false,
  showControls = true,
  minRows = 1,
  minCols = 2,
  maxRows = 20,
  maxCols = 10,
}: TableProps) {
  // Debug re-renders
  console.log("🔍 Table component received initialData:", initialData);

  // Initialize with default 2x2 table
  const [tableData, setTableData] = useState<TableData>(() => {
    const defaultData = {
      headers: ["Header 1", "Header 2"],
      rows: [
        ["Cell 1-1", "Cell 1-2"],
        ["Cell 2-1", "Cell 2-2"],
      ],
    };

    // Use initialData if it's provided and valid
    if (initialData && initialData.headers && initialData.rows) {
      console.log("🔍 Using initialData in useState:", initialData);
      return initialData;
    }

    console.log("🔍 Using defaultData in useState");
    return defaultData;
  });

  // Update when initialData changes
  useEffect(() => {
    if (initialData && initialData.headers && initialData.rows) {
      console.log("🔍 useEffect updating tableData with:", initialData);
      setTableData(initialData);
    }
  }, [initialData]); // Run when initialData changes

  // Stable callback for data changes
  const handleDataChange = useCallback(
    (data: TableData) => {
      onDataChange?.(data);
    },
    [onDataChange]
  );

  // Only call onDataChange when tableData actually changes
  const prevTableDataRef = useRef<TableData | undefined>();
  useEffect(() => {
    if (
      prevTableDataRef.current &&
      JSON.stringify(prevTableDataRef.current) !== JSON.stringify(tableData)
    ) {
      handleDataChange(tableData);
    }
    prevTableDataRef.current = tableData;
  }, [tableData, handleDataChange]);

  const handleHeaderChange = (headerIndex: number, value: string) => {
    setTableData((prev) => ({
      ...prev,
      headers: prev.headers.map((header, index) =>
        index === headerIndex ? value : header
      ),
    }));
  };

  const handleCellChange = (
    rowIndex: number,
    cellIndex: number,
    value: string | CellContent
  ) => {
    setTableData((prev) => ({
      ...prev,
      rows: prev.rows.map((row, rIndex) =>
        rIndex === rowIndex
          ? row.map((cell, cIndex) => (cIndex === cellIndex ? value : cell))
          : row
      ),
    }));
  };

  const addRow = () => {
    if (tableData.rows.length >= maxRows) return;

    const newRowIndex = tableData.rows.length + 1;
    const newRow = tableData.headers.map(
      (_, colIndex) => `Cell ${newRowIndex}-${colIndex + 1}`
    );

    setTableData((prev) => ({
      ...prev,
      rows: [...prev.rows, newRow],
    }));
  };

  const removeRow = () => {
    if (tableData.rows.length <= minRows) return;

    setTableData((prev) => ({
      ...prev,
      rows: prev.rows.slice(0, -1),
    }));
  };

  const addColumn = () => {
    if (tableData.headers.length >= maxCols) return;

    const newColIndex = tableData.headers.length + 1;
    const newHeader = `Header ${newColIndex}`;

    setTableData((prev) => ({
      headers: [...prev.headers, newHeader],
      rows: prev.rows.map((row, rowIndex) => [
        ...row,
        `Cell ${rowIndex + 1}-${newColIndex}`,
      ]),
    }));
  };

  const removeColumn = () => {
    if (tableData.headers.length <= minCols) return;

    setTableData((prev) => ({
      headers: prev.headers.slice(0, -1),
      rows: prev.rows.map((row) => row.slice(0, -1)),
    }));
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Controls */}
      {showControls && !disabled && (
        <div className="mb-4 flex flex-wrap gap-2 font-questrial ">
          <div className="flex items-center gap-1">
            <Button
              onClick={addRow}
              size="sm"
              variant="outline"
              disabled={tableData.rows.length >= maxRows}
              className="text-sm py-4 px-1"
            >
              <Plus className="w-3 h-3 mr-1" />
              Thêm hàng
            </Button>
            <Button
              onClick={removeRow}
              size="sm"
              variant="outline"
              disabled={tableData.rows.length <= minRows}
              className="text-sm py-4 px-1"
            >
              <Minus className="w-3 h-3 mr-1" />
              Xóa hàng
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              onClick={addColumn}
              size="sm"
              variant="outline"
              disabled={tableData.headers.length >= maxCols}
              className="text-sm py-4 px-1"
            >
              <Plus className="w-3 h-3 mr-1" />
              Thêm cột
            </Button>
            <Button
              onClick={removeColumn}
              size="sm"
              variant="outline"
              disabled={tableData.headers.length <= minCols}
              className="text-sm py-4 px-1"
            >
              <Minus className="w-3 h-3 mr-1" />
              Xóa cột
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          <thead className="font-calsans font-normal">
            <TableRow
              cells={tableData.headers}
              onCellChange={handleHeaderChange}
              isHeader={true}
              disabled={disabled}
            />
          </thead>
          <tbody>
            {tableData.rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                cells={row}
                onCellChange={(cellIndex, value) =>
                  handleCellChange(rowIndex, cellIndex, value)
                }
                disabled={disabled}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Info */}
      {showControls && (
        <div className="mt-2 text-xs text-gray-500 font-questrial">
          {tableData.rows.length} hàng × {tableData.headers.length} cột
        </div>
      )}
    </div>
  );
}
