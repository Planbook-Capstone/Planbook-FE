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
  Search,
  Palette,
  X,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlideTemplateResponse } from "@/types";
import { useSlideTemplatesService } from "@/services/slideTemplateServices";
import { TemplateCard } from "@/components/ui/TemplateCard";
import Loading from "../ui/loading";
import BannerWithOverlay from "../organisms/banner/BannerWithOverlay";

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
  title = "Chọn mẫu",
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

  // Navigation functions
  const totalSlides = selectedTemplate
    ? Object.keys(selectedTemplate.imageBlocks || {}).length || 1
    : 1;

  const handlePrevSlide = () => {
    setSelectedThumbnailIndex((prev) =>
      prev > 0 ? prev - 1 : totalSlides - 1
    );
  };

  const handleNextSlide = () => {
    setSelectedThumbnailIndex((prev) =>
      prev < totalSlides - 1 ? prev + 1 : 0
    );
  };

  const handleClose = () => {
    setSearchValue("");
    setStatusFilter("all");
    setSelectedTemplate(null);
    setIsViewModalOpen(false);
    onClose();
  };

  // Template card component
  const TemplateItem = ({ template }: { template: SlideTemplateResponse }) => {
    return (
      <TemplateCard
        template={template}
        onView={handleViewTemplate}
        onSelect={handleSelectTemplate}
      />
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Template Selector Modal */}
      <div className="max-w-7xl mx-auto h-full bg-opacity-50 z-50">
        <div className="bg-white rounded-lg w-full p-6">
          <BannerWithOverlay
            videoSrc="https://res.cloudinary.com/dpo0ad3aq/video/upload/Scene_02_-_4K_3840x2160_gdzuhl.mp4"
            onSearch={handleClose}
            height="h-80"
            title=""
            grid={10}
            mouse={0.1}
            strength={0.15}
            relaxation={0.9}
            className="mb-8 object-center"
            searchClassName="absolute bottom-10"
            quickActions={[]}
          />

          {/* Templates Grid */}
          <div className="mt-18">
            {isLoadingTemplates ? (
              <div className="text-center py-12">
                <Loading />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTemplates.map((template: SlideTemplateResponse) => (
                  <TemplateItem key={template.id} template={template} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isViewModalOpen && selectedTemplate && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 h-full w-full">
              {/* Left side - Template Preview */}
              <div className="lg:col-span-2 bg-white p-6 flex flex-col">
                {/* Template Main Preview */}
                <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4 relative group">
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

                    {/* Navigation Arrows - Only show if more than 1 slide */}
                    {totalSlides > 1 && (
                      <>
                        {/* Previous Arrow */}
                        <button
                          onClick={handlePrevSlide}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Next Arrow */}
                        <button
                          onClick={handleNextSlide}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Slide Counter */}
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {selectedThumbnailIndex + 1} / {totalSlides}
                        </div>
                      </>
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
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-200 pt-4">
                  <Button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      handleSelectTemplate(selectedTemplate);
                    }}
                    className="w-full mb-3 bg-[linear-gradient(227deg,_#20DCDF_40.38%,_#25BEE5_56.58%,_#2C99EE_66.8%,_#368BEB_79.32%,_#3860D2_90.53%)]"
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
