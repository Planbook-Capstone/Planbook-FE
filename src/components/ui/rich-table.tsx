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
  title: string;
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
        {
          id: "h1",
          title: "HOẠT ĐỘNG CỦA GIÁO VIÊN",
          content: "<p>Mô tả các hoạt động của giáo viên trong tiết học</p>",
          isHeader: true
        },
        {
          id: "h2",
          title: "HOẠT ĐỘNG CỦA HỌC SINH",
          content: "<p>Mô tả các hoạt động của học sinh trong tiết học</p>",
          isHeader: true
        },
      ],
    },
    {
      id: "row-1",
      cells: [
        {
          id: "r1c1",
          title: "Bước 1: Chuyển giao nhiệm vụ học tập",
          content: "<p>Nội dung chi tiết về bước 1</p>"
        },
        {
          id: "r1c2",
          title: "Hoạt động của học sinh",
          content: "<p>Học sinh thực hiện các hoạt động được giao</p>"
        },
      ],
    },
    {
      id: "row-2",
      cells: [
        {
          id: "r2c1",
          title: "Bước 2: Thực hiện nhiệm vụ",
          content: "<p>Nội dung chi tiết về bước 2</p>"
        },
        {
          id: "r2c2",
          title: "Phản hồi của học sinh",
          content: "<p>Học sinh phản hồi và thảo luận</p>"
        },
      ],
    },
  ],
  columns: 2,
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

  const updateCell = useCallback(
    (rowId: string, cellId: string, content: string) => {
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
    },
    []
  );

  const updateCellTitle = useCallback(
    (rowId: string, cellId: string, title: string) => {
      setTableData((prev) => ({
        ...prev,
        rows: prev.rows.map((row) =>
          row.id === rowId
            ? {
                ...row,
                cells: row.cells.map((cell) =>
                  cell.id === cellId ? { ...cell, title } : cell
                ),
              }
            : row
        ),
      }));
    },
    []
  );

  const addRow = useCallback(() => {
    const newRowId = `row-${Date.now()}`;
    const newCells: TableCell[] = Array.from(
      { length: tableData.columns },
      (_, i) => ({
        id: `${newRowId}-c${i}`,
        title: `Tiêu đề ${i + 1}`,
        content: "<p>Nội dung mới</p>",
      })
    );

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
            title: rowIndex === 0 ? `Cột ${prev.columns + 1}` : `Tiêu đề mới`,
            content: rowIndex === 0 ? "<p>Mô tả cột mới</p>" : "<p>Nội dung mới</p>",
            isHeader: rowIndex === 0,
          },
        ],
      })),
    }));
  }, []);

  const removeRow = useCallback(
    (rowId: string) => {
      if (tableData.rows.length <= 1) return;
      setTableData((prev) => ({
        ...prev,
        rows: prev.rows.filter((row) => row.id !== rowId),
      }));
    },
    [tableData.rows.length]
  );

  const removeColumn = useCallback(
    (columnIndex: number) => {
      if (tableData.columns <= 1) return;
      setTableData((prev) => ({
        ...prev,
        columns: prev.columns - 1,
        rows: prev.rows.map((row) => ({
          ...row,
          cells: row.cells.filter((_, index) => index !== columnIndex),
        })),
      }));
    },
    [tableData.columns]
  );

  const openRichEditor = useCallback(
    (cellId: string, currentContent: string) => {
      setEditingCell(cellId);
      // Strip HTML tags for editing
      const plainText = currentContent.replace(/<[^>]*>/g, "");
      setEditingContent(plainText);
    },
    []
  );

  const saveRichEdit = useCallback(
    (content: string) => {
      if (editingCell) {
        console.log("Saving rich edit:", { editingCell, content });

        // Find the row that contains this cell
        const row = tableData.rows.find((row) =>
          row.cells.some((cell) => cell.id === editingCell)
        );

        if (row) {
          console.log("Found row:", row.id);
          // Wrap content with <p> tags if not empty
          const htmlContent = content.trim() ? `<p>${content}</p>` : "";
          updateCell(row.id, editingCell, htmlContent);
        }

        setEditingCell(null);
        setEditingContent("");
      }
    },
    [editingCell, updateCell, tableData.rows]
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Table Controls */}
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={addRow}
          variant="outline"
          className="font-questrial shadow-none py-5"
        >
          <Plus className="w-4 h-4 mr-1" />
          Thêm hàng
        </Button>
        <Button
          size="sm"
          onClick={addColumn}
          variant="outline"
          className="font-questrial shadow-none py-5"
        >
          <Plus className="w-4 h-4 mr-1" />
          Thêm cột
        </Button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <table className="w-full">
          <tbody>
            {tableData.rows.map((row, rowIndex) => (
              <tr key={row.id} className={rowIndex === 0 ? "bg-gray-50" : ""}>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={cell.id}
                    className={cn(
                      "border-r border-gray-200 p-3 min-w-[300px] relative group align-top",
                      cell.isHeader && "font-medium bg-neutral-50"
                    )}
                  >
                    <div className="min-h-[60px] flex items-start justify-between font-questrial">
                      <div className="flex-1">
                        {/* All cells now have both title and content */}
                        <div className="flex flex-col gap-2">
                          {/* Title input for all cells */}
                          <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-500 font-medium">
                              {cell.isHeader ? "Tiêu đề cột:" : "Tiêu đề:"}
                            </label>
                            <Input
                              value={cell.title}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateCellTitle(row.id, cell.id, e.target.value)
                              }
                              className="border border-gray-200 bg-white shadow-none font-questrial text-sm"
                              placeholder={cell.isHeader ? "Nhập tiêu đề cột" : "Nhập tiêu đề"}
                            />
                          </div>

                          {/* Content section for all cells */}
                          <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-500 font-medium">
                              Nội dung:
                            </label>
                            <div
                              className="cursor-pointer min-h-[40px] p-2 border border-gray-200 rounded hover:bg-gray-50 bg-white"
                              onClick={() => openRichEditor(cell.id, cell.content)}
                              dangerouslySetInnerHTML={{
                                __html:
                                  cell.content || "<p class='text-gray-400'>Nhấn để chỉnh sửa nội dung...</p>",
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1 ml-2 items-start pt-1">
                        {/* Rich text editor button for all cells */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            openRichEditor(cell.id, cell.content)
                          }
                          className="h-7 w-7 p-0 text-neutral-600"
                          title="Chỉnh sửa nội dung"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>

                        {/* Delete column button for header cells */}
                        {cell.isHeader && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeColumn(cellIndex)}
                            className="h-7 w-7 p-0 text-neutral-600"
                            title="Xóa cột"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </td>
                ))}
                {!row.cells[0]?.isHeader && (
                  <td className=" border-gray-200 p-2 w-12 text-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeRow(row.id)}
                      className="h-7 w-7 p-0 text-neutral-600"
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
        <Input
          asTextarea
          value={editingContent}
          onChange={(e: any) => setEditingContent(e.target.value)}
        />
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={() => setEditingCell(null)}>
            Hủy
          </Button>
          <Button onClick={() => saveRichEdit(editingContent)}>Lưu</Button>
        </div>
      </Modal>
    </div>
  );
}
