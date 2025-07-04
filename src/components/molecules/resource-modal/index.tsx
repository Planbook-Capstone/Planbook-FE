import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/simple-tabs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/FormField";
import { Upload, Link, Image, Video } from "lucide-react";

interface ResourceData {
  type: "image" | "video" | "link";
  url?: string;
  file?: File;
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
    if (file) {
      setUploadFile(file);
      // Auto-detect type based on file
      if (file.type.startsWith("image/")) {
        setUploadType("image");
      } else if (file.type.startsWith("video/")) {
        setUploadType("video");
      }
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
          {/* Upload Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-calsans text-gray-700">
              Loại tài nguyên:
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="resourceType"
                  value="upload"
                  defaultChecked
                  className="text-blue-600"
                />
                <span className="text-sm font-questrial">
                  Upload file (ảnh/video)
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="resourceType"
                  value="link"
                  className="text-blue-600"
                />
                <span className="text-sm font-questrial">Đường link</span>
              </label>
            </div>
          </div>

          {/* Upload Section */}
          <div className="space-y-4">
            <FormField label="Upload file">
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
                    {uploadFile ? uploadFile.name : "Chọn file để upload"}
                  </p>
                </label>
              </div>
            </FormField>

            {uploadFile && (
              <div className="flex justify-end">
                <Button onClick={handleUploadSubmit}>Upload</Button>
              </div>
            )}
          </div>

          {/* Link Section */}
          <div className="space-y-4 border-t pt-4">
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
        </div>
      ),
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thêm học liệu" size="lg">
      <Tabs tabs={tabs} />
    </Modal>
  );
}
