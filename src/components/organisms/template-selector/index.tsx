"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { useExamTemplatesService } from "@/services/examTemplateServices";
import { cn } from "@/lib/utils";
import { BookMarkIcon, BookMarkWhiteIcon } from "@/constants/icon";

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
  const {
    data: templatesResponse,
    isLoading,
    error,
  } = useExamTemplatesService();
  const [searchTerm, setSearchTerm] = useState("");

  const templates = templatesResponse?.data || [];

  // Filter templates based on search term
  const filteredTemplates = templates.filter(
    (template: TemplateData) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách đề thi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Có lỗi xảy ra khi tải danh sách đề thi</p>
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
          className="w-full rounded-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredTemplates.map((template: TemplateData) => (
          <Card
            key={template.id}
            className={cn(
              "group relative py-0 cursor-pointer bg-white rounded-xl overflow-hidden aspect-[5/3] border shadow-sm transition-shadow hover:shadow-md",
              selectedTemplateId === template.id
                ? "ring-2 ring-blue-500 shadow-sm"
                : ""
            )}
            onClick={() => onSelectTemplate(template.id, template)}
          >
            {/* Hiệu ứng nền gradient lan toàn thẻ */}
            <span
              style={{
                background:
                  "linear-gradient(to bottom, #28E1E4 0%, #30C7EF 65%, #3AA7FC 75%, #407BE9 90%, #3714A2 100%)",
              }}
              className="absolute inset-0 scale-0 origin-bottom-left transition-transform duration-500 ease-out group-hover:scale-[2] -translate-x-20 translate-y-20 z-0 rounded-full"
            />

            <CardContent className="relative z-10 p-4 flex flex-col justify-between h-full text-black group-hover:text-white transition-colors duration-300">
              {/* Header with Icon and Badges */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300">
                    <span className="w-8 h-8 group-hover:hidden">
                      {BookMarkIcon}
                    </span>
                    <span className="w-8 h-8 hidden group-hover:block">
                      {BookMarkWhiteIcon}
                    </span>
                  </div>
                  <span className="text-base font-calsans text-gray-700 group-hover:text-white transition-colors duration-300">
                    {template.subject}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Badge
                    variant="secondary"
                    className="bg-black group-hover:bg-white text-white group-hover:text-black text-xs px-2 py-1 rounded-full transition-colors duration-300"
                  >
                    Lớp {template.grade} - {template.durationMinutes} phút
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-black group-hover:bg-white text-white group-hover:text-black text-xs px-2 py-1 rounded-full transition-colors duration-300"
                  >
                    {template.totalScore} điểm
                  </Badge>
                </div>
              </div>

              {/* Date */}
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 group-hover:text-white transition-colors duration-300">
                  {new Date(template.createdAt).toLocaleDateString("vi-VN")}
                </span>

                {/* Title */}
                <h3 className="text-lg font-calsans text-gray-900 group-hover:text-white line-clamp-2 leading-tight transition-colors duration-300">
                  {template.name}
                </h3>
              </div>

              {/* Select Button */}
              {/* <Button
                variant={
                  selectedTemplateId === template.id ? "default" : "outline"
                }
                size="sm"
                className={cn(
                  "w-full",
                  selectedTemplateId === template.id
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTemplate(template.id, template);
                }}
              >
                {selectedTemplateId === template.id
                  ? "✓ Đã chọn"
                  : "Chọn template"}
              </Button> */}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {searchTerm
              ? "Không tìm thấy đề thi nào phù hợp"
              : "Chưa có đề thi"}
          </p>
        </div>
      )}
    </div>
  );
}
