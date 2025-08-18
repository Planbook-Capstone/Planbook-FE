"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/FormField";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save, Eye, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import {
  useMatrixTemplateByIdService,
  useUpdateMatrixTemplateService,
  type MatrixTemplateConfig,
  type DifficultyLevel,
  type MatrixPart,
  validateMatrixTemplate,
} from "@/services/matrixTemplateServices";
import ConfigurableExamMatrixForm from "@/components/forms/ConfigurableExamMatrixForm";
import ColorPicker from "@/components/ui/ColorPicker";

function EditMatrixTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const [config, setConfig] = useState<MatrixTemplateConfig | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Use API to fetch template data
  const { data: templateData, isLoading: isLoadingTemplate } = useMatrixTemplateByIdService(templateId);
  const { mutate: updateTemplate, isPending: isUpdating } = useUpdateMatrixTemplateService();

  useEffect(() => {
    // Wait for API data to load
    if (isLoadingTemplate) {
      setIsLoading(true);
      return;
    }

    // Use API data
    let template = templateData?.data;

    if (template) {
      // Map API data structure to expected format
      if (template.matrixJson && !template.parts) {
        template = {
          ...template,
          parts: template.matrixJson.parts || []
        };
      }

      // Ensure parts array exists
      if (!template.parts) {
        template.parts = [];
      }

      setConfig(template);
      setIsLoading(false);
    } else if (!isLoadingTemplate) {
      toast.error("Không tìm thấy mẫu ma trận");
      router.push("/staff/matrix-templates");
    }
  }, [templateId, templateData, isLoadingTemplate, router]);

  // Handle template info changes
  const handleTemplateInfoChange = (field: keyof MatrixTemplateConfig, value: string) => {
    if (!config) return;
    
    setConfig(prev => prev ? ({
      ...prev,
      [field]: value
    }) : null);
  };

  // Handle part changes
  const handlePartChange = (partIndex: number, field: keyof MatrixPart, value: string) => {
    if (!config) return;
    
    setConfig(prev => prev ? ({
      ...prev,
      parts: prev.parts.map((part, index) => 
        index === partIndex ? { ...part, [field]: value } : part
      )
    }) : null);
  };

  // Handle difficulty level changes
  const handleDifficultyChange = (
    partIndex: number, 
    difficultyIndex: number, 
    field: keyof DifficultyLevel, 
    value: string
  ) => {
    if (!config) return;
    
    setConfig(prev => prev ? ({
      ...prev,
      parts: prev.parts.map((part, pIndex) => 
        pIndex === partIndex 
          ? {
              ...part,
              difficultyLevels: part.difficultyLevels.map((difficulty, dIndex) =>
                dIndex === difficultyIndex ? { ...difficulty, [field]: value } : difficulty
              )
            }
          : part
      )
    }) : null);
  };

  // Add new part
  const addPart = () => {
    if (!config || !config.parts) return;

    const newPart: MatrixPart = {
      id: "",
      name: `Phần ${config.parts.length + 1}`,
      label: "",
      color: "bg-gray-50",
      difficultyLevels: [
        { id: "", name: "NB", label: "Nhận biết", color: "text-gray-700" },
        { id: "", name: "TH", label: "Thông hiểu", color: "text-gray-700" },
        { id: "", name: "VD", label: "Vận dụng", color: "text-gray-700" },
      ],
    };

    setConfig(prev => prev ? ({
      ...prev,
      parts: [...prev.parts, newPart]
    }) : null);
  };

  // Remove part
  const removePart = (partIndex: number) => {
    if (!config || !config.parts || config.parts.length <= 1) {
      toast.error("Phải có ít nhất một phần trong ma trận");
      return;
    }
    
    setConfig(prev => prev ? ({
      ...prev,
      parts: prev.parts.filter((_, index) => index !== partIndex)
    }) : null);
  };

  // Add difficulty level to a part
  const addDifficultyLevel = (partIndex: number) => {
    if (!config || !config.parts || !config.parts[partIndex]) return;

    const currentPart = config.parts[partIndex];
    const difficultyLevels = currentPart.difficultyLevels || [];

    const newDifficulty: DifficultyLevel = {
      id: "",
      name: "",
      label: "",
      color: difficultyLevels[0]?.color || "text-gray-700",
    };

    setConfig(prev => prev ? ({
      ...prev,
      parts: prev.parts.map((part, index) =>
        index === partIndex
          ? { ...part, difficultyLevels: [...part.difficultyLevels, newDifficulty] }
          : part
      )
    }) : null);
  };

  // Remove difficulty level
  const removeDifficultyLevel = (partIndex: number, difficultyIndex: number) => {
    if (!config || !config.parts || !config.parts[partIndex] || !config.parts[partIndex].difficultyLevels || config.parts[partIndex].difficultyLevels.length <= 1) {
      toast.error("Phải có ít nhất một mức độ trong mỗi phần");
      return;
    }

    setConfig(prev => prev ? ({
      ...prev,
      parts: prev.parts.map((part, pIndex) => 
        pIndex === partIndex 
          ? {
              ...part,
              difficultyLevels: part.difficultyLevels.filter((_, dIndex) => dIndex !== difficultyIndex)
            }
          : part
      )
    }) : null);
  };

  // Save template
  const handleSave = () => {
    if (!config) return;

    const validationErrors = validateMatrixTemplate(config);
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    // Prepare data for API (convert back to API format)
    const updateData = {
      name: config.name,
      description: config.description,
      matrixJson: {
        parts: config.parts
      },
      status: config.status
    };

    updateTemplate(
      { id: templateId, data: updateData },
      {
        onSuccess: () => {
          toast.success("Template đã được cập nhật thành công!");
          router.push("/staff/matrix-templates");
        },
        onError: (error) => {
          console.error("Error updating template:", error);
          toast.error("Có lỗi xảy ra khi cập nhật template!");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải template...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Không tìm thấy template
        </h3>
        <p className="text-gray-600 mb-4">
          Template với ID "{templateId}" không tồn tại.
        </p>
        <Link href="/staff/matrix-templates">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/staff/matrix-templates">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-calsans">Chỉnh sửa mẫu Ma Trận</h1>
            <p className="text-gray-600 font-questrial">
              Cập nhật cấu hình template "{config.name}"
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Template Info */}
          <Card>
            <CardHeader>
              <CardTitle className="font-calsans">Thông tin mẫu ma trận</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Tên Template" htmlFor="template-name">
                <Input
                  id="template-name"
                  value={config.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTemplateInfoChange("name", e.target.value)}
                  placeholder="Nhập tên mẫu ma trận"
                  className="font-questrial"
                />
              </FormField>
              
              <FormField label="Mô tả" htmlFor="template-description">
                <Textarea
                  id="template-description"
                  value={config.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleTemplateInfoChange("description", e.target.value)}
                  placeholder="Mô tả về mẫu này"
                  rows={3}
                  className="font-questrial"
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Parts Configuration - Similar to create page */}
          <Card>
            <CardHeader>
              <CardTitle className="font-calsans flex items-center justify-between">
                Cấu hình các Phần
                <Button onClick={addPart} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm phần
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(config.parts || []).map((part, partIndex) => (
                <div key={part.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium font-calsans">Phần {partIndex + 1}</h4>
                    {(config.parts?.length || 0) > 1 && (
                      <Button
                        onClick={() => removePart(partIndex)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField label="ID" htmlFor={`part-id-${partIndex}`}>
                      <Input
                        id={`part-id-${partIndex}`}
                        value={part.id}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handlePartChange(partIndex, "id", e.target.value)
                        }
                        placeholder="part1"
                        className="font-questrial"
                      />
                    </FormField>

                    <FormField label="Tên hiển thị" htmlFor={`part-name-${partIndex}`}>
                      <Input
                        id={`part-name-${partIndex}`}
                        value={part.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handlePartChange(partIndex, "name", e.target.value)
                        }
                        placeholder="Phần 1"
                        className="font-questrial"
                      />
                    </FormField>

                    <FormField label="Nhãn mô tả" htmlFor={`part-label-${partIndex}`}>
                      <Input
                        id={`part-label-${partIndex}`}
                        value={part.label}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handlePartChange(partIndex, "label", e.target.value)
                        }
                        placeholder="Trắc nghiệm"
                        className="font-questrial"
                      />
                    </FormField>
                  </div>

                  <FormField label="Màu nền" htmlFor={`part-color-${partIndex}`}>
                    <ColorPicker
                      selectedColor={part.color}
                      onColorChange={(color) => handlePartChange(partIndex, "color", color)}
                    />
                  </FormField>

                  {/* Difficulty Levels */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium font-calsans text-sm">Mức độ khó</h5>
                      <Button
                        onClick={() => addDifficultyLevel(partIndex)}
                        size="sm"
                        variant="outline"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Thêm mức độ
                      </Button>
                    </div>

                    {/* Headers for difficulty level fields */}
                    <div className="grid grid-cols-12 gap-2 text-xs text-gray-600 font-medium">
                      <div className="col-span-3 text-center">ID</div>
                      <div className="col-span-2 text-center">Tên</div>
                      <div className="col-span-6">Nhãn mô tả</div>
                      <div className="col-span-1"></div>
                    </div>

                    {(part.difficultyLevels || []).map((difficulty, difficultyIndex) => (
                      <div key={difficulty.id || difficultyIndex} className="grid grid-cols-12 gap-2 p-2 bg-gray-50 rounded items-center">
                        <div className="col-span-3">
                          <Input
                            value={difficulty.id}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleDifficultyChange(partIndex, difficultyIndex, "id", e.target.value)
                            }
                            placeholder="nb"
                            className="text-center font-questrial text-xs"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            value={difficulty.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleDifficultyChange(partIndex, difficultyIndex, "name", e.target.value)
                            }
                            placeholder="NB"
                            className="text-center font-questrial text-xs"
                          />
                        </div>
                        <div className="col-span-6">
                          <Input
                            value={difficulty.label}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleDifficultyChange(partIndex, difficultyIndex, "label", e.target.value)
                            }
                            placeholder="Nhận biết"
                            className="font-questrial text-xs"
                          />
                        </div>
                        <div className="col-span-1">
                          {(part.difficultyLevels?.length || 0) > 1 && (
                            <Button
                              onClick={() => removeDifficultyLevel(partIndex, difficultyIndex)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-calsans flex items-center justify-between">
                Xem trước Ma trận
                <Button
                  onClick={() => setShowPreview(!showPreview)}
                  size="sm"
                  variant="outline"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {showPreview ? "Ẩn" : "Hiện"} xem trước
                </Button>
              </CardTitle>
            </CardHeader>
            {showPreview && (
              <CardContent>
                <ConfigurableExamMatrixForm
                  config={config}
                  readonly={true}
                />
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end gap-4">
        <Link href="/staff/matrix-templates">
          <Button variant="outline">
            Hủy
          </Button>
        </Link>
        <Button onClick={handleSave} disabled={isUpdating}>
          <Save className="w-4 h-4 mr-2" />
          {isUpdating ? "Đang lưu..." : "Cập nhật mẫu ma trận"}
        </Button>
      </div>
    </div>
  );
}

export default EditMatrixTemplatePage;
