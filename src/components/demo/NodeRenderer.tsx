"use client";

import { useCallback, useEffect, useRef, useMemo } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Table as CustomTable } from "@/components/organisms/table";
import {
  convertBrTagsToLineBreaks,
  convertLineBreaksToBrTags,
} from "@/utils/textUtils";
import { RichTextarea } from "@/components/ui/rich-textarea";
import { ChevronUp, ChevronDown } from "lucide-react";

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
}

interface NodeRendererProps {
  node: DemoNode;
  depth?: number;
  showDeleteButtons: boolean;
  onDeleteNode: (nodeId: string) => void;
  onUpdateNodeTitle: (nodeId: string, title: string) => void;
  onUpdateNodeContent: (nodeId: string, content: string) => void;
  onUpdateNodeDescription?: (nodeId: string, description: string) => void; // New handler for description
  onMoveChildUp?: (nodeId: string) => void;
  onMoveChildDown?: (nodeId: string) => void;
  // Selection props
  isEditMode?: boolean;
  selectedNodeIds?: Set<string>;
  onNodeSelect?: (nodeId: string, isCtrlPressed: boolean) => void;
  onPaste?: (targetNodeId: string) => void;
}

// Auto-resize textarea component
interface AutoResizeTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
  className,
}: AutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Convert <br/> tags to line breaks for display
  const displayValue = useMemo(() => {
    return convertBrTagsToLineBreaks(value);
  }, [value]);

  // Convert line breaks back to <br/> tags when saving
  const handleValueChange = useCallback(
    (newValue: string) => {
      const valueWithBrTags = convertLineBreaksToBrTags(newValue);
      onChange(valueWithBrTags);
    },
    [onChange]
  );

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "24px"; // Reset to min height
      textarea.style.height = Math.max(24, textarea.scrollHeight) + "px";
    }
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [displayValue, adjustHeight]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleValueChange(e.target.value);
    adjustHeight();
  };

  return (
    <textarea
      ref={textareaRef}
      className={className}
      placeholder={placeholder}
      value={displayValue}
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
  onUpdateNodeDescription,
  onMoveChildUp,
  onMoveChildDown,
  isEditMode = false,
  selectedNodeIds = new Set(),
  onNodeSelect,
  onPaste,
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

  // Memoize table data conversion to prevent unnecessary re-renders
  const getConvertedTableData = useCallback((node: DemoNode): TableData => {
    // Parse table data from content field (prioritize content field over tableData)
    let tableData: TableData;

    // First try to parse from content field (new format)
    if (node.content && typeof node.content === "string") {
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
                  // Handle regular cells - create HTML content for Tiptap editor
                  let titleText = cell.title || "";
                  let contentText = cell.content || "";

                  // Decode HTML entities for both title and content
                  titleText = titleText
                    .replace(/&lt;/g, "<")
                    .replace(/&gt;/g, ">");
                  contentText = contentText
                    .replace(/&lt;/g, "<")
                    .replace(/&gt;/g, ">");

                  // Clean up title by removing HTML tags and whitespace
                  const cleanTitleText = titleText
                    .replace(/<[^>]*>/g, "")
                    .replace(/\n/g, " ")
                    .trim();

                  // Keep content as-is but trim whitespace
                  const cleanContentText = contentText.trim();

                  // Create HTML content for Tiptap editor
                  let cellHtml = "";
                  if (cleanTitleText && cleanContentText) {
                    // Title as bold paragraph + content as separate paragraph
                    cellHtml = `<p><strong>${cleanTitleText}</strong></p><p>${cleanContentText}</p>`;
                  } else if (cleanTitleText) {
                    // Title only as bold paragraph
                    cellHtml = `<p><strong>${cleanTitleText}</strong></p>`;
                  } else if (cleanContentText) {
                    // Content only as paragraph
                    cellHtml = `<p>${cleanContentText}</p>`;
                  } else {
                    // Empty cell
                    cellHtml = "";
                  }

                  rowData.push(cellHtml);
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
          // Fallback to default
          tableData = {
            headers: ["Cột 1", "Cột 2"],
            rows: [
              ["", ""],
              ["", ""],
            ],
          };
        }
      } catch (error) {
        console.error("Error parsing table content:", error);
        // Fallback to tableData field if available, otherwise use default
        if ((node as any).tableData) {
          console.log(
            "📋 Fallback to tableData field:",
            (node as any).tableData
          );
          tableData = (node as any).tableData;
        } else {
          tableData = {
            headers: ["Cột 1", "Cột 2"],
            rows: [
              ["", ""],
              ["", ""],
            ],
          };
        }
      }
    }
    // Fallback to tableData field if no content available
    else if ((node as any).tableData) {
      console.log(
        "📋 Using tableData field as fallback:",
        (node as any).tableData
      );
      tableData = (node as any).tableData;
    }
    // Use default if no data available
    else {
      tableData = {
        headers: ["Cột 1", "Cột 2"],
        rows: [
          ["", ""],
          ["", ""],
        ],
      };
    }

    // Return data preserving CellContent format for DOCX export
    return {
      headers: tableData.headers,
      rows: tableData.rows, // Keep original format with CellContent objects
    };
  }, []);

  // Render table field - extracted from switch case
  const renderTableField = useCallback(
    (node: DemoNode) => {
      const convertedTableData = getConvertedTableData(node);

      const handleTableDataChange = (newTableData: TableData) => {
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
                isHeader: true,
              })),
            },
            // Data rows
            ...newTableData.rows.map((row, rowIndex) => ({
              id: `row-${rowIndex + 1}`,
              cells: row.map((cell, cellIndex) => {
                let title = "";
                let content = "";

                // Handle different cell formats
                if (typeof cell === "string") {
                  // String cell - parse markdown format
                  const cellText = cell;

                  if (cellText.includes("**") && cellText.includes("\n")) {
                    const lines = cellText.split("\n");
                    const titleLine = lines.find(
                      (line) => line.startsWith("**") && line.endsWith("**")
                    );
                    const contentLine = lines.find((line) =>
                      line.startsWith("  ")
                    );

                    if (titleLine) {
                      title = titleLine.replace(/\*\*/g, "");
                    }
                    if (contentLine) {
                      content = contentLine.trim();
                    }
                  } else if (
                    cellText.startsWith("**") &&
                    cellText.endsWith("**")
                  ) {
                    // Only title format: **title**
                    title = cellText.replace(/\*\*/g, "");
                  } else {
                    // Regular content
                    content = cellText;
                  }
                } else if (cell && typeof cell === "object" && "text" in cell) {
                  // CellContent object with text and possibly image
                  const cellContent = cell as CellContent;

                  // Use text content for title/content parsing
                  const cellText = cellContent.text || "";

                  if (cellText.includes("**") && cellText.includes("\n")) {
                    const lines = cellText.split("\n");
                    const titleLine = lines.find(
                      (line) => line.startsWith("**") && line.endsWith("**")
                    );
                    const contentLine = lines.find((line) =>
                      line.startsWith("  ")
                    );

                    if (titleLine) {
                      title = titleLine.replace(/\*\*/g, "");
                    }
                    if (contentLine) {
                      content = contentLine.trim();
                    }
                  } else if (
                    cellText.startsWith("**") &&
                    cellText.endsWith("**")
                  ) {
                    title = cellText.replace(/\*\*/g, "");
                  } else {
                    content = cellText;
                  }

                  // If cell has image, store image URL in title field
                  if (cellContent.image) {
                    // Put image URL in title, text content in content
                    title = cellContent.image.url;
                    content = cellText;
                  }
                }

                return {
                  id: `r${rowIndex + 1}c${cellIndex + 1}`,
                  title: title,
                  content: content,
                };
              }),
            })),
          ],
          columns: newTableData.headers.length,
        };

        // Only update content field with JSON string
        if (onUpdateNodeContent) {
          onUpdateNodeContent(node.id, JSON.stringify(apiFormat));
        }
      };

      return (
        <div className="field-table w-full">
          <CustomTable
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
    },
    [onUpdateNodeContent, getConvertedTableData]
  );

  // Render field based on fieldType and type
  const renderField = useCallback(
    (node: DemoNode) => {
      // Check fieldType first for special cases like TABLE
      if (node.fieldType === "TABLE") {
        // Handle TABLE fieldType regardless of node.type
        return (
          <div className="field-table-container w-full">
            {/* Table title - editable */}
            {node.title && (
              <div className="mb-3">
                <input
                  type="text"
                  className="text-lg font-calsans text-gray-800 bg-transparent outline-none w-full border-gray-200 pb-1"
                  value={node.title || ""}
                  onChange={(e) => onUpdateNodeTitle(node.id, e.target.value)}
                  placeholder="Nhập tiêu đề bảng..."
                />
              </div>
            )}
            {/* Table content */}
            {renderTableField(node)}
          </div>
        );
      }

      // Special rendering for SECTION and SUBSECTION - editable titles (only if not TABLE fieldType)
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
              className="text-lg font-calsans  bg-transparent outline-none w-full pb-1"
              value={node.title || ""}
              onChange={(e) => onUpdateNodeTitle(node.id, e.target.value)}
              placeholder="Nhập tiêu đề subsection..."
            />
            {node.content && (
              <div className="pl-6">
                <RichTextarea
                  className="w-full dotted-input text-zinc-700   resize-none overflow-hidden min-h-[24px] border-none outline-none bg-transparent leading-tight"
                  placeholder="............................................"
                  value={node.content || ""}
                  onChange={(value) => onUpdateNodeContent(node.id, value)}
                />
              </div>
            )}
          </div>
        );
      }

      // Regular field rendering based on fieldType
      switch (node.fieldType) {
        case "INPUT":
          return (
            <RichTextarea
              className="w-full dotted-input text-zinc-700   resize-none overflow-hidden min-h-[24px] border-none outline-none bg-transparent leading-tight"
              placeholder="............................................"
              value={node.content || ""}
              onChange={(value) => onUpdateNodeContent(node.id, value)}
            />
          );

        case "IMAGE":
          return (
            <div className="field-image w-full">
              <div
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

              {/* Description field - only show for IMAGE type */}
              {node.type === "IMAGE" && (
                <div className="mt-2">
                  <AutoResizeTextarea
                    value={node.description || ""}
                    onChange={(value) => {
                      if (onUpdateNodeDescription) {
                        onUpdateNodeDescription(node.id, value);
                      }
                    }}
                    placeholder="Nhập mô tả cho hình ảnh..."
                    className="w-full text-sm text-gray-600 italic border-none bg-transparent resize-none focus:outline-none focus:ring-0 placeholder-gray-400"
                  />
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
    [
      onUpdateNodeContent,
      onUpdateNodeTitle,
      renderTableField,
      getConvertedTableData,
    ]
  );

  const isNewComponent = node.metadata?.isNew === true;
  const dropColors = getDropZoneColors(depth);

  // Special styling for sections to make drop zones more visible
  const isSection = node.type === "SECTION" || node.type === "SUBSECTION";
  const sectionClass = isSection ? " pl-4" : "";

  // Check if this node is selected
  const isSelected = selectedNodeIds.has(node.id);

  // Check if this node can be a paste target (all nodes can have children now)
  const canBePasteTarget = isEditMode;

  // Handle node click for selection
  const handleNodeClick = (e: React.MouseEvent) => {
    if (isEditMode && onNodeSelect) {
      // Don't select if clicking on input/textarea elements
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      e.stopPropagation();
      const isCtrlPressed = e.ctrlKey || e.metaKey;
      onNodeSelect(node.id, isCtrlPressed);
    }
  };

  // Handle paste on right click or context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Always prevent default context menu
    e.stopPropagation(); // Stop event bubbling

    console.log("🖱️ Right click on node:", node.id, "type:", node.type);
    console.log("✏️ Edit mode:", isEditMode);
    console.log("📋 Can be paste target:", canBePasteTarget);
    console.log("🔧 onPaste function exists:", !!onPaste);

    if (isEditMode && onPaste && canBePasteTarget) {
      console.log("✅ Calling onPaste for node:", node.id);
      onPaste(node.id);
    } else {
      console.log("❌ Paste not triggered - conditions not met");
      if (!isEditMode) {
        console.log("  - Not in edit mode");
      }
      if (!onPaste) {
        console.log("  - No onPaste function");
      }
      if (!canBePasteTarget) {
        console.log("  - Cannot be paste target (not in edit mode)");
      }
    }
  };

  return (
    <div
      className={`relative group rounded-lg mb-2 bg-white px-0 py-1 pl-2 ${sectionClass} ${
        isEditMode ? "cursor-pointer hover:bg-gray-50 transition-colors" : ""
      } ${isSelected ? "ring-2 ring-blue-500 bg-blue-50 shadow-md" : ""} ${
        canBePasteTarget && !isSelected && isEditMode
          ? "border border-dashed border-gray-300"
          : ""
      }`}
      onClick={handleNodeClick}
      onContextMenu={handleContextMenu}
    >
      {/* Data source indicator - only show for new components */}
      {isNewComponent && (
        <div className="absolute top-2 right-8">
          <span className="text-xs px-2 rounded-full bg-green-100 text-green-700">
            Mới
          </span>
        </div>
      )}

      {/* Delete button - show when showDeleteButtons is true */}
      {showDeleteButtons && (
        <button
          onClick={() => onDeleteNode(node.id.toString())}
          className="absolute top-2 right-2 bg-red-500 cursor-pointer text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
        >
          ×
        </button>
      )}

      {/* Title input - only show for non-Section/Subsection/ListItem types */}
      {node.type !== "SECTION" &&
        node.type !== "SUBSECTION" &&
        node.type !== "LIST_ITEM" &&
        node.type !== "TABLE" && (
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
        <div className="flex flex-col items-start gap-0 flex-wrap w-full">
          <div className="flex items-center gap-1 w-full">
            <input
              type="text"
              className="font-bold border-none outline-none bg-transparent w-auto "
              value={node.title}
              onChange={(e) => onUpdateNodeTitle(node.id, e.target.value)}
              placeholder="Tiêu đề..."
              size={Math.max(node.title?.length || 8, 8)}
            />
          </div>
          <div className="flex-1 min-w-0 pl-6">{renderField(node)}</div>
        </div>
      )}

      {/* Regular field rendering for non-LIST_ITEM types */}
      {node.type !== "LIST_ITEM" && (
        <div className="pl-6">{renderField(node)}</div>
      )}

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
                          className={`ml-4 relative group ${
                            snapshot.isDragging ? "opacity-50" : ""
                          }`}
                        >
                          {/* Move up/down buttons - only show in edit mode */}
                          {depth >= 0 &&
                            onMoveChildUp &&
                            onMoveChildDown &&
                            isEditMode && (
                              <div className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-1 z-10">
                                {/* Move up button - disabled if first child */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onMoveChildUp(child.id.toString());
                                  }}
                                  disabled={index === 0}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                                    index === 0
                                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                      : "bg-blue-500 text-white hover:bg-blue-600"
                                  }`}
                                  title="Di chuyển lên"
                                >
                                  <ChevronUp size={12} />
                                </button>

                                {/* Move down button - disabled if last child */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onMoveChildDown(child.id.toString());
                                  }}
                                  disabled={index === node.children.length - 1}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                                    index === node.children.length - 1
                                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                      : "bg-blue-500 text-white hover:bg-blue-600"
                                  }`}
                                  title="Di chuyển xuống"
                                >
                                  <ChevronDown size={12} />
                                </button>
                              </div>
                            )}

                          <NodeRenderer
                            node={child}
                            depth={depth + 1}
                            showDeleteButtons={showDeleteButtons}
                            onDeleteNode={onDeleteNode}
                            onUpdateNodeTitle={onUpdateNodeTitle}
                            onUpdateNodeContent={onUpdateNodeContent}
                            onUpdateNodeDescription={onUpdateNodeDescription}
                            onMoveChildUp={onMoveChildUp}
                            onMoveChildDown={onMoveChildDown}
                            isEditMode={isEditMode}
                            selectedNodeIds={selectedNodeIds}
                            onNodeSelect={onNodeSelect}
                            onPaste={onPaste}
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
