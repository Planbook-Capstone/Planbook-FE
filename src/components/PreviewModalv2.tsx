"use client";

import { Share2 } from "lucide-react";
import { Button } from "./ui/Button";
import { DowloadIcon } from "@/constants/icon";
import { useUploadDocxToOnlineService } from "@/services/lessonPlanGenerationServices";
import { useState } from "react";
import ConfirmSaveResult from "./modals/ConfirmSaveResult";

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
  description?: string | null; // New field for image descriptions
  fieldType: "INPUT" | "TABLE" | "IMAGE" | "QUESTION_BANK";
  type:
    | "PARAGRAPH"
    | "LIST_ITEM"
    | "TABLE"
    | "IMAGE"
    | "SECTION"
    | "SUBSECTION"
    | "QUESTION_BANK";
  orderIndex: number;
  metadata?: any;
  status: "ACTIVE" | "DELETED";
  children: DemoNode[];
}

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DemoNode[];
  onDownload: () => void;
  lesson: any;
  mode?: boolean;
  onSaveResult?: (data: any) => void;
  currentResultData?: any;
}

export default function PreviewModal({
  isOpen,
  onClose,
  data,
  onDownload,
  lesson,
  mode = true,
  onSaveResult,
  currentResultData,
}: PreviewModalProps) {
  if (!isOpen) return null;
  const { mutate } = useUploadDocxToOnlineService();

  // State for confirm save result modal
  const [showConfirmSaveResult, setShowConfirmSaveResult] = useState(false);

  // Handler to open confirm save result modal
  const handleConfirmSaveResult = () => {
    setShowConfirmSaveResult(true);
  };

  // Handler to close confirm save result modal
  const handleCloseConfirmSaveResult = () => {
    setShowConfirmSaveResult(false);
  };

  // Handler for when user confirms save in the modal
  const handleSaveConfirm = (formData: any) => {
    if (onSaveResult) {
      onSaveResult(formData);
    } else {
      console.log("Save confirmed with data:", formData);
    }
    setShowConfirmSaveResult(false);
  };
  // Extract table rendering logic into separate function
  const renderTablePreview = (
    node: DemoNode,
    marginLeft: number,
    depth: number
  ): React.ReactNode => {
    // Parse table data from content field if it's a JSON string (same logic as NodeRenderer)
    let tableData: TableData;
    try {
      if (node.content && typeof node.content === "string") {
        const parsedContent = JSON.parse(node.content);

        // Convert API format to our TableData format
        if (parsedContent.rows && Array.isArray(parsedContent.rows)) {
          const headers: string[] = [];
          const rows: string[][] = [];

          // First pass: extract headers from header row
          const headerRow = parsedContent.rows.find(
            (row: any) =>
              row.cells && row.cells.some((cell: any) => cell.isHeader)
          );

          if (headerRow && headerRow.cells) {
            headerRow.cells.forEach((cell: any) => {
              if (cell.isHeader) {
                // Decode HTML entities and extract text content
                let headerText = cell.title || cell.content || "";
                headerText = headerText
                  .replace(/&lt;/g, "<")
                  .replace(/&gt;/g, ">");
                headerText = headerText.replace(/<[^>]*>/g, ""); // Remove HTML tags
                headerText = headerText.replace(/\n/g, " ").trim();
                headers.push(headerText || `Cột ${headers.length + 1}`);
              }
            });
          }

          // Second pass: extract data rows (non-header rows)
          parsedContent.rows.forEach((row: any) => {
            if (row.cells && !row.cells.some((cell: any) => cell.isHeader)) {
              const rowData: string[] = [];

              row.cells.forEach((cell: any) => {
                // Handle regular cells - combine title and content with HTML
                let titleText = cell.title || "";
                let contentText = cell.content || "";

                // Decode HTML entities
                titleText = titleText
                  .replace(/&lt;/g, "<")
                  .replace(/&gt;/g, ">");
                contentText = contentText
                  .replace(/&lt;/g, "<")
                  .replace(/&gt;/g, ">");

                // Combine title and content, keeping HTML formatting
                let combinedText = "";
                if (titleText && contentText) {
                  combinedText = `${titleText} ${contentText}`;
                } else {
                  combinedText = titleText || contentText;
                }

                rowData.push(combinedText);
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
            rows:
              rows.length > 0
                ? rows
                : [
                    ["", ""],
                    ["", ""],
                  ],
          };
        } else {
          // Fallback to default
          tableData = {
            headers: ["Cột 1", "Cột 2"],
            rows: [
              ["", ""],
              ["", ""],
            ],
          };
        }
      } else {
        // Use default if no content available
        tableData = {
          headers: ["Cột 1", "Cột 2"],
          rows: [
            ["", ""],
            ["", ""],
          ],
        };
      }
    } catch (error) {
      console.error("Error parsing table content in preview:", error);
      // Fallback to default
      tableData = {
        headers: ["Cột 1", "Cột 2"],
        rows: [
          ["", ""],
          ["", ""],
        ],
      };
    }

    return (
      <div
        key={node.id}
        style={{ marginLeft: `${marginLeft}px` }}
        className="mb-4"
      >
        {node.title &&
          node.title !== "Mới: Table" &&
          (node.type === "SUBSECTION" ? (
            <h2 className="text-xl font-semibold text-black mb-3">
              {node.title}
            </h2>
          ) : (
            <h3 className="text-lg font-medium text-black mb-2">
              {node.title}
            </h3>
          ))}
        <div className="border border-gray-400">
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr className="bg-gray-100">
                {tableData.headers.map((header, index) => (
                  <th
                    key={index}
                    className="border border-gray-400 px-3 py-2 text-left font-semibold w-auto"
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
                    let cellContent: React.ReactNode = "";
                    try {
                      if (typeof cell === "string") {
                        // Check if it's HTML content
                        if (cell.includes("<") && cell.includes(">")) {
                          cellContent = (
                            <div
                              className="prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: cell }}
                            />
                          );
                        } else {
                          cellContent = cell;
                        }
                      } else if (cell && typeof cell === "object") {
                        if ("text" in cell || "image" in cell) {
                          // New CellContent format
                          const cellContent_obj = cell as CellContent;
                          if (cellContent_obj.image) {
                            cellContent = `[Hình ảnh: ${
                              cellContent_obj.image.name || "image"
                            }]`;
                          } else {
                            const text = cellContent_obj.text || "";
                            if (text.includes("<") && text.includes(">")) {
                              cellContent = (
                                <div
                                  className="prose prose-sm max-w-none"
                                  dangerouslySetInnerHTML={{ __html: text }}
                                />
                              );
                            } else {
                              cellContent = text;
                            }
                          }
                        } else if ("type" in cell && "content" in cell) {
                          // Old format compatibility
                          const oldCell = cell as any;
                          if (oldCell.type === "image") {
                            cellContent = `[Hình ảnh: ${oldCell.content}]`;
                          } else {
                            const content = oldCell.content || "";
                            if (
                              content.includes("<") &&
                              content.includes(">")
                            ) {
                              cellContent = (
                                <div
                                  className="prose prose-sm max-w-none"
                                  dangerouslySetInnerHTML={{ __html: content }}
                                />
                              );
                            } else {
                              cellContent = content;
                            }
                          }
                        }
                      }
                    } catch (error) {
                      console.error("Error rendering cell:", error, cell);
                      cellContent = String(cell || "");
                    }

                    return (
                      <td
                        key={colIndex}
                        className="border border-gray-400 px-3 py-2 w-auto"
                      >
                        {cellContent}
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

    if (node.fieldType === "TABLE") {
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
            {node.content && node.content.trim() !== "" && (
              <div className="text-base text-gray-700 mb-4 leading-relaxed">
                {node.content.includes("<") && node.content.includes(">") ? (
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: node.content }}
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{node.content}</p>
                )}
              </div>
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
            {node.content && node.content.trim() !== "" && (
              <div className="text-base text-gray-700 mb-3 leading-relaxed">
                {node.content.includes("<") && node.content.includes(">") ? (
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: node.content }}
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{node.content}</p>
                )}
              </div>
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
            <div className="text-base text-gray-700 leading-relaxed">
              {node.content &&
              node.content.includes("<") &&
              node.content.includes(">") ? (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: node.content }}
                />
              ) : (
                <p className="whitespace-pre-wrap">{node.content || ""}</p>
              )}
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

      case "LIST_ITEM":
        return (
          <div
            key={node.id}
            style={{ marginLeft: `${marginLeft}px` }}
            className="mb-2 flex flex-col h-full  "
          >
            <div className="flex flex-col items-start gap-2 w-full">
              <span className="text-black font-bold flex-shrink-0">
                {node.title || "Item"}:
              </span>
              <div className="text-gray-700 leading-relaxed flex-1 pl-6">
                {node.content &&
                node.content.includes("<") &&
                node.content.includes(">") ? (
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: node.content }}
                  />
                ) : (
                  <span className="whitespace-pre-wrap">
                    {node.content || ""}
                  </span>
                )}
              </div>
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
                {/* Display description if exists */}
                {node.description && (
                  <div className="text-center text-sm text-gray-600 italic mt-2">
                    {node.description}
                  </div>
                )}
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

      case "QUESTION_BANK":
        return (
          <div
            key={node.id}
            style={{ marginLeft: `${marginLeft}px` }}
            className="mb-4"
          >
            {node.title && node.title !== "Mới: Question Bank" && (
              <h3 className="text-lg font-medium text-black mb-2">
                {node.title}
              </h3>
            )}
            {node.content &&
              node.content !== "Nhập câu hỏi của bạn ở đây..." && (
                <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-600 font-medium text-sm">
                      Câu hỏi:
                    </span>
                  </div>
                  <div className="text-base text-gray-700 leading-relaxed">
                    <div
                      className="whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html:
                          node.content
                            ?.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                            ?.replace(/(\w)(\d+)/g, "$1<sub>$2</sub>") || "",
                      }}
                    />
                  </div>
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
    <div>
      <div className="h-full">
        {/* Document Content */}
        <div className="flex-1 ">
          <div
            className="max-w-4xl mx-auto bg-white "
            style={{ minHeight: "297mm" }}
          >
            {/* Document Paper */}
            <div
              className="bg-white p-12"
              // style={{
              //   width: "210mm",
              //   minHeight: "297mm",
              //   margin: "20px auto",
              //   boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              //   fontFamily: "Times New Roman, serif",
              // }}
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
                    {" " + lesson?.name?.toUpperCase()}
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

      {/* Confirm Save Result Modal */}
      <ConfirmSaveResult
        isOpen={showConfirmSaveResult}
        onClose={handleCloseConfirmSaveResult}
        onConfirm={handleSaveConfirm}
        data={data}
        resultId={currentResultData?.id}
        initialName={currentResultData?.name || ""}
        initialDescription={currentResultData?.description || ""}
      />
    </div>
  );
}
