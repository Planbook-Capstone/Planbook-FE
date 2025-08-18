"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/FormField";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  type MatrixTemplateConfig,
  type DifficultyLevel,
  type MatrixPart,
  validateMatrixTemplate,
  useCreateMatrixTemplateService,
} from "@/services/matrixTemplateServices";
import ConfigurableExamMatrixForm from "@/components/forms/ConfigurableExamMatrixForm";
import ColorPicker from "@/components/ui/ColorPicker";

function CreateMatrixTemplatePage() {
  const router = useRouter();
  const [config, setConfig] = useState<MatrixTemplateConfig>({
    name: "",
    description: "",
    parts: [
      {
        id: "part1",
        name: "Phần 1",
        label: "Trắc nghiệm",
        color: "bg-amber-50",
        difficultyLevels: [
          { id: "nb", name: "NB", label: "Nhận biết", color: "text-amber-700" },
          { id: "th", name: "TH", label: "Thông hiểu", color: "text-amber-700" },
          { id: "vd", name: "VD", label: "Vận dụng", color: "text-amber-700" },
        ],
      },
      {
        id: "part2",
        name: "Phần 2",
        label: "Đúng/Sai",
        color: "bg-green-50",
        difficultyLevels: [
          { id: "nb", name: "NB", label: "Nhận biết", color: "text-green-700" },
          { id: "th", name: "TH", label: "Thông hiểu", color: "text-green-700" },
          { id: "vd", name: "VD", label: "Vận dụng", color: "text-green-700" },
        ],
      },
      {
        id: "part3",
        name: "Phần 3",
        label: "Tự luận",
        color: "bg-sky-50",
        difficultyLevels: [
          { id: "nb", name: "NB", label: "Nhận biết", color: "text-sky-700" },
          { id: "th", name: "TH", label: "Thông hiểu", color: "text-sky-700" },
          { id: "vd", name: "VD", label: "Vận dụng", color: "text-sky-700" },
        ],
      },
    ],
  });

  const [showPreview, setShowPreview] = useState(false);
const {mutate:createMatrixTemplate, isPending: isCreating} = useCreateMatrixTemplateService();
  // Handle template info changes
  const handleTemplateInfoChange = (field: keyof MatrixTemplateConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle part changes
  const handlePartChange = (partIndex: number, field: keyof MatrixPart, value: string) => {
    setConfig(prev => ({
      ...prev,
      parts: prev.parts.map((part, index) =>
        index === partIndex ? { ...part, [field]: value } : part
      )
    }));
  };

  // Handle difficulty level changes
  const handleDifficultyChange = (
    partIndex: number,
    difficultyIndex: number,
    field: keyof DifficultyLevel,
    value: string
  ) => {
    setConfig(prev => ({
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
    }));
  };

  // Add new part
  const addPart = () => {
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

    setConfig(prev => ({
      ...prev,
      parts: [...prev.parts, newPart]
    }));
  };

  // Remove part
  const removePart = (partIndex: number) => {
    if (config.parts.length <= 1) {
      toast.error("Phải có ít nhất một phần trong ma trận");
      return;
    }

    setConfig(prev => ({
      ...prev,
      parts: prev.parts.filter((_, index) => index !== partIndex)
    }));
  };

  // Add difficulty level to a part
  const addDifficultyLevel = (partIndex: number) => {
    const newDifficulty: DifficultyLevel = {
      id: "",
      name: "",
      label: "",
      color: config.parts[partIndex].difficultyLevels[0]?.color || "text-gray-700",
    };

    setConfig(prev => ({
      ...prev,
      parts: prev.parts.map((part, index) =>
        index === partIndex
          ? { ...part, difficultyLevels: [...part.difficultyLevels, newDifficulty] }
          : part
      )
    }));
  };

  // Remove difficulty level
  const removeDifficultyLevel = (partIndex: number, difficultyIndex: number) => {
    if (config.parts[partIndex].difficultyLevels.length <= 1) {
      toast.error("Phải có ít nhất một mức độ trong mỗi phần");
      return;
    }

    setConfig(prev => ({
      ...prev,
      parts: prev.parts.map((part, pIndex) =>
        pIndex === partIndex
          ? {
              ...part,
              difficultyLevels: part.difficultyLevels.filter((_, dIndex) => dIndex !== difficultyIndex)
            }
          : part
      )
    }));
  };

  // Save template
  const handleSave = () => {
    const validationErrors = validateMatrixTemplate(config);
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    // Prepare data for API
    const createData = {
      name: config.name,
      description: config.description,
      matrixJson: {
        parts: config.parts
      },
      status: "ACTIVE"
    };

    createMatrixTemplate(createData, {
      onSuccess: () => {
        toast.success("Mẫu ma trận đã được tạo thành công!");
        router.push("/staff/matrix-templates");
      },
      onError: (error) => {
        console.error("Error creating template:", error);
        toast.error("Có lỗi xảy ra khi tạo template!");
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-calsans mb-2">Tạo Mẫu Ma Trận Đề Thi</h1>
        <p className="text-gray-600 font-questrial">
          Cấu hình cấu trúc ma trận đề thi với các phần và mức độ khó tùy chỉnh
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Template Info */}
          <Card>
            <CardHeader>
              <CardTitle className="font-calsans">Thông tin Ma trận</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Tên ma trận" htmlFor="template-name">
                <Input
                  id="template-name"
                  value={config.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTemplateInfoChange("name", e.target.value)}
                  placeholder="Nhập tên ma trận"
                  className="font-questrial"
                />
              </FormField>

              <FormField label="Mô tả" htmlFor="template-description">
                <Textarea
                  id="template-description"
                  value={config.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleTemplateInfoChange("description", e.target.value)}
                  placeholder="Mô tả về mẫu ma trận này"
                  rows={3}
                  className="font-questrial"
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Parts Configuration */}
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
              {config.parts.map((part, partIndex) => (
                <div key={part.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium font-calsans">Phần {partIndex + 1}</h4>
                    {config.parts.length > 1 && (
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
                    <FormField label="ID phần" htmlFor={`part-id-${partIndex}`}>
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

                    <div className="text-xs text-gray-500 font-questrial">
                      <span className="font-medium">Thứ tự:</span> ID | Tên | Mô tả
                    </div>

                    {part.difficultyLevels.map((difficulty, difficultyIndex) => (
                      <div key={difficulty.id || difficultyIndex} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Input
                          value={difficulty.id}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleDifficultyChange(partIndex, difficultyIndex, "id", e.target.value)
                          }
                          placeholder="nb"
                          className="w-16 text-center font-questrial"
                          title="ID mức độ"
                        />
                        <Input
                          value={difficulty.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleDifficultyChange(partIndex, difficultyIndex, "name", e.target.value)
                          }
                          placeholder="NB"
                          className="w-16 text-center font-questrial"
                          title="Tên hiển thị"
                        />
                        <Input
                          value={difficulty.label}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleDifficultyChange(partIndex, difficultyIndex, "label", e.target.value)
                          }
                          placeholder="Nhận biết"
                          className="flex-1 font-questrial"
                          title="Mô tả mức độ"
                        />
                        {part.difficultyLevels.length > 1 && (
                          <Button
                            onClick={() => removeDifficultyLevel(partIndex, difficultyIndex)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
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

          {/* Usage Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="font-calsans">Hướng dẫn sử dụng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm font-questrial text-gray-600">
              <div>
                <strong>1. Cấu hình thông tin template:</strong> Nhập tên và mô tả cho template ma trận.
              </div>
              <div>
                <strong>2. Thiết lập các phần:</strong> Nhập ID, tên hiển thị và nhãn mô tả cho mỗi phần. ID phải là duy nhất.
              </div>
              <div>
                <strong>3. Định nghĩa mức độ khó:</strong> Nhập ID, tên và mô tả cho mỗi mức độ khó. ID trong cùng một phần phải khác nhau.
              </div>
              <div>
                <strong>4. Xem trước:</strong> Kiểm tra giao diện ma trận sẽ hiển thị như thế nào.
              </div>
              <div>
                <strong>5. Lưu template:</strong> Hệ thống sẽ kiểm tra tính hợp lệ của ID trước khi lưu.
              </div>
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <strong className="text-yellow-800">Lưu ý:</strong>
                <ul className="mt-1 ml-4 list-disc text-yellow-700">
                  <li>ID không được để trống và không được trùng lặp</li>
                  <li>ID nên sử dụng ký tự không dấu, không khoảng trắng</li>
                  <li>Ví dụ ID hợp lệ: part1, nb, th, vd</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.push("/staff/matrix-templates")}>
          Hủy
        </Button>
        <Button onClick={handleSave} disabled={isCreating}>
          <Save className="w-4 h-4 mr-2" />
          {isCreating ? "Đang tạo..." : "Lưu ma trận"}
        </Button>
      </div>
    </div>
  );
}

export default CreateMatrixTemplatePage;
