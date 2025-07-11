"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { DowloadIcon } from "@/constants/icon";

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

interface DemoNode {
  id: string;
  lessonPlanId?: number;
  parentId?: string | null;
  title: string;
  content: string;
  fieldType: "INPUT" | "TABLE" | "IMAGE";
  type:
    | "PARAGRAPH"
    | "LIST_ITEM"
    | "TABLE"
    | "IMAGE"
    | "SECTION"
    | "SUBSECTION";
  orderIndex: number;
  metadata?: any;
  status: "ACTIVE" | "DELETED";
  children: DemoNode[];
  tableData?: TableData;
}

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DemoNode[];
  onDownload: () => void;
}

export default function PreviewModal({
  isOpen,
  onClose,
  data,
  onDownload,
}: PreviewModalProps) {
  if (!isOpen) return null;

  // Extract table rendering logic into separate function
  const renderTablePreview = (node: DemoNode, marginLeft: number, depth: number): React.ReactNode => {
    // Parse table data from content field if it's a JSON string (same logic as NodeRenderer)
    let tableData: TableData;
    try {
      if (node.content && typeof node.content === 'string') {
        const parsedContent = JSON.parse(node.content);

        // Convert API format to our TableData format
        if (parsedContent.rows && Array.isArray(parsedContent.rows)) {
          const headers: string[] = [];
          const rows: string[][] = [];

          // First pass: extract headers from header row
          const headerRow = parsedContent.rows.find((row: any) =>
            row.cells && row.cells.some((cell: any) => cell.isHeader)
          );

          if (headerRow && headerRow.cells) {
            headerRow.cells.forEach((cell: any) => {
              if (cell.isHeader) {
                // Decode HTML entities and extract text content
                let headerText = cell.title || cell.content || "";
                headerText = headerText.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                headerText = headerText.replace(/<[^>]*>/g, ''); // Remove HTML tags
                headerText = headerText.replace(/\n/g, ' ').trim();
                headers.push(headerText || `Cột ${headers.length + 1}`);
              }
            });
          }

          // Second pass: extract data rows (non-header rows)
          parsedContent.rows.forEach((row: any) => {
            if (row.cells && !row.cells.some((cell: any) => cell.isHeader)) {
              const rowData: string[] = [];

              row.cells.forEach((cell: any) => {
                // Handle regular cells - decode HTML and extract text
                let cellText = cell.title || cell.content || "";
                // Decode HTML entities
                cellText = cellText.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                // Remove HTML tags for display
                cellText = cellText.replace(/<[^>]*>/g, '');
                // Clean up whitespace
                cellText = cellText.replace(/\n/g, ' ').trim();
                rowData.push(cellText);
              });

              // Ensure row has same number of cells as headers
              while (rowData.length < headers.length) {
                rowData.push("");
              }
              rows.push(rowData);
            }
          });

          tableData = {
            headers: headers.length > 0 ? headers : ["Cột 1", "Cột 2"],
            rows: rows.length > 0 ? rows : [["", ""], ["", ""]]
          };
        } else {
          // Fallback to default
          tableData = {
            headers: ["Cột 1", "Cột 2"],
            rows: [["", ""], ["", ""]]
          };
        }
      } else {
        // Use tableData if available, otherwise default
        tableData = node.tableData || {
          headers: ["Cột 1", "Cột 2"],
          rows: [["", ""], ["", ""]]
        };
      }
    } catch (error) {
      console.error("Error parsing table content in preview:", error);
      // Fallback to default or existing tableData
      tableData = node.tableData || {
        headers: ["Cột 1", "Cột 2"],
        rows: [["", ""], ["", ""]]
      };
    }

    return (
      <div
        key={node.id}
        style={{ marginLeft: `${marginLeft}px` }}
        className="mb-4"
      >
        {node.title && node.title !== "Mới: Table" && (
          <h3 className="text-lg font-medium text-black mb-2">
            {node.title}
          </h3>
        )}
        <div className="border border-gray-400">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {tableData.headers.map((header, index) => (
                  <th
                    key={index}
                    className="border border-gray-400 px-3 py-2 text-left font-semibold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => {
                    let cellText = "";
                    try {
                      if (typeof cell === "string") {
                        cellText = cell;
                      } else if (cell && typeof cell === "object") {
                        if ("text" in cell || "image" in cell) {
                          // New CellContent format
                          const cellContent = cell as CellContent;
                          if (cellContent.image) {
                            cellText = `[Hình ảnh: ${
                              cellContent.image.name || "image"
                            }]`;
                          } else {
                            cellText = cellContent.text || "";
                          }
                        } else if ("type" in cell && "content" in cell) {
                          // Old format compatibility
                          const oldCell = cell as any;
                          cellText =
                            oldCell.type === "image"
                              ? `[Hình ảnh: ${oldCell.content}]`
                              : oldCell.content;
                        }
                      }
                    } catch (error) {
                      console.error("Error rendering cell:", error, cell);
                      cellText = String(cell || "");
                    }

                    return (
                      <td
                        key={colIndex}
                        className="border border-gray-400 px-3 py-2"
                      >
                        {cellText}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {node.children && node.children.length > 0 && (
          <div className="ml-4 mt-3">
            {node.children
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((child) => renderPreviewNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderPreviewNode = (
    node: DemoNode,
    depth: number = 0
  ): React.ReactNode => {
    const marginLeft = depth * 20;

    // Debug: Log all nodes to see their properties
    console.log("🔍 PreviewModal node:", {
      id: node.id,
      type: node.type,
      fieldType: node.fieldType,
      title: node.title,
      hasContent: !!node.content,
      contentPreview: node.content?.substring(0, 50) + "..."
    });

    // Check fieldType first for TABLE (regardless of node.type)
    if (node.fieldType === "TABLE") {
      console.log("🎯 PreviewModal: Rendering table for node", node.id, "fieldType:", node.fieldType, "type:", node.type);
      return renderTablePreview(node, marginLeft, depth);
    }

    switch (node.type) {
      case "SECTION":
        return (
          <div
            key={node.id}
            style={{ marginLeft: `${marginLeft}px` }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold text-black mb-4 border-b-2 border-gray-300 pb-2">
              {node.title || "Untitled Section"}
            </h1>
            {node.content && (
              <p className="text-base text-gray-700 mb-4 leading-relaxed">
                {node.content}
              </p>
            )}
            {node.children && node.children.length > 0 && (
              <div className="ml-0">
                {node.children
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((child) => renderPreviewNode(child, depth))}
              </div>
            )}
          </div>
        );

      case "SUBSECTION":
        return (
          <div
            key={node.id}
            style={{ marginLeft: `${marginLeft}px` }}
            className="mb-4"
          >
            <h2 className="text-xl font-semibold text-black mb-3">
              {node.title || "Untitled Subsection"}
            </h2>
            {node.content && (
              <p className="text-base text-gray-700 mb-3 leading-relaxed">
                {node.content}
              </p>
            )}
            {node.children && node.children.length > 0 && (
              <div className="ml-4">
                {node.children
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((child) => renderPreviewNode(child, depth + 1))}
              </div>
            )}
          </div>
        );

      case "PARAGRAPH":
        return (
          <div
            key={node.id}
            style={{ marginLeft: `${marginLeft}px` }}
            className="mb-4"
          >
            {node.title && node.title !== "Mới: Text/Paragraph" && (
              <h3 className="text-lg font-medium text-black mb-2">
                {node.title}
              </h3>
            )}
            <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
              {node.content || ""}
            </p>
            {node.children && node.children.length > 0 && (
              <div className="ml-4 mt-3">
                {node.children
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((child) => renderPreviewNode(child, depth + 1))}
              </div>
            )}
          </div>
        );

      case "LIST_ITEM":
        return (
          <div
            key={node.id}
            style={{ marginLeft: `${marginLeft}px` }}
            className="mb-2"
          >
            <div className="flex items-start gap-2">
              <span className="text-black font-medium flex-shrink-0">
                {node.title || "Item"}:
              </span>
              <span className="text-gray-700 leading-relaxed">
                {node.content || ""}
              </span>
            </div>
            {node.children && node.children.length > 0 && (
              <div className="ml-6 mt-2">
                {node.children
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((child) => renderPreviewNode(child, depth + 1))}
              </div>
            )}
          </div>
        );



      case "IMAGE":
        return (
          <div
            key={node.id}
            style={{ marginLeft: `${marginLeft}px` }}
            className="mb-4"
          >
            {node.title && node.title !== "Mới: Image" && (
              <h3 className="text-lg font-medium text-black mb-2">
                {node.title}
              </h3>
            )}
            {node.content ? (
              <div className="border border-gray-300 bg-white p-4 rounded">
                <img
                  src={node.content}
                  alt={node.title || "Image"}
                  className="max-w-full max-h-96 mx-auto rounded shadow-sm"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.nextElementSibling?.classList.remove("hidden");
                  }}
                />
                <div className="hidden text-center text-red-500 text-sm mt-2">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p>Không thể tải hình ảnh</p>
                </div>
              </div>
            ) : (
              <div className="border border-gray-300 bg-gray-50 p-8 text-center rounded">
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-gray-500">Chưa có hình ảnh</p>
              </div>
            )}
            {node.children && node.children.length > 0 && (
              <div className="ml-4 mt-3">
                {node.children
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((child) => renderPreviewNode(child, depth + 1))}
              </div>
            )}
          </div>
        );

      default:
        return <div key={node.id}></div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Xem trước giáo án
          </h2>
          <div className="flex items-center gap-3">
            {/* <Button
              onClick={onDownload}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center gap-2"
            >
              📥 Download DOCX
            </Button> */}
            <Button onClick={onDownload}>
              {DowloadIcon}
              <span>Tải về</span>
            </Button>
            <Button onClick={onClose} variant={"outline"}>
              Đóng
            </Button>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-y-auto">
          <div
            className="max-w-4xl mx-auto bg-white "
            style={{ minHeight: "297mm" }}
          >
            {/* Document Paper */}
            <div
              className="bg-white p-12"
              style={{
                width: "210mm",
                minHeight: "297mm",
                margin: "20px auto",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                fontFamily: "Times New Roman, serif",
              }}
            >
              {/* Header thông tin bài dạy */}
              <div className="text-center space-y-4 mb-8">
                <div className="font-bold text-lg">Phụ lục IV</div>
                <div className="font-bold text-xl">KHUNG KẾ HOẠCH BÀI DẠY</div>
                <div className="text-sm text-gray-600 italic">
                  (Kèm theo Công văn số 5512/BGDĐT-GDTrH ngày 18 tháng 12 năm
                  2020 của Bộ GDĐT)
                </div>
              </div>

              {/* Thông tin chung */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <div>Trường:.......................</div>
                  <div>Họ và tên giáo viên:</div>
                </div>
                <div className="flex justify-between">
                  <div>Tổ:..............................</div>
                  <div>................................</div>
                </div>

                <div className="text-center space-y-2 mt-6">
                  <div className="font-bold text-lg">
                    TÊN BÀI DẠY:
                    ................................................
                  </div>
                  <div>
                    Môn học/Hoạt động giáo dục: ..........; lớp:........
                  </div>
                  <div>Thời gian thực hiện: (số tiết)</div>
                </div>
              </div>

              {data.length === 0 ? (
                <div className="text-center text-gray-500 py-20">
                  <p className="text-lg">Không có nội dung để hiển thị</p>
                </div>
              ) : (
                <div>
                  {data
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((node) => renderPreviewNode(node, 0))}

                  {/* Ghi chú */}
                  <div className="space-y-3 text-sm text-gray-700 border-t pt-6 mt-8">
                    <div className="font-bold">Ghi chú:</div>
                    <div className="space-y-2">
                      <div>
                        1. Mỗi bài dạy có thể được thực hiện trong nhiều tiết
                        học, bảo đảm đủ thời gian dành cho mỗi hoạt động để học
                        sinh thực hiện hiệu quả.
                      </div>
                      <div>
                        2. Trong Kế hoạch bài dạy không cần nêu cụ thể lời nói
                        của giáo viên, học sinh mà tập trung mô tả rõ hoạt động
                        cụ thể.
                      </div>
                      <div>
                        3. Việc kiểm tra, đánh giá thường xuyên được thực hiện
                        trong quá trình tổ chức các hoạt động học.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
