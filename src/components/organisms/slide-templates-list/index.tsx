"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { SlideTemplateResponse } from "@/types";

interface SlideTemplatesListProps {
  onEdit: (template: SlideTemplateResponse) => void;
  onDelete: (templateId: string) => void;
  showCreateButton?: boolean;
  initialTemplates?: SlideTemplateResponse[];
}

export default function SlideTemplatesList({
  onEdit,
  onDelete,
  showCreateButton = false,
  initialTemplates,
}: SlideTemplatesListProps) {
  const router = useRouter();
  const { setTempData } = useSlideTemplateContext();

  // State management
  const [templates, setTemplates] = useState(initialTemplates || []);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Update templates when initialTemplates changes
  useEffect(() => {
    if (initialTemplates) {
      setTemplates(initialTemplates);
    }
  }, [initialTemplates]);

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<SlideTemplateResponse | null>(null);

  // Selected thumbnail state
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] =
    useState<number>(0);

  // Filter and search logic
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      // Search filter (name, description, or tags)
      const searchMatch =
        template.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchValue.toLowerCase());

      // Status filter
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "active" && template.status === "ACTIVE") ||
        (statusFilter === "inactive" && template.status === "INACTIVE");

      return searchMatch && statusMatch;
    });
  }, [templates, searchValue, statusFilter]);

  // Handlers
  const handleViewTemplate = (template: SlideTemplateResponse) => {
    setSelectedTemplate(template);
    setSelectedThumbnailIndex(0); // Reset to first slide
    setIsViewModalOpen(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa template này?")) {
      setTemplates((prev: any) => prev.filter((t: any) => t.id !== templateId));
      onDelete(templateId);
    }
  };

  const handleDesignTemplate = (template: SlideTemplateResponse) => {
    router.push(`/staff/slide-templates/edit/${template.id}`);
  };

  // Template card component
  const TemplateCard = ({ template }: { template: SlideTemplateResponse }) => {
    return (
      <div className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
        {/* Template Thumbnail */}
        <div className="aspect-[16/9] bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
          {Object.values(template.imageBlocks ?? {})[0] ? (
            <img
              src={Object.values(template.imageBlocks ?? {})[0]}
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
        {/* <div className="p-4 absolute bottom-0 bg-white rounded-tr-2xl">
          <h3 className="font-calsans text-lg text-gray-900 mb-2 line-clamp-1">
            {template.name}
          </h3>
          <p className="text-sm text-gray-600 font-questrial mb-3 line-clamp-2">
            {template.description || "Không có mô tả"}
          </p>
        </div> */}
      </div>
    );
  };

  return (
    <div>
      {/* Header with Search, Filter and Create Button */}
      <div className="flex justify-between items-center mb-6">
        {/* Left side - Search and Filter */}
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên, mô tả..."
              value={searchValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchValue(e.target.value)
              }
              className="pl-10 w-80"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Vô hiệu hoá</SelectItem>
            </SelectContent>
          </Select>
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
        <DialogContent className="min-w-7xl max-h-[100vh] p-0 overflow-hidden">
          {selectedTemplate && (
            <div className="grid grid-cols-1 lg:grid-cols-3 h-full w-full">
              {/* Left side - Template Preview */}
              <div className="lg:col-span-2 bg-gray-50 p-6 flex flex-col">
                {/* Template Main Preview */}
                <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
                  <div className="aspect-[16/9] bg-gradient-to-br from-blue-50 to-purple-50 relative">
                    {Object.values(selectedTemplate.imageBlocks ?? {})[
                      selectedThumbnailIndex
                    ] ? (
                      <img
                        src={
                          Object.values(selectedTemplate.imageBlocks ?? {})[
                            selectedThumbnailIndex
                          ]
                        }
                        alt={`${selectedTemplate.name} - Slide ${
                          selectedThumbnailIndex + 1
                        }`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-xl font-calsans text-gray-700 mb-2">
                            {selectedTemplate.name}
                          </h3>
                          <p className="text-gray-500 font-questrial">
                            Template Preview - Slide{" "}
                            {selectedThumbnailIndex + 1}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Slide Thumbnails */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {Object.entries(selectedTemplate.imageBlocks || {}).map(
                    ([key, imageUrl], index) => (
                      <div
                        key={key}
                        onClick={() => setSelectedThumbnailIndex(index)}
                        className={`flex-shrink-0 w-20 h-12 bg-white rounded border-2 overflow-hidden cursor-pointer transition-all hover:border-blue-400 ${
                          selectedThumbnailIndex === index
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-200"
                        }`}
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs text-gray-400">
                              {index + 1}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  )}
                  {/* Show at least one thumbnail if no imageBlocks */}
                  {(!selectedTemplate.imageBlocks ||
                    Object.keys(selectedTemplate.imageBlocks).length === 0) && (
                    <div className="flex-shrink-0 w-20 h-12 bg-white rounded border border-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-400">1</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right side - Template Info */}
              <div className="bg-white p-6 flex flex-col">
                <div className="flex-1">
                  {/* Header */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-calsans text-gray-900 mb-2">
                      {selectedTemplate.name}
                    </h2>
                    <p className="text-sm text-gray-600 font-questrial mb-4">
                      {selectedTemplate.description || "Không có mô tả"}
                    </p>

                    {/* Template ID info */}
                    <div className="flex items-center gap-2 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Template #{selectedTemplate.id}
                        </p>
                        <p className="text-xs text-gray-500">ID Template</p>
                      </div>
                    </div>
                  </div>

                  {/* Template Details */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Trạng thái
                      </label>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedTemplate.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedTemplate.status === "ACTIVE"
                            ? "Hoạt động"
                            : "Vô hiệu hoá"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Ngày tạo
                      </label>
                      <p className="mt-1 text-sm text-gray-900 font-questrial">
                        {selectedTemplate.createdAt}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Cập nhật lần cuối
                      </label>
                      <p className="mt-1 text-sm text-gray-900 font-questrial">
                        {selectedTemplate.updatedAt}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-200 pt-4">
                  <Button
                    onClick={() => handleDesignTemplate(selectedTemplate)}
                    className="w-full mb-3 bg-cyan-400 hover:bg-lime-300"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Tùy chỉnh mẫu này
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsViewModalOpen(false)}
                      className="flex-1"
                    >
                      Đóng
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsViewModalOpen(false);
                        onEdit(selectedTemplate);
                      }}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Chỉnh sửa
                    </Button>
                  </div>
                </div>
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
