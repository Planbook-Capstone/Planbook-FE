"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  BookOpen,
  GraduationCap,
  Calendar,
  FileText,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  Square,
  Link,
  Copy,
  Users,
  BarChart3,
  Edit,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import {
  ExamInstanceData,
  useChangeExamInstanceStatusService,
  useExamInstanceSubmissionsService,
  useDownloadExcelReportService,
  ChangeStatusData,
  SubmissionData,
} from "@/services/examInstanceServices";
import { cn } from "@/lib/utils";

interface InstanceDetailsProps {
  instance: ExamInstanceData;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const statusConfig = {
  DRAFT: {
    label: "Nháp",
    color: "bg-gray-100 text-gray-800",
    icon: FileText,
  },
  SCHEDULED: {
    label: "Đã lên lịch",
    color: "bg-yellow-100 text-yellow-800",
    icon: Calendar,
  },
  ACTIVE: {
    label: "Đang hoạt động",
    color: "bg-green-100 text-green-800",
    icon: Play,
  },
  PAUSED: {
    label: "Tạm dừng",
    color: "bg-orange-100 text-orange-800",
    icon: Pause,
  },
  COMPLETED: {
    label: "Đã hoàn thành",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
};

export function InstanceDetails({
  instance,
  onClose,
  onEdit,
  onDelete,
  className,
}: InstanceDetailsProps) {
  const [showSubmissions, setShowSubmissions] = useState(false);

  const statusInfo = statusConfig[instance.status];
  const StatusIcon = statusInfo.icon;

  // API hooks
  const changeStatusMutation = useChangeExamInstanceStatusService(instance.id);
  const { data: submissionsResponse, isLoading: submissionsLoading } =
    useExamInstanceSubmissionsService(instance.id);
  const downloadExcelMutation = useDownloadExcelReportService(instance.id);

  const submissions = submissionsResponse?.data || [];
  const examUrl = `${window.location.origin}/exam/${instance.code}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(examUrl);
    toast.success("Đã sao chép link bài thi!");
  };

  const handleStatusChange = (
    newStatus: ExamInstanceData["status"],
    reason?: string
  ) => {
    const data: ChangeStatusData = { status: newStatus };
    if (reason) data.reason = reason;

    changeStatusMutation.mutate(data, {
      onSuccess: () => {
        toast.success(
          `Đã chuyển trạng thái thành "${statusConfig[newStatus].label}"`
        );
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            "Có lỗi xảy ra khi thay đổi trạng thái"
        );
      },
    });
  };

  const handleDownloadExcel = () => {
    downloadExcelMutation.mutate(undefined, {
      onSuccess: (response: any) => {
        // Create blob and download
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `exam-instance-${instance.code}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success("Đã tải xuống báo cáo Excel!");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Có lỗi xảy ra khi tải xuống"
        );
      },
    });
  };

  // Get available status transitions
  const getAvailableStatusTransitions = () => {
    const transitions: {
      status: ExamInstanceData["status"];
      label: string;
      icon: any;
      variant?: string;
    }[] = [];

    switch (instance.status) {
      case "DRAFT":
        transitions.push(
          { status: "SCHEDULED", label: "Lên lịch", icon: Calendar },
          {
            status: "ACTIVE",
            label: "Kích hoạt",
            icon: Play,
            variant: "default",
          },
          {
            status: "CANCELLED",
            label: "Hủy",
            icon: XCircle,
            variant: "destructive",
          }
        );
        break;
      case "SCHEDULED":
        transitions.push(
          {
            status: "ACTIVE",
            label: "Kích hoạt",
            icon: Play,
            variant: "default",
          },
          {
            status: "CANCELLED",
            label: "Hủy",
            icon: XCircle,
            variant: "destructive",
          }
        );
        break;
      case "ACTIVE":
        transitions.push(
          { status: "PAUSED", label: "Tạm dừng", icon: Pause },
          { status: "COMPLETED", label: "Kết thúc", icon: Square },
          {
            status: "CANCELLED",
            label: "Hủy",
            icon: XCircle,
            variant: "destructive",
          }
        );
        break;
      case "PAUSED":
        transitions.push(
          {
            status: "ACTIVE",
            label: "Tiếp tục",
            icon: Play,
            variant: "default",
          },
          { status: "COMPLETED", label: "Kết thúc", icon: Square },
          {
            status: "CANCELLED",
            label: "Hủy",
            icon: XCircle,
            variant: "destructive",
          }
        );
        break;
    }

    return transitions;
  };

  return (
    <div className={cn("max-w-7xl mx-auto space-y-6", className)}>
      {/* Header với thông tin cơ bản */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {instance.templateName}
              </h1>
              <Badge className={cn("text-sm px-3 py-1", statusInfo.color)}>
                <StatusIcon className="w-4 h-4 mr-1" />
                {statusInfo.label}
              </Badge>
            </div>
            <p className="text-gray-600 mb-3">{instance.description}</p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{instance.subject}</span>
              </div>
              <div className="flex items-center gap-1">
                <GraduationCap className="w-4 h-4" />
                <span>Lớp {instance.grade}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{instance.durationMinutes} phút</span>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={onClose} className="ml-4">
            Đóng
          </Button>
        </div>

        {/* Mã bài thi và Link chia sẻ */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <div>
                  <p className="text-sm font-medium text-blue-700">
                    Mã bài thi
                  </p>
                  <p className="text-2xl font-bold text-blue-900 font-mono">
                    {instance.code}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-700 mb-1">
                    Link bài thi
                  </p>
                  <p className="font-mono text-sm text-blue-600 break-all">
                    {examUrl}
                  </p>
                </div>
              </div>
              {instance.status !== "ACTIVE" && (
                <p className="text-sm text-orange-600 font-medium">
                  ⚠️ Học sinh chỉ có thể làm bài khi trạng thái là "Đang hoạt
                  động"
                </p>
              )}
            </div>
            <Button
              onClick={handleCopyLink}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Copy className="w-4 h-4" />
              Sao chép link
            </Button>
          </div>
        </div>
      </div>

      {/* Layout 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái - Điều khiển và thông tin */}
        <div className="lg:col-span-1 space-y-6">
          {/* Điều khiển trạng thái */}
          {getAvailableStatusTransitions().length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Play className="w-5 h-5 text-green-600" />
                  Điều khiển bài thi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getAvailableStatusTransitions().map((transition) => {
                    const TransitionIcon = transition.icon;
                    return (
                      <Button
                        key={transition.status}
                        variant={(transition.variant as any) || "outline"}
                        onClick={() => handleStatusChange(transition.status)}
                        disabled={changeStatusMutation.isPending}
                        className="w-full flex items-center gap-2 justify-start"
                        size="sm"
                      >
                        <TransitionIcon className="w-4 h-4" />
                        {transition.label}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Thông tin thời gian */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Thời gian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Bắt đầu</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(instance.startAt), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Kết thúc</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(instance.endAt), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Ngày tạo</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(instance.createdAt), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </p>
              </div>
              {instance.statusChangedAt && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Thay đổi trạng thái
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(
                      new Date(instance.statusChangedAt),
                      "dd/MM/yyyy HH:mm",
                      { locale: vi }
                    )}
                  </p>
                  {instance.statusChangeReason && (
                    <p className="text-xs text-gray-500 mt-1">
                      Lý do: {instance.statusChangeReason}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hành động */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Download className="w-5 h-5 text-purple-600" />
                Hành động
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={handleDownloadExcel}
                  disabled={downloadExcelMutation.isPending}
                  className="w-full flex items-center gap-2 justify-start"
                  size="sm"
                >
                  <Download className="w-4 h-4" />
                  {downloadExcelMutation.isPending
                    ? "Đang tải..."
                    : "Tải báo cáo Excel"}
                </Button>

                {onEdit && (
                  <Button
                    variant="outline"
                    onClick={onEdit}
                    disabled={
                      instance.status === "COMPLETED" ||
                      instance.status === "CANCELLED"
                    }
                    className="w-full flex items-center gap-2 justify-start"
                    size="sm"
                  >
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa
                  </Button>
                )}

                {onDelete && (
                  <Button
                    variant="destructive"
                    onClick={onDelete}
                    disabled={instance.status === "ACTIVE"}
                    className="w-full flex items-center gap-2 justify-start"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cột phải - Kết quả bài thi */}
        <div className="lg:col-span-2">
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Kết quả bài thi
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setShowSubmissions(!showSubmissions)}
                  size="sm"
                >
                  {showSubmissions ? "Ẩn kết quả" : "Xem kết quả"}
                </Button>
              </div>
            </CardHeader>
            {showSubmissions && (
              <CardContent>
                {submissionsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Đang tải kết quả...</p>
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium mb-2">
                      Chưa có học sinh nào nộp bài
                    </p>
                    <p className="text-sm">
                      Kết quả sẽ hiển thị khi có học sinh hoàn thành bài thi
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Thống kê tổng quan */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-700">
                              Tổng số bài nộp
                            </p>
                            <p className="text-2xl font-bold text-blue-900">
                              {submissions.length}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-700">
                              Điểm trung bình
                            </p>
                            <p className="text-2xl font-bold text-green-900">
                              {submissions.length > 0
                                ? (
                                    submissions.reduce(
                                      (sum: number, sub: SubmissionData) =>
                                        sum + sub.score,
                                      0
                                    ) / submissions.length
                                  ).toFixed(1)
                                : "0"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-purple-700">
                              Điểm cao nhất
                            </p>
                            <p className="text-2xl font-bold text-purple-900">
                              {submissions.length > 0
                                ? Math.max(
                                    ...submissions.map(
                                      (sub: SubmissionData) => sub.score
                                    )
                                  )
                                : "0"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Danh sách kết quả */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Danh sách kết quả chi tiết
                      </h4>
                      <div className="max-h-96 overflow-y-auto space-y-2">
                        {submissions.map(
                          (submission: SubmissionData, index: number) => (
                            <div
                              key={submission.submissionId}
                              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-blue-700">
                                    {index + 1}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {submission.studentName}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Nộp lúc:{" "}
                                    {format(
                                      new Date(submission.submittedAt),
                                      "dd/MM/yyyy HH:mm",
                                      { locale: vi }
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-lg font-bold text-blue-600">
                                    {submission.score}
                                  </span>
                                  <span className="text-gray-400">/</span>
                                  <span className="text-lg font-medium text-gray-600">
                                    {submission.maxScore}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {submission.correctCount}/
                                  {submission.totalQuestions} câu đúng
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
