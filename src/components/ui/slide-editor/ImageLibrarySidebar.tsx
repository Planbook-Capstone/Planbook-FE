"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Upload,
  MoreHorizontal,
  Camera,
  Video,
  Music,
} from "lucide-react";
import Image from "next/image";
import { useMaterialSearchService } from "@/services/materialServices";
import { useTagService } from "@/services/tagServices";
import { TagResponse } from "@/types";
import { Tabs } from "antd";
import { Gallery } from "../Gallery";
import WebcamCapture from "../WebcamCapture";

interface ImageLibrarySidebarProps {
  onAddImage: (imageUrl: string) => void;
}

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  name: string;
}

export default function ImageLibrarySidebar({
  onAddImage,
}: ImageLibrarySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"images" | "videos" | "audio">(
    "images"
  );
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real material data
  const { data: tag } = useTagService();
  const [activeTagId, setActiveTagId] = useState<string>("");
  const { data: materials } = useMaterialSearchService(activeTagId);

  useEffect(() => {
    if (tag?.data?.length > 0 && !activeTagId) {
      setActiveTagId(tag.data[0].id);
    }
  }, [tag?.data, activeTagId]);

  // Get all images for display
  const allImages = React.useMemo(() => {
    const images: any[] = [];

    // Add uploaded images
    uploadedImages.forEach((image) => {
      images.push({
        id: image.id,
        url: image.url,
        name: image.name,
        type: "uploaded",
      });
    });

    // Add materials from API (only images)
    materials?.data?.content?.forEach((item: any, idx: number) => {
      const extension = item?.url?.split(".")?.pop()?.toLowerCase();
      if (["png", "jpg", "jpeg", "gif", "webp"].includes(extension)) {
        images.push({
          id: `material-${idx}`,
          url: item.url,
          name: item.name,
          type: "material",
        });
      }
    });

    return images;
  }, [uploadedImages, materials]);

  // Handle webcam capture
  const handleWebcamCapture = (imageDataUrl: string) => {
    // Convert base64 to blob and create object URL
    const byteCharacters = atob(imageDataUrl.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" });
    const imageUrl = URL.createObjectURL(blob);

    // Add to uploaded images
    const newImage: UploadedImage = {
      id: `webcam-${Date.now()}`,
      file: new File([blob], `webcam-${Date.now()}.jpg`, {
        type: "image/jpeg",
      }),
      url: imageUrl,
      name: `Webcam ${new Date().toLocaleTimeString()}`,
    };

    setUploadedImages((prev) => [...prev, newImage]);

    // Also add to slide immediately
    onAddImage(imageUrl);
  };

  // Convert to gallery format
  const galleryImages = allImages.map((image) => ({
    src: image.url,
    thumbnail: image.url,
    width: 150,
    height: 120,
    caption: image.name,
  }));

  // Handle gallery selection
  const handleGallerySelect = (index: number) => {
    const selectedImage = allImages[index];
    if (selectedImage) {
      onAddImage(selectedImage.url);
    }
  };

  // Sample stock images (you can replace with real stock image API)
  const stockImages = [
    { id: "1", url: "/api/placeholder/150/150", title: "Sample 1" },
    { id: "2", url: "/api/placeholder/150/150", title: "Sample 2" },
    { id: "3", url: "/api/placeholder/150/150", title: "Sample 3" },
    { id: "4", url: "/api/placeholder/150/150", title: "Sample 4" },
    { id: "5", url: "/api/placeholder/150/150", title: "Sample 5" },
    { id: "6", url: "/api/placeholder/150/150", title: "Sample 6" },
  ];

  // Validate image file
  const validateFile = (file: File) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: "Chỉ hỗ trợ file ảnh: JPG, PNG, GIF, WebP, SVG",
      };
    }

    if (file.size > maxSize) {
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
    const validFiles: UploadedImage[] = [];

    for (const file of fileArray) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        alert(validation.error);
        continue;
      }

      const imageUrl = URL.createObjectURL(file);
      const uploadedImage: UploadedImage = {
        id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        url: imageUrl,
        name: file.name,
      };

      validFiles.push(uploadedImage);
    }

    if (validFiles.length > 0) {
      setUploadedImages((prev) => [...validFiles, ...prev]);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
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

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-white">
        <h2 className="text-lg font-calsans text-gray-900 mb-4">Học liệu</h2>

        {/* Search Bar */}
        <div className="relative mb-4 ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm hình ảnh"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full pl-10 pr-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full text-sm bg-neutral-800 hover:bg-neutral-700 text-white py-3 px-4 rounded-sm transition-colors flex items-center justify-center gap-2 mb-3"
        >
          <Upload className="w-4 h-4" />
          Tải lên tệp
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Record Button */}
        <button
          onClick={() => setShowWebcam(true)}
          className="w-full bg-gray-100 text-sm hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-sm transition-colors flex items-center justify-center gap-2"
        >
          <Camera className="w-4 h-4" />
          Chụp ảnh
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {allImages.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-4 font-questrial">
                Thư viện ảnh
              </h3>
              <Gallery
                images={galleryImages}
                onSelect={handleGallerySelect}
                enableImageSelection={false}
                rowHeight={120}
                margin={8}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-calsans text-gray-800 mb-2">
                Chưa có học liệu
              </h3>
              <p className="text-sm text-gray-500 text-center font-questrial">
                Tải lên học liệu để sử dụng trong slide
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Drag & Drop Overlay */}
      {dragActive && (
        <div
          className="absolute inset-0 bg-blue-50/95 backdrop-blur-sm border-2 border-dashed border-blue-400 flex items-center justify-center z-50 rounded-lg"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-calsans text-blue-800 mb-2">
              Thả file ảnh vào đây
            </h3>
            <p className="text-sm text-blue-600 font-questrial">
              Hỗ trợ JPG, PNG, GIF, WebP, SVG
            </p>
          </div>
        </div>
      )}

      {/* Webcam Capture Modal */}
      {showWebcam && (
        <WebcamCapture
          onCapture={handleWebcamCapture}
          onClose={() => setShowWebcam(false)}
        />
      )}
    </div>
  );
}
