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
import { Eye, Search, Palette, X, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlideTemplateResponse } from "@/types";
import { useSlideTemplatesService } from "@/services/slideTemplateServices";

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
  title?: string;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  title = "Chọn mẫu slide",
}) => {
  // State management
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] =
    useState<SlideTemplateResponse | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] =
    useState<number>(0);

  // Fetch templates
  const {
    data: templates,
    isLoading: isLoadingTemplates,
    error,
  } = useSlideTemplatesService(
    {
      retry: 1,
      staleTime: 0,
    },
    {
      offset: 1,
      pageSize: 50, // Get more templates
      sortBy: "createdAt",
      sortDirection: "desc",
    }
  );

  // Filter and search logic
  const filteredTemplates = useMemo(() => {
    const templateList = templates?.data?.content || [];
    return templateList.filter((template: SlideTemplateResponse) => {
      // Search filter
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
  }, [templates?.data?.content, searchValue, statusFilter]);

  // Handlers
  const handleViewTemplate = (template: SlideTemplateResponse) => {
    setSelectedTemplate(template);
    setSelectedThumbnailIndex(0);
    setIsViewModalOpen(true);
  };

  const handleSelectTemplate = (template: SlideTemplateResponse) => {
    onSelectTemplate(template.id);
    onClose();
  };

  const handleClose = () => {
    setSearchValue("");
    setStatusFilter("all");
    setSelectedTemplate(null);
    setIsViewModalOpen(false);
    onClose();
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
                onClick={() => handleSelectTemplate(template)}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                <Palette className="w-4 h-4 mr-1" />
                Chọn mẫu này
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
                  onClick={() => handleSelectTemplate(template)}
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Chọn mẫu này
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Template Info */}
        <div className="p-4">
          <h3 className="font-calsans text-lg text-gray-900 mb-2 line-clamp-1">
            {template.name}
          </h3>
          <p className="text-sm text-gray-600 font-questrial mb-3 line-clamp-2">
            {template.description || "Không có mô tả"}
          </p>

          {/* Template metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>ID: {template.id}</span>
            <span
              className={`px-2 py-1 rounded-full ${
                template.status === "ACTIVE"
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {template.status === "ACTIVE" ? "Hoạt động" : "Vô hiệu"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Template Selector Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold">{title}</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search and Filter */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên, mô tả..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-10"
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
          </div>

          {/* Templates Grid */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {isLoadingTemplates ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-500">Đang tải templates...</p>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-calsans text-gray-900 mb-2">
                  Không tìm thấy template
                </h3>
                <p className="text-gray-600 font-questrial">
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template: SlideTemplateResponse) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Template Modal - Beautiful Layout like original */}
      {isViewModalOpen && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden">
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

                  {/* Template Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Số slide</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {Object.keys(selectedTemplate.imageBlocks || {})
                          .length || 1}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Trạng thái</p>
                      <p
                        className={`text-sm font-medium ${
                          selectedTemplate.status === "ACTIVE"
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      >
                        {selectedTemplate.status === "ACTIVE"
                          ? "Hoạt động"
                          : "Vô hiệu"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-200 pt-4">
                  <Button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      handleSelectTemplate(selectedTemplate);
                    }}
                    className="w-full mb-3 bg-green-500 hover:bg-green-600"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Chọn mẫu này
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setIsViewModalOpen(false)}
                    className="w-full"
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
