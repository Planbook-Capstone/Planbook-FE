"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/ui/FormField";
import { Settings, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  useMatrixTemplatesService,
  DEFAULT_MATRIX_TEMPLATES,
  type MatrixTemplateConfig,
  convertMatrixToBackendFormat,
} from "@/services/matrixTemplateServices";
import ConfigurableExamMatrixForm from "@/components/forms/ConfigurableExamMatrixForm";

interface MatrixWithTemplateProps {
  onMatrixChange?: (matrixData: any) => void;
  initialTemplateId?: string;
  readonly?: boolean;
}

const MatrixWithTemplate: React.FC<MatrixWithTemplateProps> = ({
  onMatrixChange,
  initialTemplateId,
  readonly = false,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    initialTemplateId || "default-3-parts"
  );
  const [selectedTemplate, setSelectedTemplate] = useState<MatrixTemplateConfig | null>(null);
  const [matrixData, setMatrixData] = useState<{ [partId: string]: { [difficultyId: string]: number } }>({});

  // Fetch templates (for now use default templates)
  const { data: templatesData } = useMatrixTemplatesService();
  const templates = templatesData?.data?.content || DEFAULT_MATRIX_TEMPLATES;

  // Update selected template when templateId changes
  useEffect(() => {
    const template = templates.find((t: MatrixTemplateConfig) => t.id === selectedTemplateId);
    if (template) {
      setSelectedTemplate(template);
      
      // Initialize matrix data for new template
      const initialMatrix: { [partId: string]: { [difficultyId: string]: number } } = {};
      template.parts.forEach((part) => {
        initialMatrix[part.id] = {};
        part.difficultyLevels.forEach((difficulty) => {
          initialMatrix[part.id][difficulty.id] = 0;
        });
      });
      setMatrixData(initialMatrix);
    }
  }, [selectedTemplateId, templates]);

  // Handle template change
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    toast.success("Template đã được thay đổi");
  };

  // Handle matrix data change
  const handleMatrixDataChange = (newMatrixData: { [partId: string]: { [difficultyId: string]: number } }) => {
    setMatrixData(newMatrixData);
    
    if (onMatrixChange && selectedTemplate) {
      // Convert to backend format
      const backendFormat = convertMatrixToBackendFormat(newMatrixData, selectedTemplate);
      onMatrixChange({
        templateId: selectedTemplateId,
        template: selectedTemplate,
        matrixData: newMatrixData,
        backendFormat,
      });
    }
  };

  // Reset matrix data
  const handleResetMatrix = () => {
    if (selectedTemplate) {
      const resetMatrix: { [partId: string]: { [difficultyId: string]: number } } = {};
      selectedTemplate.parts.forEach((part) => {
        resetMatrix[part.id] = {};
        part.difficultyLevels.forEach((difficulty) => {
          resetMatrix[part.id][difficulty.id] = 0;
        });
      });
      setMatrixData(resetMatrix);
      toast.success("Ma trận đã được reset");
    }
  };

  if (!selectedTemplate) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải template...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      {!readonly && (
        <Card>
          <CardHeader>
            <CardTitle className="font-calsans flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Cấu hình Template Ma Trận
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Chọn Template" htmlFor="template-select">
                <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn template ma trận" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template: MatrixTemplateConfig) => (
                      <SelectItem key={template.id} value={template.id!}>
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs text-gray-500">{template.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={handleResetMatrix}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Ma Trận
                </Button>
              </div>
            </div>

            {/* Template Info */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium font-calsans mb-2">Thông tin Template</h4>
              <p className="text-sm text-gray-600 font-questrial mb-3">
                {selectedTemplate.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Số phần:</span>
                  <div className="font-medium">{selectedTemplate.parts.length}</div>
                </div>
                <div>
                  <span className="text-gray-600">Tổng mức độ:</span>
                  <div className="font-medium">
                    {selectedTemplate.parts.reduce((total, part) => total + part.difficultyLevels.length, 0)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Trạng thái:</span>
                  <div className="font-medium text-green-600">
                    {selectedTemplate.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Template ID:</span>
                  <div className="font-medium text-xs text-gray-500">{selectedTemplate.id}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matrix Form */}
      <Card>
        <CardHeader>
          <CardTitle className="font-calsans">
            Ma trận đề thi - {selectedTemplate.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ConfigurableExamMatrixForm
            config={selectedTemplate}
            onMatrixChange={handleMatrixDataChange}
            initialData={matrixData}
            readonly={readonly}
          />
        </CardContent>
      </Card>

      {/* Template Structure Preview */}
      {!readonly && (
        <Card>
          <CardHeader>
            <CardTitle className="font-calsans">Cấu trúc Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedTemplate.parts.map((part, index) => (
                <div key={part.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`w-4 h-4 rounded ${part.color}`}></div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {part.name}
                      {part.label && <span className="text-gray-500 ml-2">({part.label})</span>}
                    </div>
                    <div className="text-xs text-gray-600">
                      Mức độ: {part.difficultyLevels.map(d => d.name).join(", ")}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {part.difficultyLevels.length} mức độ
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MatrixWithTemplate;
