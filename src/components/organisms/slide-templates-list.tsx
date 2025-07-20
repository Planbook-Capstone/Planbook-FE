"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SlideTemplate, TEMPLATE_CATEGORIES } from "@/types/slide-template";
import { mockSlideTemplates } from "@/data/slide-templates";
import {
  Eye,
  Edit,
  Trash2,
  Search,
  Palette,
  Plus,
  MoreVertical,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateSlideTemplateForm from "@/components/organisms/create-slide-template-form";
import { useSlideTemplateContext } from "@/contexts/SlideTemplateContext";

interface SlideTemplatesListProps {
  onEdit: (template: SlideTemplate) => void;
  onDelete: (templateId: string) => void;
  showCreateButton?: boolean;
}

export default function SlideTemplatesList({
  onEdit,
  onDelete,
  showCreateButton = false,
}: SlideTemplatesListProps) {
  const router = useRouter();
  const { setTempData } = useSlideTemplateContext();

  // State management
  const [templates, setTemplates] =
    useState<SlideTemplate[]>(mockSlideTemplates);
  const [searchValue, setSearchValue] = useState("");

  // Debug logs
  console.log("SlideTemplatesList rendered with:", {
    showCreateButton,
    templatesCount: templates.length,
    searchValue,
  });

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<SlideTemplate | null>(null);

  // Filter and search logic
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      // Search filter (name, description, or tags)
      const searchMatch =
        template.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        template.description
          ?.toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        template.tags.some((tag) =>
          tag.toLowerCase().includes(searchValue.toLowerCase())
        );

      return searchMatch;
    });
  }, [templates, searchValue]);

  // Handlers
  const handleViewTemplate = (template: SlideTemplate) => {
    setSelectedTemplate(template);
    setIsViewModalOpen(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa template này?")) {
      setTemplates((prev) => prev.filter((t) => t.id !== templateId));
      onDelete(templateId);
    }
  };

  const handleDesignTemplate = (template: SlideTemplate) => {
    router.push(`/slide-template-editor/edit/${template.id}`);
  };

  // Get category label
  const getCategoryLabel = (category: string) => {
    const categoryOption = TEMPLATE_CATEGORIES.find(
      (cat) => cat.value === category
    );
    return categoryOption?.label || category;
  };

  // Template card component
  const TemplateCard = ({ template }: { template: SlideTemplate }) => {
    return (
      <div className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
        {/* Template Thumbnail */}
        <div className="aspect-[16/9] bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
          {template.thumbnail ? (
            <img
              src={template.thumbnail}
              alt={template.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Palette className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 font-questrial">
                  {template.name}
                </p>
              </div>
            </div>
          )}

          {/* Hover overlay with actions */}
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleViewTemplate(template)}
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                <Eye className="w-4 h-4 mr-1" />
                Xem
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDesignTemplate(template)}
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                <Palette className="w-4 h-4 mr-1" />
                Thiết kế
              </Button>
            </div>
          </div>

          {/* Actions dropdown */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-8 h-8 p-0 bg-white text-gray-900 hover:bg-gray-100"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewTemplate(template)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDesignTemplate(template)}
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Thiết kế slide
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(template)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Template Info */}
        <div className="p-4">
          <h3 className="font-calsans text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {template.name}
          </h3>
          <p className="text-sm text-gray-600 font-questrial mb-3 line-clamp-2">
            {template.description || "Không có mô tả"}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-questrial">
              {template.slides.length} slide
              {template.slides.length > 1 ? "s" : ""}
            </span>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                template.isPublic
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {template.isPublic ? "Công khai" : "Riêng tư"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header with Search and Create Button */}
      <div className="flex justify-between items-center mb-6">
        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên, mô tả hoặc tag..."
            value={searchValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchValue(e.target.value)
            }
            className="pl-10"
          />
        </div>

        {/* Create Button */}
        {showCreateButton && (
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tạo Template
          </Button>
        )}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-calsans text-gray-900 mb-2">
            Không tìm thấy template
          </h3>
          <p className="text-gray-600 font-questrial">
            Thử thay đổi từ khóa tìm kiếm hoặc tạo template mới
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}

      {/* View Template Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-calsans">
              Chi tiết Template
            </DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Tên Template
                  </label>
                  <p className="font-questrial text-gray-900">
                    {selectedTemplate.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Danh mục
                  </label>
                  <p className="font-questrial text-gray-900">
                    {getCategoryLabel(selectedTemplate.category)}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">
                    Mô tả
                  </label>
                  <p className="font-questrial text-gray-900">
                    {selectedTemplate.description || "Không có mô tả"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Số slide
                  </label>
                  <p className="font-questrial text-gray-900">
                    {selectedTemplate.slides.length} slide
                    {selectedTemplate.slides.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Trạng thái
                  </label>
                  <p className="font-questrial text-gray-900">
                    {selectedTemplate.isPublic ? "Công khai" : "Riêng tư"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Ngày tạo
                  </label>
                  <p className="font-questrial text-gray-900">
                    {selectedTemplate.createdAt.toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Cập nhật lần cuối
                  </label>
                  <p className="font-questrial text-gray-900">
                    {selectedTemplate.updatedAt.toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Đóng
                </Button>
                <Button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    onEdit(selectedTemplate);
                  }}
                >
                  Chỉnh sửa
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Template Modal */}
      <CreateSlideTemplateForm
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={(tempData) => {
          // Lưu temp data vào Context
          setTempData(tempData);

          // Redirect to create page (không cần URL params)
          router.push("/staff/slide-templates/create");
        }}
      />
    </div>
  );
}
