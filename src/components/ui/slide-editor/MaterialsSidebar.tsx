"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, Play, FileText, X } from "lucide-react";
import { Gallery } from "../Gallery";
import { Tabs } from "../simple-tabs";
import {
  useMaterialSearchService,
  useMaterialInternalService,
  useCreateMaterialInternalService,
} from "@/services/materialServices";
import { useTagService } from "@/services/tagServices";
import { toast } from "sonner";
import { UploadCloudIcon } from "@/constants/icon";

interface MaterialsSidebarProps {
  onClose: () => void;
  onMaterialSelect: (material: MaterialItem) => void;
}

interface MaterialItem {
  id: string;
  file: File | null;
  url: string;
  name: string;
  type: "image" | "video" | "document";
}

export default function MaterialsSidebar({
  onClose,
  onMaterialSelect,
}: MaterialsSidebarProps) {
  const [dragActive, setDragActive] = useState(false);
  const [activeTagId, setActiveTagId] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API hooks
  const { data: tag } = useTagService();
  const { data: materials } = useMaterialSearchService(activeTagId);
  const { data: materialInternal, refetch: refetchMaterialInternal } =
    useMaterialInternalService();
  const { mutate: createMaterialInternal } = useCreateMaterialInternalService();

  // Set active tag ID when tags are loaded
  useEffect(() => {
    if (tag?.data?.length > 0 && !activeTagId) {
      setActiveTagId(tag.data[0].id);
    }
  }, [tag?.data, activeTagId]);

  // Get all materials (images, videos, documents)
  const allMaterials = React.useMemo(() => {
    const serverMaterials: MaterialItem[] = [];

    // Add materials from external API
    materials?.data?.content?.forEach((item: any, idx: number) => {
      const ext = item?.url?.split(".").pop()?.toLowerCase();
      const isImage = ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(
        ext
      );
      const isVideo = ["mp4", "webm", "ogg", "avi", "mov", "wmv"].includes(ext);
      const isDocument = ["pdf", "doc", "docx", "ppt", "pptx", "txt"].includes(
        ext
      );

      if (isImage || isVideo || isDocument) {
        serverMaterials.push({
          id: `material-${idx}`,
          file: null,
          url: item.url,
          name: item.name,
          type: isVideo ? "video" : isDocument ? "document" : "image",
        });
      }
    });

    // Add materials from internal API
    materialInternal?.data?.content?.forEach((item: any, idx: number) => {
      const ext = item?.url?.split(".").pop()?.toLowerCase();
      const isImage = ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(
        ext
      );
      const isVideo = ["mp4", "webm", "ogg", "avi", "mov", "wmv"].includes(ext);
      const isDocument = ["pdf", "doc", "docx", "ppt", "pptx", "txt"].includes(
        ext
      );

      if (isImage || isVideo || isDocument) {
        serverMaterials.push({
          id: `internal-${idx}`,
          file: null,
          url: item.url,
          name: item.name,
          type: isVideo ? "video" : isDocument ? "document" : "image",
        });
      }
    });

    return serverMaterials;
  }, [materials, materialInternal]);

  // Validate files (images, videos, documents)
  const validateFile = (file: File) => {
    const maxImageSize = 10 * 1024 * 1024; // 10MB for images
    const maxVideoSize = 100 * 1024 * 1024; // 100MB for videos
    const maxDocumentSize = 50 * 1024 * 1024; // 50MB for documents

    const allowedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];

    const allowedVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/avi",
      "video/mov",
      "video/wmv",
    ];

    const allowedDocumentTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
    ];

    const isImage = allowedImageTypes.includes(file.type);
    const isVideo = allowedVideoTypes.includes(file.type);
    const isDocument = allowedDocumentTypes.includes(file.type);

    if (!isImage && !isVideo && !isDocument) {
      return {
        isValid: false,
        error: "Chỉ hỗ trợ file ảnh, video và tài liệu (PDF, DOC, PPT, TXT)",
      };
    }

    const maxSize = isVideo
      ? maxVideoSize
      : isDocument
      ? maxDocumentSize
      : maxImageSize;
    const fileType = isVideo ? "video" : isDocument ? "tài liệu" : "ảnh";
    const maxSizeText = isVideo ? "100MB" : isDocument ? "50MB" : "10MB";

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File ${fileType} quá lớn. Tối đa ${maxSizeText}`,
      };
    }

    return {
      isValid: true,
      type: isVideo ? "video" : isDocument ? "document" : "image",
    };
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

      // Upload to server using API
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);
      formData.append("type", validation.type || "image");

      const fileType =
        validation.type === "video"
          ? "video"
          : validation.type === "document"
          ? "tài liệu"
          : "ảnh";

      createMaterialInternal(formData, {
        onSuccess: () => {
          toast.success(`Tải lên ${fileType} thành công: ${file.name}`);
          refetchMaterialInternal();
        },
        onError: () => {
          toast.error(`Tải lên ${fileType} thất bại: ${file.name}`);
        },
      });
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
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

  // Convert materials to gallery format
  const galleryImages = allMaterials.map((material) => {
    const icon =
      material.type === "video"
        ? "🎬"
        : material.type === "document"
        ? "📄"
        : "";

    return {
      src: material.url,
      thumbnail: material.url,
      width: 150,
      height: 120,
      caption: `${icon} ${material.name}`,
      isSelected: false,
      materialType: material.type,
    };
  });

  // Handle material selection
  const handleMaterialSelect = (index: number) => {
    const selectedMaterial = allMaterials[index];
    if (selectedMaterial) {
      onMaterialSelect(selectedMaterial);
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Học liệu</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col h-full">
        <Tabs
          tabs={[
            {
              id: "materials",
              label: "Tất cả",
              content: (
                <div className="flex-1 p-4 space-y-5 h-full">
                  <div className="space-y-3 h-full">
                    {/* Upload Area */}
                    <div
                      className={`relative flex flex-col items-center border-[1px] border-dashed rounded-lg p-6 text-center transition-colors ${
                        dragActive
                          ? "border-sky-400 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.txt"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <div className="w-12 h-12">{UploadCloudIcon}</div>

                      <p className="text-sm text-gray-600 mb-2">
                        Kéo thả ảnh, video hoặc tài liệu vào đây
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-neutral-700 rounded-full text-white text-sm cursor-pointer hover:bg-blue-600 transition-colors"
                      >
                        Chọn file
                      </button>
                    </div>

                    {/* Materials Grid */}
                    {allMaterials.length > 0 ? (
                      <div className="overflow-y-scroll h-full">
                        <Gallery
                          images={galleryImages}
                          onSelect={handleMaterialSelect}
                          enableImageSelection={false}
                          rowHeight={120}
                          margin={8}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-16 text-sm text-gray-500 font-questrial">
                        Chưa có học liệu, vui lòng tải lên
                      </div>
                    )}
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
