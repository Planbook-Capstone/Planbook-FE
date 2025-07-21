"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { TemplateSelector } from "@/components/organisms/template-selector";
import { CreateInstanceForm } from "@/components/organisms/create-instance-form";
import { InstanceDetails } from "@/components/organisms/instance-details";
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

interface TemplateInfo {
  id: string;
  name: string;
  subject: string;
  grade: number;
  durationMinutes: number;
  totalScore: number;
}

const statusConfig = {
  DRAFT: { label: "Nháp", color: "bg-gray-100 text-gray-800" },
  ACTIVE: { label: "Đang hoạt động", color: "bg-green-100 text-green-800" },
  COMPLETED: { label: "Đã hoàn thành", color: "bg-blue-100 text-blue-800" },
  CANCELLED: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
};

export default function ExamInstancesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateInfo | null>(null);
  const [selectedInstance, setSelectedInstance] = useState<ExamInstanceData | null>(null);
  const [step, setStep] = useState<"select-template" | "create-form">("select-template");

  // API hooks
  const { data: instancesResponse, isLoading, refetch } = useExamInstancesService();
  const { mutate: createInstance, isPending: isCreating } = useCreateExamInstanceService();

  const instances = instancesResponse?.data || [];

  const handleCreateNew = () => {
    setShowCreateModal(true);
    setStep("select-template");
    setSelectedTemplate(null);
  };

  const handleSelectTemplate = (templateId: string, templateData: TemplateInfo) => {
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
        toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo instance");
      },
    });
  };

  const handleViewDetails = (instance: ExamInstanceData) => {
    setSelectedInstance(instance);
    setShowDetailsModal(true);
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
          <p className="text-gray-600">Đang tải danh sách instances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Exam Instances</h1>
          <p className="text-gray-600 mt-1">Tạo và quản lý các instance từ templates</p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tạo Instance Mới
        </Button>
      </div>

      {/* Instances List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instances.map((instance: ExamInstanceData) => {
          const statusInfo = statusConfig[instance.status];
          return (
            <Card key={instance.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {instance.templateName}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1 font-mono">
                      Mã: {instance.code}
                    </p>
                  </div>
                  <Badge className={statusInfo.color}>
                    {statusInfo.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Description */}
                <p className="text-sm text-gray-700 line-clamp-2">
                  {instance.description}
                </p>

                {/* Template Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>{instance.subject}</span>
                    <span className="text-gray-400">•</span>
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    <span>Lớp {instance.grade}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span>{instance.durationMinutes} phút</span>
                  </div>
                </div>

                {/* Time Info */}
                <div className="text-xs text-gray-500 space-y-1">
                  <p>
                    Bắt đầu: {format(new Date(instance.startAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                  </p>
                  <p>
                    Kết thúc: {format(new Date(instance.endAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(instance)}
                    className="w-full flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Xem chi tiết
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {instances.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có instance nào
          </h3>
          <p className="text-gray-600 mb-4">
            Tạo instance đầu tiên từ các template có sẵn
          </p>
          <Button onClick={handleCreateNew}>
            Tạo Instance Mới
          </Button>
        </div>
      )}

      {/* Create Instance Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        title={step === "select-template" ? "Chọn Template" : "Tạo Instance"}
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

      {/* Instance Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        size="xl"
      >
        {selectedInstance && (
          <InstanceDetails
            instance={selectedInstance}
            onClose={() => setShowDetailsModal(false)}
          />
        )}
      </Modal>
    </div>
  );
}
