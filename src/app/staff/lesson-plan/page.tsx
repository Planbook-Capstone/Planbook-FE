"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Eye,
  Download,
  Trash2,
  Plus,
  MoreVertical,
  Edit,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LessonPlanTemplateBuilder } from "@/components/organisms/lesson-plan-template-builder";
import { LessonPlanTemplate } from "@/types";
import { getDefaultTemplate } from "@/data/lesson-plan-templates";
import { toast } from "sonner";

// Interface for uploaded files
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  file: File;
  thumbnail?: string; // Base64 thumbnail for PDFs
}

export default function LessonPlanPage() {
  const [templates, setTemplates] = useState<LessonPlanTemplate[]>([
    { ...getDefaultTemplate(), isActive: true },
    {
      ...getDefaultTemplate(),
      id: "template-2",
      name: "Template Toán Học",
      description:
        "Template chuyên dụng cho các môn toán học với cấu trúc bài tập và ví dụ",
      isActive: false,
    },
    {
      ...getDefaultTemplate(),
      id: "template-3",
      name: "Template Ngữ Văn",
      description:
        "Template dành cho môn ngữ văn với phần phân tích văn bản và luyện tập",
      isActive: false,
    },
  ]);
  const [activeTab, setActiveTab] = useState("template");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [currentTemplate, setCurrentTemplate] =
    useState<LessonPlanTemplate | null>(null);

  // Filter templates based on search query
  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTemplate = () => {
    const newTemplate = getDefaultTemplate();
    newTemplate.id = `template-${Date.now()}`;
    newTemplate.name = "Mẫu Mới";
    newTemplate.description = "Mô tả mẫu mới";
    setCurrentTemplate(newTemplate);
    setShowBuilder(true);
  };

  const handleEditTemplate = (template: LessonPlanTemplate) => {
    setCurrentTemplate(template);
    setShowBuilder(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (templates.length <= 1) {
      toast.error("Không thể xóa mẫu cuối cùng!");
      return;
    }
    setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    toast.success("Đã xóa mẫu!");
  };

  const handleActivateTemplate = (templateId: string) => {
    setTemplates((prev) =>
      prev.map((template) => ({
        ...template,
        isActive: template.id === templateId,
      }))
    );
    toast.success("Đã kích hoạt mẫu!");
  };

  // File management functions
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      // Check file type (only PDF and Word documents)
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error(
          `File ${file.name} không được hỗ trợ. Chỉ chấp nhận PDF và Word.`
        );
        continue;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} quá lớn. Kích thước tối đa 10MB.`);
        continue;
      }

      // Skip thumbnail generation for now
      let thumbnail: string | undefined;

      const newFile: UploadedFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        file: file,
        thumbnail: thumbnail,
      };

      setUploadedFiles((prev) => [...prev, newFile]);
      toast.success(`Đã upload ${file.name} thành công!`);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleViewFile = (file: UploadedFile) => {
    // Create a URL for the file and open it
    const url = URL.createObjectURL(file.file);
    window.open(url, "_blank");
    // Clean up the URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
    toast.success("Đã xóa file!");
  };

  const handleSave = (template: LessonPlanTemplate) => {
    // Check if template exists, update or add
    const existingIndex = templates.findIndex((t) => t.id === template.id);
    if (existingIndex >= 0) {
      setTemplates((prev) =>
        prev.map((t) => (t.id === template.id ? template : t))
      );
    } else {
      setTemplates((prev) => [...prev, template]);
    }

    toast.success("Mẫu đã được lưu thành công!");
    setShowBuilder(false);
  };

  const handleSaveDraft = (template: LessonPlanTemplate) => {
    toast.success("Nháp đã được lưu!");
    localStorage.setItem(
      `lesson-plan-content-draft-${template.id}`,
      JSON.stringify(template)
    );
  };

  // Utility functions
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (showBuilder) {
    return (
      <LessonPlanTemplateBuilder
        initialTemplate={currentTemplate}
        onSave={handleSave}
        onSaveDraft={handleSaveDraft}
        onExit={() => setShowBuilder(false)}
        mode="staff"
      />
    );
  }

  return (
    <div className="py-3">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-3">
          <TabsList className="rounded-full">
            <TabsTrigger value="template" className="rounded-full">
              Cấu hình Mẫu
            </TabsTrigger>
            <TabsTrigger value="references" className="rounded-full">
              Tài liệu tham khảo
            </TabsTrigger>
          </TabsList>

          {/* Search Box */}
          <div className="flex items-center gap-4">
            <Input
              placeholder="Tìm kiếm mẫu..."
              className="w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {activeTab === "template" && (
              <Button
                onClick={handleCreateTemplate}
                className="flex items-center gap-2 bg-neutral-800 text-white hover:bg-neutral-700"
              >
                <Plus className="w-4 h-4" />
                Tạo Mẫu Mới
              </Button>
            )}
            {activeTab === "references" && (
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload File
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="template" className="mt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`rounded-lg p-4 hover:shadow-md transition-shadow ${
                  template.isActive
                    ? "bg-[url('/images/background/abstract-bg.png')] bg-[length:150%] bg-center text-white"
                    : "bg-white border"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-calsans text-lg mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm opacity-90 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 ${
                          template.isActive
                            ? "text-white hover:bg-white/20"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      {!template.isActive && (
                        <DropdownMenuItem
                          onClick={() => handleActivateTemplate(template.id)}
                        >
                          Kích hoạt
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-600"
                      >
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs opacity-75">
                    {template.steps?.length || 0} bước
                  </div>
                  {template.isActive && (
                    <span className="px-2 py-1 rounded-full text-xs bg-white/20 text-white">
                      Đang sử dụng
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="references" className="mt-3">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* File List */}
          {uploadedFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer relative"
                  onClick={() => handleViewFile(file)}
                >
                  {/* Thumbnail - only show if available */}
                  {file.thumbnail && (
                    <div className="w-full h-32 mb-3 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                      <img
                        src={file.thumbnail}
                        alt={file.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  {/* Three dots menu */}
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(file.id);
                          }}
                          className="text-red-600"
                        >
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* File Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">
                      {file.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} •{" "}
                      {new Date(file.uploadDate).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Chưa có tài liệu nào. Nhấn "Upload File" để thêm tài liệu.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
