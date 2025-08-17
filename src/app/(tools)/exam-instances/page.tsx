"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/modal";
import { TemplateSelector } from "@/components/organisms/template-selector";
import { CreateInstanceForm } from "@/components/organisms/create-instance-form";
import {
  useExamInstancesService,
  useCreateExamInstanceService,
  CreateExamInstanceData,
  ExamInstanceData,
  ChangeStatusData,
} from "@/services/examInstanceServices";
import { AlertTriangle } from "lucide-react";

import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/config/axios";
import { EXAM_ENDPOINTS } from "@/constants/apiEndpoints";
import { NoneExamIcon } from "@/constants/icon";
import ExamInstanceTable from "@/components/organisms/table-exam-instance";

interface TemplateInfo {
  id: string;
  name: string;
  subject: string;
  grade: number;
  durationMinutes: number;
  totalScore: number;
}

interface StatusChangeConfirm {
  instance: ExamInstanceData;
  newStatus: ExamInstanceData["status"];
  title: string;
  message: string;
  successMessage: string;
  reason?: string;
}

export const statusConfig = {
  DRAFT: { label: "Nháp", color: "bg-gray-100 text-gray-800" },
  SCHEDULED: { label: "Đã lên lịch", color: "bg-yellow-100 text-yellow-800" },
  ACTIVE: { label: "Đang hoạt động", color: "bg-green-100 text-green-800" },
  PAUSED: { label: "Tạm dừng", color: "bg-orange-100 text-orange-800" },
  COMPLETED: { label: "Đã hoàn thành", color: "bg-blue-100 text-blue-800" },
  CANCELLED: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
};

export default function ExamInstancesPage() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateInfo | null>(
    null
  );
  const [step, setStep] = useState<"select-template" | "create-form">(
    "select-template"
  );
  const [statusChangeConfirm, setStatusChangeConfirm] =
    useState<StatusChangeConfirm | null>(null);

  // API hooks
  const {
    data: instancesResponse,
    isLoading,
    refetch,
  } = useExamInstancesService();
  const { mutate: createInstance, isPending: isCreating } =
    useCreateExamInstanceService();

  // Status change mutations - we'll create them dynamically
  const [changingStatus, setChangingStatus] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Create a mutation for changing status
  const changeStatusMutation = useMutation({
    mutationFn: ({
      instanceId,
      data,
    }: {
      instanceId: string;
      data: ChangeStatusData;
    }) =>
      api.put(`${EXAM_ENDPOINTS.EXAM_INSTANCES}/${instanceId}/status`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examInstances"] });
      setChangingStatus(null);
    },
    onError: () => {
      setChangingStatus(null);
    },
  });

  const instances = instancesResponse?.data || [];

  const handleCreateNew = () => {
    setShowCreateModal(true);
    setStep("select-template");
    setSelectedTemplate(null);
  };

  const handleSelectTemplate = (
    templateId: string,
    templateData: TemplateInfo
  ) => {
    setSelectedTemplate(templateData);
    setStep("create-form");
  };

  const handleCreateInstance = (data: CreateExamInstanceData) => {
    createInstance(data, {
      onSuccess: (response) => {
        toast.success("Tạo instance thành công!");
        setShowCreateModal(false);
        setStep("select-template");
        setSelectedTemplate(null);
        refetch();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Có lỗi xảy ra khi tạo instance"
        );
      },
    });
  };

  const handleViewDetails = (instance: ExamInstanceData) => {
    router.push(`/exam-instances/${instance.id}`);
  };

  // Helper function to handle status changes
  const handleStatusChange = (
    instance: ExamInstanceData,
    newStatus: ExamInstanceData["status"],
    title: string,
    confirmMessage: string,
    successMessage: string,
    reason?: string
  ) => {
    setStatusChangeConfirm({
      instance,
      newStatus,
      title,
      message: confirmMessage,
      successMessage,
      reason,
    });
  };

  // Function to confirm status change
  const confirmStatusChange = () => {
    if (!statusChangeConfirm) return;

    setChangingStatus(statusChangeConfirm.instance.id);

    const data: ChangeStatusData = { status: statusChangeConfirm.newStatus };
    if (statusChangeConfirm.reason) data.reason = statusChangeConfirm.reason;

    changeStatusMutation.mutate(
      { instanceId: statusChangeConfirm.instance.id, data },
      {
        onSuccess: () => {
          toast.success(statusChangeConfirm.successMessage);
          setStatusChangeConfirm(null);
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              "Có lỗi xảy ra khi thay đổi trạng thái"
          );
          setStatusChangeConfirm(null);
        },
      }
    );
  };

  const handlePause = (instance: ExamInstanceData) => {
    handleStatusChange(
      instance,
      "PAUSED",
      "Tạm dừng bài thi",
      `Bạn có chắc muốn tạm dừng bài thi "${instance.templateName}"?`,
      "Đã tạm dừng bài thi thành công"
    );
  };

  const handleResume = (instance: ExamInstanceData) => {
    handleStatusChange(
      instance,
      "ACTIVE",
      "Tiếp tục bài thi",
      `Bạn có chắc muốn tiếp tục bài thi "${instance.templateName}"?`,
      "Đã tiếp tục bài thi thành công"
    );
  };

  const handleStop = (instance: ExamInstanceData) => {
    handleStatusChange(
      instance,
      "COMPLETED",
      "Kết thúc bài thi",
      `Bạn có chắc muốn kết thúc bài thi "${instance.templateName}"?`,
      "Đã kết thúc bài thi thành công"
    );
  };

  const handleCancel = (instance: ExamInstanceData) => {
    handleStatusChange(
      instance,
      "CANCELLED",
      "Hủy bài thi",
      `Bạn có chắc muốn hủy bài thi "${instance.templateName}"?`,
      "Đã hủy bài thi thành công"
    );
  };

  const handleActivate = (instance: ExamInstanceData) => {
    handleStatusChange(
      instance,
      "ACTIVE",
      "Kích hoạt bài thi",
      `Bạn có chắc muốn kích hoạt bài thi "${instance.templateName}"?`,
      "Đã kích hoạt bài thi thành công"
    );
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setStep("select-template");
    setSelectedTemplate(null);
  };

  const handleBackToTemplateSelection = () => {
    setStep("select-template");
    setSelectedTemplate(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách phiên kiểm tra...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-calsans text-gray-900">
            Lịch sử phiên kiểm tra
          </h1>
          <p className="text-gray-600 mt-1">
            Tạo và quản lý các phiên kiểm tra (Được chọn từ kho đề)
          </p>
        </div>
        <Button
          onClick={() => router.push("/exam-templates")}
          className="flex items-center gap-2"
        >
          Tổ chức phiên kiểm tra mới
        </Button>
      </div>

      <ExamInstanceTable
        examInstances={instances}
        onViewDetail={handleViewDetails}
        onPause={handlePause}
        onResume={handleResume}
        onStop={handleStop}
        onCancel={handleCancel}
        onActivate={handleActivate}
      />

      {instances.length === 0 && (
        <div className="text-center py-12">
          <div className="w-56 h-56 mx-auto mb-4">{NoneExamIcon}</div>
          <h3 className="text-2xl font-calsans text-gray-900 mb-2">
            Chưa có phiên kiểm tra
          </h3>
          <h3 className="text-lg text-gray-900 mb-2">
            Hiện chưa có phiên kiểm tra được tổ chức
          </h3>
        </div>
      )}

      {/* Create Instance Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        title={step === "select-template" ? "Chọn đề thi" : "Tạo đề thi"}
        size="xl"
      >
        {step === "select-template" ? (
          <TemplateSelector
            onSelectTemplate={handleSelectTemplate}
            selectedTemplateId={selectedTemplate?.id}
          />
        ) : selectedTemplate ? (
          <CreateInstanceForm
            selectedTemplate={selectedTemplate}
            onSubmit={handleCreateInstance}
            onCancel={handleBackToTemplateSelection}
            isLoading={isCreating}
          />
        ) : null}
      </Modal>

      {/* Status Change Confirmation Modal */}
      <Modal
        isOpen={!!statusChangeConfirm}
        onClose={() => setStatusChangeConfirm(null)}
        title={statusChangeConfirm?.title || "Xác nhận"}
        size="md"
      >
        {statusChangeConfirm && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-900 font-medium">
                  {statusChangeConfirm.message}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Hành động này sẽ thay đổi trạng thái của phiên kiểm tra.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setStatusChangeConfirm(null)}
                disabled={changingStatus === statusChangeConfirm.instance.id}
              >
                Hủy
              </Button>
              <Button
                onClick={confirmStatusChange}
                disabled={changingStatus === statusChangeConfirm.instance.id}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {changingStatus === statusChangeConfirm.instance.id
                  ? "Đang xử lý..."
                  : "Xác nhận"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
