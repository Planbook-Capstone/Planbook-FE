"use client";

import { useCallback, useEffect, useRef } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Table } from "@/components/organisms/table";

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

interface NodeRendererProps {
  node: DemoNode;
  depth?: number;
  showDeleteButtons: boolean;
  onDeleteNode: (nodeId: string) => void;
  onUpdateNodeTitle: (nodeId: string, title: string) => void;
  onUpdateNodeContent: (nodeId: string, content: string) => void;
  onUpdateTableData?: (nodeId: string, tableData: TableData) => void;
}

// Auto-resize textarea component
interface AutoResizeTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function AutoResizeTextarea({ value, onChange, placeholder, className }: AutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "24px"; // Reset to min height
      textarea.style.height = Math.max(24, textarea.scrollHeight) + "px";
    }
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    adjustHeight();
  };

  return (
    <textarea
      ref={textareaRef}
      className={className}
      placeholder={placeholder}
      value={value}
      rows={1}
      onChange={handleChange}
    />
  );
}

export default function NodeRenderer({
  node,
  depth = 0,
  showDeleteButtons,
  onDeleteNode,
  onUpdateNodeTitle,
  onUpdateNodeContent,
  onUpdateTableData,
}: NodeRendererProps) {
  // Get drop zone colors based on depth level
  const getDropZoneColors = (depth: number) => {
    const colors = [
      { border: "border-blue-500", bg: "bg-blue-50" }, // Level 0 - Blue
      { border: "border-green-500", bg: "bg-green-50" }, // Level 1 - Green
      { border: "border-purple-500", bg: "bg-purple-50" }, // Level 2 - Purple
    ];
    return colors[depth % colors.length];
  };

  // Render field based on fieldType and type
  const renderField = useCallback(
    (node: DemoNode) => {
      // Special rendering for SECTION and SUBSECTION - editable titles
      if (node.type === "SECTION") {
        return (
          <div className="section-field">
            <input
              type="text"
              className="text-xl font-bold text-gray-800 bg-transparent outline-none w-full "
              value={node.title || ""}
              onChange={(e) => onUpdateNodeTitle(node.id, e.target.value)}
              placeholder="Nhập tiêu đề section..."
            />
            {node.content && (
              <div className="mt-2 text-gray-600 text-sm">{node.content}</div>
            )}
          </div>
        );
      }

      if (node.type === "SUBSECTION") {
        return (
          <div className="subsection-field">
            <input
              type="text"
              className="text-lg font-semibold text-gray-700 bg-transparent outline-none w-full pb-1"
              value={node.title || ""}
              onChange={(e) => onUpdateNodeTitle(node.id, e.target.value)}
              placeholder="Nhập tiêu đề subsection..."
            />
            {node.content && (
              <div className=" text-gray-600 text-sm">{node.content}</div>
            )}
          </div>
        );
      }

      // Regular field rendering based on fieldType
      switch (node.fieldType) {
        case "INPUT":
          return (
            <AutoResizeTextarea
              className="w-full dotted-input text-blue-600 resize-none overflow-hidden min-h-[24px] border-none outline-none bg-transparent leading-tight"
              placeholder="............................................"
              value={node.content || ""}
              onChange={(value) => onUpdateNodeContent(node.id, value)}
            />
          );
        case "TABLE":
          // Parse table data from content field if it's a JSON string
          let tableData: TableData;
          try {
            if (node.content && typeof node.content === 'string') {
              console.log("Parsing table content for node:", node.id, node.content);
              const parsedContent = JSON.parse(node.content);
              console.log("Parsed content:", parsedContent);
              // Convert API format to our TableData format
              if (parsedContent.rows && Array.isArray(parsedContent.rows)) {
                const headers: string[] = [];
                const rows: string[][] = [];

                parsedContent.rows.forEach((row: any, rowIndex: number) => {
                  if (row.cells && Array.isArray(row.cells)) {
                    const rowData: string[] = [];
                    row.cells.forEach((cell: any, cellIndex: number) => {
                      // Handle header row
                      if (cell.isHeader) {
                        if (rowIndex === 0) {
                          // Decode HTML entities and extract text content
                          const headerText = cell.title || cell.content || `Cột ${cellIndex + 1}`;
                          headers.push(headerText.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
                        }
                      } else {
                        // Handle regular cells - decode HTML and extract text
                        let cellText = cell.title || cell.content || "";
                        // Decode HTML entities
                        cellText = cellText.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                        // Remove HTML tags for display
                        cellText = cellText.replace(/<[^>]*>/g, '');
                        // Clean up whitespace
                        cellText = cellText.replace(/\n/g, ' ').trim();
                        rowData.push(cellText);
                      }
                    });

                    // Only add non-header rows to rows array
                    if (!row.cells.some((cell: any) => cell.isHeader)) {
                      rows.push(rowData);
                    }
                  }
                });

                tableData = {
                  headers: headers.length > 0 ? headers : ["Cột 1", "Cột 2"],
                  rows: rows.length > 0 ? rows : [["", ""], ["", ""]]
                };
                console.log("Final table data:", tableData);
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
            console.error("Error parsing table content:", error);
            // Fallback to default or existing tableData
            tableData = node.tableData || {
              headers: ["Cột 1", "Cột 2"],
              rows: [["", ""], ["", ""]]
            };
          }

          // Ensure all cells are strings for simplicity
          const convertedTableData: TableData = {
            headers: tableData.headers,
            rows: tableData.rows.map((row) =>
              row.map((cell) => {
                if (typeof cell === "string") {
                  return cell;
                } else if (cell && typeof cell === "object") {
                  if ("type" in cell && "content" in cell) {
                    // Convert old format {type: 'text', content: 'value'} to string
                    const oldCell = cell as any;
                    return oldCell.content || "";
                  } else if ("text" in cell) {
                    // Convert new format to string for now
                    return (cell as any).text || "";
                  }
                }
                return "";
              })
            ),
          };

          const handleTableDataChange = (newTableData: TableData) => {
            if (onUpdateTableData) {
              // Convert TableData back to API format and save to content
              const apiFormat = {
                rows: [
                  // Header row
                  {
                    id: "header-row",
                    cells: newTableData.headers.map((header, index) => ({
                      id: `h${index + 1}`,
                      title: header,
                      content: "",
                      isHeader: true
                    }))
                  },
                  // Data rows
                  ...newTableData.rows.map((row, rowIndex) => ({
                    id: `row-${rowIndex + 1}`,
                    cells: row.map((cell, cellIndex) => ({
                      id: `r${rowIndex + 1}c${cellIndex + 1}`,
                      title: typeof cell === 'string' ? cell : (cell?.text || ""),
                      content: ""
                    }))
                  }))
                ],
                columns: newTableData.headers.length
              };

              // Update both tableData and content
              onUpdateTableData(node.id, newTableData);
              // Also update content with JSON string
              if (onUpdateNodeContent) {
                onUpdateNodeContent(node.id, JSON.stringify(apiFormat));
              }
            }
          };

          return (
            <div className="field-table w-full">
              <Table
                initialData={convertedTableData}
                onDataChange={handleTableDataChange}
                showControls={true}
                minRows={1}
                minCols={2}
                maxRows={10}
                maxCols={5}
              />
            </div>
          );
        case "IMAGE":
          return (
            <div
              className="field-image w-full"
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add("border-blue-500", "bg-blue-50");
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove(
                  "border-blue-500",
                  "bg-blue-50"
                );
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove(
                  "border-blue-500",
                  "bg-blue-50"
                );

                const imageUrl = e.dataTransfer.getData("text/plain");
                if (imageUrl) {
                  onUpdateNodeContent(node.id, imageUrl);
                }
              }}
            >
              {node.content ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center bg-white hover:border-gray-400 transition-colors">
                  <img
                    src={node.content}
                    alt="Uploaded image"
                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-sm"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  <div className="hidden text-red-500 text-sm mt-2">
                    Không thể tải hình ảnh
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    Kéo hình ảnh khác để thay thế
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-colors">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p className="text-gray-500">
                    Kéo hình ảnh từ panel bên trái vào đây
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Hoặc click để chọn file
                  </p>
                </div>
              )}
            </div>
          );
        default:
          return (
            <div className="field-default">
              <span className="text-gray-500 text-sm">
                Không xác định fieldType: {node.fieldType}
              </span>
            </div>
          );
      }
    },
    [onUpdateNodeContent, onUpdateNodeTitle]
  );

  const isNewComponent = node.metadata?.isNew === true;
  const dropColors = getDropZoneColors(depth);

  // Special styling for sections to make drop zones more visible
  const isSection = node.type === "SECTION" || node.type === "SUBSECTION";
  const sectionClass = isSection ? " pl-4" : "";

  return (
    <div
      className={`relative group rounded-lg mb-2 bg-white px-2 ${sectionClass}`}
    >
      {/* Data source indicator - only show for new components */}
      {isNewComponent && (
        <div className="absolute top-2 right-8">
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
            Mới
          </span>
        </div>
      )}

      {/* Delete button - show when showDeleteButtons is true */}
      {showDeleteButtons && (
        <button
          onClick={() => onDeleteNode(node.id.toString())}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
        >
          ×
        </button>
      )}

      {/* Title input - only show for non-Section/Subsection/ListItem types */}
      {node.type !== "SECTION" &&
        node.type !== "SUBSECTION" &&
        node.type !== "LIST_ITEM" && (
          <div className="mb-2">
            <input
              type="text"
              className="font-calsans  border-none outline-none bg-transparent w-full"
              value={node.title}
              onChange={(e) => onUpdateNodeTitle(node.id, e.target.value)}
              placeholder="Nhập tiêu đề..."
            />
          </div>
        )}

      {/* Special rendering for LIST_ITEM with flex layout */}
      {node.type === "LIST_ITEM" && (
        <div className="flex items-start gap-3 flex-wrap">
          <div className="flex items-center gap-1 flex-shrink-0">
            <input
              type="text"
              className="font-medium border-none outline-none bg-transparent w-auto min-w-[80px]"
              value={node.title}
              onChange={(e) => onUpdateNodeTitle(node.id, e.target.value)}
              placeholder="Tiêu đề..."
              size={Math.max(node.title?.length || 8, 8)}
            />
            <span className="text-gray-600">:</span>
          </div>
          <div className="flex-1 min-w-0">{renderField(node)}</div>
        </div>
      )}

      {/* Regular field rendering for non-LIST_ITEM types */}
      {node.type !== "LIST_ITEM" && renderField(node)}

      {/* Drop zone for this node */}
      <Droppable droppableId={`node-${node.id}`}>
        {(provided: any, snapshot: any) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`mt-2 rounded-lg transition-all duration-200 ${
              snapshot.isDraggingOver
                ? `border-2 border-dashed ${dropColors.border} ${dropColors.bg} min-h-[40px] p-2`
                : "min-h-[8px] border-0 bg-transparent"
            }`}
          >
            {node.children && node.children.length > 0 ? (
              <div className="space-y-1">
                {node.children
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((child, index) => (
                    <Draggable
                      key={child.id}
                      draggableId={child.id.toString()}
                      index={index}
                    >
                      {(provided: any, snapshot: any) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`ml-4 ${
                            snapshot.isDragging ? "opacity-50" : ""
                          }`}
                        >
                          <NodeRenderer
                            node={child}
                            depth={depth + 1}
                            showDeleteButtons={showDeleteButtons}
                            onDeleteNode={onDeleteNode}
                            onUpdateNodeTitle={onUpdateNodeTitle}
                            onUpdateNodeContent={onUpdateNodeContent}
                            onUpdateTableData={onUpdateTableData}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
              </div>
            ) : (
              snapshot.isDraggingOver && (
                <div className="flex items-center justify-center text-gray-400 text-sm h-8">
                  <span className="font-medium text-gray-600">
                    🎯 Thả vào đây để thêm con (Cấp {depth + 1})
                  </span>
                </div>
              )
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
