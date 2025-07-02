"use client";

import { useState, useRef } from "react";
import { LessonPlanTemplateBuilder } from "@/components/organisms/lesson-plan-template-builder";
// import { TemplateReferenceManager } from "@/components/organisms/template-reference-manager";
import { LessonPlanTemplate } from "@/types";
import { getDefaultTemplate } from "@/data/lesson-plan-templates";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Settings,
  FileText,
  Upload,
  Eye,
  Download,
  Plus,
  MoreVertical,
  Trash2,
} from "lucide-react";

// Interface for uploaded files
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  file: File;
}

export default function LessonPlanTemplatePage() {
  const [templates, setTemplates] = useState<LessonPlanTemplate[]>([
    getDefaultTemplate(),
    {
      ...getDefaultTemplate(),
      id: "template-2",
      name: "Template Toán Học",
      description:
        "Template chuyên dụng cho các môn toán học với cấu trúc bài tập và ví dụ",
    },
    {
      ...getDefaultTemplate(),
      id: "template-3",
      name: "Template Ngữ Văn",
      description:
        "Template dành cho môn ngữ văn với phần phân tích văn bản và luyện tập",
    },
  ]);
  const [currentTemplate, setCurrentTemplate] = useState<
    LessonPlanTemplate | undefined
  >();
  const [selectedTemplate, setSelectedTemplate] = useState<
    LessonPlanTemplate | undefined
  >();
  const [showBuilder, setShowBuilder] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("template");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateTemplate = () => {
    const newTemplate = getDefaultTemplate();
    newTemplate.id = `template-${Date.now()}`;
    newTemplate.name = "Template Mới";
    newTemplate.description = "Mô tả template mới";
    setCurrentTemplate(newTemplate);
    setSelectedTemplate(undefined);
    setIsEditing(true);
    setShowBuilder(true);
  };

  const handleEditTemplate = (template: LessonPlanTemplate) => {
    setCurrentTemplate(template);
    setSelectedTemplate(template);
    setIsEditing(true);
    setShowBuilder(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (templates.length <= 1) {
      toast.error("Không thể xóa template cuối cùng!");
      return;
    }

    setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    toast.success("Đã xóa template!");
  };

  const handleSave = (template: LessonPlanTemplate) => {
    // TODO: Integrate with API
    console.log("Saving template:", template);

    if (selectedTemplate) {
      // Update existing template
      setTemplates((prev) =>
        prev.map((t) => (t.id === template.id ? template : t))
      );
    } else {
      // Add new template
      setTemplates((prev) => [...prev, template]);
    }

    toast.success("Template đã được lưu thành công!");
    setShowBuilder(false);
    setIsEditing(false);
  };

  const handleSaveDraft = (template: LessonPlanTemplate) => {
    // TODO: Integrate with API
    console.log("Saving draft:", template);
    toast.success("Nháp đã được lưu!");

    // Save to localStorage for now
    localStorage.setItem(
      `lesson-plan-draft-${template.id}`,
      JSON.stringify(template)
    );
  };

  // File management functions
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
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
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} quá lớn. Kích thước tối đa 10MB.`);
        return;
      }

      const newFile: UploadedFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        file: file,
      };

      setUploadedFiles((prev) => [...prev, newFile]);
      toast.success(`Đã upload ${file.name} thành công!`);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
    toast.success("Đã xóa file thành công!");
  };

  const handleViewFile = (file: UploadedFile) => {
    // Create blob URL and open in new tab
    const url = URL.createObjectURL(file.file);
    window.open(url, "_blank");

    // Clean up URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDownloadFile = (file: UploadedFile) => {
    const url = URL.createObjectURL(file.file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Đã tải xuống ${file.name}!`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type === "application/pdf") {
      return "📄";
    } else if (type.includes("word")) {
      return "📝";
    }
    return "📄";
  };

  if (showBuilder) {
    return (
      <LessonPlanTemplateBuilder
        initialTemplate={currentTemplate}
        onSave={handleSave}
        onSaveDraft={handleSaveDraft}
        onExit={() => setShowBuilder(false)}
        mode="admin" // Admin mode - chỉ cấu hình cấu trúc template
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-calsans text-gray-900 mb-2">
            Quản Lý Template Giáo Án
          </h1>
          <p className="text-gray-600">
            Cấu hình template động và quản lý tài liệu tham khảo cho AI
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="template" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Cấu hình Template
            </TabsTrigger>
            <TabsTrigger value="references" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Tài liệu tham khảo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="mt-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-calsans mb-2">
                    Danh Sách Template Giáo Án
                  </h2>
                  <p className="text-gray-600">
                    Quản lý các template giáo án cho hệ thống
                  </p>
                </div>
                <Button
                  onClick={handleCreateTemplate}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tạo Template Mới
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {template.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1"
                              title="Tùy chọn"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditTemplate(template)}
                            >
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteTemplate(template.id)}
                              className="text-red-600"
                            >
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mb-3">
                      {template.steps?.length || 0} bước • 0 từ khóa
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                        Không sử dụng
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTemplate(template)}
                        className="text-xs"
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="references" className="mt-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-calsans mb-2">
                    Tài Liệu Tham Khảo
                  </h2>
                  <p className="text-gray-600">
                    Quản lý các file Word/PDF để AI học và tham khảo cấu trúc
                    giáo án
                  </p>
                </div>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload File
                </Button>
              </div>

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
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {getFileIcon(file.type)}
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {file.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.size)} •{" "}
                            {new Date(file.uploadDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewFile(file)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Xem
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadFile(file)}
                          className="flex items-center gap-1"
                        >
                          <Download className="w-4 h-4" />
                          Tải
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteFile(file.id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">
                    Chưa có tài liệu nào
                  </h3>
                  <p className="mb-4">
                    Upload file PDF hoặc Word để AI có thể học và tham khảo cấu
                    trúc giáo án
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Chọn file để upload
                  </Button>
                </div>
              )}

              {/* Upload Guidelines */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Hướng dẫn upload:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Chỉ chấp nhận file PDF (.pdf) và Word (.doc, .docx)</li>
                  <li>• Kích thước tối đa: 10MB mỗi file</li>
                  <li>
                    • AI sẽ phân tích cấu trúc và nội dung để học cách tạo giáo
                    án
                  </li>
                  <li>
                    • Nên upload các mẫu giáo án chất lượng để AI học tốt hơn
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
