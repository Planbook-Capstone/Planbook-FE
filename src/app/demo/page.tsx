"use client";

import { useState, useCallback, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { useLessonPlanNodeChildrenService } from "@/services/lessonPlanNodeServices";

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
}

interface ComponentPaletteItem {
  id: string;
  type: "PARAGRAPH" | "LIST_ITEM" | "TABLE" | "IMAGE" | "SECTION" | "SUBSECTION";
  fieldType: "INPUT" | "TABLE" | "IMAGE";
  title: string;
  icon: string;
  description: string;
}

const COMPONENT_PALETTE: ComponentPaletteItem[] = [
  {
    id: "section",
    type: "SECTION",
    fieldType: "INPUT",
    title: "Section",
    icon: "📑",
    description: "Thêm tiêu đề chính"
  },
  {
    id: "subsection",
    type: "SUBSECTION",
    fieldType: "INPUT",
    title: "Subsection",
    icon: "📄",
    description: "Thêm tiêu đề phụ"
  },
  {
    id: "paragraph",
    type: "PARAGRAPH",
    fieldType: "INPUT",
    title: "Text/Paragraph",
    icon: "📝",
    description: "Thêm đoạn văn bản"
  },
  {
    id: "table",
    type: "TABLE",
    fieldType: "TABLE",
    title: "Table",
    icon: "📊",
    description: "Thêm bảng dữ liệu"
  },
  {
    id: "list-item",
    type: "LIST_ITEM",
    fieldType: "INPUT",
    title: "List Item",
    icon: "📋",
    description: "Thêm mục danh sách"
  },
  {
    id: "image",
    type: "IMAGE",
    fieldType: "IMAGE",
    title: "Image",
    icon: "🖼️",
    description: "Thêm hình ảnh"
  }
];

function DemoPage() {
  const [demoData, setDemoData] = useState<DemoNode[]>([]);
  const [trashData, setTrashData] = useState<DemoNode[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const [activeTab, setActiveTab] = useState<"components" | "images" | "trash">("components");

  // Load data from API
  const childrenQuery = useLessonPlanNodeChildrenService("1")();
  const apiData = childrenQuery?.data?.data;

  // Initialize demo data from API when it loads
  useEffect(() => {
    if (apiData && apiData.length > 0) {
      // Convert API data to DemoNode format
      const convertApiToDemoNode = (apiNode: any): DemoNode => {
        return {
          id: apiNode.id?.toString() || uuidv4(),
          lessonPlanId: apiNode.lessonPlanId || 1,
          parentId: apiNode.parentId?.toString() || null,
          title: apiNode.title || "",
          content: apiNode.content || "",
          fieldType: apiNode.fieldType || "INPUT",
          type: apiNode.type || "PARAGRAPH",
          orderIndex: apiNode.orderIndex || 0,
          metadata: apiNode.metadata,
          status: apiNode.status || "ACTIVE",
          children: apiNode.children ? apiNode.children.map(convertApiToDemoNode) : []
        };
      };

      const convertedData = apiData.map(convertApiToDemoNode);
      setDemoData(convertedData);
    }
  }, [apiData]);

  // Handle input changes
  const handleInputChange = useCallback((nodeId: string, value: string | boolean) => {
    const updateNodeContent = (nodeList: DemoNode[]): DemoNode[] => {
      return nodeList.map((node) => {
        if (node.id.toString() === nodeId) {
          return { ...node, content: String(value) };
        }
        if (node.children && node.children.length > 0) {
          return { ...node, children: updateNodeContent(node.children) };
        }
        return node;
      });
    };

    setDemoData((prev) => updateNodeContent(prev));
  }, []);

  // Add child to node with proper orderIndex
  const addChildToNode = useCallback((parentId: string, newChild: DemoNode, preserveOrderIndex: boolean = false) => {
    const updateNodeWithChild = (nodeList: DemoNode[]): DemoNode[] => {
      return nodeList.map((node) => {
        if (node.id.toString() === parentId) {
          let childWithOrder = { ...newChild, parentId: parentId };

          if (preserveOrderIndex) {
            // Check if orderIndex conflicts with existing children
            const existingChildOrderIndices = node.children.map(child => child.orderIndex);
            if (existingChildOrderIndices.includes(newChild.orderIndex)) {
              // If conflict, assign new orderIndex at the end
              const maxChildOrderIndex = node.children.length > 0
                ? Math.max(...existingChildOrderIndices)
                : -1;
              childWithOrder.orderIndex = maxChildOrderIndex + 1;
            }
            // else keep original orderIndex
          } else {
            // Calculate next orderIndex for new children
            const maxChildOrderIndex = node.children.length > 0
              ? Math.max(...node.children.map(child => child.orderIndex))
              : -1;
            childWithOrder.orderIndex = maxChildOrderIndex + 1;
          }

          return {
            ...node,
            children: [...node.children, childWithOrder].sort((a, b) => a.orderIndex - b.orderIndex)
          };
        }
        if (node.children && node.children.length > 0) {
          return { ...node, children: updateNodeWithChild(node.children) };
        }
        return node;
      });
    };

    setDemoData((prev) => updateNodeWithChild(prev));
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback((result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    // Dragging from palette to canvas or to a node
    if (source.droppableId === "component-palette") {
      const componentType = COMPONENT_PALETTE.find(item => item.id === draggableId);
      if (!componentType) return;

      const newNode: DemoNode = {
        id: uuidv4(),
        lessonPlanId: 1,
        parentId: null,
        title: `Mới: ${componentType.title}`,
        content: "",
        fieldType: componentType.fieldType,
        type: componentType.type,
        orderIndex: 0,
        metadata: { isNew: true },
        status: "ACTIVE",
        children: []
      };

      // Dropping to main canvas
      if (destination.droppableId === "demo-canvas") {
        setDemoData(prev => {
          const maxOrderIndex = prev.length > 0 ? Math.max(...prev.map(n => n.orderIndex)) : -1;
          const nodeWithOrder = { ...newNode, orderIndex: maxOrderIndex + 1 };
          return [...prev, nodeWithOrder].sort((a, b) => a.orderIndex - b.orderIndex);
        });
      }
      // Dropping to a specific node (as child)
      else if (destination.droppableId.startsWith("node-")) {
        const parentId = destination.droppableId.replace("node-", "");
        addChildToNode(parentId, newNode);
      }
    }

    // Dragging to trash
    if (destination.droppableId === "trash") {
      const nodeToDelete = demoData.find(node => node.id.toString() === draggableId);
      if (nodeToDelete) {
        setTrashData(prev => [...prev, { ...nodeToDelete, status: "DELETED" }]);
        setDemoData(prev => prev.filter(node => node.id.toString() !== draggableId));
      }
    }

    // Reordering within canvas
    if (source.droppableId === "demo-canvas" && destination.droppableId === "demo-canvas") {
      const newDemoData = Array.from(demoData);
      const [reorderedItem] = newDemoData.splice(source.index, 1);
      newDemoData.splice(destination.index, 0, reorderedItem);

      // Update order indices
      const updatedData = newDemoData.map((item, index) => ({
        ...item,
        orderIndex: index
      }));

      setDemoData(updatedData);
    }
  }, [demoData, addChildToNode]);

  // Find and delete node (including nested nodes)
  const findAndDeleteNode = useCallback((nodeList: DemoNode[], nodeId: string): { updatedList: DemoNode[], deletedNode: DemoNode | null } => {
    for (let i = 0; i < nodeList.length; i++) {
      const node = nodeList[i];

      // Found the node to delete
      if (node.id.toString() === nodeId) {
        const updatedList = nodeList.filter((_, index) => index !== i);
        return { updatedList, deletedNode: node };
      }

      // Search in children
      if (node.children && node.children.length > 0) {
        const result = findAndDeleteNode(node.children, nodeId);
        if (result.deletedNode) {
          const updatedNode = { ...node, children: result.updatedList };
          const updatedList = nodeList.map((n, index) => index === i ? updatedNode : n);
          return { updatedList, deletedNode: result.deletedNode };
        }
      }
    }

    return { updatedList: nodeList, deletedNode: null };
  }, []);

  // Delete node
  const handleDeleteNode = useCallback((nodeId: string) => {
    const result = findAndDeleteNode(demoData, nodeId);
    if (result.deletedNode) {
      setTrashData(prev => [...prev, { ...result.deletedNode, status: "DELETED" as const }]);
      setDemoData(result.updatedList);
    }
  }, [demoData, findAndDeleteNode]);

  // Check if parent exists in current data
  const findParentExists = useCallback((parentId: string, nodeList: DemoNode[]): boolean => {
    for (const node of nodeList) {
      if (node.id.toString() === parentId) {
        return true;
      }
      if (node.children && node.children.length > 0) {
        if (findParentExists(parentId, node.children)) {
          return true;
        }
      }
    }
    return false;
  }, []);

  // Restore from trash
  const handleRestoreNode = useCallback((nodeId: string) => {
    const nodeToRestore = trashData.find(node => node.id.toString() === nodeId);
    if (nodeToRestore) {
      // Check if parent still exists, if not restore to root level
      const shouldRestoreToRoot = !nodeToRestore.parentId ||
        !findParentExists(nodeToRestore.parentId, demoData);

      if (shouldRestoreToRoot) {
        // Restore to root level with original orderIndex
        setDemoData(prev => {
          const restoredNode = {
            ...nodeToRestore,
            status: "ACTIVE" as const,
            parentId: null // Clear parentId when restoring to root
          };

          // Check if orderIndex conflicts with existing nodes
          const existingOrderIndices = prev.map(n => n.orderIndex);
          if (existingOrderIndices.includes(restoredNode.orderIndex)) {
            // If conflict, assign new orderIndex at the end
            const maxOrderIndex = prev.length > 0 ? Math.max(...existingOrderIndices) : -1;
            restoredNode.orderIndex = maxOrderIndex + 1;
          }

          return [...prev, restoredNode].sort((a, b) => a.orderIndex - b.orderIndex);
        });
      } else {
        // Restore as child to existing parent with original orderIndex
        const nodeWithOriginalOrder = { ...nodeToRestore, status: "ACTIVE" as const };
        addChildToNode(nodeToRestore.parentId!, nodeWithOriginalOrder, true); // preserveOrderIndex = true
      }

      setTrashData(prev => prev.filter(node => node.id.toString() !== nodeId));
    }
  }, [trashData, addChildToNode, findParentExists, demoData]);

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
            onChange={(e) => {
              // Update title directly
              const updateNodeTitle = (nodeList: DemoNode[]): DemoNode[] => {
                return nodeList.map((n) => {
                  if (n.id.toString() === node.id.toString()) {
                    return { ...n, title: e.target.value };
                  }
                  if (n.children && n.children.length > 0) {
                    return { ...n, children: updateNodeTitle(n.children) };
                  }
                  return n;
                });
              };
              setDemoData(prev => updateNodeTitle(prev));
            }}
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
            onChange={(e) => {
              // Update title directly
              const updateNodeTitle = (nodeList: DemoNode[]): DemoNode[] => {
                return nodeList.map((n) => {
                  if (n.id.toString() === node.id.toString()) {
                    return { ...n, title: e.target.value };
                  }
                  if (n.children && n.children.length > 0) {
                    return { ...n, children: updateNodeTitle(n.children) };
                  }
                  return n;
                });
              };
              setDemoData(prev => updateNodeTitle(prev));
            }}
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
              handleInputChange(node.id.toString(), e.target.value);
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "24px"; // Reset to min height
              target.style.height = Math.max(24, target.scrollHeight) + "px";
            }}
          />
        );
      case "TABLE":
        return (
          <div className="field-table w-full">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Cột 1</th>
                    <th className="px-4 py-2 text-left font-medium">Cột 2</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        className="w-full border-none outline-none bg-transparent"
                        placeholder="Nhập nội dung..."
                        value={node.content || ""}
                        onChange={(e) => handleInputChange(node.id.toString(), e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        className="w-full border-none outline-none bg-transparent"
                        placeholder="Nhập nội dung..."
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        className="w-full border-none outline-none bg-transparent"
                        placeholder="Nhập nội dung..."
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        className="w-full border-none outline-none bg-transparent"
                        placeholder="Nhập nội dung..."
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
  }, [handleInputChange]);

  // Get drop zone colors based on depth level
  const getDropZoneColors = (depth: number) => {
    const colors = [
      { border: "border-blue-500", bg: "bg-blue-50" },      // Level 0 - Blue
      { border: "border-green-500", bg: "bg-green-50" },    // Level 1 - Green
      { border: "border-purple-500", bg: "bg-purple-50" },  // Level 2 - Purple
    ];
    return colors[depth % colors.length];
  };

  // Render node based on type
  const renderNode = useCallback((node: DemoNode, depth: number = 0) => {
    const isNewComponent = node.metadata?.isNew === true;
    const isApiData = !isNewComponent;
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
            onClick={() => handleDeleteNode(node.id.toString())}
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
              onChange={(e) => {
                // Update title in nested structure
                const updateNodeTitle = (nodeList: DemoNode[]): DemoNode[] => {
                  return nodeList.map((n) => {
                    if (n.id.toString() === node.id.toString()) {
                      return { ...n, title: e.target.value };
                    }
                    if (n.children && n.children.length > 0) {
                      return { ...n, children: updateNodeTitle(n.children) };
                    }
                    return n;
                  });
                };
                setDemoData(prev => updateNodeTitle(prev));
              }}
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
                onChange={(e) => {
                  const updateNodeTitle = (nodeList: DemoNode[]): DemoNode[] => {
                    return nodeList.map((n) => {
                      if (n.id.toString() === node.id.toString()) {
                        return { ...n, title: e.target.value };
                      }
                      if (n.children && n.children.length > 0) {
                        return { ...n, children: updateNodeTitle(n.children) };
                      }
                      return n;
                    });
                  };
                  setDemoData(prev => updateNodeTitle(prev));
                }}
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
                      {renderNode(child, depth + 1)}
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
  }, [showDeleteButtons, handleDeleteNode, renderField, getDropZoneColors]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Demo Layout</h2>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {(["components", "images", "trash"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 text-sm font-medium capitalize ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab === "components" && "🧩 Components"}
                {tab === "images" && "🖼️ Images"}
                {tab === "trash" && `🗑️ Trash (${trashData.length})`}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === "components" && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Kéo thả để thêm components
                </h3>
                <Droppable droppableId="component-palette" isDropDisabled>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-3"
                    >
                      {COMPONENT_PALETTE.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 border border-gray-200 rounded-lg cursor-move transition-colors ${
                                snapshot.isDragging
                                  ? "border-blue-500 bg-blue-100 shadow-lg"
                                  : "hover:border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{item.icon}</span>
                                <div>
                                  <div className="font-medium text-gray-800">
                                    {item.title}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {item.description}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )}

            {activeTab === "images" && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Thư viện hình ảnh
                </h3>
                <div className="text-center text-gray-500 py-8">
                  Chưa có hình ảnh nào
                </div>
              </div>
            )}

            {activeTab === "trash" && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Thùng rác ({trashData.length} items)
                </h3>
                {trashData.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Thùng rác trống
                  </div>
                ) : (
                  <div className="space-y-2">
                    {trashData.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-800">
                              {item.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.type}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRestoreNode(item.id.toString())}
                            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Khôi phục
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-800">
                Dynamic Layout Demo
              </h1>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDeleteButtons(!showDeleteButtons)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showDeleteButtons
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {showDeleteButtons ? "Ẩn nút xóa" : "Hiện nút xóa"}
                </button>
                <button
                  onClick={() => {
                    console.log("Demo Data:", demoData);
                    alert("Check console for data structure!");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Export JSON
                </button>
              </div>
            </div>
          </div>

          {/* Canvas */}
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
                        <p className="text-lg font-medium">Kéo components từ sidebar vào đây</p>
                        <p className="text-sm">Bắt đầu tạo layout của bạn</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3">
                      {demoData
                        .sort((a, b) => a.orderIndex - b.orderIndex)
                        .map((node, index) => (
                        <Draggable key={node.id} draggableId={node.id.toString()} index={index}>
                          {(provided: any, snapshot: any) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={snapshot.isDragging ? "opacity-50" : ""}
                            >
                              {renderNode(node, 0)}
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

          {/* Trash Drop Zone */}
          {/* <Droppable droppableId="trash">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`m-4 p-4 rounded-lg transition-colors ${
                  snapshot.isDraggingOver
                    ? "border-2 border-dashed border-red-500 bg-red-50"
                    : "border border-gray-300 bg-gray-100"
                }`}
              >
                <div className="text-center text-gray-600">
                  <span className="text-2xl">🗑️</span>
                  <p className="text-sm">Kéo vào đây để xóa</p>
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable> */}
        </div>
      </div>
    </DragDropContext>
  );
}

export default DemoPage;
