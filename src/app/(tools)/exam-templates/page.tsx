"use client";

import React, { useState } from "react";
import {
  useExamTemplatesService,
  useDeleteExamTemplateService,
  useCloneExamTemplateService,
} from "@/services/examTemplateServices";
import { Button } from "@/components/ui/Button";
import { Plus, Edit, Trash2, Copy, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ExamCreationModal from "@/components/organisms/exam-creation-modal";
import DeleteConfirmDialog from "@/components/organisms/delete-confirm-dialog";
import { useExamImportService } from "@/services/examImportServices";
import { useExamContext, ExamProvider } from "@/contexts/ExamContext";
import { ExamTemplateProvider } from "@/contexts/ExamTemplateContext";

interface ExamTemplate {
  id: string;
  name: string;
  subject: string;
  grade: number;
  durationMinutes: number;
  totalScore: number;
  createdAt: string;
  updatedAt: string;
}

function ExamTemplatesPageContent() {
  const router = useRouter();
  const { data: templates, isLoading, refetch } = useExamTemplatesService();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  // Initialize the exam import service
  const { mutate: importExam, isPending: isImporting } = useExamImportService();

  // Get exam context to store imported data
  const { setExamFromApiResponse } = useExamContext();

  // Initialize clone and delete services
  const { mutate: cloneTemplate, isPending: isCloning } =
    useCloneExamTemplateService();
  const { mutate: deleteTemplate, isPending: isDeleting } =
    useDeleteExamTemplateService();

  // Filter templates based on search term
  const filteredTemplates =
    templates?.data?.filter(
      (template: ExamTemplate) =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.subject.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleCreateTemplate = () => {
    setShowCreationModal(true);
  };

  const handleEditTemplate = (templateId: string) => {
    router.push(`/exam-templates/${templateId}`);
  };

  const handleViewTemplate = (templateId: string) => {
    router.push(`/exam-templates/${templateId}`);
  };

  const handleDuplicateTemplate = (templateId: string) => {
    if (isCloning) return;

    cloneTemplate(templateId, {
      onSuccess: () => {
        toast.success("Nhân bản template thành công!");
        refetch(); // Refresh the templates list
      },
      onError: (error: any) => {
        console.error("Clone template failed:", error);
        toast.error(
          error?.response?.data?.message ||
            "Nhân bản template thất bại. Vui lòng thử lại!"
        );
      },
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplateToDelete(templateId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!templateToDelete || isDeleting) return;

    deleteTemplate(templateToDelete, {
      onSuccess: () => {
        toast.success("Xóa template thành công!");
        setShowDeleteDialog(false);
        setTemplateToDelete(null);
        refetch(); // Refresh the templates list
      },
      onError: (error: any) => {
        console.error("Delete template failed:", error);
        toast.error(
          error?.response?.data?.message ||
            "Xóa template thất bại. Vui lòng thử lại!"
        );
      },
    });
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setTemplateToDelete(null);
  };

  const handleFileSubmit = (files: File[]) => {
    console.log("=== FILE SUBMIT HANDLER ===");
    console.log("Number of files:", files.length);

    // Create FormData for file upload
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(`file`, file);
    });

    // Call the exam import service
    importExam(formData, {
      onSuccess: (response) => {
        console.log("Exam import successful:", response);
        toast.success("Import đề thi thành công!");

        // Store imported data in context
        setExamFromApiResponse(response);

        // Close modal and navigate to exam-creation
        setShowCreationModal(false);
        router.push("/exam-creation");
      },
      onError: (error) => {
        console.error("Exam import failed:", error);
        toast.error("Import đề thi thất bại. Vui lòng thử lại!");
      },
    });
  };

  const handleCreateManually = () => {
    setShowCreationModal(false);
    // Navigate to exam-creation for manual creation
    router.push("/exam-creation");
  };

  const handleModalClose = () => {
    setShowCreationModal(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Template Đề Thi</h1>
          <p className="text-gray-600">
            Tạo và quản lý các template đề thi để sử dụng nhiều lần
          </p>
        </div>
        <Button onClick={handleCreateTemplate}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo Template Mới
        </Button>
      </div>

      {/* Search and filter */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc môn học..."
          className="w-full p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Templates list */}
      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : isCloning || isDeleting ? (
        <div className="text-center py-10">
          <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>
            {isCloning ? "Đang nhân bản template..." : "Đang xóa template..."}
          </p>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-10 border border-dashed rounded-lg">
          <p className="text-gray-500 mb-4">Chưa có template nào</p>
          <Button onClick={handleCreateTemplate}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo Template Đầu Tiên
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template: ExamTemplate) => (
            <div
              key={template.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{template.name}</h3>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleViewTemplate(template.id)}
                    className="p-1 text-gray-500 hover:text-blue-500"
                    title="Xem chi tiết"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEditTemplate(template.id)}
                    className="p-1 text-gray-500 hover:text-green-500"
                    title="Chỉnh sửa"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicateTemplate(template.id)}
                    disabled={isCloning || isDeleting}
                    className="p-1 text-gray-500 hover:text-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Nhân bản"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    disabled={isCloning || isDeleting}
                    className="p-1 text-gray-500 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Xóa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {template.subject} - Lớp {template.grade}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{template.durationMinutes} phút</span>
                <span>{template.totalScore} điểm</span>
              </div>
              <div className="mt-4 pt-2 border-t text-xs text-gray-400">
                Cập nhật:{" "}
                {new Date(template.updatedAt).toLocaleDateString("vi-VN")}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      <ExamCreationModal
        isOpen={showCreationModal}
        onClose={handleModalClose}
        onImportFile={handleFileSubmit}
        onCreateManually={handleCreateManually}
        isImporting={isImporting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa template"
        itemName={
          templateToDelete
            ? templates?.data?.find(
                (t: ExamTemplate) => t.id === templateToDelete
              )?.name
            : undefined
        }
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function ExamTemplatesPage() {
  return (
    <ExamProvider>
      <ExamTemplateProvider>
        <ExamTemplatesPageContent />
      </ExamTemplateProvider>
    </ExamProvider>
  );
}
