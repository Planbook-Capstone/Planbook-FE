"use client";

import React, { useState, useMemo } from "react";
import { useDraggable } from "@dnd-kit/core";
import { toast } from "sonner";
import {
  Image,
  CloudUpload,
  CircleArrowOutDownLeft,
  CircleArrowOutUpRight,
  Database,
  Search,
} from "lucide-react";
import {
  useCreateMaterialInternalService,
  useMaterialInternalService,
  useMaterialSearchService,
} from "@/services/materialServices";
import { UploadCloudIcon } from "@/constants/icon";
import { QuestionBankModal } from "@/components/modals/QuestionBankModal";
import { QuestionBankItem } from "@/services/questionBankServices";
import { useExamResultEditorContext } from "@/contexts/ExamResultEditorContext";
import { GridSkeleton } from "@/components/molecules/grid-skeleton";

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
        font-questrial border border-gray-200 rounded-lg cursor-grab hover:border-blue-300
        hover:shadow-md transition-all duration-200 bg-white overflow-hidden group
        ${isDragging ? "opacity-50" : ""}
      `}
    >
      {asset.type === "image" && (
        <div className="relative w-full">
          <img
            src={asset.content}
            alt={asset.preview}
            className="w-full h-auto object-contain"
            onError={(e) => {
              // Fallback to icon if image fails to load
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
          <Image className="w-8 h-8 text-blue-600 hidden absolute inset-0 m-auto" />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <span className="text-white text-sm font-medium text-center px-2 py-1 bg-black bg-opacity-30 rounded">
              {asset.preview}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ToolExamPanel() {
  const [activeTab, setActiveTab] = useState<
    "images" | "upload" | "questionBank"
  >("images");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<AssetItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isQuestionBankModalOpen, setIsQuestionBankModalOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Check if we're in ExamResultEditor context
  const examResultEditorContext = useExamResultEditorContext();

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

  const handleQuestionBankClick = () => {
    setIsQuestionBankModalOpen(true);
  };

  const handleQuestionSelect = (question: QuestionBankItem) => {
    console.log("Selected question:", question);
  
    // Question is automatically added to exam context by the modal
  };

  const tabs = [
    { id: "images", label: "Hình ảnh", icon: Image },
    { id: "upload", label: "Tải lên", icon: CloudUpload },
    { id: "questionBank", label: "Ngân hàng đề", icon: Database },
  ] as const;

  const { data: materials, isLoading: isLoadingMaterials } = useMaterialSearchService("1");

  const { data: materialInternal, refetch: refetchMaterialInternal, isLoading: isLoadingMaterialInternal } =
    useMaterialInternalService();

  const { mutate: createMaterialInternal } = useCreateMaterialInternalService();

  // Filter materials based on search query
  const filteredMaterials = useMemo(() => {
    if (!materials?.data?.content) return [];
    if (!searchQuery.trim()) return materials.data.content;

    return materials.data.content.filter((asset: any) => {
      const name = asset.name?.toLowerCase() || "";
      const description = asset.description?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();

      return name.includes(query) || description.includes(query);
    });
  }, [materials?.data?.content, searchQuery]);

  // Filter internal materials based on search query
  const filteredMaterialInternal = useMemo(() => {
    if (!materialInternal?.data?.content) return [];
    if (!searchQuery.trim()) return materialInternal.data.content;

    return materialInternal.data.content.filter((asset: any) => {
      const name = asset.name?.toLowerCase() || "";
      const description = asset.description?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();

      return name.includes(query) || description.includes(query);
    });
  }, [materialInternal?.data?.content, searchQuery]);

  return (
    <div
      className={`sticky top-0 border-r max-h-screen flex flex-col font-questrial transition-all duration-200 ease-in-out ${
        isCollapsed ? "w-12" : "w-80"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-gray-200 flex items-center justify-between ">
        {!isCollapsed && (
          <h2 className="text-lg font-calsans text-gray-800">Công cụ</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
          title={isCollapsed ? "Mở rộng" : "Thu gọn"}
        >
          {isCollapsed ? (
            <CircleArrowOutUpRight className="-translate-x-[2px] w-5 h-5" />
          ) : (
            <CircleArrowOutDownLeft />
          )}
        </button>
      </div>

      {/* Tabs */}
      {!isCollapsed && (
        <div className="flex border border-gray-200 mx-4 p-1 rounded-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === "questionBank") {
                    handleQuestionBankClick();
                  } else {
                    setActiveTab(tab?.id);
                  }
                }}
                className={`
                 cursor-pointer flex-1 flex items-center justify-center space-x-2 py-2 px-2 text-sm font-medium
                  transition-colors duration-200 rounded-full
                  ${
                    activeTab === tab.id
                      ? "border"
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
        <div className="flex-1 p-2 sm:p-4 overflow-y-auto w-full">
          {/* Search Input - Show for images and upload tabs */}
          {(activeTab === "images" || activeTab === "upload") && (
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
          )}

          {activeTab === "images" ? (
            <div className="space-y-4">
              {/* Images from materials service */}
              {isLoadingMaterials ? (
                <div>
                  <GridSkeleton
                    count={6}
                    height={60}
                    cols="grid-cols-1 lg:grid-cols-2"
                  />
                </div>
              ) : filteredMaterials.length === 0 && searchQuery.trim() ? (
                <div className="text-center text-gray-500 py-8">
                  <span className="text-sm">Không tìm thấy hình ảnh nào phù hợp</span>
                </div>
              ) : (
                <div className="columns-2 gap-3 space-y-3">
                  {filteredMaterials.map((asset: any) => {
                  const assetItem: AssetItem = {
                    id: asset?.id,
                    type: "image",
                    content: asset?.url,
                    preview: asset?.name,
                  };
                  return (
                    <div key={asset?.id} className="break-inside-avoid mb-3">
                      <DraggableAsset asset={assetItem} />
                    </div>
                  );
                })}
                </div>
              )}
            </div>
          ) : activeTab === "upload" ? (
            <div className="space-y-4">
              {/* Upload Area */}
              <div
                className={`border-[1.5px] border-dashed rounded-lg p-4 text-center transition-colors ${
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
                    <div className="w-12 h-12">{UploadCloudIcon}</div>
                    // <Upload className="w-8 h-8 text-gray-400" />
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

              {/* Uploaded Images Gallery */}
              {isLoadingMaterialInternal ? (
                <div>
                  <GridSkeleton
                    count={6}
                    height={60}
                    cols="grid-cols-1 lg:grid-cols-2"
                  />
                </div>
              ) : filteredMaterialInternal.length > 0 ? (
                <div className="columns-2 gap-3 space-y-3">
                  {filteredMaterialInternal.map(
                    (asset: any, idx: number) => {
                      const assetItem: AssetItem = {
                        type: "image",
                        id: idx.toString(),
                        content: asset?.url,
                        preview: asset?.name?.slice(0, 10),
                      };
                      return (
                        <div
                          key={asset?.id}
                          className="break-inside-avoid mb-3"
                        >
                          <DraggableAsset asset={assetItem} />
                        </div>
                      );
                    }
                  )}
                </div>
              ) : searchQuery.trim() ? (
                <div className="text-center text-gray-500 py-8">
                  <span className="text-sm">Không tìm thấy hình ảnh nào phù hợp</span>
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
            <div className="columns-2 gap-3 space-y-3">
              {filteredMaterials.map((asset: any) => {
                const assetItem: AssetItem = {
                  id: asset?.id,
                  type: "image",
                  content: asset?.url,
                  preview: asset?.name,
                };
                return (
                  <div key={asset?.id} className="break-inside-avoid mb-3">
                    <DraggableAsset asset={assetItem} />
                  </div>
                );
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
                    if (tab.id === "questionBank") {
                      handleQuestionBankClick();
                    } else {
                      setActiveTab(tab.id);
                      setIsCollapsed(false); // Expand when clicking on icon
                    }
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

      {/* Question Bank Modal */}
      <QuestionBankModal
        isOpen={isQuestionBankModalOpen}
        onClose={() => setIsQuestionBankModalOpen(false)}
        onSelectQuestion={handleQuestionSelect}
        lessonId={1} // You can make this dynamic based on current lesson
        title="Ngân hàng đề"
        mode={examResultEditorContext?.isExamResultEditor ? "exam-result-editor" : "exam-context"}
        onAddToExamResult={examResultEditorContext?.onAddQuestionFromBank}
      />
    </div>
  );
}
