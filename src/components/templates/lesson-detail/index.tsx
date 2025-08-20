"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  BreadcrumbTrail,
  type BreadcrumbItem,
} from "@/components/ui/BreadcrumbTrail";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/modal";
import { Upload, FileText, X, Eye } from "lucide-react";
import { UploadIcon } from "@/constants/icon";
import {
  useTextbookByLessonIdService,
  useQuickTextBookAnalysisService,
  useDeletePdfWithQuery,
} from "@/services/textbookServices";
import TaskProgressWrapper from "@/components/molecules/task-progress-wrapper";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { CloseOutlined } from "@ant-design/icons";
interface LessonDetailProps {
  lesson: any;
  selectedGrade?: any;
  selectedSubject?: any;
  selectedBook?: any;
  onBack: () => void;
  onBackToGrades: () => void;
  onBackToSubjects: () => void;
  onBackToBooks: () => void;
  onBackToLessons: () => void;
}

const LessonDetail: React.FC<LessonDetailProps> = ({
  lesson,
  selectedGrade,
  selectedSubject,
  selectedBook,
  onBack,
  onBackToGrades,
  onBackToSubjects,
  onBackToBooks,
  onBackToLessons,
}) => {
  // State for import modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // State for view modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // State for task progress tracking
  const [activeTaskIds, setActiveTaskIds] = useState<string[]>([]);

  // Function to remove completed tasks and refetch textbook data
  const removeCompletedTask = (taskId: string) => {
    setActiveTaskIds((prev) => prev.filter((id) => id !== taskId));

    // Refetch textbook data when task completed
    queryClient.invalidateQueries({
      queryKey: ["secondary-textbook", lesson?.id],
    });
  };

  // Quick textbook analysis mutation
  const { mutateAsync: quickAnalysisMutateAsync, isPending } =
    useQuickTextBookAnalysisService();
  const queryClient = useQueryClient();

  // Delete PDF mutation
  const { mutate: deletePdf, isPending: isDeleting } = useDeletePdfWithQuery();

  // Handle delete PDF
  const handleDeletePdf = () => {
    if (!lesson?.id || !selectedBook?.id) return;

    // Create delete payload with both lesson_id and book_id
    const deletePayload = {
      lesson_id: lesson.id,
      book_id: lesson?.chapter?.book?.id,
    };

    deletePdf(deletePayload, {
      onSuccess: () => {
        toast.success("Xóa file PDF thành công!");
        setIsDeleteModalOpen(false);

        // Reset query data và force refetch để hiển thị loading
        queryClient.resetQueries({
          queryKey: ["secondary-textbook", lesson.id],
        });

        // Force refetch để load data mới
        queryClient.refetchQueries({
          queryKey: ["secondary-textbook", lesson.id],
        });
      },
      onError: (error: any) => {
        console.error("Delete PDF failed:", error);
        toast.error(
          error?.response?.data?.message ||
            "Xóa file PDF thất bại. Vui lòng thử lại!"
        );
      },
    });
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        alert("Vui lòng chọn file PDF hoặc DOCX");
        event.target.value = "";
      }
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile || !lesson?.id || !selectedBook?.id) {
      alert("Thiếu thông tin cần thiết để upload file");
      return;
    }

    try {
      // Create FormData for quick analysis
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("lesson_id", lesson.id);
      formData.append("book_id", selectedBook.id);
      formData.append("create_embeddings", "true");

      // Call the quick textbook analysis service
      const response = await quickAnalysisMutateAsync(formData, {
        onSuccess: (response) => {
          setIsImportModalOpen(false);
          setSelectedFile(null);
        },
        onError: (error) => {
          console.error("❌ Quick Analysis Error:", error);
        },
      });

      // Get taskId from response and add to activeTaskIds
      const taskId = response?.data?.task_id;

      // Add task_id to activeTaskIds array
      if (taskId) {
        setActiveTaskIds((prev) => [...prev, taskId]);
        toast.success(
          `Đang tiến hành phân tích PDF cho bài "${lesson.name}"...`
        );
      }

      // Invalidate and refetch textbook data
      await queryClient.invalidateQueries({
        queryKey: ["secondary-textbook", lesson.id],
      });

      // Close modal and reset state
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload thất bại. Vui lòng thử lại.");
    }
  };

  // Generate breadcrumbs for lesson detail view
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      {
        label: "Khối lớp",
        onClick: onBackToGrades,
      },
    ];

    if (selectedGrade) {
      breadcrumbs.push({
        label: `Khối ${selectedGrade.name}`,
        onClick: onBackToGrades,
      });
    }

    if (selectedSubject) {
      breadcrumbs.push({
        label: `Môn ${selectedSubject.name}`,
        onClick: onBackToSubjects,
      });
    }

    if (selectedBook) {
      breadcrumbs.push({
        label: selectedBook.name,
        onClick: onBackToBooks,
      });
    }

    // Add lessons breadcrumb
    breadcrumbs.push({
      label: "Danh sách bài học",
      onClick: onBackToLessons,
    });

    // Add current lesson breadcrumb
    breadcrumbs.push({
      label: lesson.name,
      active: true,
    });

    return breadcrumbs;
  };

  const { data: textbook, isLoading } = useTextbookByLessonIdService(
    [lesson?.id], // dependencies array
    {
      enabled: !!lesson?.id,
      retry: false, // Không retry khi gặp lỗi
      refetchOnWindowFocus: false, // Không refetch khi focus window
      refetchOnMount: false, // Không refetch khi component mount lại
      refetchOnReconnect: false, // Không refetch khi reconnect
      staleTime: 0, // Cho phép refetch ngay lập tức
    },
    {
      lesson_id: lesson?.id, // query parameters
    }
  );

  if (activeTaskIds.length) {
    return (
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Tiến trình phân tích PDF
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTaskIds.map((taskId) => (
            <TaskProgressWrapper
              key={taskId}
              taskId={taskId}
              onTaskCompleted={removeCompletedTask}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <BreadcrumbTrail items={getBreadcrumbs()} />
      </div>

      {/* Lesson Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-4">
          <div className="flex flex-col justify-end items-start">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {lesson.name}
            </h1>
            <p>{lesson.createdAt}</p>
          </div>
        </div>
        {isLoading ? (
          <>
            <div className="w-1/5">
              <Skeleton className="h-[40px] w-full rounded-md bg-neutral-300" />
            </div>
          </>
        ) : (
          <div>
            <Button
              variant={"custom"}
              onClick={() => setIsImportModalOpen(true)}
            >
              {textbook?.data?.lessons[0]?.file_url
                ? "Sửa nội dung sách"
                : "Import nội dung sách"}
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(1)].map((_, index) => (
            <Skeleton
              key={index}
              className="h-[150px] w-full rounded-md bg-neutral-300"
            />
          ))}
        </div>
      ) : (
        <>
          {/* Lesson Content */}
          <div className="">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Nội dung bài
            </h2>
            {textbook?.data?.lessons[0]?.file_url ? (
              <div className="relative flex justify-between items-center w-1/4 border border-dashed rounded-md p-3">
                <div className="flex items-center gap-2">
                  <div>
                    <img src={"/images/files/PDF.svg"} alt="Document icon" />
                  </div>
                  <p className="text-blue-500">Sách giáo khoa</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsViewModalOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Xem
                  </Button>
                  <button
                    className=" hover:scale-105 cursor-pointer mt-1 absolute -right-2 -top-3 hover:bg-red-400 border h-6 w-6 rounded-full shadow-base"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering parent onClick
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <CloseOutlined className="h-2 w-2" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-start items-end gap-2 w-1/4 border border-dashed rounded-md p-3">
                <div>
                  <img src={"/images/files/PDF.svg"} alt="Document icon" />
                </div>
                <p className="text-gray-400">Chưa có sách giáo khoa</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Import File Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          setSelectedFile(null);
        }}
        title="Import nội dung sách"
        size="md"
      >
        <div className="space-y-6">
          {/* File Upload Area */}
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Chọn file PDF để import nội dung sách
            </div>

            {!selectedFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload-import"
                />

                <label htmlFor="file-upload-import" className="cursor-pointer">
                  <div className="w-32 h-32 mx-auto">{UploadIcon}</div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Chọn file để upload
                  </p>
                  <p className="text-sm text-gray-500">
                    Chỉ hỗ trợ file PDF (tối đa 10MB)
                  </p>
                </label>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsImportModalOpen(false);
                setSelectedFile(null);
              }}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button
              variant="custom"
              onClick={handleUpload}
              disabled={!selectedFile || isPending}
            >
              {isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang upload...</span>
                </div>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Textbook Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Xem sách giáo khoa"
        size="xl"
      >
        <div className="h-full">
          {textbook?.data?.lessons[0]?.file_url ? (
            <iframe
              src={textbook.data.lessons[0].file_url}
              className="w-full h-full border-0"
              title="Sách giáo khoa"
              style={{ minHeight: "80vh" }}
            />
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Không có file để hiển thị</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Xác nhận xóa"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Bạn có chắc chắn muốn xóa file PDF này không? Hành động này không
            thể hoàn tác.
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePdf}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang xóa...</span>
                </div>
              ) : (
                "Xóa"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LessonDetail;
