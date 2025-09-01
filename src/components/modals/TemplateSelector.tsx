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
import { TemplateCardSkeleton } from "@/components/ui/TemplateCardSkeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedTemplate, setSelectedTemplate] =
    useState<SlideTemplateResponse | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] =
    useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);

  // Fetch templates
  const {
    data: templates,
    isLoading: isLoadingTemplates,
    error,
  } = useSlideTemplatesService(
    {
      retry: 1,
      staleTime: 0,
      queryKey: [
        "slide-templates",
        currentPage,
        pageSize,
        searchValue,
        sortOrder,
      ],
    },
    {
      page: currentPage,
      size: pageSize,
      name: searchValue,
      sortBy: "createdAt",
      status: "ACTIVE",
      sortDirection: sortOrder as "asc" | "desc",
    }
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filter and search logic
  const filteredTemplates = useMemo(() => {
    return templates?.data?.content || [];
  }, [templates?.data?.content]);

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
        <div className="rounded-lg w-full p-6">
          <div className="relative">
            <BannerWithOverlay
              // videoSrc="https://hxjigovnfjyaepkgvamd.supabase.co/storage/v1/object/public/planbook/Scene%2003%20-%204K%20(3840x2160)%20(1).mp4"
              imageSrc="/images/banner/bannerSlide.png"
              onSearch={handleClose}
              height="h-80"
              grid={10}
              mouse={0.1}
              strength={0.15}
              relaxation={0.9}
              className="mb-8 object-center"
              searchClassName="absolute bottom-10"
              quickActions={[]}
              hideSearch={true}
            />
            <img
              src="/images/logo/glassLogo.svg"
              className="h-16 absolute bottom-5 left-10"
            />
          </div>
          {/* Templates Grid */}
          {/* Search and Filter Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-sm">
              <Input
                placeholder="Tìm kiếm theo tên, mô tả..."
                value={searchValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchValue(e.target.value)
                }
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Mới nhất</SelectItem>
                <SelectItem value="asc">Cũ nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Templates Grid */}
          <div className="mt-8">
            {isLoadingTemplates ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 5 }).map((_, index) => (
                  <TemplateCardSkeleton key={index} />
                ))}
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
              <div className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredTemplates.map((template: SlideTemplateResponse) => (
                    <TemplateItem key={template.id} template={template} />
                  ))}
                </div>
                {/* Pagination */}
                {templates?.data?.totalPages >= 1 && (
                  <div className="mt-8 flex justify-end">
                    <Pagination className="!text-black justify-end">
                      <PaginationContent className="!text-black">
                        {/* Previous Button */}
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1)
                                handlePageChange(currentPage - 1);
                            }}
                            className={
                              currentPage === 1
                                ? "!text-black pointer-events-none opacity-50"
                                : "!text-black hover:!text-black"
                            }
                          />
                        </PaginationItem>

                        {/* Page Numbers (1-based) */}
                        {(() => {
                          const totalPages = templates.data.totalPages ?? 1;
                          const pages: React.ReactNode[] = [];

                          // luôn hiển thị trang 1
                          if (totalPages >= 1) {
                            pages.push(
                              <PaginationItem key={1}>
                                <PaginationLink
                                  href="#"
                                  isActive={currentPage === 1}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage !== 1) handlePageChange(1);
                                  }}
                                  className="!text-black hover:text-black"
                                >
                                  1
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }

                          // ellipsis đầu
                          if (currentPage > 3) {
                            pages.push(
                              <PaginationItem key="ellipsis-start">
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }

                          // các trang xung quanh current (cửa sổ ±1, bỏ trang 1 & cuối)
                          const start = Math.max(2, currentPage - 1);
                          const end = Math.min(totalPages - 1, currentPage + 1);

                          for (let p = start; p <= end; p++) {
                            pages.push(
                              <PaginationItem key={p}>
                                <PaginationLink
                                  href="#"
                                  isActive={currentPage === p}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage !== p) handlePageChange(p);
                                  }}
                                  className="!text-black hover:text-black"
                                >
                                  {p}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }

                          // ellipsis cuối
                          if (currentPage < totalPages - 2) {
                            pages.push(
                              <PaginationItem key="ellipsis-end">
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }

                          // luôn hiển thị trang cuối nếu > 1
                          if (totalPages > 1) {
                            pages.push(
                              <PaginationItem key={totalPages}>
                                <PaginationLink
                                  href="#"
                                  isActive={currentPage === totalPages}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage !== totalPages)
                                      handlePageChange(totalPages);
                                  }}
                                  className="!text-black hover:text-black"
                                >
                                  {totalPages}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }

                          return pages;
                        })()}

                        {/* Next Button */}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (
                                currentPage < (templates.data.totalPages ?? 1)
                              ) {
                                handlePageChange(currentPage + 1);
                              }
                            }}
                            className={
                              currentPage >= (templates.data.totalPages ?? 1)
                                ? "!text-black pointer-events-none opacity-50"
                                : "!text-black hover:!text-black"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
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
