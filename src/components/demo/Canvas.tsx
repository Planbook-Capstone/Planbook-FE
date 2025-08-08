"use client";

import { Droppable, Draggable } from "@hello-pangea/dnd";
import NodeRenderer from "./NodeRenderer";

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

interface CanvasProps {
  demoData: DemoNode[];
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

export default function Canvas({
  demoData,
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
}: CanvasProps) {
  return (
    <div className="flex-1 p-1 overflow-y-auto">
      <Droppable droppableId="demo-canvas">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-full rounded-lg transition-colors ${
              snapshot.isDraggingOver
                ? "border-2 border-dashed border-blue-500 bg-blue-50"
                : "border-0 bg-transparent"
            }`}
          >
            {demoData.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-4">📋</div>
                  <p className="text-lg font-medium">
                    Kéo components từ sidebar vào đây
                  </p>
                  <p className="text-sm">Bắt đầu tạo layout của bạn</p>
                </div>
              </div>
            ) : (
              <div className="p-3">
                {demoData
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((node, index) => (
                    <Draggable
                      key={node.id}
                      draggableId={node.id.toString()}
                      index={index}
                    >
                      {(provided: any, snapshot: any) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={snapshot.isDragging ? "opacity-50" : ""}
                        >
                          <NodeRenderer
                            node={node}
                            depth={0}
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
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
