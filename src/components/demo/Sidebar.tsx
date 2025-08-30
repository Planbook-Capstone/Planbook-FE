"use client";

import {
  useMaterialSearchService,
  useCreateMaterialInternalService,
  useMaterialInternalService,
} from "@/services/materialServices";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Badge } from "antd";
import { Image, RotateCcw, Trash, Upload, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useRef, useState, useMemo } from "react";
import { toast } from "sonner";
import { UploadIcon } from "@/constants/icon";

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
  activeTab: "components" | "images" | "upload" | "trash";
  setActiveTab: (tab: "components" | "images" | "upload" | "trash") => void;
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
  const { data: materialInternal, refetch: refetchMaterialInternal } =
    useMaterialInternalService();
  const { mutate: createMaterialInternal } = useCreateMaterialInternalService();

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Filter materials based on search query
  const filteredMaterials = useMemo(() => {
    if (!materials?.data?.content) return [];
    if (!searchQuery.trim()) return materials.data.content;

    return materials.data.content.filter((image: any) => {
      const name = image.name?.toLowerCase() || "";
      const description = image.description?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();

      return name.includes(query) || description.includes(query);
    });
  }, [materials?.data?.content, searchQuery]);

  // Handle file upload
  const handleFileUpload = (files: FileList) => {
    setIsUploading(true);

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        // Create FormData for API upload
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", file.name);
        formData.append("type", "image");

        // Call API to upload
        createMaterialInternal(formData, {
          onSuccess: (response) => {
            console.log("Upload successful:", response);
            setIsUploading(false);
            toast.success(`Tải lên thành công: ${file.name}`);
            // Refresh the materials list to show new upload
            refetchMaterialInternal();
          },
          onError: (error) => {
            console.error("Upload failed:", error);
            setIsUploading(false);
            toast.error(`Tải lên thất bại: ${file.name}`);
          },
        });
      } else {
        setIsUploading(false);
        toast.error(`File ${file.name} không phải là hình ảnh`);
      }
    });
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

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
          setActiveTab(value as "components" | "images" | "upload" | "trash")
        }
        className="flex flex-col flex-1 min-h-0"
      >
        <div className="flex-shrink-0 p-2">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="components" className="text-xs">
              Thành phần
            </TabsTrigger>
            <TabsTrigger value="images" className="text-xs">
              <div className="flex items-center gap-1">
                <Image size={14} />
                <span className="text-nowrap">Hình ảnh</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="upload" className="text-xs">
              <div className="flex items-center gap-1">
                <Upload size={14} />
                <span className="text-nowrap">Upload</span>
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
          className="flex-1 min-h-0 overflow-y-scroll"
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

            {/* Search Input */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc mô tả..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div className="space-y-2 grid grid-cols-2 gap-2">
              {filteredMaterials.length === 0 && searchQuery.trim() ? (
                <div className="col-span-2 text-center text-gray-500 py-4">
                  Không tìm thấy hình ảnh nào phù hợp
                </div>
              ) : (
                filteredMaterials.map((image: any) => (
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
                        {image?.name?.slice(0, 10)}
                      </div>
                      {/* <div className="text-xs text-gray-500">
                        Kéo vào table cell
                      </div> */}
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="flex-1 min-h-0 overflow-y-auto">
          <div className="px-4 pb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Upload hình ảnh cá nhân
            </h3>

            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-20 h-20 mx-auto">{UploadIcon}</div>
              <p className="text-sm text-gray-600 mb-2">
                Kéo thả hình ảnh vào đây hoặc click để chọn
              </p>
              <p className="text-xs text-gray-500">
                Hỗ trợ: JPG, PNG, GIF (tối đa 10MB)
              </p>
              {isUploading && (
                <p className="text-xs text-blue-600 mt-2">Đang tải lên...</p>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
            />

            {/* Personal Images Library */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Hình ảnh cá nhân
              </h4>
              <div className="space-y-2 grid grid-cols-2 gap-2">
                {materialInternal?.data?.content?.map((image: any) => (
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
                    <div className="flex items-center gap-3 ">
                      <div className="w-full p-1">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-contain"
                        />
                        <div className="font-medium text-gray-800 text-sm text-center">
                          {image?.name?.slice(0, 10)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {(!materialInternal?.data?.content ||
                materialInternal.data.content.length === 0) && (
                <div className="text-center text-gray-500 py-4">
                  Chưa có hình ảnh cá nhân nào
                </div>
              )}
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
