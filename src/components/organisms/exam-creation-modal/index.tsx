"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FileText, X, ChevronLeft } from "lucide-react";
import ExamFileImport from "../exam-file-import";
import { useToolResultsWithParamsService } from "@/services/toolResultService";
import { useAuth } from "@/hooks/useAuth";
import DocumentItem from "@/components/molecules/document-item";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { GridSkeleton } from "@/components/molecules/grid-skeleton";

interface ExamCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportFile: (files: File[]) => void;
  onCreateManually: () => void;
  onSelectFromLibrary?: (examData: any) => void;
  isImporting?: boolean;
}

export default function ExamCreationModal({
  isOpen,
  onClose,
  onImportFile,
  onCreateManually,
  onSelectFromLibrary,
  isImporting = false,
}: ExamCreationModalProps) {
  const { user } = useAuth();
  const [selectedMode, setSelectedMode] = useState<
    "none" | "import" | "manual" | "mylibrary"
  >("none");

  // Pagination state for library
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(9);

  // Fetch tool results for library mode
  const { data: toolResults, isLoading: isLoadingLibrary } =
    useToolResultsWithParamsService(
      [currentPage, pageSize], // dependencies for query key
      { retry: 1, staleTime: 0, enabled: selectedMode === "mylibrary" }, // options
      {
        userId: user?.id,
        page: currentPage + 1,
        size: pageSize,
        sort: "createdAt,desc",
        type: "EXAM",
        status: "ARCHIVED",
      }
    );

  const handleModeSelect = (mode: "import" | "manual" | "mylibrary") => {
    setSelectedMode(mode);
    if (mode === "mylibrary") {
      setCurrentPage(0); // Reset pagination when entering library mode
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLibraryItemSelect = (item: any) => {
    if (onSelectFromLibrary) {
      onSelectFromLibrary(item);
    }
    handleClose();
  };

  const handleFileSubmit = (files: File[]) => {
    onImportFile(files);
  };

  const handleBackToSelection = () => {
    setSelectedMode("none");
    setCurrentPage(0); // Reset pagination when going back
  };

  const handleClose = () => {
    setSelectedMode("none");
    setCurrentPage(0); // Reset pagination when closing
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center">
            {(selectedMode === "import" ||
              selectedMode === "manual" ||
              selectedMode === "mylibrary") && (
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  onClick={handleBackToSelection}
                  className=" text-gray-600 hover:text-gray-900 hover:bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Quay lại
                </Button>
                <div className="bg-neutral-300 w-[1px] h-6 mr-2"></div>
              </div>
            )}

            <h2 className="text-2xl font-calsans text-gray-900">
              Tạo mẫu đề thi
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 border rounded-full p-0 h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Show mode selection when no mode is selected */}
          {selectedMode === "none" && (
            <div>
              <p className="text-gray-600 font-questrial text-lg mb-8">
                Chọn cách tạo mẫu đề thi mới. Mẫu có thể được sử dụng nhiều lần
                để tạo các đề thi khác nhau.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Import từ DOCX */}
                <div
                  className="overflow-hidden relative rounded-lg p-10 group hover:shadow-md transition-all cursor-pointer flex flex-col items-start justify-end text-center aspect-[4/3] w-full"
                  onClick={() => handleModeSelect("import")}
                >
                  <h2 className="text-6xl mb-2 z-10 text-white text-start">
                    Import từ <br />
                    <span className="font-calsans text-white underline bg-clip-text leading-tight">
                      DOCX
                    </span>
                  </h2>
                  <img
                    src={"/images/illustration/docx.svg"}
                    className="absolute group-hover:scale-110 transition-all -bottom-1/4 -right-1/6 h-[110%] object-cover z-10"
                  />
                  <img
                    src={"/images/background/import.svg"}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                </div>

                {/* Tạo thủ công */}
                <div
                  className="overflow-hidden relative rounded-lg p-10 group hover:shadow-md transition-all cursor-pointer flex flex-col items-end justify-start aspect-[4/3] w-full"
                  onClick={() => handleModeSelect("mylibrary")}
                >
                  <h2 className="text-5xl mb-3 z-10 text-white text-end">
                    Đề từ <br />
                    <span className="font-calsans bg-clip-text leading-tight">
                      kho tài liệu
                    </span>
                  </h2>
                  <img
                    src={"/images/illustration/document.svg"}
                    className="absolute group-hover:scale-110 h-[70%] left-0 bottom-0 transition-all object-cover z-10"
                  />
                  <img
                    src={"/images/background/library.svg"}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                </div>

                <div
                  className="overflow-hidden relative rounded-lg p-10 group hover:shadow-md transition-all cursor-pointer flex flex-col items-end justify-start aspect-[4/3] w-full"
                  // onClick={() => handleModeSelect("manual")}
                  onClick={onCreateManually}
                >
                  <h2 className="text-6xl mb-2 z-10 text-white text-end">
                    Tạo mới <br />
                    <span className="font-calsans bg-clip-text leading-tight">
                      thủ công
                    </span>
                  </h2>
                  <img
                    src={"/images/illustration/text.svg"}
                    className="absolute group-hover:scale-110 h-[70%] left-0 bottom-0 transition-all object-cover z-10"
                  />
                  <img
                    src={"/images/background/manual.svg"}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Show file import interface when import mode is selected */}
          {selectedMode === "import" && (
            <div>
              <div className="flex justify-between items-center mb-6 mx-3">
                <div>
                  {" "}
                  <h3 className="text-xl font-calsans mb-2 text-gray-900">
                    Import Template từ File DOCX
                  </h3>
                  <p className="text-gray-600 font-questrial">
                    Tải lên file DOCX để tự động tạo template đề thi
                  </p>
                </div>
                <div>
                  <h1>Template mẫu</h1>
                  <p>
                    <span
                      style={{ color: '#2563eb', textDecoration: 'underline', cursor: 'pointer' }}
                      onClick={() => {
                        // Tải file docx về máy, không mở tab mới
                        const link = document.createElement('a');
                        link.href = 'https://docs.google.com/document/d/1BgfaPs088DnGtxtlvOBJL44xae8wKeSP/export?format=docx';
                        link.download = 'template-mau.docx';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      Click vào đây
                    </span>
                  </p>
                </div>
              </div>

              <ExamFileImport
                onSubmit={handleFileSubmit}
                isLoading={isImporting}
              />
            </div>
          )}

          {/* Show manual creation interface when manual mode is selected */}
          {selectedMode === "manual" && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-calsans mb-2 text-gray-900">
                  Tạo Template Thủ Công
                </h3>
                <p className="text-gray-600 font-questrial">
                  Tạo template từ đầu với trình soạn thảo trực quan
                </p>
              </div>

              <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-calsans mb-2 text-gray-900">
                  Bắt đầu tạo template mới
                </h4>
                <p className="text-gray-600 font-questrial mb-6 max-w-md mx-auto">
                  Sử dụng trình soạn thảo để tạo template đề thi với các câu hỏi
                  và phần thi tùy chỉnh
                </p>
                <Button
                  onClick={onCreateManually}
                  size="lg"
                  className="px-8 py-3"
                >
                  Tiếp tục
                </Button>
              </div>
            </div>
          )}

          {/* Show library interface when mylibrary mode is selected */}
          {selectedMode === "mylibrary" && (
            <div>
              <div className="mb-6 mx-3">
                <h3 className="text-xl font-calsans mb-2 text-gray-900">
                  Chọn đề kiểm tra từ kho tài liệu
                </h3>
                <p className="text-gray-600 font-questrial">
                  Chọn một đề kiểm tra đã lưu từ thư viện của bạn
                </p>
              </div>

              {/* Loading state */}
              {isLoadingLibrary && (
                <div>
                  <GridSkeleton
                    count={7}
                    height={150}
                    cols="grid-cols-2 lg:grid-cols-4"
                  />
                </div>
              )}

              {/* Tool results grid */}
              {!isLoadingLibrary && toolResults?.data?.content && (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {toolResults.data.content.map(
                      (item: any, index: number) => (
                        <div key={index} className="cursor-pointer">
                          <DocumentItem
                            type="DOCX"
                            name={item.name}
                            description={item.description}
                            lastModifiedTime={new Date(
                              item.updatedAt
                            ).toLocaleString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })}
                            onClick={() => handleLibraryItemSelect(item)}
                            onRemove={undefined} // No remove button in selection mode
                          />
                        </div>
                      )
                    )}
                  </div>

                  {/* Pagination */}
                  {toolResults.data.totalPages > 1 && (
                    <div className="flex justify-center">
                      <Pagination className="!text-black">
                        <PaginationContent className="!text-black">
                          {/* Previous Button */}
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 0) {
                                  handlePageChange(currentPage - 1);
                                }
                              }}
                              className={
                                currentPage === 0
                                  ? "!text-black pointer-events-none opacity-50"
                                  : "!text-black hover:!text-black"
                              }
                            />
                          </PaginationItem>

                          {/* Page Numbers */}
                          {Array.from(
                            {
                              length: Math.min(5, toolResults.data.totalPages),
                            },
                            (_, i) => {
                              const pageNumber =
                                currentPage < 3
                                  ? i
                                  : currentPage >
                                    toolResults.data.totalPages - 3
                                  ? toolResults.data.totalPages - 5 + i
                                  : currentPage - 2 + i;

                              if (
                                pageNumber < 0 ||
                                pageNumber >= toolResults.data.totalPages
                              )
                                return null;

                              return (
                                <PaginationItem key={pageNumber}>
                                  <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handlePageChange(pageNumber);
                                    }}
                                    isActive={currentPage === pageNumber}
                                    className="!text-black hover:!text-black"
                                  >
                                    {pageNumber + 1}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            }
                          )}

                          {/* Next Button */}
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (
                                  currentPage <
                                  toolResults.data.totalPages - 1
                                ) {
                                  handlePageChange(currentPage + 1);
                                }
                              }}
                              className={
                                currentPage === toolResults.data.totalPages - 1
                                  ? "!text-black pointer-events-none opacity-50"
                                  : "!text-black hover:!text-black"
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}

              {/* Empty state */}
              {!isLoadingLibrary &&
                (!toolResults?.data?.content ||
                  toolResults.data.content.length === 0) && (
                  <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-calsans mb-2 text-gray-900">
                      Chưa có đề kiểm tra nào
                    </h4>
                    <p className="text-gray-600 font-questrial mb-6 max-w-md mx-auto">
                      Bạn chưa có đề kiểm tra nào trong thư viện. Hãy tạo đề
                      kiểm tra mới trước.
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
