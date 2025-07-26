"use client";

import React, { useRef, useState, useEffect } from "react";
import { Search, Upload, Camera } from "lucide-react";
import {
  useMaterialSearchService,
  useMaterialInternalService,
  useCreateMaterialInternalService,
} from "@/services/materialServices";
import { useTagService } from "@/services/tagServices";
import { toast } from "sonner";
import { Gallery } from "../Gallery";
import WebcamCapture from "../WebcamCapture";

interface ImageLibrarySidebarProps {
  onAddImage: (imageUrl: string) => void;
}

export default function ImageLibrarySidebar({
  onAddImage,
}: ImageLibrarySidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showWebcam, setShowWebcam] = useState(false);
  const [activeTagId, setActiveTagId] = useState<string>("");

  const { data: tag } = useTagService();
  const { data: materials } = useMaterialSearchService(activeTagId);
  const { data: materialInternal, refetch: refetchMaterialInternal } =
    useMaterialInternalService();
  const { mutate: createMaterialInternal } = useCreateMaterialInternalService();

  useEffect(() => {
    if (tag?.data?.length > 0 && !activeTagId) {
      setActiveTagId(tag.data[0].id);
    }
  }, [tag?.data, activeTagId]);

  const allImages = React.useMemo(() => {
    const images: any[] = [];

    materials?.data?.content?.forEach((item: any, idx: number) => {
      const ext = item?.url?.split(".").pop()?.toLowerCase();
      if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) {
        images.push({
          id: `material-${idx}`,
          url: item.url,
          name: item.name,
        });
      }
    });

    materialInternal?.data?.content?.forEach((item: any, idx: number) => {
      const ext = item?.url?.split(".").pop()?.toLowerCase();
      if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) {
        images.push({
          id: `internal-${idx}`,
          url: item.url,
          name: item.name,
        });
      }
    });

    return images;
  }, [materials, materialInternal]);

  const galleryImages = allImages.map((image) => ({
    src: image.url,
    thumbnail: image.url,
    width: 150,
    height: 120,
    caption: image.name,
  }));

  const handleGallerySelect = (index: number) => {
    const selected = allImages[index];
    if (selected) onAddImage(selected.url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    Array.from(files).forEach((file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);
      formData.append("type", "image");

      createMaterialInternal(formData, {
        onSuccess: () => {
          toast.success(`Tải lên thành công: ${file.name}`);
          refetchMaterialInternal();
        },
        onError: () => {
          toast.error(`Tải lên thất bại: ${file.name}`);
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
        toast.success(`Chụp ảnh thành công: ${file.name}`);
        refetchMaterialInternal();
      },
      onError: () => {
        toast.error(`Tải ảnh từ webcam thất bại`);
      },
    });

    const imageUrl = URL.createObjectURL(file);
    onAddImage(imageUrl);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 bg-white">
        <h2 className="text-lg font-calsans text-gray-900 mb-4">Học liệu</h2>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm hình ảnh"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full pl-10 pr-4 py-2.5 border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full text-sm bg-neutral-800 hover:bg-neutral-700 text-white py-3 px-4 rounded-sm flex items-center justify-center gap-2 mb-3"
        >
          <Upload className="w-4 h-4" />
          Tải lên tệp
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={() => setShowWebcam(true)}
          className="w-full bg-gray-100 text-sm hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-sm flex items-center justify-center gap-2"
        >
          <Camera className="w-4 h-4" />
          Chụp ảnh
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {allImages.length > 0 ? (
          <Gallery
            images={galleryImages}
            onSelect={handleGallerySelect}
            enableImageSelection={false}
            rowHeight={120}
            margin={8}
          />
        ) : (
          <div className="text-center py-16 text-sm text-gray-500 font-questrial">
            Chưa có học liệu, vui lòng tải lên
          </div>
        )}
      </div>

      {showWebcam && (
        <WebcamCapture
          onCapture={handleWebcamCapture}
          onClose={() => setShowWebcam(false)}
        />
      )}
    </div>
  );
}
