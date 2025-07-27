"use client";

import React, { useState } from "react";
import {
  useExamTemplatesService,
  useDeleteExamTemplateService,
  useCloneExamTemplateService,
} from "@/services/examTemplateServices";
import { Button } from "@/components/ui/Button";
import { Plus, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ExamCreationModal from "@/components/organisms/exam-creation-modal";
import DeleteConfirmDialog from "@/components/organisms/delete-confirm-dialog";
import { useExamImportService } from "@/services/examImportServices";
import { useExamContext, ExamProvider } from "@/contexts/ExamContext";
import { ExamTemplateProvider } from "@/contexts/ExamTemplateContext";
import ExamTemplateCard, {
  ExamTemplate,
} from "@/components/molecules/exam-template-card";

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
        {/* Search and filter */}
        <div className="relative w-[30%]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <SearchIcon className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc môn học..."
            className="w-full pl-9 p-2 border border-gray-300 rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleCreateTemplate} className="bg-neutral-900">
          <Plus className="h-4 w-4 mr-2" />
          Tạo Template Mới
        </Button>
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
            <ExamTemplateCard
              key={template.id}
              template={template}
              onView={handleViewTemplate}
              // onEdit={handleEditTemplate}
              // onDuplicate={handleDuplicateTemplate}
              // onDelete={handleDeleteTemplate}
              // isCloning={isCloning}
              // isDeleting={isDeleting}
            />
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
