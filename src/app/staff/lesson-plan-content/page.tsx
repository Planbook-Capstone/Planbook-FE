"use client";

import { useState } from "react";
import { LessonPlanTemplateBuilder } from "@/components/organisms/lesson-plan-template-builder";
import { LessonPlanTemplate } from "@/types";
import { getDefaultTemplate } from "@/data/lesson-plan-templates";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function LessonPlanContentPage() {
  const [templates] = useState<LessonPlanTemplate[]>([
    getDefaultTemplate(),
    {
      ...getDefaultTemplate(),
      id: "template-2",
      name: "Template Toán Học",
      description:
        "Template chuyên dụng cho các môn toán học với cấu trúc bài tập và ví dụ",
    },
    {
      ...getDefaultTemplate(),
      id: "template-3",
      name: "Template Ngữ Văn",
      description:
        "Template dành cho môn ngữ văn với phần phân tích văn bản và luyện tập",
    },
  ]);
  const [currentTemplate, setCurrentTemplate] = useState<
    LessonPlanTemplate | undefined
  >();
  const [showBuilder, setShowBuilder] = useState(false);

  const handleEditTemplate = (template: LessonPlanTemplate) => {
    setCurrentTemplate(template);
    setShowBuilder(true);
  };

  const handleSave = (template: LessonPlanTemplate) => {
    // TODO: Integrate with API to save lesson plan content
    console.log("Saving lesson plan content:", template);
    toast.success("Nội dung giáo án đã được lưu thành công!");
    setShowBuilder(false);
  };

  const handleSaveDraft = (template: LessonPlanTemplate) => {
    // TODO: Integrate with API to save draft
    console.log("Saving draft:", template);
    toast.success("Nháp đã được lưu!");

    // Save to localStorage for now
    localStorage.setItem(
      `lesson-plan-content-draft-${template.id}`,
      JSON.stringify(template)
    );
  };

  if (showBuilder) {
    return (
      <LessonPlanTemplateBuilder
        initialTemplate={currentTemplate}
        onSave={handleSave}
        onSaveDraft={handleSaveDraft}
        onExit={() => setShowBuilder(false)}
        mode="staff" // Staff mode - chỉ chỉnh sửa nội dung
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-calsans text-gray-900 mb-2">
            Chọn Template Giáo Án
          </h1>
          <p className="text-gray-600">
            Chọn template phù hợp để tạo nội dung giáo án chi tiết
          </p>
        </div>

        {/* Templates List */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-calsans mb-2">Danh Sách Template</h2>
              <p className="text-gray-600">
                Chọn template để bắt đầu tạo nội dung giáo án
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  {template.steps?.length || 0} bước • 0 từ khóa
                </div>

                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Có sẵn
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditTemplate(template)}
                    className="text-xs"
                  >
                    Tạo nội dung
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
