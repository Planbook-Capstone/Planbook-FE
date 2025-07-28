"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { TemplateSelector } from "@/components/organisms/template-selector";
import { CreateInstanceForm } from "@/components/organisms/create-instance-form";
import {
  useExamInstancesService,
  useCreateExamInstanceService,
  CreateExamInstanceData,
  ExamInstanceData,
} from "@/services/examInstanceServices";
import { Plus, Eye, Clock, BookOpen, GraduationCap } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  BookMarkIcon,
  BookMarkWhiteIcon,
  NoneExamIcon,
} from "@/constants/icon";
import ExamInstanceTable from "@/components/organisms/table-exam-instance";

interface TemplateInfo {
  id: string;
  name: string;
  subject: string;
  grade: number;
  durationMinutes: number;
  totalScore: number;
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

  // API hooks
  const {
    data: instancesResponse,
    isLoading,
    refetch,
  } = useExamInstancesService();
  const { mutate: createInstance, isPending: isCreating } =
    useCreateExamInstanceService();

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
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          Tổ chức phiên kiểm tra mới
        </Button>
      </div>

      <ExamInstanceTable
        examInstances={instances}
        onViewDetail={handleViewDetails}
      />

      {/* Instances List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instances.map((instance: ExamInstanceData) => {
          const statusInfo = statusConfig[instance.status];
          return (
            <Card
              key={instance.id}
              className="group relative hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
              onClick={() => handleViewDetails(instance)}
            >
              {/* Hiệu ứng nền gradient lan toàn thẻ */}
              <span
                style={{
                  background:
                    "linear-gradient(to bottom, #28E1E4 0%, #30C7EF 65%, #3AA7FC 75%, #407BE9 90%, #3714A2 100%)",
                }}
                className="absolute inset-0 scale-0 origin-bottom-left transition-transform duration-500 ease-out group-hover:scale-[2] -translate-x-20 translate-y-20 z-0 rounded-full"
              />
              <CardHeader className="relative z-10 pb-3">
                {/* Template Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <div className="flex gap-1">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors duration-300">
                        <span className="w-6 h-6 group-hover:hidden">
                          {BookMarkIcon}
                        </span>
                        <span className="w-6 h-6 hidden group-hover:block">
                          {BookMarkWhiteIcon}
                        </span>
                      </div>
                      <span className="text-base font-calsans text-gray-700 group-hover:text-white transition-colors duration-300">
                        {instance.subject}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Badge
                        variant="secondary"
                        className="bg-black group-hover:bg-white text-white group-hover:text-black text-xs px-2 py-1 rounded-full transition-colors duration-300"
                      >
                        Lớp {instance.grade}
                      </Badge>
                      <Badge
                        className={`${statusInfo.color} group-hover:bg-white group-hover:text-black transition-colors duration-300`}
                      >
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex-1 pt-3">
                    <CardTitle className="text-lg font-normal font-calsans line-clamp-2 text-black group-hover:text-white transition-colors duration-300">
                      {instance.templateName}
                    </CardTitle>
                    <p className="text-sm text-gray-600 group-hover:text-white mt-1 transition-colors duration-300">
                      Mã: {instance.code}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 space-y-3">
                {/* Description */}
                <p className="text-sm text-gray-700 group-hover:text-white line-clamp-2 transition-colors duration-300">
                  {instance.description}
                </p>

                {/* Time Info */}
                <div className="text-xs text-gray-500 group-hover:text-white space-y-1 transition-colors duration-300">
                  <p>
                    Bắt đầu:{" "}
                    {format(new Date(instance.startAt), "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                  </p>
                  <p>
                    Kết thúc:{" "}
                    {format(new Date(instance.endAt), "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
    </div>
  );
}
