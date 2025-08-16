"use client";

import React, { useState, useEffect } from "react";
import {
  useExamTemplatesService,
  useDeleteExamTemplateService,
  useCloneExamTemplateService,
} from "@/services/examTemplateServices";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ExamCreationModal from "@/components/organisms/exam-creation-modal";
import DeleteConfirmDialog from "@/components/organisms/delete-confirm-dialog";
import { useExamImportService } from "@/services/examImportServices";
import { Modal } from "@/components/ui/modal";
import { CreateInstanceForm } from "@/components/organisms/create-instance-form";
import TemplatePreviewModal from "@/components/organisms/template-preview-modal";
import {
  useCreateExamInstanceService,
  CreateExamInstanceData,
} from "@/services/examInstanceServices";
import { useExamContext, ExamProvider } from "@/contexts/ExamContext";
import { ExamTemplateProvider } from "@/contexts/ExamTemplateContext";
import ExamTemplateCard, {
  ExamTemplate,
} from "@/components/molecules/exam-template-card";
import ExamTemplateTable from "@/components/organisms/table-exam-template";

function ExamTemplatesPageContent() {
  const router = useRouter();
  const { data: templates, isLoading, refetch } = useExamTemplatesService();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  // Disable reload warning for this page
  const { setDisableReloadWarning } = useExamContext();

  // Disable reload warning when component mounts
  useEffect(() => {
    setDisableReloadWarning(true);

    // Re-enable when component unmounts (user navigates away)
    return () => {
      setDisableReloadWarning(false);
    };
  }, [setDisableReloadWarning]);

  // States for create instance modal
  const [showCreateInstanceModal, setShowCreateInstanceModal] = useState(false);
  const [selectedTemplateForInstance, setSelectedTemplateForInstance] =
    useState<ExamTemplate | null>(null);

  // States for preview modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplateForPreview, setSelectedTemplateForPreview] = useState<
    string | null
  >(null);

  // Initialize the exam import service
  const { mutate: importExam, isPending: isImporting } = useExamImportService();

  // Get exam context to store imported data
  const { setExamFromApiResponse } = useExamContext();

  // Initialize clone and delete services
  const { mutate: cloneTemplate, isPending: isCloning } =
    useCloneExamTemplateService();
  const { mutate: deleteTemplate, isPending: isDeleting } =
    useDeleteExamTemplateService();

  // Initialize create instance service
  const { mutate: createInstance, isPending: isCreatingInstance } =
    useCreateExamInstanceService();

  // Filter templates based on search term and subject
  const filteredTemplates =
    templates?.data?.filter((template: ExamTemplate) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject =
        selectedSubject === "all" || template.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    }) || [];

  // Get unique subjects for filter dropdown
  const uniqueSubjects: string[] = templates?.data
    ? Array.from(
        new Set(
          templates.data.map(
            (template: ExamTemplate) => template.subject as string
          )
        )
      ).sort()
    : [];

  const handleCreateTemplate = () => {
    setShowCreationModal(true);
  };

  const handleEditTemplate = (templateId: string) => {
    router.push(`/exam-templates/${templateId}`);
  };

  const handleViewTemplate = (templateId: string) => {
    setSelectedTemplateForPreview(templateId);
    setShowPreviewModal(true);
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

  // Handler for creating instance from template
  const handleCreateInstance = (template: ExamTemplate) => {
    setSelectedTemplateForInstance(template);
    setShowCreateInstanceModal(true);
  };

  // Handler for submitting create instance form
  const handleCreateInstanceSubmit = (data: CreateExamInstanceData) => {
    createInstance(data, {
      onSuccess: () => {
        toast.success("Tạo phiên kiểm tra thành công!");
        setShowCreateInstanceModal(false);
        setSelectedTemplateForInstance(null);
        // Navigate to exam instances page
        router.push("/exam-instances");
      },
      onError: (error: any) => {
        console.error("Create instance failed:", error);
        toast.error(
          error?.response?.data?.message ||
            "Tạo phiên kiểm tra thất bại. Vui lòng thử lại!"
        );
      },
    });
  };

  // Handler for canceling create instance
  const handleCancelCreateInstance = () => {
    setShowCreateInstanceModal(false);
    setSelectedTemplateForInstance(null);
  };

  // Handler for closing preview modal
  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
    setSelectedTemplateForPreview(null);
  };

  const handleFileSubmit = (files: File[]) => {
    // Create FormData for file upload
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(`file`, file);
    });

    // Add staff_import field
    formData.append("staff_import", "false");

    // Call the exam import service
    importExam(formData, {
      onSuccess: (response) => {
        console.log("Exam import successful:", response?.data?.warnings);
        toast.error(response?.data?.warnings, {
          style: {
            background: "#fca5a5", // đỏ Tailwind red-600
            color: "black",
            border: "1px solid #b91c1c",
          },
        });

        // Store imported data in context
        setExamFromApiResponse(response);

        // Close modal and navigate to exam-creation
        setShowCreationModal(false);
        router.push("/exam-templates/create");
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
    router.push("/exam-templates/create");
  };

  const handleModalClose = () => {
    setShowCreationModal(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        {/* Search and filter */}
        <div className="flex gap-4 w-[50%]">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <SearchIcon className="h-4 w-4" />
            </span>
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc môn học..."
              className="w-full pl-9 rounded-full"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[200px] rounded-full">
              <SelectValue placeholder="Tất cả môn học" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả môn học</SelectItem>
              {uniqueSubjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleCreateTemplate} className="bg-neutral-900">
          <Plus className="h-4 w-4 mr-2" />
          Tạo đề thi Mới
        </Button>
      </div>
      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <ExamTemplateTable
          examTemplates={filteredTemplates}
          onViewDetail={(template) => handleViewTemplate(template.id)}
          onEdit={(template) => handleEditTemplate(template.id)}
          onDelete={(template) => handleDeleteTemplate(template.id)}
          onDuplicate={(template) => handleDuplicateTemplate(template.id)}
          onCreateInstance={handleCreateInstance}
        />
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

      {/* Create Instance Modal */}
      <Modal
        isOpen={showCreateInstanceModal}
        onClose={handleCancelCreateInstance}
        title="Tạo phiếm kiểm tra"
        size="lg"
      >
        {selectedTemplateForInstance && (
          <CreateInstanceForm
            selectedTemplate={{
              id: selectedTemplateForInstance.id,
              name: selectedTemplateForInstance.name,
              subject: selectedTemplateForInstance.subject,
              grade: selectedTemplateForInstance.grade || 10,
              durationMinutes: selectedTemplateForInstance.durationMinutes,
              totalScore: selectedTemplateForInstance.totalScore || 10,
            }}
            onSubmit={handleCreateInstanceSubmit}
            onCancel={handleCancelCreateInstance}
            isLoading={isCreatingInstance}
          />
        )}
      </Modal>

      {/* Template Preview Modal */}
      {selectedTemplateForPreview && (
        <TemplatePreviewModal
          isOpen={showPreviewModal}
          onClose={handleClosePreviewModal}
          templateId={selectedTemplateForPreview}
        />
      )}
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
