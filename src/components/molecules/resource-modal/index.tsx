import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/simple-tabs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/FormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Link, Image, Video } from "lucide-react";
import { useMaterialSearchService } from "@/services/materialServices";

export interface ResourceData {
  type: "image" | "video" | "link";
  url?: string;
  file?:
    | File
    | {
        name: string;
        size: number;
        type: string;
        base64: string;
      };
  description?: string;
}

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (resource: ResourceData) => void;
}

export function ResourceModal({
  isOpen,
  onClose,
  onSubmit,
}: ResourceModalProps) {
  const [linkData, setLinkData] = useState({ url: "", description: "" });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<"image" | "video">("image");
  const [resourceType, setResourceType] = useState<"upload" | "link">("upload");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedLibraryItem, setSelectedLibraryItem] = useState<any>(null);

  const { data } = useMaterialSearchService("tagIds=1");
  console.log(data?.data?.content, "hoclieu");

  // Get materials from API
  const materials = data?.data?.content || [];

  const handleLibraryItemSelect = (item: any) => {
    setSelectedLibraryItem(item);
  };

  const handleLibrarySubmit = () => {
    if (selectedLibraryItem) {
      onSubmit({
        type: "image", // Assuming all library items are images for now
        url: selectedLibraryItem.url,
        description: selectedLibraryItem.description || selectedLibraryItem.name,
      });
      setSelectedLibraryItem(null);
      onClose();
    }
  };

  const handleLinkSubmit = () => {
    if (linkData.url.trim()) {
      onSubmit({
        type: "link",
        url: linkData.url,
        description: linkData.description,
      });
      setLinkData({ url: "", description: "" });
      onClose();
    }
  };

  const handleUploadSubmit = () => {
    if (uploadFile) {
      onSubmit({
        type: uploadType,
        file: uploadFile,
      });
      setUploadFile(null);
      onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImagePreview(null); // Always clear previous preview
    if (!file) {
      setUploadFile(null);
      setUploadType("image");
      return;
    }
    setUploadFile(file);
    // Auto-detect type based on file
    if (file.type.startsWith("image/")) {
      setUploadType("image");
      // Create image preview with error handling
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.onerror = () => {
        setImagePreview(null);
        alert("Không thể xem trước ảnh này. Vui lòng thử file khác.");
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("video/")) {
      setUploadType("video");
      setImagePreview(null);
    } else {
      setUploadType("image");
      setImagePreview(null);
      alert("Chỉ hỗ trợ upload ảnh hoặc video.");
      setUploadFile(null);
    }
  };

  const tabs = [
    {
      id: "library",
      label: "Học liệu",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 font-questrial">
            Chọn từ thư viện học liệu có sẵn ({materials.length} tài liệu)
          </p>

          {materials.length === 0 ? (
            <div className="text-center py-8">
              <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 font-questrial">Chưa có học liệu nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {materials.map((item: any) => (
                <div
                  key={item.id}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedLibraryItem?.id === item.id
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleLibraryItemSelect(item)}
                >
                  <div className="aspect-video bg-gray-100 relative">
                    {item.url ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          // Fallback if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.parentElement?.querySelector('.fallback-icon') as HTMLElement;
                          if (fallback) fallback.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className="fallback-icon hidden absolute inset-0 items-center justify-center bg-gray-100">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>

                    {/* Selection indicator */}
                    {selectedLibraryItem?.id === item.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-white">
                    <h4 className="font-medium text-sm truncate" title={item.name}>
                      {item.name}
                    </h4>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2" title={item.description}>
                        {item.description}
                      </p>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.slice(0, 2).map((tag: any) => (
                          <span
                            key={tag.id}
                            className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600"
                          >
                            {tag.name}
                          </span>
                        ))}
                        {item.tags.length > 2 && (
                          <span className="text-xs text-gray-400">+{item.tags.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleLibrarySubmit}
              disabled={!selectedLibraryItem}
            >
              Chọn {selectedLibraryItem ? `"${selectedLibraryItem.name}"` : ""}
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "upload",
      label: "Upload tài nguyên",
      content: (
        <div className="space-y-6">
          {/* Resource Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-calsans text-gray-700">
              Loại tài nguyên:
            </label>
            <Select
              value={resourceType}
              onValueChange={(value) =>
                setResourceType(value as "upload" | "link")
              }
            >
              <SelectTrigger className="w-full font-questrial">
                <SelectValue placeholder="Chọn loại tài nguyên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upload">Upload file (ảnh/video)</SelectItem>
                <SelectItem value="link">Đường link</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Content Based on Selection */}
          {resourceType === "upload" ? (
            /* Upload Section */
            <div className="space-y-4">
              <FormField label="Upload file">
                {!uploadFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-questrial text-gray-600">
                        Chọn file để upload
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {uploadType === "image" && imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Video className="w-8 h-8 text-gray-500" />
                        <div>
                          <p className="font-medium text-sm">
                            {uploadFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(uploadFile.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setUploadFile(null);
                          setImagePreview(null);
                        }}
                      >
                        Chọn file khác
                      </Button>
                      <Button onClick={handleUploadSubmit}>Upload</Button>
                    </div>
                  </div>
                )}
              </FormField>
            </div>
          ) : (
            /* Link Section */
            <div className="space-y-4">
              <FormField label="Mô tả">
                <Input
                  placeholder="Nhập mô tả cho đường link"
                  value={linkData.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLinkData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </FormField>

              <FormField label="Đường link">
                <Input
                  placeholder="Nhập URL"
                  value={linkData.url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLinkData((prev) => ({ ...prev, url: e.target.value }))
                  }
                />
              </FormField>

              <div className="flex justify-end">
                <Button
                  onClick={handleLinkSubmit}
                  disabled={!linkData.url.trim()}
                >
                  Thêm link
                </Button>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Thêm học liệu" size="lg">
        <Tabs tabs={tabs} />
      </Modal>

      {/* Image Preview Modal */}
      {showImageModal && imagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-full max-h-full p-4">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 z-10"
            >
              ✕
            </button>
            <img
              src={imagePreview}
              alt="Full preview"
              className="max-w-full max-h-full object-contain"
              style={{ maxHeight: "90vh", maxWidth: "90vw" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
