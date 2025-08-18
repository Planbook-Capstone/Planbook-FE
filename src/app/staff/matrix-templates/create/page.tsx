"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/FormField";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save, Eye } from "lucide-react";
import { toast } from "sonner";

// Types for matrix template configuration
interface DifficultyLevel {
  id: string;
  name: string;
  label: string;
  color: string;
}

interface MatrixPart {
  id: string;
  name: string;
  label: string;
  color: string;
  difficultyLevels: DifficultyLevel[];
}

interface MatrixTemplateConfig {
  id?: string;
  name: string;
  description: string;
  parts: MatrixPart[];
}

function CreateMatrixTemplatePage() {
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
      id: `part${config.parts.length + 1}`,
      name: `Phần ${config.parts.length + 1}`,
      label: "",
      color: "bg-gray-50",
      difficultyLevels: [
        { id: "nb", name: "NB", label: "Nhận biết", color: "text-gray-700" },
        { id: "th", name: "TH", label: "Thông hiểu", color: "text-gray-700" },
        { id: "vd", name: "VD", label: "Vận dụng", color: "text-gray-700" },
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
      id: `level${config.parts[partIndex].difficultyLevels.length + 1}`,
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
    if (!config.name.trim()) {
      toast.error("Vui lòng nhập tên template");
      return;
    }

    if (config.parts.some(part => !part.name.trim())) {
      toast.error("Vui lòng nhập tên cho tất cả các phần");
      return;
    }

    // TODO: Call API to save template
    console.log("Saving matrix template config:", config);
    toast.success("Mẫu ma trận đã được lưu thành công!");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-calsans mb-2">Tạo Template Ma Trận Đề Thi</h1>
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
              <CardTitle className="font-calsans">Thông tin Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Tên Template" htmlFor="template-name">
                <Input
                  id="template-name"
                  value={config.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTemplateInfoChange("name", e.target.value)}
                  placeholder="Nhập tên template"
                  className="font-questrial"
                />
              </FormField>

              <FormField label="Mô tả" htmlFor="template-description">
                <Textarea
                  id="template-description"
                  value={config.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleTemplateInfoChange("description", e.target.value)}
                  placeholder="Mô tả về template này"
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

                  <div className="grid grid-cols-2 gap-4">
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
                    <select
                      id={`part-color-${partIndex}`}
                      value={part.color}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handlePartChange(partIndex, "color", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-questrial"
                    >
                      <option value="bg-amber-50">Vàng nhạt</option>
                      <option value="bg-green-50">Xanh lá nhạt</option>
                      <option value="bg-sky-50">Xanh dương nhạt</option>
                      <option value="bg-purple-50">Tím nhạt</option>
                      <option value="bg-pink-50">Hồng nhạt</option>
                      <option value="bg-gray-50">Xám nhạt</option>
                    </select>
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

                    {part.difficultyLevels.map((difficulty, difficultyIndex) => (
                      <div key={difficulty.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Input
                          value={difficulty.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleDifficultyChange(partIndex, difficultyIndex, "name", e.target.value)
                          }
                          placeholder="NB"
                          className="w-16 text-center font-questrial"
                        />
                        <Input
                          value={difficulty.label}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleDifficultyChange(partIndex, difficultyIndex, "label", e.target.value)
                          }
                          placeholder="Nhận biết"
                          className="flex-1 font-questrial"
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
                <div className="overflow-x-auto">
                  <table className="w-full text-center rounded-md border mb-4">
                    <thead className="font-calsans text-base">
                      <tr>
                        {config.parts.map((part, index) => (
                          <th
                            key={part.id}
                            className={`border px-2 py-4 align-middle ${part.color}`}
                            colSpan={part.difficultyLevels.length}
                          >
                            <span className="font-normal">
                              {part.name}
                              {part.label && (
                                <div className="text-xs text-gray-600 mt-1">
                                  ({part.label})
                                </div>
                              )}
                            </span>
                          </th>
                        ))}
                        <th className="border px-2 py-4 align-middle" rowSpan={2}>
                          <span className="font-normal">Tổng</span>
                        </th>
                      </tr>
                      <tr>
                        {config.parts.map((part) =>
                          part.difficultyLevels.map((difficulty) => (
                            <th key={`${part.id}-${difficulty.id}`} className="border px-2 py-2">
                              <span className="font-normal" title={difficulty.label}>
                                {difficulty.name}
                              </span>
                            </th>
                          ))
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Sample row */}
                      <tr className="font-questrial">
                        {config.parts.map((part) =>
                          part.difficultyLevels.map((difficulty) => (
                            <td key={`${part.id}-${difficulty.id}-sample`} className="border px-2 py-1">
                              <input
                                type="number"
                                min="0"
                                defaultValue={0}
                                className="w-full px-2 py-2 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                                disabled
                              />
                            </td>
                          ))
                        )}
                        <td className="border px-2 py-1">
                          <div className="px-2 py-2 text-center font-semibold text-blue-600 bg-gray-50 rounded">
                            0
                          </div>
                        </td>
                      </tr>

                      {/* Total row */}
                      <tr className="bg-gray-50">
                        {config.parts.map((part) => (
                          <td
                            key={`${part.id}-total`}
                            className="border px-2 py-3 text-center"
                            colSpan={part.difficultyLevels.length}
                          >
                            <span className={`font-calsans ${part.color.replace('bg-', 'text-').replace('-50', '-700')}`}>
                              0
                            </span>
                          </td>
                        ))}
                        <td className="border px-2 py-3 text-center">
                          <span className="font-bold font-questrial text-blue-700">
                            0
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Template JSON Preview */}
                <div className="mt-4">
                  <h4 className="font-medium font-calsans mb-2">Cấu hình JSON:</h4>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto font-mono">
                    {JSON.stringify(config, null, 2)}
                  </pre>
                </div>
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
                <strong>2. Thiết lập các phần:</strong> Mỗi phần đại diện cho một loại câu hỏi (trắc nghiệm, đúng/sai, tự luận).
              </div>
              <div>
                <strong>3. Định nghĩa mức độ khó:</strong> Mỗi phần có thể có nhiều mức độ khó khác nhau (NB, TH, VD).
              </div>
              <div>
                <strong>4. Xem trước:</strong> Kiểm tra giao diện ma trận sẽ hiển thị như thế nào.
              </div>
              <div>
                <strong>5. Lưu template:</strong> Template sẽ được sử dụng khi tạo đề thi mới.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end gap-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          Hủy
        </Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Lưu Template
        </Button>
      </div>
    </div>
  );
}

export default CreateMatrixTemplatePage;
