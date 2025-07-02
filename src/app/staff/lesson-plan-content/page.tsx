"use client";

import { useState } from "react";
import { LessonPlanTemplateBuilder } from "@/components/organisms/lesson-plan-template-builder";
import { LessonPlanTemplate } from "@/types";
import { getDefaultTemplate } from "@/data/lesson-plan-templates";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { ArrowLeft, FileText, Save, BookOpen } from "lucide-react";

export default function LessonPlanContentPage() {
  const [currentTemplate, setCurrentTemplate] = useState<
    LessonPlanTemplate | undefined
  >();
  const [showBuilder, setShowBuilder] = useState(false);

  const handleCreateContent = () => {
    // Load the template structure (read-only for staff)
    const template = getDefaultTemplate();
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
            Tạo Nội Dung Giáo Án
          </h1>
          <p className="text-gray-600">
            Thêm nội dung vào cấu trúc giáo án đã được thiết lập bởi Admin
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-calsans mb-2">Bắt Đầu Tạo Giáo Án</h2>
              <p className="text-gray-600">
                Sử dụng cấu trúc template có sẵn để tạo nội dung giáo án chi tiết
              </p>
            </div>
            <Button 
              onClick={handleCreateContent}
              className="flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Tạo Nội Dung
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Cấu Trúc Có Sẵn</h3>
              <p className="text-sm text-gray-600">
                Sử dụng cấu trúc template đã được Admin thiết lập
              </p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Tập Trung Nội Dung</h3>
              <p className="text-sm text-gray-600">
                Chỉ cần tập trung vào việc tạo nội dung chất lượng
              </p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Save className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Lưu Tự Động</h3>
              <p className="text-sm text-gray-600">
                Hệ thống tự động lưu nháp trong quá trình làm việc
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Hướng dẫn sử dụng:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Click "Tạo Nội Dung" để bắt đầu</li>
              <li>• Cấu trúc bước và tiêu đề đã được thiết lập sẵn</li>
              <li>• Bạn chỉ cần thêm nội dung vào các từ khóa</li>
              <li>• Sử dụng "Lưu nháp" để lưu tiến độ làm việc</li>
              <li>• Click "Lưu" khi hoàn thành để xuất bản giáo án</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
