"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/FormField";
import { toast } from "sonner";
import {
  Upload,
  Plus,
  Search,
  FileText,
  Trash2,
  Download,
  Eye,
} from "lucide-react";

interface TemplateReference {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileType: "pdf" | "docx" | "doc";
  fileSize: number;
  uploadedAt: string;
  thumbnail?: string;
  file?: File;
}

export function TemplateReferenceManager() {
  const [references, setReferences] = useState<TemplateReference[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFileUpload = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx";
    input.multiple = true;

    input.onchange = async (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);

      for (const file of files) {
        if (file.size > 50 * 1024 * 1024) {
          // 50MB limit
          toast.error(`File ${file.name} quá lớn. Giới hạn 50MB.`);
          continue;
        }

        const newReference: TemplateReference = {
          id: `ref-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          fileName: file.name,
          fileType: file.name.split(".").pop()?.toLowerCase() as
            | "pdf"
            | "docx"
            | "doc",
          fileSize: file.size,
          uploadedAt: new Date().toISOString(),
          file: file,
        };

        setReferences((prev) => [...prev, newReference]);
      }

      toast.success(`Đã upload ${files.length} file thành công!`);
    };

    input.click();
  }, []);

  const handleDeleteReference = useCallback((id: string) => {
    setReferences((prev) => prev.filter((ref) => ref.id !== id));
    toast.success("Đã xóa tài liệu tham khảo!");
  }, []);

  const handleViewDocument = useCallback((reference: TemplateReference) => {
    // Simple download for now - will implement viewer later
    if (reference.file) {
      const url = URL.createObjectURL(reference.file);
      window.open(url, "_blank");
      URL.revokeObjectURL(url);
    }
  }, []);

  const handleUpdateTitle = useCallback((id: string, newTitle: string) => {
    setReferences((prev) =>
      prev.map((ref) => (ref.id === id ? { ...ref, title: newTitle } : ref))
    );
  }, []);

  const filteredReferences = references.filter(
    (ref) =>
      ref.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-calsans mb-2">Tài Liệu Tham Khảo</h2>
            <p className="text-gray-600">
              Quản lý các file Word/PDF để AI học và tham khảo cấu trúc giáo án
            </p>
          </div>
          <Button
            onClick={handleFileUpload}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Tài Liệu
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <FormField label="Tìm kiếm" htmlFor="search">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Tìm kiếm theo tên file hoặc tiêu đề..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </FormField>
          </div>
          <div className="text-sm text-gray-500 mt-6">
            {filteredReferences.length} / {references.length} tài liệu
          </div>
        </div>
      </div>

      {/* Document Grid */}
      {filteredReferences.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {references.length === 0
              ? "Chưa có tài liệu nào"
              : "Không tìm thấy tài liệu"}
          </h3>
          <p className="text-gray-600 mb-6">
            {references.length === 0
              ? "Upload các file Word/PDF để AI có thể học và tham khảo cấu trúc giáo án"
              : "Thử thay đổi từ khóa tìm kiếm"}
          </p>
          {references.length === 0 && (
            <Button
              onClick={handleFileUpload}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Upload Tài Liệu Đầu Tiên
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredReferences.map((reference) => (
            <div
              key={reference.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              {/* Document Thumbnail */}
              <div className="aspect-[3/4] bg-gray-100 rounded-t-lg flex items-center justify-center relative group">
                <FileText className="w-16 h-16 text-gray-400" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-t-lg flex items-center justify-center">
                  <Button
                    size="sm"
                    onClick={() => handleViewDocument(reference)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Xem
                  </Button>
                </div>

                {/* File Type Badge */}
                <div className="absolute top-2 right-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full uppercase font-medium">
                  {reference.fileType}
                </div>
              </div>

              {/* Document Info */}
              <div className="p-4">
                <div className="mb-3">
                  <Input
                    value={reference.title}
                    onChange={(e) =>
                      handleUpdateTitle(reference.id, e.target.value)
                    }
                    className="font-medium text-sm border-0 p-0 focus:border focus:border-gray-300 focus:p-2"
                    placeholder="Nhập tiêu đề..."
                  />
                </div>

                <div className="text-xs text-gray-500 space-y-1 mb-3">
                  <div className="truncate">{reference.fileName}</div>
                  <div>{formatFileSize(reference.fileSize)}</div>
                  <div>
                    {new Date(reference.uploadedAt).toLocaleDateString("vi-VN")}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDocument(reference)}
                    className="flex-1"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Xem
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteReference(reference.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Instructions */}
      {references.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Hướng dẫn sử dụng</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Hỗ trợ file PDF, DOC, DOCX (tối đa 50MB)</li>
            <li>
              • AI sẽ phân tích cấu trúc và nội dung để học cách viết giáo án
            </li>
            <li>• Có thể upload nhiều file cùng lúc</li>
            <li>• Click vào tài liệu để xem chi tiết</li>
          </ul>
        </div>
      )}
    </div>
  );
}
