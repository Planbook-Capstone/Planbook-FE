import React, { useState, useRef, useCallback } from "react";
import { TableElement } from "@/types";

interface TableEditorProps {
  element: TableElement;
  isSelected?: boolean;
  onSelect?: () => void;
  onUpdate?: (updates: Partial<TableElement>) => void;
  onDelete?: () => void;
}

export const TableEditor: React.FC<TableEditorProps> = ({
  element,
  isSelected = false,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  const {
    x,
    y,
    width,
    height,
    headers,
    rows,
    columnWidths = [],
    rowHeights = [],
    style = {},
    cellStyles = {},
    rowStyles = {},
    zIndex = 0,
  } = element;

  const {
    borderColor = "#000000",
    borderWidth = 1,
    headerBackgroundColor = "#f3f4f6",
    cellBackgroundColor = "#ffffff",
    textColor = "#000000",
    fontSize = 14,
    fontFamily = "Arial, sans-serif",
    textAlign = "center",
  } = style;

  const [isDragging, setIsDragging] = useState(false);
  const [isResizingColumn, setIsResizingColumn] = useState(false);
  const [isResizingRow, setIsResizingRow] = useState(false);
  const [resizingIndex, setResizingIndex] = useState(-1);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const tableRef = useRef<HTMLDivElement>(null);

  // Calculate column widths
  const defaultColumnWidth = width / headers.length;
  const actualColumnWidths = headers.map(
    (_, index) => columnWidths[index] || defaultColumnWidth
  );

  // Calculate row heights
  const defaultRowHeight = 40;
  const actualRowHeights = [
    defaultRowHeight,
    ...rows.map((_, index) => rowHeights[index] || defaultRowHeight),
  ];

  // Handle table drag
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isSelected && onSelect) {
        onSelect();
        return;
      }

      if (isSelected) {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        setInitialPosition({ x, y });
      }
    },
    [isSelected, x, y, onSelect]
  );

  // Handle column resize
  const handleColumnResizeStart = useCallback(
    (e: React.MouseEvent, columnIndex: number) => {
      e.preventDefault();
      e.stopPropagation();

      setIsResizingColumn(true);
      setResizingIndex(columnIndex);
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    []
  );

  // Handle row resize
  const handleRowResizeStart = useCallback(
    (e: React.MouseEvent, rowIndex: number) => {
      e.preventDefault();
      e.stopPropagation();

      setIsResizingRow(true);
      setResizingIndex(rowIndex);
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    []
  );

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!onUpdate) return;

      if (isDragging) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        const newX = Math.max(0, initialPosition.x + deltaX);
        const newY = Math.max(0, initialPosition.y + deltaY);

        onUpdate({ x: newX, y: newY });
      } else if (isResizingColumn) {
        const deltaX = e.clientX - dragStart.x;
        const newColumnWidths = [...actualColumnWidths];
        newColumnWidths[resizingIndex] = Math.max(
          50,
          actualColumnWidths[resizingIndex] + deltaX
        );

        onUpdate({ columnWidths: newColumnWidths });
      } else if (isResizingRow) {
        const deltaY = e.clientY - dragStart.y;
        const newRowHeights = [...actualRowHeights.slice(1)]; // Exclude header row
        newRowHeights[resizingIndex] = Math.max(
          30,
          actualRowHeights[resizingIndex + 1] + deltaY
        );

        onUpdate({ rowHeights: newRowHeights });
      }
    },
    [
      isDragging,
      isResizingColumn,
      isResizingRow,
      dragStart,
      initialPosition,
      actualColumnWidths,
      actualRowHeights,
      resizingIndex,
      onUpdate,
    ]
  );

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizingColumn(false);
    setIsResizingRow(false);
    setResizingIndex(-1);
  }, []);

  // Add event listeners
  React.useEffect(() => {
    if (isDragging || isResizingColumn || isResizingRow) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [
    isDragging,
    isResizingColumn,
    isResizingRow,
    handleMouseMove,
    handleMouseUp,
  ]);

  // Handle delete key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        isSelected &&
        (e.key === "Delete" || e.key === "Backspace") &&
        onDelete
      ) {
        e.preventDefault();
        onDelete();
      }
    };

    if (isSelected) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isSelected, onDelete]);

  // Handle cell click
  const handleCellClick = useCallback(
    (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
      e.stopPropagation();
      setSelectedCell({ row: rowIndex, col: colIndex });
      setSelectedRow(null);
    },
    []
  );

  // Handle row click
  const handleRowClick = useCallback(
    (e: React.MouseEvent, rowIndex: number) => {
      e.stopPropagation();
      setSelectedRow(rowIndex);
      setSelectedCell(null);
    },
    []
  );

  // Get cell style
  const getCellStyle = (rowIndex: number, colIndex: number) => {
    const cellKey = `${rowIndex}-${colIndex}`;
    const cellStyle = cellStyles[cellKey] || {};
    const rowStyle = rowStyles[rowIndex] || {};

    return {
      backgroundColor:
        cellStyle.backgroundColor ||
        rowStyle.backgroundColor ||
        cellBackgroundColor,
      color: cellStyle.textColor || rowStyle.textColor || textColor,
      fontSize: cellStyle.fontSize || rowStyle.fontSize || fontSize,
      fontWeight: cellStyle.fontWeight || rowStyle.fontWeight || "normal",
      textAlign: cellStyle.textAlign || textAlign,
    };
  };

  return (
    <div
      ref={tableRef}
      className={`absolute ${isSelected ? "ring-2 ring-blue-500" : ""} ${
        isDragging ? "cursor-grabbing" : "cursor-pointer"
      }`}
      style={{
        left: x,
        top: y,
        width,
        height,
        zIndex: isSelected ? 1000 : zIndex,
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
    >
      <table
        className="border-collapse"
        style={{
          width: "100%",
          height: "100%",
          borderColor,
          borderWidth,
          fontFamily,
          tableLayout: "fixed", // Fixed layout for better control
          fontSize: `${fontSize}px`,
        }}
      >
        {/* Table Header */}
        {headers.length > 0 && (
          <thead>
            <tr style={{ height: actualRowHeights[0] }}>
              {headers.map((header, colIndex) => (
                <th
                  key={colIndex}
                  className={`border relative ${
                    selectedCell?.col === colIndex ? "bg-blue-100" : ""
                  }`}
                  style={{
                    borderColor,
                    borderWidth,
                    backgroundColor: headerBackgroundColor,
                    textAlign,
                    padding: "4px 8px",
                    fontWeight: "bold",
                    width: actualColumnWidths[colIndex],
                    position: "relative",
                    fontSize: `${fontSize * 0.9}px`,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  onClick={(e) => handleCellClick(e, -1, colIndex)}
                >
                  {header}

                  {/* Column resize handle */}
                  {isSelected && (
                    <div
                      className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-blue-500 opacity-0 hover:opacity-100"
                      onMouseDown={(e) => handleColumnResizeStart(e, colIndex)}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
        )}

        {/* Table Body */}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              style={{ height: actualRowHeights[rowIndex + 1] }}
              className={selectedRow === rowIndex ? "bg-blue-50" : ""}
            >
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  className={`border relative ${
                    selectedCell?.row === rowIndex &&
                    selectedCell?.col === colIndex
                      ? "bg-blue-200"
                      : ""
                  }`}
                  style={{
                    borderColor,
                    borderWidth,
                    padding: "4px 8px",
                    width: actualColumnWidths[colIndex],
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    ...getCellStyle(rowIndex, colIndex),
                  }}
                  onClick={(e) => handleCellClick(e, rowIndex, colIndex)}
                >
                  {cell}
                </td>
              ))}

              {/* Row resize handle */}
              {isSelected && (
                <div
                  className="absolute right-0 bottom-0 h-1 w-full cursor-row-resize bg-blue-500 opacity-0 hover:opacity-100"
                  style={{ left: 0 }}
                  onMouseDown={(e) => handleRowResizeStart(e, rowIndex)}
                />
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
