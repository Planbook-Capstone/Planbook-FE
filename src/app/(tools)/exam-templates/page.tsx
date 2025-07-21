"use client";

import React, { useState, useEffect } from "react";
import { useExamTemplatesService } from "@/services/examTemplateServices";
import { Button } from "@/components/ui/Button";
import { Plus, Edit, Trash2, Copy, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

export default function ExamTemplatesPage() {
  const router = useRouter();
  const { data: templates, isLoading, refetch } = useExamTemplatesService();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter templates based on search term
  const filteredTemplates = templates?.data?.filter((template: ExamTemplate) => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreateTemplate = () => {
    router.push("/exam-creation?mode=template");
  };

  const handleEditTemplate = (templateId: string) => {
    router.push(`/exam-creation?mode=template&id=${templateId}`);
  };

  const handleViewTemplate = (templateId: string) => {
    router.push(`/exam-templates/${templateId}`);
  };

  const handleDuplicateTemplate = (templateId: string) => {
    // Implement duplicate functionality
    toast.info("Chức năng nhân bản template sẽ được phát triển trong tương lai");
  };

  const handleDeleteTemplate = (templateId: string) => {
    // Implement delete functionality
    toast.info("Chức năng xóa template sẽ được phát triển trong tương lai");
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
                    className="p-1 text-gray-500 hover:text-purple-500"
                    title="Nhân bản"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="p-1 text-gray-500 hover:text-red-500"
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
                Cập nhật: {new Date(template.updatedAt).toLocaleDateString("vi-VN")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
