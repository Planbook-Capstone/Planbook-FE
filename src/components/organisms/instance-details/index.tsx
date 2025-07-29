"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  Square,
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
import { SubmissionDetails } from "@/components/organisms/submission-details";
import { cn } from "@/lib/utils";
import SubmissionTable from "../table-submission";
import {
  ScoreDistributionChart,
  ScoreStatistics,
} from "@/components/charts/ScoreDistributionChart";
import { DowloadIcon } from "@/constants/icon";

interface InstanceDetailsProps {
  instance: ExamInstanceData;
  onClose: () => void;
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
    color: "bg-teal-100 text-teal-800",
    icon: Play,
  },
  PAUSED: {
    label: "Tạm dừng",
    color: "bg-orange-100 text-orange-800",
    icon: Pause,
  },
  COMPLETED: {
    label: "Đã hoàn thành",
    color: "bg-cyan-100 text-cyan-800",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "bg-rose-100 text-rose-800",
    icon: XCircle,
  },
};

export function InstanceDetails({
  instance,
  onClose,
  className,
}: InstanceDetailsProps) {
  const statusInfo = statusConfig[instance.status];

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
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-calsans text-gray-900">
              Bài thi: {instance.templateName}
            </h1>
            <Badge className={cn("text-sm px-3 py-1", statusInfo.color)}>
              {statusInfo.label}
            </Badge>
          </div>
          <p className="text-gray-600 mb-3">{instance.description}</p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div>
              <span>{instance.subject}</span>
            </div>
            <div>
              <span>Lớp {instance.grade}</span>
            </div>
            <div>
              <span>{instance.durationMinutes} phút</span>
            </div>
          </div>
          <div className="bg-neutral-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-700">
                      Mã bài thi
                    </p>
                    <p className="text-2xl font-calsans text-neutral-900">
                      {instance.code}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-700 mb-1">
                      Link bài thi
                    </p>
                    <p
                      onClick={handleCopyLink}
                      className="font-questrial text-sm text-red-600 break-all cursor-pointer"
                    >
                      Click vào đây để copy link bài thi
                    </p>
                  </div>
                </div>
                {instance.status !== "ACTIVE" && (
                  <p className="text-sm text-orange-600 font-medium">
                    Học sinh chỉ có thể làm bài khi trạng thái là "Đang hoạt
                    động"
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <Button variant="outline" onClick={onClose} className="float-end">
            Đóng
          </Button>
          <div className="bg-white p-5 ">
            <h5 className="text-lg font-semibold text-gray-900 mb-4">
              Phân phối điểm số
            </h5>
            <ScoreDistributionChart
              submissions={submissions}
              maxScore={submissions.length > 0 ? submissions[0].maxScore : 10}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h4 className="font-calsans text-lg text-gray-900 mb-6">
          Danh sách kết quả chi tiết
        </h4>
        <Button
          // variant="outline"
          onClick={handleDownloadExcel}
          disabled={downloadExcelMutation.isPending}
          size="sm"
          className="py-5"
        >
          {downloadExcelMutation.isPending ? (
            "Đang tải..."
          ) : (
            <>{DowloadIcon} Xuất báo cáo</>
          )}
        </Button>
      </div>
      <SubmissionTable submitions={submissions} />

      {/* Layout 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái - Điều khiển và thông tin */}
        <div className="lg:col-span-1 space-y-6">
          {/* Điều khiển trạng thái */}
          {getAvailableStatusTransitions().length > 0 && (
            <Card>
              <CardHeader className="text-lg font-calsans font-normal flex items-center gap-2">
                Điều khiển bài thi
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
                        className="w-full flex items-center gap-2 justify-start py-5"
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
        </div>
      </div>
    </div>
  );
}
