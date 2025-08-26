"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/FormField";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus, Trash2, Save, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  type MatrixTemplateConfig,
  type DifficultyLevel,
  type MatrixPart,
  validateMatrixTemplate,
  useCreateMatrixTemplateService,
} from "@/services/matrixTemplateServices";

// Predefined difficulty levels
const PREDEFINED_DIFFICULTY_LEVELS = [
  { id: "nb", name: "NB", label: "Nhận biết" },
  { id: "th", name: "TH", label: "Thông hiểu" },
  { id: "vd", name: "VD", label: "Vận dụng" },
] as const;

// Predefined parts
const PREDEFINED_PARTS = [
  {
    id: "part1",
    name: "Phần 1",
    label: "Trắc nghiệm",
    color: "bg-amber-50",
    textColor: "text-amber-700",
  },
  {
    id: "part2",
    name: "Phần 2",
    label: "Đúng/Sai",
    color: "bg-green-50",
    textColor: "text-green-700",
  },
  {
    id: "part3",
    name: "Phần 3",
    label: "Tự luận",
    color: "bg-sky-50",
    textColor: "text-sky-700",
  },
] as const;
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
        maximum: 20,
        difficultyLevels: [
          { id: "nb", name: "NB", label: "Nhận biết", color: "text-amber-700" },
          {
            id: "th",
            name: "TH",
            label: "Thông hiểu",
            color: "text-amber-700",
          },
          { id: "vd", name: "VD", label: "Vận dụng", color: "text-amber-700" },
        ],
      },
      {
        id: "part2",
        name: "Phần 2",
        label: "Đúng/Sai",
        color: "bg-green-50",
        maximum: 5,
        difficultyLevels: [
          { id: "nb", name: "NB", label: "Nhận biết", color: "text-green-700" },
          {
            id: "th",
            name: "TH",
            label: "Thông hiểu",
            color: "text-green-700",
          },
          { id: "vd", name: "VD", label: "Vận dụng", color: "text-green-700" },
        ],
      },
      {
        id: "part3",
        name: "Phần 3",
        label: "Tự luận",
        color: "bg-sky-50",
        maximum: 3,
        difficultyLevels: [
          { id: "nb", name: "NB", label: "Nhận biết", color: "text-sky-700" },
          { id: "th", name: "TH", label: "Thông hiểu", color: "text-sky-700" },
          { id: "vd", name: "VD", label: "Vận dụng", color: "text-sky-700" },
        ],
      },
    ],
  });

  const [showPreview, setShowPreview] = useState(false);
  const { mutate: createMatrixTemplate, isPending: isCreating } =
    useCreateMatrixTemplateService();
  // Handle template info changes
  const handleTemplateInfoChange = (
    field: keyof MatrixTemplateConfig,
    value: string
  ) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle part changes
  const handlePartChange = (
    partIndex: number,
    field: keyof MatrixPart,
    value: string
  ) => {
    setConfig((prev) => ({
      ...prev,
      parts: prev.parts.map((part, index) =>
        index === partIndex
          ? {
              ...part,
              [field]: field === "maximum" ? (value === "" ? undefined : parseInt(value)) : value
            }
          : part
      ),
    }));
  };

  // Handle difficulty level changes
  const handleDifficultyChange = (
    partIndex: number,
    difficultyIndex: number,
    field: keyof DifficultyLevel,
    value: string
  ) => {
    setConfig((prev) => ({
      ...prev,
      parts: prev.parts.map((part, pIndex) =>
        pIndex === partIndex
          ? {
              ...part,
              difficultyLevels: part.difficultyLevels.map(
                (difficulty, dIndex) =>
                  dIndex === difficultyIndex
                    ? { ...difficulty, [field]: value }
                    : difficulty
              ),
            }
          : part
      ),
    }));
  };

  // Handle difficulty level selection from dropdown
  const handleDifficultyLevelSelect = (
    partIndex: number,
    difficultyIndex: number,
    selectedLabel: string
  ) => {
    const selectedDifficulty = PREDEFINED_DIFFICULTY_LEVELS.find(
      (level) => level.label === selectedLabel
    );

    if (selectedDifficulty) {
      setConfig((prev) => ({
        ...prev,
        parts: prev.parts.map((part, pIndex) =>
          pIndex === partIndex
            ? {
                ...part,
                difficultyLevels: part.difficultyLevels.map(
                  (difficulty, dIndex) =>
                    dIndex === difficultyIndex
                      ? {
                          ...difficulty,
                          id: selectedDifficulty.id,
                          name: selectedDifficulty.name,
                          label: selectedDifficulty.label,
                        }
                      : difficulty
                ),
              }
            : part
        ),
      }));
    }
  };

  // Add new part (always in order: part1 -> part2 -> part3)
  const addPart = () => {
    // Check if we can add more parts
    if (config.parts.length >= PREDEFINED_PARTS.length) {
      toast.error("Đã đạt số lượng phần tối đa");
      return;
    }

    // Find the first missing part in order (part1 -> part2 -> part3)
    const usedPartIds = config.parts.map((p) => p.id);
    const nextPart = PREDEFINED_PARTS.find(
      (part) => !usedPartIds.includes(part.id)
    );

    if (!nextPart) {
      toast.error("Không còn phần nào khả dụng");
      return;
    }

    const newPart: MatrixPart = {
      id: nextPart.id,
      name: nextPart.name,
      label: nextPart.label,
      color: nextPart.color,
      maximum: nextPart.id === "part1" ? 20 : nextPart.id === "part2" ? 5 : 3,
      difficultyLevels: [
        {
          id: "nb",
          name: "NB",
          label: "Nhận biết",
          color: nextPart.textColor,
        },
        {
          id: "th",
          name: "TH",
          label: "Thông hiểu",
          color: nextPart.textColor,
        },
        {
          id: "vd",
          name: "VD",
          label: "Vận dụng",
          color: nextPart.textColor,
        },
      ],
    };

    setConfig((prev) => {
      // Add the new part and sort by predefined order
      const updatedParts = [...prev.parts, newPart];

      // Sort parts according to PREDEFINED_PARTS order
      const sortedParts = updatedParts.sort((a, b) => {
        const indexA = PREDEFINED_PARTS.findIndex((p) => p.id === a.id);
        const indexB = PREDEFINED_PARTS.findIndex((p) => p.id === b.id);
        return indexA - indexB;
      });

      return {
        ...prev,
        parts: sortedParts,
      };
    });
  };

  // Remove part
  const removePart = (partIndex: number) => {
    if (config.parts.length <= 1) {
      toast.error("Phải có ít nhất một phần trong ma trận");
      return;
    }

    setConfig((prev) => ({
      ...prev,
      parts: prev.parts.filter((_, index) => index !== partIndex),
    }));
  };

  // Add difficulty level to a part
  const addDifficultyLevel = (partIndex: number) => {
    // Check if we can add more difficulty levels
    if (
      config.parts[partIndex].difficultyLevels.length >=
      PREDEFINED_DIFFICULTY_LEVELS.length
    ) {
      toast.error("Đã đạt số lượng mức độ khó tối đa");
      return;
    }

    // Find the first unused difficulty level
    const usedLabels = config.parts[partIndex].difficultyLevels.map(
      (d) => d.label
    );
    const availableLevel = PREDEFINED_DIFFICULTY_LEVELS.find(
      (level) => !usedLabels.includes(level.label)
    );

    if (!availableLevel) {
      toast.error("Không còn mức độ khó nào khả dụng");
      return;
    }

    const newDifficulty: DifficultyLevel = {
      id: availableLevel.id,
      name: availableLevel.name,
      label: availableLevel.label,
      color:
        config.parts[partIndex].difficultyLevels[0]?.color || "text-gray-700",
    };

    setConfig((prev) => ({
      ...prev,
      parts: prev.parts.map((part, index) =>
        index === partIndex
          ? {
              ...part,
              difficultyLevels: [...part.difficultyLevels, newDifficulty],
            }
          : part
      ),
    }));
  };

  // Remove difficulty level
  const removeDifficultyLevel = (
    partIndex: number,
    difficultyIndex: number
  ) => {
    if (config.parts[partIndex].difficultyLevels.length <= 1) {
      toast.error("Phải có ít nhất một mức độ trong mỗi phần");
      return;
    }

    setConfig((prev) => ({
      ...prev,
      parts: prev.parts.map((part, pIndex) =>
        pIndex === partIndex
          ? {
              ...part,
              difficultyLevels: part.difficultyLevels.filter(
                (_, dIndex) => dIndex !== difficultyIndex
              ),
            }
          : part
      ),
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
        parts: config.parts,
      },
      status: "ACTIVE",
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleTemplateInfoChange("name", e.target.value)
                  }
                  placeholder="Nhập tên ma trận"
                  className="font-questrial"
                />
              </FormField>

              <FormField label="Mô tả" htmlFor="template-description">
                <Textarea
                  id="template-description"
                  value={config.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleTemplateInfoChange("description", e.target.value)
                  }
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
                <Button
                  onClick={addPart}
                  size="sm"
                  variant="outline"
                  disabled={config.parts.length >= PREDEFINED_PARTS.length}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm phần
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.parts.map((part, partIndex) => (
                <div key={part.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium font-calsans">
                      Phần {partIndex + 1}
                    </h4>
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

                  <div className="grid grid-cols-4 gap-4">
                    <FormField label="Loại" htmlFor={`part-id-${partIndex}`}>
                      <Input
                        id={`part-id-${partIndex}`}
                        value={part.label}
                        className="font-questrial bg-gray-100"
                        disabled={true}
                        title="Loại phần được tự động xác định theo thứ tự"
                      />
                    </FormField>

                    <FormField
                      label="Tên hiển thị"
                      htmlFor={`part-name-${partIndex}`}
                    >
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

                    <FormField
                      label="Nhãn mô tả"
                      htmlFor={`part-label-${partIndex}`}
                    >
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

                    <FormField
                      label="Số câu tối đa"
                      htmlFor={`part-maximum-${partIndex}`}
                    >
                      <Input
                        id={`part-maximum-${partIndex}`}
                        type="number"
                        min="0"
                        step="1"
                        value={part.maximum || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handlePartChange(partIndex, "maximum", e.target.value)
                        }
                        placeholder="20"
                        className="font-questrial"
                      />
                    </FormField>
                  </div>

                  <FormField
                    label="Màu nền"
                    htmlFor={`part-color-${partIndex}`}
                  >
                    <ColorPicker
                      selectedColor={part.color}
                      onColorChange={(color) =>
                        handlePartChange(partIndex, "color", color)
                      }
                    />
                  </FormField>

                  {/* Difficulty Levels */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium font-calsans text-sm">
                        Mức độ khó
                      </h5>
                      <Button
                        onClick={() => addDifficultyLevel(partIndex)}
                        size="sm"
                        variant="outline"
                        disabled={
                          part.difficultyLevels.length >=
                          PREDEFINED_DIFFICULTY_LEVELS.length
                        }
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Thêm mức độ
                      </Button>
                    </div>

                    <div className="text-xs text-gray-500 font-questrial">
                      <span className="font-medium">Thứ tự:</span> ID | Tên | Mô
                      tả
                    </div>

                    {part.difficultyLevels.map(
                      (difficulty, difficultyIndex) => (
                        <div
                          key={difficulty.id || difficultyIndex}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                        >
                          <Input
                            value={difficulty.id}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              handleDifficultyChange(
                                partIndex,
                                difficultyIndex,
                                "id",
                                e.target.value
                              )
                            }
                            placeholder="nb"
                            className="w-16 text-center font-questrial bg-gray-100"
                            title="ID mức độ"
                            disabled={true}
                          />
                          <Input
                            value={difficulty.name}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              handleDifficultyChange(
                                partIndex,
                                difficultyIndex,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="NB"
                            className="w-16 text-center font-questrial bg-gray-100"
                            title="Tên hiển thị"
                            disabled={true}
                          />
                          <Select
                            value={difficulty.label}
                            onValueChange={(value) =>
                              handleDifficultyLevelSelect(
                                partIndex,
                                difficultyIndex,
                                value
                              )
                            }
                          >
                            <SelectTrigger className="flex-1 font-questrial">
                              <SelectValue placeholder="Chọn mức độ khó" />
                            </SelectTrigger>
                            <SelectContent>
                              {PREDEFINED_DIFFICULTY_LEVELS.filter((level) => {
                                // Show current selected level or levels not used by other difficulties in this part
                                const usedLabels = part.difficultyLevels
                                  .filter((_, idx) => idx !== difficultyIndex)
                                  .map((d) => d.label);
                                return (
                                  level.label === difficulty.label ||
                                  !usedLabels.includes(level.label)
                                );
                              }).map((level) => (
                                <SelectItem key={level.id} value={level.label}>
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {part.difficultyLevels.length > 1 && (
                            <Button
                              onClick={() =>
                                removeDifficultyLevel(
                                  partIndex,
                                  difficultyIndex
                                )
                              }
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      )
                    )}
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
                <ConfigurableExamMatrixForm config={config} readonly={true} />
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
                <strong>1. Cấu hình thông tin template:</strong> Nhập tên và mô
                tả cho template ma trận.
              </div>
              <div>
                <strong>2. Thiết lập các phần:</strong> Các phần sẽ được thêm
                theo thứ tự cố định (Trắc nghiệm → Đúng/Sai → Tự luận). Loại
                được tự động xác định, tên, nhãn và số câu tối đa có thể tùy chỉnh.
              </div>
              <div>
                <strong>3. Định nghĩa mức độ khó:</strong> Chọn mức độ khó từ
                danh sách có sẵn (Nhận biết, Thông hiểu, Vận dụng). ID và tên sẽ
                được tự động điền.
              </div>
              <div>
                <strong>4. Xem trước:</strong> Kiểm tra giao diện ma trận sẽ
                hiển thị như thế nào.
              </div>
              <div>
                <strong>5. Lưu template:</strong> Hệ thống sẽ kiểm tra tính hợp
                lệ của ID trước khi lưu.
              </div>
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <strong className="text-yellow-800">Lưu ý:</strong>
                <ul className="mt-1 ml-4 list-disc text-yellow-700">
                  <li>ID không được để trống và không được trùng lặp</li>
                  <li>ID nên sử dụng ký tự không dấu, không khoảng trắng</li>
                  <li>Ví dụ ID hợp lệ: part1, nb, th, vd</li>
                  <li>Số câu tối đa giúp kiểm soát giới hạn câu hỏi cho mỗi phần</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/staff/matrix-templates")}
        >
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
