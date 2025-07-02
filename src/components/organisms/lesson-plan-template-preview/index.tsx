"use client";

import { LessonPlanTemplate, LessonPlanKeyword } from "@/types";
import { Clock, AlertCircle, FileText, Hash } from "lucide-react";

interface LessonPlanTemplatePreviewProps {
  template: LessonPlanTemplate;
}

interface KeywordPreviewProps {
  keyword: LessonPlanKeyword;
  level: number;
}

function KeywordPreview({ keyword, level }: KeywordPreviewProps) {
  const indentClass = level > 0 ? `ml-${level * 4}` : "";
  const textSize = level === 0 ? "text-base font-medium" : level === 1 ? "text-sm" : "text-xs";
  const bulletStyle = level === 0 ? "•" : level === 1 ? "-" : "◦";

  return (
    <div className={`${indentClass} mb-2`}>
      <div className={`flex items-start gap-2 ${textSize}`}>
        <span className="text-gray-400 mt-1">{bulletStyle}</span>
        <div className="flex-1">
          <div className="font-medium text-gray-800">
            {keyword.title || "Chưa có tiêu đề"}
          </div>
          {keyword.content && (
            <div className="text-gray-600 mt-1 text-sm">
              {keyword.content}
            </div>
          )}
          {keyword.prompt && (
            <div className="text-blue-600 mt-1 text-xs italic">
              AI Prompt: {keyword.prompt}
            </div>
          )}
        </div>
      </div>
      
      {keyword.children && keyword.children.length > 0 && (
        <div className="mt-2">
          {keyword.children.map((child) => (
            <KeywordPreview
              key={child.id}
              keyword={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function LessonPlanTemplatePreview({ template }: LessonPlanTemplatePreviewProps) {
  const totalTime = template.steps.reduce((total, step) => {
    return total + (step.timeAllocation || 0);
  }, 0);

  const requiredSteps = template.steps.filter(step => step.isRequired);
  const optionalSteps = template.steps.filter(step => !step.isRequired);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h1 className="text-2xl font-calsans mb-2">
          {template.name || "Template Giáo Án"}
        </h1>
        {template.description && (
          <p className="text-blue-100 mb-4">{template.description}</p>
        )}
        
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Tổng thời gian: {totalTime} phút</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>Bước bắt buộc: {requiredSteps.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Bước tùy chọn: {optionalSteps.length}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {template.steps.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Template trống</h3>
            <p>Chưa có bước nào được thêm vào template này.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {template.steps
              .sort((a, b) => a.order - b.order)
              .map((step, index) => (
                <div key={step.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  {/* Step Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-calsans text-gray-800">
                          {step.title || `Bước ${index + 1}`}
                        </h2>
                        {step.isRequired && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            <AlertCircle className="w-3 h-3" />
                            Bắt buộc
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {step.stepType === "general_info" && "Thông tin chung"}
                          {step.stepType === "objectives" && "Mục tiêu"}
                          {step.stepType === "equipment" && "Thiết bị"}
                          {step.stepType === "activities" && "Hoạt động"}
                          {step.stepType === "custom" && "Tùy chỉnh"}
                        </span>
                      </div>
                      
                      {step.description && (
                        <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                      )}
                      
                      {step.timeAllocation && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{step.timeAllocation} phút</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Keywords */}
                  {step.keywords.length > 0 ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Hash className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          Từ khóa và nội dung ({step.keywords.length})
                        </span>
                      </div>
                      <div className="space-y-2">
                        {step.keywords
                          .sort((a, b) => a.order - b.order)
                          .map((keyword) => (
                            <KeywordPreview
                              key={keyword.id}
                              keyword={keyword}
                              level={0}
                            />
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                      <Hash className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Chưa có từ khóa nào được thêm</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            <span>Phiên bản: {template.version}</span>
            {template.metadata.subject && (
              <span className="ml-4">Môn học: {template.metadata.subject}</span>
            )}
            {template.metadata.grade && (
              <span className="ml-4">Lớp: {template.metadata.grade}</span>
            )}
          </div>
          <div>
            Cập nhật: {new Date(template.updatedAt).toLocaleDateString("vi-VN")}
          </div>
        </div>
      </div>
    </div>
  );
}
