"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, Check, Plus, ArrowLeft } from "lucide-react";
import { useTextColor } from "./TextColorContext";
// Gallery import removed - using simple grid layout
import { Tabs } from "../simple-tabs";
import {
  useMaterialSearchService,
  useMaterialInternalInfiniteService,
  useCreateMaterialInternalService,
} from "@/services/materialServices";
import { useTagService } from "@/services/tagServices";
import { toast } from "sonner";
import { UploadCloudIcon } from "@/constants/icon";

interface BackgroundSidebarProps {
  currentBackground?: string;
  onBackgroundChange: (background: string) => void;
}

interface BackgroundImage {
  id: string;
  file: File | null; // Allow null for server images
  url: string;
  name: string;
}

const PRESET_COLORS = [
  // Row 1: Grays (Black to White)
  "#000000", // Black
  "#4a4a4a", // Dark Gray
  "#6b6b6b", // Medium Dark Gray
  "#9b9b9b", // Medium Gray
  "#b8b8b8", // Light Gray
  "#d4d4d4", // Very Light Gray
  "#ffffff", // White

  // Row 2: Greens and Cyans
  "#00d084", // Bright Green
  "#7ed321", // Light Green
  "#bdff00", // Lime Green
  "#50e3c2", // Turquoise
  "#00bcd4", // Cyan
  "#0288d1", // Dark Cyan
  "#2196f3", // Blue

  // Row 3: Blues and Purples
  "#5c6bc0", // Light Blue
  "#1565c0", // Medium Blue
  "#0d47a1", // Dark Blue
  "#673ab7", // Purple
  "#9c27b0", // Medium Purple
  "#e91e63", // Pink Purple
  "#ff4081", // Hot Pink

  // Row 4: Reds, Oranges, and Browns
  "#f44336", // Light Red
  "#d32f2f", // Red
  "#ff9800", // Orange
  "#ffeb3b", // Yellow
  "#ffc107", // Amber
  "#ff5722", // Deep Orange
  "#8d6e63", // Brown
];

export default function BackgroundSidebar({
  currentBackground = "#ffffff",
  onBackgroundChange,
}: BackgroundSidebarProps) {
  const [dragActive, setDragActive] = useState(false);
  // Removed backgroundImages state - only use API images
  const [customColor, setCustomColor] = useState("#ffffff");
  const [colorHistory, setColorHistory] = useState<string[]>([]);
  const [activeTagId, setActiveTagId] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API hooks
  const { data: tag } = useTagService();
  const { data: materials } = useMaterialSearchService(activeTagId);
  const {
    data: materialInternalPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchMaterialInternal,
  } = useMaterialInternalInfiniteService();
  const { mutate: createMaterialInternal } = useCreateMaterialInternalService();

  // Text color context
  const { isTextColorMode, setIsTextColorMode, onTextColorChange } =
    useTextColor();

  // Set active tag ID when tags are loaded
  useEffect(() => {
    if (tag?.data?.length > 0 && !activeTagId) {
      setActiveTagId(tag.data[0].id);
    }
  }, [tag?.data, activeTagId]);

  // Background images only - no videos
  const allBackgroundImages = React.useMemo(() => {
    const serverImages: BackgroundImage[] = [];

    // Add images and videos from materials (external)
    materials?.data?.content?.forEach((item: any, idx: number) => {
      const ext = item?.url?.split(".").pop()?.toLowerCase();
      const isImage = ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(
        ext
      );

      if (isImage) {
        serverImages.push({
          id: `material-${idx}`,
          file: null as any, // Server images don't have file objects
          url: item.url,
          name: item.name,
        });
      }
    });

    // Add images from internal materials (infinite pages)
    materialInternalPages?.pages?.forEach((page: any, pageIdx: number) => {
      page?.data?.content?.forEach((item: any, idx: number) => {
        const ext = item?.url?.split(".").pop()?.toLowerCase();
        const isImage = ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(
          ext
        );

        if (isImage) {
          serverImages.push({
            id: `internal-${pageIdx}-${idx}`,
            file: null as any, // Server images don't have file objects
            url: item.url,
            name: item.name,
          });
        }
      });
    });

    // Return only images for background - no videos
    return serverImages;
  }, [materials, materialInternalPages]);

  // Load color history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("slide-editor-color-history");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setColorHistory(parsedHistory);
      } catch (error) {
        console.warn("Failed to parse color history:", error);
      }
    }
  }, []);

  // Save color to history (only custom colors, not preset colors)
  const saveColorToHistory = (color: string) => {
    // Don't save preset colors
    if (PRESET_COLORS.includes(color)) return;

    // Don't save if it's already the first item
    if (colorHistory[0] === color) return;

    // Remove color if it exists in history
    const filteredHistory = colorHistory.filter((c) => c !== color);

    // Add to beginning and limit to 12 colors
    const newHistory = [color, ...filteredHistory].slice(0, 12);

    setColorHistory(newHistory);
    localStorage.setItem(
      "slide-editor-color-history",
      JSON.stringify(newHistory)
    );
  };

  // Validate image files only (no videos for background)
  const validateFile = (file: File) => {
    const maxImageSize = 10 * 1024 * 1024; // 10MB for images

    const allowedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];

    const isImage = allowedImageTypes.includes(file.type);

    if (!isImage) {
      return {
        isValid: false,
        error: "Chỉ hỗ trợ file ảnh: JPG, PNG, GIF, WebP, SVG",
      };
    }

    if (file.size > maxImageSize) {
      return {
        isValid: false,
        error: "File quá lớn. Tối đa 10MB",
      };
    }

    return { isValid: true };
  };

  // Process uploaded files
  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        toast.error(validation.error);
        continue;
      }

      // Upload to server using API (images only for background)
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);
      formData.append("type", "image");

      createMaterialInternal(formData, {
        onSuccess: () => {
          toast.success(`Tải lên ảnh thành công: ${file.name}`);
          refetchMaterialInternal();
        },
        onError: () => {
          toast.error(`Tải lên ảnh thất bại: ${file.name}`);
        },
      });

      // No local state - only upload to API
      // File will appear after API refresh
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Handle file select
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // Handle color change
  const handleColorChange = (color: string) => {
    setCustomColor(color);

    if (isTextColorMode && onTextColorChange) {
      // Text color mode: change text color
      onTextColorChange(color);
    } else {
      // Background mode: change background
      onBackgroundChange(color);
    }

    saveColorToHistory(color);
  };

  // Check if current background is active
  const isActiveBackground = (bg: string) => {
    // For images, compare with url() format
    if (bg.startsWith("http") || bg.startsWith("blob:")) {
      return currentBackground === `url(${bg})`;
    }
    // For colors, direct comparison
    return currentBackground === bg;
  };

  // Handle image background
  const handleImageBackground = (imageUrl: string) => {
    onBackgroundChange(`url(${imageUrl})`);
  };

  // Simple background image handling - no gallery component needed

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col max-h-screen overflow-y-auto">
      {/* Header */}
      {isTextColorMode && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsTextColorMode(false)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>
            <h2 className="text-sm font-medium text-gray-900">Chọn màu chữ</h2>
          </div>
        </div>
      )}

      {/* Tabs for Background */}
      {!isTextColorMode && (
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Tabs
            tabs={[
              {
                id: "colors",
                label: "Màu nền",
                content: (
                  <div className="flex-1 overflow-y-auto p-4 space-y-5">
                    {/* Solid Colors */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        Màu nền
                      </h3>

                      {/* Custom Color Picker */}
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <input
                            type="color"
                            value={customColor}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div
                            className="w-10 h-10 rounded-full cursor-pointer transition-transform hover:scale-105 flex items-center justify-center"
                            style={{
                              background: `conic-gradient(
                    hsl(0, 100%, 50%) 0deg,
                    hsl(60, 100%, 50%) 60deg,
                    hsl(120, 100%, 50%) 120deg,
                    hsl(180, 100%, 50%) 180deg,
                    hsl(240, 100%, 50%) 240deg,
                    hsl(300, 100%, 50%) 300deg,
                    hsl(360, 100%, 50%) 360deg
                  )`,
                            }}
                          >
                            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm">
                              <Plus className="w-4 h-4 text-gray-600" />
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">
                          Chọn màu tùy chỉnh
                        </span>
                      </div>

                      {/* Preset Colors */}
                      <div className="grid grid-cols-7 gap-2">
                        {PRESET_COLORS.map((color) => (
                          <button
                            key={color}
                            onClick={() => handleColorChange(color)}
                            className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                              isActiveBackground(color)
                                ? "border-blue-500 ring-2 ring-blue-200"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          >
                            {isActiveBackground(color) && (
                              <Check className="w-4 h-4 text-white mx-auto" />
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Color History */}
                      {colorHistory.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">
                            Màu tùy chỉnh đã dùng
                          </h4>
                          <div className="grid grid-cols-7 gap-2">
                            {colorHistory.map((color, index) => (
                              <button
                                key={`${color}-${index}`}
                                onClick={() => handleColorChange(color)}
                                className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                                  isActiveBackground(color)
                                    ? "border-blue-500 ring-2 ring-blue-200"
                                    : "border-gray-300 hover:border-gray-400"
                                }`}
                                style={{ backgroundColor: color }}
                                title={`${color} (màu tùy chỉnh)`}
                              >
                                {isActiveBackground(color) && (
                                  <Check className="w-4 h-4 text-white mx-auto" />
                                )}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => {
                              setColorHistory([]);
                              localStorage.removeItem(
                                "slide-editor-color-history"
                              );
                            }}
                            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            Xóa lịch sử màu
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Reset to Default */}
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleColorChange("#ffffff")}
                        className="w-full px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                      >
                        Đặt lại nền trắng
                      </button>
                    </div>
                  </div>
                ),
              },
              {
                id: "images",
                label: "Ảnh nền",
                content: (
                  <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-5">
                    {/* Background Images Upload */}
                    {allBackgroundImages.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          {allBackgroundImages.map((image, index) => (
                            <div
                              key={`bg-${index}`}
                              className="group relative cursor-pointer rounded-lg overflow-hidden bg-white shadow-sm border-2 transition-all duration-200 hover:shadow-md hover:transform hover:scale-[1.02] border-gray-300 hover:border-blue-300"
                              onClick={() => handleImageBackground(image.url)}
                            >
                              <div className="aspect-square">
                                <img
                                  src={image.url}
                                  alt={image.name || `Background ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/placeholder-image.png";
                                  }}
                                />
                              </div>

                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                <p className="text-white text-xs truncate">
                                  {image.name || `Background ${index + 1}`}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Load More Button */}
                        {hasNextPage && (
                          <div className="text-center py-4">
                            <button
                              onClick={() => fetchNextPage()}
                              disabled={isFetchingNextPage}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isFetchingNextPage ? "Đang tải..." : "Tải thêm"}
                            </button>
                          </div>
                        )}
                        <div className="h-16 w-full"></div>
                      </div>
                    ) : (
                      <div className="text-center py-16 text-sm text-gray-500 font-questrial">
                        Chưa có ảnh nền, vui lòng tải lên
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
            defaultTab="bg-neutral-700"
            className="flex-1 min-h-0 flex flex-col pt-4 p-2"
          />
        </div>
      )}

      {/* Text Color Mode Content */}
      {isTextColorMode && (
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Solid Colors for Text */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Màu chữ</h3>
            <div className="grid grid-cols-7 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Custom Color Picker for Text */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Màu tùy chỉnh</h3>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  handleColorChange(e.target.value);
                }}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600">{customColor}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
