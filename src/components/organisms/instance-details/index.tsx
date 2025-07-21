"use client";

import React from "react";
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
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ExamInstanceData } from "@/services/examInstanceServices";
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
  ACTIVE: {
    label: "Đang hoạt động",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
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
  const statusInfo = statusConfig[instance.status];
  const StatusIcon = statusInfo.icon;

  const handleDownloadExcel = () => {
    if (instance.excelUrl) {
      // Create a temporary link to download the file
      const link = document.createElement("a");
      link.href = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"}${instance.excelUrl}`;
      link.download = `exam-instance-${instance.code}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className={cn("max-w-4xl mx-auto space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Chi tiết Instance</h1>
        <Button variant="outline" onClick={onClose}>
          Đóng
        </Button>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Thông tin cơ bản</CardTitle>
            <Badge className={statusInfo.color}>
              <StatusIcon className="w-4 h-4 mr-1" />
              {statusInfo.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Instance Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Mã Instance</label>
              <p className="text-lg font-mono font-bold text-blue-600">{instance.code}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">ID</label>
              <p className="text-sm text-gray-700 font-mono">{instance.id}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-500">Mô tả</label>
            <p className="text-gray-700 mt-1">{instance.description}</p>
          </div>

          {/* Template Information */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Thông tin Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Tên template</p>
                  <p className="font-medium">{instance.templateName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Môn học</p>
                  <p className="font-medium">{instance.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Lớp</p>
                  <p className="font-medium">Lớp {instance.grade}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Thời gian</p>
                  <p className="font-medium">{instance.durationMinutes} phút</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Thời gian</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Thời gian bắt đầu</p>
                <p className="font-medium">
                  {format(new Date(instance.startAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-500">Thời gian kết thúc</p>
                <p className="font-medium">
                  {format(new Date(instance.endAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">Ngày tạo</p>
              <p className="font-medium">
                {format(new Date(instance.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
              </p>
            </div>
          </div>

          {instance.statusChangedAt && (
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-500">Thay đổi trạng thái lần cuối</p>
                <p className="font-medium">
                  {format(new Date(instance.statusChangedAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                </p>
                {instance.statusChangeReason && (
                  <p className="text-sm text-gray-600 mt-1">
                    Lý do: {instance.statusChangeReason}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Hành động</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {instance.excelUrl && (
              <Button
                variant="outline"
                onClick={handleDownloadExcel}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Tải file Excel
              </Button>
            )}
            
            {onEdit && (
              <Button
                variant="outline"
                onClick={onEdit}
                disabled={instance.status === "COMPLETED" || instance.status === "CANCELLED"}
              >
                Chỉnh sửa
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="destructive"
                onClick={onDelete}
                disabled={instance.status === "ACTIVE"}
              >
                Xóa
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
