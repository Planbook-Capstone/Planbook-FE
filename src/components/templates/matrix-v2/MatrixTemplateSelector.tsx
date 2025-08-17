"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/ui/FormField";
import { Badge } from "@/components/ui/badge";
import { Settings, Eye, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  DEFAULT_MATRIX_TEMPLATES,
  type MatrixTemplateConfig,
} from "@/services/matrixTemplateServices";
import { Modal } from "@/components/ui/modal";
import ConfigurableExamMatrixForm from "@/components/forms/ConfigurableExamMatrixForm";

interface MatrixTemplateSelectorProps {
  selectedTemplateId?: string;
  onTemplateChange?: (templateId: string, template: MatrixTemplateConfig) => void;
  onMatrixDataChange?: (matrixData: any) => void;
  className?: string;
}

const MatrixTemplateSelector: React.FC<MatrixTemplateSelectorProps> = ({
  selectedTemplateId = "default-3-parts",
  onTemplateChange,
  onMatrixDataChange,
  className = "",
}) => {
  const [currentTemplateId, setCurrentTemplateId] = useState(selectedTemplateId);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<MatrixTemplateConfig | null>(null);

  // For now, use default templates
  const templates = DEFAULT_MATRIX_TEMPLATES;
  const currentTemplate = templates.find(t => t.id === currentTemplateId);

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCurrentTemplateId(templateId);
      onTemplateChange?.(templateId, template);
      toast.success(`Đã chuyển sang template: ${template.name}`);
    }
  };

  const handlePreviewTemplate = (template: MatrixTemplateConfig) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  };

  const handleResetMatrix = () => {
    if (currentTemplate) {
      // Reset matrix data to zeros
      const resetData: { [partId: string]: { [difficultyId: string]: number } } = {};
      currentTemplate.parts.forEach((part) => {
        resetData[part.id] = {};
        part.difficultyLevels.forEach((difficulty) => {
          resetData[part.id][difficulty.id] = 0;
        });
      });
      
      onMatrixDataChange?.(resetData);
      toast.success("Ma trận đã được reset về 0");
    }
  };

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="font-calsans flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Template Ma Trận
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Template Selection */}
          <FormField label="Chọn Template" htmlFor="template-select">
            <Select value={currentTemplateId} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn template ma trận" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id!}>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-xs text-gray-500">{template.description}</div>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {template.parts.length} phần
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* Current Template Info */}
          {currentTemplate && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium font-calsans">{currentTemplate.name}</h4>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePreviewTemplate(currentTemplate)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Xem
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleResetMatrix}
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{currentTemplate.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Số phần:</span>
                  <span className="ml-2 font-medium">{currentTemplate.parts.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Tổng mức độ:</span>
                  <span className="ml-2 font-medium">
                    {currentTemplate.parts.reduce((total, part) => total + part.difficultyLevels.length, 0)}
                  </span>
                </div>
              </div>

              {/* Parts Preview */}
              <div className="mt-3">
                <h5 className="text-xs font-medium text-gray-700 mb-2">Cấu trúc:</h5>
                <div className="space-y-1">
                  {currentTemplate.parts.map((part) => (
                    <div key={part.id} className="flex items-center gap-2 text-xs">
                      <div className={`w-2 h-2 rounded ${part.color}`}></div>
                      <span className="font-medium">{part.name}</span>
                      {part.label && (
                        <span className="text-gray-500">({part.label})</span>
                      )}
                      <span className="text-gray-400">
                        - {part.difficultyLevels.map(d => d.name).join(", ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex items-center gap-2 pt-2 border-t">
            <span className="text-xs text-gray-600">Thao tác nhanh:</span>
            <Button size="sm" variant="outline" onClick={handleResetMatrix}>
              Reset tất cả
            </Button>
            {currentTemplate && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePreviewTemplate(currentTemplate)}
              >
                Xem trước
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={`Xem trước: ${previewTemplate?.name}`}
        size="xl"
      >
        {previewTemplate && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium font-calsans mb-2">Thông tin Template</h4>
              <p className="text-sm text-gray-600 font-questrial mb-3">
                {previewTemplate.description}
              </p>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Số phần:</span>
                  <div className="font-medium">{previewTemplate.parts.length}</div>
                </div>
                <div>
                  <span className="text-gray-600">Tổng mức độ:</span>
                  <div className="font-medium">
                    {previewTemplate.parts.reduce((total, part) => total + part.difficultyLevels.length, 0)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Trạng thái:</span>
                  <Badge variant={previewTemplate.status === "ACTIVE" ? "default" : "secondary"}>
                    {previewTemplate.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
                  </Badge>
                </div>
              </div>
            </div>
            
            <ConfigurableExamMatrixForm
              config={previewTemplate}
              readonly={true}
            />

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium font-calsans mb-2">Cấu trúc Template</h4>
              <div className="space-y-2">
                {previewTemplate.parts.map((part, index) => (
                  <div key={part.id} className="flex items-center gap-3 p-2 bg-white rounded">
                    <div className={`w-4 h-4 rounded ${part.color}`}></div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {part.name}
                        {part.label && <span className="text-gray-500 ml-2">({part.label})</span>}
                      </div>
                      <div className="text-xs text-gray-600">
                        Mức độ: {part.difficultyLevels.map(d => `${d.name} (${d.label})`).join(", ")}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {part.difficultyLevels.length} mức độ
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default MatrixTemplateSelector;
