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
            Chọn từ thư viện học liệu có sẵn
          </p>
          <div className="grid grid-cols-3 gap-4">
            {/* Placeholder for library items */}
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <Image className="w-8 h-8 text-gray-400" />
            </div>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <Video className="w-8 h-8 text-gray-400" />
            </div>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <Image className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={onClose}>Chọn</Button>
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
                  onChange={(e) =>
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
                  onChange={(e) =>
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
