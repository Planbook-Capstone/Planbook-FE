"use client";

import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { toast } from "sonner";
import {
  Image,
  Upload,
  Square,
  Circle,
  Triangle,
  ChevronLeft,
  ChevronRight,
  X,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import {
  useCreateMaterialInternalService,
  useMaterialInternalService,
  useMaterialSearchService,
} from "@/services/materialServices";

interface AssetItem {
  id: string;
  type: "image" | "shape";
  content: string;
  preview: string;
  style?: Record<string, any>;
}

interface DraggableAssetProps {
  asset: AssetItem;
}

function DraggableAsset({ asset }: DraggableAssetProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: asset.id,
      data: asset,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
       font-questrial p-3 border border-gray-200 rounded-lg cursor-grab hover:border-blue-300 
        hover:shadow-md transition-all duration-200 bg-white
        ${isDragging ? "opacity-50" : ""}
      `}
    >
      <div className="flex flex-col items-center space-y-2">
        {asset.type === "image" && (
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src={asset.content}
              alt={asset.preview}
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to icon if image fails to load
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.remove("hidden");
              }}
            />
            <Image className="w-8 h-8 text-blue-600 hidden" />
          </div>
        )}

        {asset.type === "shape" && (
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
            {asset.content === "rectangle" && (
              <Square className="w-8 h-8 text-purple-600" />
            )}
            {asset.content === "circle" && (
              <Circle className="w-8 h-8 text-purple-600" />
            )}
            {asset.content === "triangle" && (
              <Triangle className="w-8 h-8 text-purple-600" />
            )}
          </div>
        )}
        <span className="text-sm text-gray-600 text-center truncate max-w-20">
          {asset.preview}
        </span>
      </div>
    </div>
  );
}

export default function AssetsPanel() {
  const [activeTab, setActiveTab] = useState<"images" | "upload" | "shapes">(
    "images"
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<AssetItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

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

        // Also add to local state for immediate preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          const newAsset: AssetItem = {
            id: `uploaded-${Date.now()}-${Math.random()}`,
            type: "image",
            content: result,
            preview: file.name,
          };
          setUploadedImages((prev) => [...prev, newAsset]);
        };
        reader.readAsDataURL(file);
      }
    });

    // Reset input value to allow uploading the same file again
    event.target.value = "";
  };

  const removeUploadedImage = (imageId: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const tabs = [
    { id: "images", label: "Images", icon: Image },
    { id: "upload", label: "Upload", icon: Upload },
    // { id: 'shapes', label: 'Shapes', icon: Square },
  ] as const;

  const { data: materials } = useMaterialSearchService("1");

  const { data: materialInternal, refetch: refetchMaterialInternal } =
    useMaterialInternalService();

  const { mutate: createMaterialInternal } = useCreateMaterialInternalService();

  return (
    <div
      className={`h-full flex flex-col font-questrial transition-all duration-200 ease-in-out ${
        isCollapsed ? "w-12" : "w-full"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-gray-200 flex items-center justify-between ">
        {!isCollapsed && (
          <h2 className="text-lg font-calsans text-gray-800">Học liệu</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
          title={isCollapsed ? "Mở rộng" : "Thu gọn"}
        >
          {isCollapsed ? <PanelRightClose /> : <PanelRightOpen />}
        </button>
      </div>

      {/* Tabs */}
      {!isCollapsed && (
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                 cursor-pointer flex-1 flex items-center justify-center space-x-2 py-3 px-2 text-sm font-medium
                  transition-colors duration-200
                  ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Assets Grid */}
      {!isCollapsed && (
        <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
          {activeTab === "upload" ? (
            <div className="space-y-4">
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isUploading
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="file-upload"
                  className={`flex flex-col items-center space-y-2 ${
                    isUploading ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  {isUploading ? (
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-600">
                    {isUploading
                      ? "Đang tải lên..."
                      : "Click để tải lên hình ảnh"}
                  </span>
                  <span className="text-xs text-gray-400">
                    Hỗ trợ: JPG, PNG, GIF
                  </span>
                </label>
              </div>

              {/* Uploaded Images Grid */}
              {materialInternal?.data?.content?.length > 0 ? (
                <div className=" w-48 grid grid-cols-2 lg:grid-cols-2 md:grid-cols-1 gap-2 sm:gap-3">
                  {materialInternal?.data?.content?.map(
                    (asset: any, idx: number) => {
                      const assetItem: AssetItem = {
                        type: "image",
                        id: idx.toString(),
                        content: asset?.url,
                        preview: asset?.name,
                      };
                      return (
                        <DraggableAsset key={asset?.id} asset={assetItem} />
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <span className="text-sm">
                    Chưa có hình ảnh nào được tải lên
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-2 md:grid-cols-1 gap-2 sm:gap-3">
              {/* {sampleAssets[activeTab]?.map((asset) => (
                <DraggableAsset key={asset.id} asset={asset} />
              ))} */}
              {materials?.data?.content?.map((asset: any) => {
                const assetItem: AssetItem = {
                  id: asset?.id,
                  type: "image",
                  content: asset?.url,
                  preview: asset?.name,
                };
                return <DraggableAsset key={asset?.id} asset={assetItem} />;
              })}
            </div>
          )}
        </div>
      )}

      {/* Collapsed State - Show Icons Only */}
      {isCollapsed && (
        <div className="flex-1 p-1 mx-auto overflow-y-auto">
          <div className="flex flex-col space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsCollapsed(false); // Expand when clicking on icon
                  }}
                  className={`
                   cursor-pointer p-2 rounded-full transition-colors duration-200
                    ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }
                  `}
                  title={tab.label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
