"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, GraduationCap, FileText } from "lucide-react";
import { useExamTemplatesService } from "@/services/examTemplateServices";
import { cn } from "@/lib/utils";

interface TemplateData {
  id: string;
  name: string;
  subject: string;
  grade: number;
  durationMinutes: number;
  totalScore: number;
  createdAt: string;
}

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string, templateData: TemplateData) => void;
  selectedTemplateId?: string;
  className?: string;
}

export function TemplateSelector({
  onSelectTemplate,
  selectedTemplateId,
  className,
}: TemplateSelectorProps) {
  const { data: templatesResponse, isLoading, error } = useExamTemplatesService();
  const [searchTerm, setSearchTerm] = useState("");

  const templates = templatesResponse?.data || [];

  // Filter templates based on search term
  const filteredTemplates = templates.filter((template: TemplateData) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách template...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Có lỗi xảy ra khi tải danh sách template</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm template theo tên hoặc môn học..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template: TemplateData) => (
          <Card
            key={template.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              selectedTemplateId === template.id
                ? "ring-2 ring-blue-500 border-blue-500"
                : "hover:border-gray-400"
            )}
            onClick={() => onSelectTemplate(template.id, template)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium line-clamp-2">
                {template.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Subject and Grade */}
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">{template.subject}</span>
                <Badge variant="secondary" className="ml-auto">
                  Lớp {template.grade}
                </Badge>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">
                  {template.durationMinutes} phút
                </span>
              </div>

              {/* Total Score */}
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-700">
                  {template.totalScore} điểm
                </span>
              </div>

              {/* Created Date */}
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-500">
                  {new Date(template.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>

              {/* Select Button */}
              <Button
                variant={selectedTemplateId === template.id ? "default" : "outline"}
                size="sm"
                className="w-full mt-3"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTemplate(template.id, template);
                }}
              >
                {selectedTemplateId === template.id ? "Đã chọn" : "Chọn template"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {searchTerm
              ? "Không tìm thấy template nào phù hợp"
              : "Chưa có template nào"}
          </p>
        </div>
      )}
    </div>
  );
}
