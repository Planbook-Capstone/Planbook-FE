"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Plus, Trash2, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";

interface TableCell {
  id: string;
  content: string;
  isHeader?: boolean;
}

interface TableRow {
  id: string;
  cells: TableCell[];
}

interface TableData {
  rows: TableRow[];
  columns: number;
}

interface RichTableProps {
  data?: TableData;
  onChange?: (data: TableData) => void;
  className?: string;
}

// Default table data
const getDefaultTableData = (): TableData => ({
  rows: [
    {
      id: "header-row",
      cells: [
        { id: "h1", content: "Cột 1", isHeader: true },
        { id: "h2", content: "Cột 2", isHeader: true },
        { id: "h3", content: "Cột 3", isHeader: true },
      ],
    },
    {
      id: "row-1",
      cells: [
        { id: "r1c1", content: "<p>Nội dung ô 1</p>" },
        { id: "r1c2", content: "<p>Nội dung ô 2</p>" },
        { id: "r1c3", content: "<p>Nội dung ô 3</p>" },
      ],
    },
    {
      id: "row-2",
      cells: [
        { id: "r2c1", content: "<p>Nội dung ô 4</p>" },
        { id: "r2c2", content: "<p>Nội dung ô 5</p>" },
        { id: "r2c3", content: "<p>Nội dung ô 6</p>" },
      ],
    },
  ],
  columns: 3,
});

export function RichTable({ data, onChange, className }: RichTableProps) {
  const [tableData, setTableData] = useState<TableData>(
    data || getDefaultTableData()
  );
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  // Update parent when data changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log("RichTable - Saving data:", tableData);
      onChange?.(tableData);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [tableData]);

  // Update local state when prop changes (prevent infinite loop)
  useEffect(() => {
    if (data && JSON.stringify(data) !== JSON.stringify(tableData)) {
      console.log("RichTable - Loading data:", data);
      setTableData(data);
    }
  }, [data]);

  const updateCell = useCallback((rowId: string, cellId: string, content: string) => {
    setTableData((prev) => ({
      ...prev,
      rows: prev.rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              cells: row.cells.map((cell) =>
                cell.id === cellId ? { ...cell, content } : cell
              ),
            }
          : row
      ),
    }));
  }, []);

  const addRow = useCallback(() => {
    const newRowId = `row-${Date.now()}`;
    const newCells: TableCell[] = Array.from({ length: tableData.columns }, (_, i) => ({
      id: `${newRowId}-c${i}`,
      content: "<p>Nội dung mới</p>",
    }));

    setTableData((prev) => ({
      ...prev,
      rows: [...prev.rows, { id: newRowId, cells: newCells }],
    }));
  }, [tableData.columns]);

  const addColumn = useCallback(() => {
    setTableData((prev) => ({
      ...prev,
      columns: prev.columns + 1,
      rows: prev.rows.map((row, rowIndex) => ({
        ...row,
        cells: [
          ...row.cells,
          {
            id: `${row.id}-c${prev.columns}`,
            content: rowIndex === 0 ? `Cột ${prev.columns + 1}` : "<p>Nội dung mới</p>",
            isHeader: rowIndex === 0,
          },
        ],
      })),
    }));
  }, []);

  const removeRow = useCallback((rowId: string) => {
    if (tableData.rows.length <= 1) return;
    setTableData((prev) => ({
      ...prev,
      rows: prev.rows.filter((row) => row.id !== rowId),
    }));
  }, [tableData.rows.length]);

  const removeColumn = useCallback((columnIndex: number) => {
    if (tableData.columns <= 1) return;
    setTableData((prev) => ({
      ...prev,
      columns: prev.columns - 1,
      rows: prev.rows.map((row) => ({
        ...row,
        cells: row.cells.filter((_, index) => index !== columnIndex),
      })),
    }));
  }, [tableData.columns]);

  const openRichEditor = useCallback((cellId: string, currentContent: string) => {
    setEditingCell(cellId);
    setEditingContent(currentContent);
  }, []);

  const saveRichEdit = useCallback((content: string) => {
    if (editingCell) {
      console.log("Saving rich edit:", { editingCell, content });

      // Find the row that contains this cell
      const row = tableData.rows.find(row =>
        row.cells.some(cell => cell.id === editingCell)
      );

      if (row) {
        console.log("Found row:", row.id);
        updateCell(row.id, editingCell, content);
      }

      setEditingCell(null);
      setEditingContent("");
    }
  }, [editingCell, updateCell, tableData.rows]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Table Controls */}
      <div className="flex gap-2">
        <Button size="sm" onClick={addRow} variant="outline">
          <Plus className="w-4 h-4 mr-1" />
          Thêm hàng
        </Button>
        <Button size="sm" onClick={addColumn} variant="outline">
          <Plus className="w-4 h-4 mr-1" />
          Thêm cột
        </Button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <tbody>
            {tableData.rows.map((row, rowIndex) => (
              <tr key={row.id} className={rowIndex === 0 ? "bg-gray-50" : ""}>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={cell.id}
                    className={cn(
                      "border-r border-b border-gray-200 p-3 min-w-[200px] relative group",
                      cell.isHeader && "font-medium bg-gray-50"
                    )}
                  >
                    <div className="min-h-[40px] flex items-start justify-between">
                      {cell.isHeader ? (
                        // Header cells - simple input
                        <Input
                          value={cell.content}
                          onChange={(e) => updateCell(row.id, cell.id, e.target.value)}
                          className="border-0 bg-transparent font-medium"
                          placeholder="Tiêu đề cột"
                        />
                      ) : (
                        // Content cells - rich text preview
                        <div 
                          className="flex-1 cursor-pointer min-h-[40px] p-2 rounded hover:bg-gray-50"
                          onClick={() => openRichEditor(cell.id, cell.content)}
                          dangerouslySetInnerHTML={{ __html: cell.content || "<p>Nhấn để chỉnh sửa...</p>" }}
                        />
                      )}
                      
                      <div className="flex gap-1 ml-2">
                        {!cell.isHeader && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openRichEditor(cell.id, cell.content)}
                            className="h-7 w-7 p-0 bg-blue-100 hover:bg-blue-200 text-blue-600"
                            title="Rich Text Editor"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeColumn(cellIndex)}
                          className="h-7 w-7 p-0 bg-red-100 hover:bg-red-200 text-red-600"
                          title="Xóa cột"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </td>
                ))}
                {!row.cells[0]?.isHeader && (
                  <td className="border-b border-gray-200 p-2 w-12 text-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeRow(row.id)}
                      className="h-7 w-7 p-0 bg-red-100 hover:bg-red-200 text-red-600"
                      title="Xóa hàng"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rich Text Editor Modal */}
      <Modal
        isOpen={!!editingCell}
        onClose={() => setEditingCell(null)}
        title="Chỉnh sửa nội dung ô"
        size="xl"
      >
        <RichTextEditor
          content={editingContent}
          onChange={setEditingContent}
          className="mb-4"
        />
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={() => setEditingCell(null)}>
            Hủy
          </Button>
          <Button onClick={() => saveRichEdit(editingContent)}>
            Lưu
          </Button>
        </div>
      </Modal>
    </div>
  );
}
