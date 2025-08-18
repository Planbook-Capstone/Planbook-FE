"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import {
  useMatrixTemplatesService,
  useDeleteMatrixTemplateService,
  type MatrixTemplateConfig,
} from "@/services/matrixTemplateServices";
import ConfigurableExamMatrixForm from "@/components/forms/ConfigurableExamMatrixForm";
import { Modal } from "@/components/ui/modal";

function MatrixTemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<MatrixTemplateConfig | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Use API data
  const { data: templatesData, isLoading, error, refetch } = useMatrixTemplatesService();
  const { mutate: deleteTemplate } = useDeleteMatrixTemplateService();

  // Use API data, fallback to empty array if no data
  const rawTemplates = templatesData?.data || [];

  // Map API data to expected format
  const templates = rawTemplates.map((template: any) => ({
    ...template,
    parts: template.matrixJson?.parts || [], // Map matrixJson.parts to parts
  }));

  // Filter templates based on search term
  const filteredTemplates = (templates || []).filter(
    (template: MatrixTemplateConfig) =>
      template.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteTemplate = (templateId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa template này?")) {
      deleteTemplate(templateId, {
        onSuccess: () => {
          toast.success("Template đã được xóa thành công!");
          refetch(); // Refresh the list after deletion
        },
        onError: (error) => {
          console.error("Error deleting template:", error);
          toast.error("Có lỗi xảy ra khi xóa template!");
        },
      });
    }
  };



  const handlePreviewTemplate = (template: MatrixTemplateConfig) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Có lỗi xảy ra khi tải dữ liệu
          </h3>
          <p className="text-gray-600 mb-4">
            Vui lòng thử lại sau
          </p>
          <Button onClick={() => refetch()}>
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold font-calsans">
              Quản lý Mẫu Ma Trận
            </h1>
            <p className="text-gray-600 font-questrial">
              Tạo và quản lý các mẫu ma trận đề thi
            </p>
          </div>
          <Link href="/staff/matrix-templates/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tạo Mẫu Mới
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm template..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="pl-10 font-questrial"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template: MatrixTemplateConfig) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="font-calsans text-lg mb-2">
                    {template.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 font-questrial line-clamp-2">
                    {template.description}
                  </p>
                </div>
                <Badge
                  variant={
                    template.status === "ACTIVE" ? "default" : "secondary"
                  }
                >
                  {template.status === "ACTIVE"
                    ? "Hoạt động"
                    : "Không hoạt động"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Template Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Số phần:</span>
                  <span className="font-medium">{template.parts?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tổng mức độ:</span>
                  <span className="font-medium">
                    {template.parts?.reduce(
                      (total, part) => total + (part.difficultyLevels?.length || 0),
                      0
                    ) || 0}
                  </span>
                </div>
              </div>

              {/* Parts Preview */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Các phần:</h4>
                <div className="space-y-1">
                  {(template.parts || []).map((part) => (
                    <div
                      key={part.id}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div className={`w-3 h-3 rounded ${part.color || 'bg-gray-200'}`}></div>
                      <span>{part.name}</span>
                      {part.label && (
                        <span className="text-gray-500">({part.label})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePreviewTemplate(template)}
                  className="flex-1"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Xem
                </Button>
                {template.id ? (
                  <Link href={`/staff/matrix-templates/${template.id}/edit`}>
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </Link>
                ) : (
                  <Button size="sm" variant="outline" disabled>
                    <Edit className="w-3 h-3" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => template.id && handleDeleteTemplate(template.id)}
                  className="text-red-600 hover:text-red-700"
                  disabled={!template.id}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy template nào
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? "Thử tìm kiếm với từ khóa khác"
              : "Chưa có template nào được tạo"}
          </p>
          <Link href="/staff/matrix-templates/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tạo Template Đầu Tiên
            </Button>
          </Link>
        </div>
      )}

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={`Xem trước: ${selectedTemplate?.name}`}
        size="xl"
      >
        {selectedTemplate && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium font-calsans mb-2">
                Thông tin Template
              </h4>
              <p className="text-sm text-gray-600 font-questrial">
                {selectedTemplate.description}
              </p>
            </div>

            <ConfigurableExamMatrixForm
              config={selectedTemplate}
              readonly={true}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default MatrixTemplatesPage;
