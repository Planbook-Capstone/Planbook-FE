"use client";

import { useMaterialSearchService } from "@/services/materialServices";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Badge } from "antd";
import { Image, RotateCcw, Trash } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

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

interface ComponentPaletteItem {
  id: string;
  type:
    | "PARAGRAPH"
    | "LIST_ITEM"
    | "TABLE"
    | "IMAGE"
    | "SECTION"
    | "SUBSECTION"
    | "QUESTION_BANK";
  fieldType: "INPUT" | "TABLE" | "IMAGE" | "QUESTION_BANK";
  title: string;
  icon: React.ReactNode;
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
  componentPalette,
}: SidebarProps) {
  const { data: materials } = useMaterialSearchService("1");

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Sidebar Header */}
      <div className="p-2 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg font-calsans py-1.5">Thành phần</h2>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "components" | "images" | "trash")
        }
        className="flex flex-col flex-1 min-h-0 pb-20"
      >
        <div className="flex-shrink-0 p-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="components" className="text-xs">
              Thành phần
            </TabsTrigger>
            <TabsTrigger value="images" className="text-xs">
              <div className="flex items-center gap-1">
                <Image size={14} />
                <span className="text-nowrap">Hình ảnh</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="trash" className="text-xs">
              <Badge count={trashData.length} size="small">
                <Trash size={14} />
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="components"
          className="flex-1 min-h-0 overflow-y-auto"
        >
          <div className="px-4 pb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Kéo thả để thêm thành phần mới
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
        </TabsContent>

        <TabsContent value="images" className="flex-1 min-h-0 overflow-y-auto">
          <div className="px-4 pb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Thư viện hình ảnh
            </h3>
            <div className="space-y-2 grid grid-cols-2 gap-2">
              {materials?.data?.content?.map((image: any) => (
                <div
                  key={image.id}
                  className="p-3 border border-gray-200 rounded-lg cursor-move hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  draggable
                  onDragStart={(e) => {
                    // Pass both URL and description as JSON
                    const imageData = {
                      url: image.url,
                      description: image.description || null,
                      name: image.name || null,
                    };
                    e.dataTransfer.setData(
                      "application/json",
                      JSON.stringify(imageData)
                    );
                    // Keep backward compatibility with text/plain
                    e.dataTransfer.setData("text/plain", `${image.url}`);
                  }}
                >
                  <div className="flex items-center gap-3">
                    {/* <span className="text-2xl">{image.icon}</span> */}
                    <div>
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-contain"
                      />
                      <div className="font-medium text-gray-800 text-sm text-center">
                        {image.name}
                      </div>
                      {/* <div className="text-xs text-gray-500">
                        Kéo vào table cell
                      </div> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trash" className="flex-1 min-h-0 overflow-y-auto">
          <div className="px-4 pb-4">
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
                    className="p-3 border border-red-200 rounded-lg bg-red-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500">{item.type}</div>
                      </div>
                      <button
                        onClick={() => onRestoreNode(item.id.toString())}
                        className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-md transition-colors hover:cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
