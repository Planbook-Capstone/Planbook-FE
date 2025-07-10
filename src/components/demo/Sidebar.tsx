"use client";

import { Droppable, Draggable } from "@hello-pangea/dnd";

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

interface SidebarProps {
  activeTab: "components" | "images" | "trash";
  setActiveTab: (tab: "components" | "images" | "trash") => void;
  trashData: DemoNode[];
  onRestoreNode: (nodeId: string) => void;
  componentPalette: ComponentPaletteItem[];
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  trashData, 
  onRestoreNode, 
  componentPalette 
}: SidebarProps) {
  return (
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
                  {componentPalette.map((item, index) => (
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
            <div className="space-y-2">
              {[
                { id: 'img1', name: 'diagram.png', icon: '📊' },
                { id: 'img2', name: 'chart.jpg', icon: '📈' },
                { id: 'img3', name: 'photo.png', icon: '📷' },
                { id: 'img4', name: 'illustration.svg', icon: '🎨' },
                { id: 'img5', name: 'screenshot.png', icon: '🖥️' }
              ].map((image) => (
                <div
                  key={image.id}
                  className="p-3 border border-gray-200 rounded-lg cursor-move hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', `image:${image.name}`);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{image.icon}</span>
                    <div>
                      <div className="font-medium text-gray-800 text-sm">
                        {image.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Kéo vào table cell
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                        onClick={() => onRestoreNode(item.id.toString())}
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
  );
}
