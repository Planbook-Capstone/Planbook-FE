import React from "react";
import { TableElement } from "@/types";

interface TablePropertiesPanelProps {
  element: TableElement;
  selectedCell?: { row: number; col: number } | null;
  selectedRow?: number | null;
  onUpdate: (updates: Partial<TableElement>) => void;
}

export const TablePropertiesPanel: React.FC<TablePropertiesPanelProps> = ({
  element,
  selectedCell,
  selectedRow,
  onUpdate,
}) => {
  const { style = {}, cellStyles = {}, rowStyles = {} } = element;

  // Update table style
  const updateTableStyle = (styleUpdates: any) => {
    onUpdate({
      style: { ...style, ...styleUpdates },
    });
  };

  // Update cell style
  const updateCellStyle = (
    rowIndex: number,
    colIndex: number,
    cellStyleUpdates: any
  ) => {
    const cellKey = `${rowIndex}-${colIndex}`;
    const newCellStyles = {
      ...cellStyles,
      [cellKey]: { ...cellStyles[cellKey], ...cellStyleUpdates },
    };
    onUpdate({ cellStyles: newCellStyles });
  };

  // Update row style
  const updateRowStyle = (rowIndex: number, rowStyleUpdates: any) => {
    const newRowStyles = {
      ...rowStyles,
      [rowIndex]: { ...rowStyles[rowIndex], ...rowStyleUpdates },
    };
    onUpdate({ rowStyles: newRowStyles });
  };

  // Get current cell style
  const getCurrentCellStyle = () => {
    if (!selectedCell) return {};
    const cellKey = `${selectedCell.row}-${selectedCell.col}`;
    return cellStyles[cellKey] || {};
  };

  // Get current row style
  const getCurrentRowStyle = () => {
    if (selectedRow === null) return {};
    return rowStyles[selectedRow] || {};
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Table Properties
      </h3>

      {/* Table-wide settings */}
      <div className="space-y-4 mb-6">
        <h4 className="font-medium text-gray-700">Table Style</h4>

        {/* Font Family */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Font Family
          </label>
          <select
            value={style.fontFamily || "Arial, sans-serif"}
            onChange={(e) => updateTableStyle({ fontFamily: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="Arial, sans-serif">Arial</option>
            <option value="Times New Roman, serif">Times New Roman</option>
            <option value="Courier New, monospace">Courier New</option>
            <option value="Helvetica, sans-serif">Helvetica</option>
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Font Size
          </label>
          <input
            type="number"
            value={style.fontSize || 14}
            onChange={(e) =>
              updateTableStyle({ fontSize: parseInt(e.target.value) })
            }
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            min="8"
            max="72"
          />
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Text Color
          </label>
          <input
            type="color"
            value={style.textColor || "#000000"}
            onChange={(e) => updateTableStyle({ textColor: e.target.value })}
            className="w-full h-10 border border-gray-300 rounded-md"
          />
        </div>

        {/* Border Color */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Border Color
          </label>
          <input
            type="color"
            value={style.borderColor || "#000000"}
            onChange={(e) => updateTableStyle({ borderColor: e.target.value })}
            className="w-full h-10 border border-gray-300 rounded-md"
          />
        </div>

        {/* Border Width */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Border Width
          </label>
          <input
            type="number"
            value={style.borderWidth || 1}
            onChange={(e) =>
              updateTableStyle({ borderWidth: parseInt(e.target.value) })
            }
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            min="0"
            max="10"
          />
        </div>

        {/* Header Background */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Header Background
          </label>
          <input
            type="color"
            value={style.headerBackgroundColor || "#f3f4f6"}
            onChange={(e) =>
              updateTableStyle({ headerBackgroundColor: e.target.value })
            }
            className="w-full h-10 border border-gray-300 rounded-md"
          />
        </div>

        {/* Cell Background */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Default Cell Background
          </label>
          <input
            type="color"
            value={style.cellBackgroundColor || "#ffffff"}
            onChange={(e) =>
              updateTableStyle({ cellBackgroundColor: e.target.value })
            }
            className="w-full h-10 border border-gray-300 rounded-md"
          />
        </div>

        {/* Text Align */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Text Alignment
          </label>
          <select
            value={style.textAlign || "center"}
            onChange={(e) => updateTableStyle({ textAlign: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      {/* Cell-specific settings */}
      {selectedCell && (
        <div className="space-y-4 mb-6 border-t pt-4">
          <h4 className="font-medium text-gray-700">
            Cell Style (Row {selectedCell.row + 1}, Col {selectedCell.col + 1})
          </h4>

          {/* Cell Background */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Cell Background
            </label>
            <input
              type="color"
              value={
                getCurrentCellStyle().backgroundColor ||
                style.cellBackgroundColor ||
                "#ffffff"
              }
              onChange={(e) =>
                updateCellStyle(selectedCell.row, selectedCell.col, {
                  backgroundColor: e.target.value,
                })
              }
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>

          {/* Cell Text Color */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Cell Text Color
            </label>
            <input
              type="color"
              value={
                getCurrentCellStyle().textColor || style.textColor || "#000000"
              }
              onChange={(e) =>
                updateCellStyle(selectedCell.row, selectedCell.col, {
                  textColor: e.target.value,
                })
              }
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>

          {/* Cell Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Cell Font Size
            </label>
            <input
              type="number"
              value={getCurrentCellStyle().fontSize || style.fontSize || 14}
              onChange={(e) =>
                updateCellStyle(selectedCell.row, selectedCell.col, {
                  fontSize: parseInt(e.target.value),
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              min="8"
              max="72"
            />
          </div>

          {/* Cell Font Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Cell Font Weight
            </label>
            <select
              value={getCurrentCellStyle().fontWeight || "normal"}
              onChange={(e) =>
                updateCellStyle(selectedCell.row, selectedCell.col, {
                  fontWeight: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </select>
          </div>

          {/* Cell Text Align */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Cell Text Alignment
            </label>
            <select
              value={
                getCurrentCellStyle().textAlign || style.textAlign || "center"
              }
              onChange={(e) =>
                updateCellStyle(selectedCell.row, selectedCell.col, {
                  textAlign: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      )}

      {/* Row-specific settings */}
      {selectedRow !== null && (
        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium text-gray-700">
            Row Style (Row {selectedRow + 1})
          </h4>

          {/* Row Background */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Row Background
            </label>
            <input
              type="color"
              value={
                getCurrentRowStyle().backgroundColor ||
                style.cellBackgroundColor ||
                "#ffffff"
              }
              onChange={(e) =>
                updateRowStyle(selectedRow, { backgroundColor: e.target.value })
              }
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>

          {/* Row Text Color */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Row Text Color
            </label>
            <input
              type="color"
              value={
                getCurrentRowStyle().textColor || style.textColor || "#000000"
              }
              onChange={(e) =>
                updateRowStyle(selectedRow, { textColor: e.target.value })
              }
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>

          {/* Row Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Row Font Size
            </label>
            <input
              type="number"
              value={getCurrentRowStyle().fontSize || style.fontSize || 14}
              onChange={(e) =>
                updateRowStyle(selectedRow, {
                  fontSize: parseInt(e.target.value),
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              min="8"
              max="72"
            />
          </div>

          {/* Row Font Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Row Font Weight
            </label>
            <select
              value={getCurrentRowStyle().fontWeight || "normal"}
              onChange={(e) =>
                updateRowStyle(selectedRow, { fontWeight: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
