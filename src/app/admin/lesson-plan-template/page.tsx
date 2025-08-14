"use client";

import { useState, useRef } from "react";
import { LessonPlanTemplate } from "@/types";
import { getDefaultTemplate } from "@/data/lesson-plan-templates";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Upload, MoreVertical } from "lucide-react";

import {
  useLessonPlanByIdService,
  useLessonPlanService,
} from "@/services/lessonPlanServices";
import { useLessonPlanAllNodeService } from "@/services/lessonPlanNodeServices";
import { set } from "date-fns";
import PreviewModal from "@/components/PreviewModal";

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

export default function LessonPlanTemplatePage() {
  const { data: lessonPlanData } = useLessonPlanService();
  const [selected, setSelected] = useState<LessonPlanTemplate>();
  const { data: lessonPlanById } = useLessonPlanByIdService(selected?.id || "");
  const { data: allNode } = useLessonPlanAllNodeService(selected?.id || "")();

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
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter templates based on search query
  const filteredTemplates = lessonPlanData?.data?.content?.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    console.log(template, "tran");
    setShowPreview(true);
    // setCurrentTemplate(template);
    // setSelectedTemplate(template);
    // setIsEditing(true);
    // setShowBuilder(true);
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
  const [showPreview, setShowPreview] = useState(false);

  if (showPreview && allNode?.data) {
    return (
      <>
        <PreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          data={allNode?.data}
          onDownload={() => {}}
          lesson={lessonPlanById?.data}
          mode={false}
        />
      </>
    );
  }

  return (
    <div className="py-3">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-3">
          <TabsList className="rounded-full">
            <TabsTrigger value="template" className="rounded-full">
              Cấu hình Template
            </TabsTrigger>
            <TabsTrigger value="references" className="rounded-full">
              Tài liệu tham khảo
            </TabsTrigger>
          </TabsList>

          {/* Search Box */}
          <div className="flex items-center gap-4">
            <Input
              placeholder="Tìm kiếm template..."
              className="w-80"
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
            />
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
            {filteredTemplates?.map((template) => (
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
                    <h3
                      className={`font-calsans text-base mb-1 ${
                        template?.isActive ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {template?.name}
                    </h3>
                    <p
                      className={`text-sm line-clamp-2 ${
                        template?.isActive ? "text-blue-100" : "text-gray-600"
                      }`}
                    >
                      {template?.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2"></div>
                </div>

                <div
                  className={`text-xs mb-3 ${
                    template.isActive ? "text-white" : "text-gray-500"
                  }`}
                >
                  {template.steps?.length || 0} bước • 0 từ khóa
                </div>

                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                    Không sử dụng
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelected(template);
                      handleEditTemplate(template);
                    }}
                    className={`text-xs ${
                      template.isActive
                        ? "bg-neutral-800 text-white border-neutral-800 hover:bg-neutral-700"
                        : ""
                    }`}
                  >
                    Xem chi tiết
                  </Button>
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
