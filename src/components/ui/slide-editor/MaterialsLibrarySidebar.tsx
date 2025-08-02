"use client";

import React, { useRef, useState, useEffect } from "react";
import { Search, Upload, Camera, Play } from "lucide-react";
import {
  useMaterialSearchService,
  useMaterialInternalInfiniteService,
  useCreateMaterialInternalService,
} from "@/services/materialServices";
import { useTagService } from "@/services/tagServices";
import { toast } from "sonner";
// Gallery import removed - using simple grid layout
import WebcamCapture from "../WebcamCapture";
import { Tabs } from "../simple-tabs";

interface MaterialsLibrarySidebarProps {
  onAddImage: (imageUrl: string) => void;
  onAddVideo: (videoUrl: string) => void;
}

interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: "image" | "video";
}

export default function MaterialsLibrarySidebar({
  onAddImage,
  onAddVideo,
}: MaterialsLibrarySidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showWebcam, setShowWebcam] = useState(false);
  const [activeTagId, setActiveTagId] = useState<string>("");

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

  useEffect(() => {
    if (tag?.data?.length > 0 && !activeTagId) {
      setActiveTagId(tag.data[0].id);
    }
  }, [tag?.data, activeTagId]);

  // Get all media files
  const allMediaFiles = React.useMemo(() => {
    const mediaFiles: MediaItem[] = [];

    materials?.data?.content?.forEach((item: any, idx: number) => {
      const ext = item?.url?.split(".").pop()?.toLowerCase();
      const isImage = ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(
        ext
      );
      const isVideo = ["mp4", "webm", "ogg", "avi", "mov", "wmv"].includes(ext);

      if (isImage || isVideo) {
        mediaFiles.push({
          id: `material-${idx}`,
          url: item.url,
          name: item.name,
          type: isVideo ? "video" : "image",
        });
      }
    });

    // Add internal materials from all pages
    materialInternalPages?.pages?.forEach((page: any, pageIdx: number) => {
      page?.data?.content?.forEach((item: any, idx: number) => {
        const ext = item?.url?.split(".").pop()?.toLowerCase();
        const isImage = ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(
          ext
        );
        const isVideo = ["mp4", "webm", "ogg", "avi", "mov", "wmv"].includes(
          ext
        );

        if (isImage || isVideo) {
          mediaFiles.push({
            id: `internal-${pageIdx}-${idx}`,
            url: item.url,
            name: item.name,
            type: isVideo ? "video" : "image",
          });
        }
      });
    });

    return mediaFiles;
  }, [materials, materialInternalPages]);

  // Filter by type
  const images = allMediaFiles.filter((item) => item.type === "image");
  const videos = allMediaFiles.filter((item) => item.type === "video");

  // Filter by search
  const filteredImages = images.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredVideos = videos.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Simple image handling - no gallery component needed

  const handleVideoSelect = (video: MediaItem) => {
    onAddVideo(video.url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    Array.from(files).forEach((file) => {
      // Detect file type
      const ext = file.name.split(".").pop()?.toLowerCase();
      const isImage = ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(
        ext || ""
      );
      const isVideo = ["mp4", "webm", "ogg", "avi", "mov", "wmv"].includes(
        ext || ""
      );

      if (!isImage && !isVideo) {
        toast.error(`${file.name} không phải là file ảnh hoặc video hợp lệ`);
        return;
      }

      // Check file size
      const maxImageSize = 10 * 1024 * 1024; // 10MB
      const maxVideoSize = 100 * 1024 * 1024; // 100MB
      const maxSize = isVideo ? maxVideoSize : maxImageSize;
      const fileType = isVideo ? "video" : "ảnh";
      const maxSizeText = isVideo ? "100MB" : "10MB";

      if (file.size > maxSize) {
        toast.error(
          `${file.name} quá lớn. Tối đa ${maxSizeText} cho ${fileType}`
        );
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);
      formData.append("type", isVideo ? "video" : "image");

      createMaterialInternal(formData, {
        onSuccess: () => {
          toast.success(`Tải lên ${fileType} thành công: ${file.name}`);
          refetchMaterialInternal();
        },
        onError: () => {
          toast.error(`Tải lên ${fileType} thất bại: ${file.name}`);
        },
      });
    });
  };

  const handleWebcamCapture = (imageDataUrl: string) => {
    const byteCharacters = atob(imageDataUrl.split(",")[1]);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: "image/jpeg" });
    const file = new File([blob], `webcam-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);
    formData.append("type", "image");

    createMaterialInternal(formData, {
      onSuccess: () => {
        toast.success("Chụp ảnh thành công!");
        refetchMaterialInternal();
        setShowWebcam(false);
      },
      onError: () => {
        toast.error("Chụp ảnh thất bại!");
      },
    });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Thư viện học liệu
        </h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Upload Controls */}
      <div className="p-4 border-gray-200 space-y-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-sm hover:bg-black transition-colors"
        >
          <Upload className="w-4 h-4" />
          Tải lên file
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={() => setShowWebcam(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-black rounded-sm hover:bg-white transition-colors"
        >
          <Camera className="w-4 h-4" />
          Chụp ảnh
        </button>

        <p className="text-xs text-gray-500 text-center">
          Ảnh: JPG, PNG, GIF, WebP, SVG (10MB) • Video: MP4, WebM, OGG, AVI,
          MOV, WMV (100MB)
        </p>
      </div>

      {/* Content with Sub-tabs */}
      <div
        className="flex-1 flex flex-col px-4"
        style={{ height: "calc(100vh - 200px)" }}
      >
        <Tabs
          tabs={[
            {
              id: "images",
              label: `Ảnh (${filteredImages.length})`,
              content: (
                <div className="h-96 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4">
                    {filteredImages.length > 0 ? (
                      <div className="space-y-4">
                        {/* Simple Grid Layout */}
                        <div className="grid grid-cols-2 gap-3">
                          {filteredImages.map((image) => (
                            <div
                              key={image.id}
                              className="group relative cursor-pointer rounded-lg overflow-hidden bg-white shadow-sm border-2 transition-all duration-200 hover:shadow-md hover:transform hover:scale-[1.02] border-gray-300 hover:border-blue-300"
                              onClick={() => onAddImage(image.url)}
                            >
                              <div className="aspect-square">
                                <img
                                  src={image.url}
                                  alt={image.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/placeholder-image.png"; // Fallback image
                                  }}
                                />
                              </div>

                              {/* Image overlay with name */}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                <p className="text-white text-xs truncate">
                                  {image.name}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Load More Button - Force show for testing */}
                        {(hasNextPage || filteredImages.length > 0) && (
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
                      </div>
                    ) : (
                      <div className="text-center py-16 text-sm text-gray-500">
                        {searchQuery
                          ? "Không tìm thấy ảnh nào"
                          : "Chưa có ảnh, vui lòng tải lên"}
                      </div>
                    )}
                  </div>
                </div>
              ),
            },
            {
              id: "videos",
              label: `Video (${filteredVideos.length})`,
              content: (
                <div className="flex-1 flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto p-4">
                    {filteredVideos.length > 0 ? (
                      <div className="space-y-3">
                        {filteredVideos.map((video) => (
                          <div
                            key={video.id}
                            className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleVideoSelect(video)}
                          >
                            <div className="flex items-center gap-3">
                              {/* Video Thumbnail */}
                              <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                <video
                                  src={video.url}
                                  className="w-full h-full object-cover rounded"
                                  muted
                                  preload="metadata"
                                  onError={(e) => {
                                    const target = e.target as HTMLVideoElement;
                                    target.style.display = "none";
                                    const parent = target.parentElement;
                                    if (parent) {
                                      parent.innerHTML =
                                        '<div class="text-purple-500"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8 5v10l8-5-8-5z"/></svg></div>';
                                    }
                                  }}
                                />
                              </div>

                              {/* Video Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <Play className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                  <h3 className="text-sm font-medium text-gray-900 truncate">
                                    {video.name}
                                  </h3>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  🎬 Video file
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 text-sm text-gray-500">
                        {searchQuery
                          ? "Không tìm thấy video nào"
                          : "Chưa có video, vui lòng tải lên"}
                      </div>
                    )}

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
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Webcam Modal */}
      {showWebcam && (
        <WebcamCapture
          onCapture={handleWebcamCapture}
          onClose={() => setShowWebcam(false)}
        />
      )}
    </div>
  );
}
