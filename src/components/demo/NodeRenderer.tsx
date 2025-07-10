"use client";

import { useCallback } from "react";
import { Droppable } from "@hello-pangea/dnd";
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
  type: "PARAGRAPH" | "LIST_ITEM" | "TABLE" | "IMAGE" | "SECTION" | "SUBSECTION";
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

export default function NodeRenderer({
  node,
  depth = 0,
  showDeleteButtons,
  onDeleteNode,
  onUpdateNodeTitle,
  onUpdateNodeContent,
  onUpdateTableData
}: NodeRendererProps) {
  
  // Get drop zone colors based on depth level
  const getDropZoneColors = (depth: number) => {
    const colors = [
      { border: "border-blue-500", bg: "bg-blue-50" },      // Level 0 - Blue
      { border: "border-green-500", bg: "bg-green-50" },    // Level 1 - Green
      { border: "border-purple-500", bg: "bg-purple-50" },  // Level 2 - Purple
    ];
    return colors[depth % colors.length];
  };

  // Render field based on fieldType and type
  const renderField = useCallback((node: DemoNode) => {
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
          <textarea
            className="w-full dotted-input text-blue-600 resize-none overflow-hidden min-h-[24px] border-none outline-none bg-transparent leading-tight"
            placeholder="............................................"
            value={node.content || ""}
            rows={1}
            onChange={(e) => {
              onUpdateNodeContent(node.id, e.target.value);
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "24px"; // Reset to min height
              target.style.height = Math.max(24, target.scrollHeight) + "px";
            }}
          />
        );
      case "TABLE":
        const tableData = node.tableData || {
          headers: ["Cột 1", "Cột 2"],
          rows: [
            ["", ""],
            ["", ""]
          ]
        };

        // Ensure all cells are strings for simplicity
        const convertedTableData: TableData = {
          headers: tableData.headers,
          rows: tableData.rows.map(row =>
            row.map(cell => {
              if (typeof cell === 'string') {
                return cell;
              } else if (cell && typeof cell === 'object') {
                if ('type' in cell && 'content' in cell) {
                  // Convert old format {type: 'text', content: 'value'} to string
                  const oldCell = cell as any;
                  return oldCell.content || '';
                } else if ('text' in cell) {
                  // Convert new format to string for now
                  return (cell as any).text || '';
                }
              }
              return '';
            })
          )
        };

        const handleTableDataChange = (newTableData: TableData) => {
          if (onUpdateTableData) {
            // Keep it simple - just pass the data as is
            onUpdateTableData(node.id, newTableData);
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
          <div className="field-image w-full">
            <div className="rounded-lg p-8 text-center bg-gray-50">
              <div className="text-4xl mb-2">🖼️</div>
              <p className="text-gray-500">Kéo hình ảnh vào đây hoặc click để chọn</p>
            </div>
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
  }, [onUpdateNodeContent, onUpdateNodeTitle]);

  const isNewComponent = node.metadata?.isNew === true;
  const dropColors = getDropZoneColors(depth);

  return (
    <div className="relative group rounded-lg mb-2 bg-white px-2">
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
      {node.type !== "SECTION" && node.type !== "SUBSECTION" && node.type !== "LIST_ITEM" && (
        <div className="mb-2">
          <input
            type="text"
            className="font-medium text-gray-800 border-none outline-none bg-transparent w-full"
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
              className="font-medium text-gray-800 border-none outline-none bg-transparent w-auto min-w-[80px]"
              value={node.title}
              onChange={(e) => onUpdateNodeTitle(node.id, e.target.value)}
              placeholder="Tiêu đề..."
              size={Math.max(node.title?.length || 8, 8)}
            />
            <span className="text-gray-600">:</span>
          </div>
          <div className="flex-1 min-w-0">
            {renderField(node)}
          </div>
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
            className={`mt-0.5 min-h-[8px] rounded-lg transition-colors ${
              snapshot.isDraggingOver
                ? `border-2 border-dashed ${dropColors.border} ${dropColors.bg} min-h-[30px]`
                : "border-0 bg-transparent"
            }`}
          >
            {node.children && node.children.length > 0 ? (
              <div className="mt-2">
                {node.children
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map(child => (
                  <div key={child.id} className="ml-4">
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
                ))}
              </div>
            ) : (
              snapshot.isDraggingOver && (
                <div className="flex items-center justify-center h-10 text-gray-400 text-sm">
                  Thả vào đây để thêm con (Cấp {depth + 1})
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
