"use client";

import { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KeywordManager } from "@/components/organisms/keyword-manager";
import { LessonPlanStep, LessonPlanKeyword } from "@/types";
import {
  GripVertical,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
  Clock,
  AlertCircle,
} from "lucide-react";

interface StepSectionProps {
  step: LessonPlanStep;
  dragHandleProps?: any;
  onUpdate: (updates: Partial<LessonPlanStep>) => void;
  onDelete: () => void;
  mode?: "admin" | "staff"; // admin: chỉ xem, staff: chỉnh sửa tất cả
}

export function StepSection({
  step,
  dragHandleProps,
  onUpdate,
  onDelete,
  mode = "admin", // default to admin mode
}: StepSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateField = useCallback(
    (field: keyof LessonPlanStep, value: any) => {
      onUpdate({ [field]: value });
    },
    [onUpdate]
  );

  const addKeyword = useCallback(() => {
    const newKeyword: LessonPlanKeyword = {
      id: uuidv4(),
      title: "",
      content: "",
      order: step.keywords.length,
      nodeType: "LIST_ITEM", // Set default nodeType to enable adding children
    };

    updateField("keywords", [...step.keywords, newKeyword]);
  }, [step.keywords, updateField]);

  const updateKeyword = useCallback(
    (keywordId: string, updates: Partial<LessonPlanKeyword>) => {
      const updatedKeywords = step.keywords.map((keyword) =>
        keyword.id === keywordId ? { ...keyword, ...updates } : keyword
      );
      updateField("keywords", updatedKeywords);
    },
    [step.keywords, updateField]
  );

  const deleteKeyword = useCallback(
    (keywordId: string) => {
      const updatedKeywords = step.keywords.filter(
        (keyword) => keyword.id !== keywordId
      );
      updateField("keywords", updatedKeywords);
    },
    [step.keywords, updateField]
  );

  const onKeywordDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) return;

      const newKeywords = Array.from(step.keywords);
      const [reorderedKeyword] = newKeywords.splice(result.source.index, 1);
      newKeywords.splice(result.destination.index, 0, reorderedKeyword);

      // Update order property
      const updatedKeywords = newKeywords.map((keyword, index) => ({
        ...keyword,
        order: index,
      }));

      updateField("keywords", updatedKeywords);
    },
    [step.keywords, updateField]
  );

  return (
    <div className="border rounded-lg bg-white">
      {/* Header */}
      <div className="p-4 rounded-t-lg relative">
        <div className="flex items-center gap-3 sticky top-0">
          {/* Expand/Collapse */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-full"
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </Button>

          {/* Step Info */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField label="Tiêu đề bước" htmlFor={`step-title-${step.id}`}>
              <Input
                id={`step-title-${step.id}`}
                placeholder="Nhập tiêu đề bước"
                value={step.title}
                onChange={(e) => updateField("title", e.target.value)}
                disabled={mode === "admin"} // Admin không thể chỉnh sửa tiêu đề
              />
            </FormField>

            <div className="flex items-center gap-2">
              <Checkbox
                id={`required-${step.id}`}
                checked={step.isRequired}
                onCheckedChange={(checked) =>
                  updateField("isRequired", checked)
                }
                disabled={mode === "admin"} // Admin không thể chỉnh sửa required
              />
              <label htmlFor={`required-${step.id}`} className="text-sm">
                Bắt buộc
              </label>
              {step.isRequired && (
                <AlertCircle className="w-4 h-4 text-orange-500" />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {mode === "staff" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                Nâng cao
              </Button>
            )}
            {mode === "staff" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-white hover:text-gray-700 bg-neutral-800"
              >
                Xoá bước
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Options - Only for Staff */}
        {mode === "staff" && showAdvanced && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField label="Mô tả" htmlFor={`step-desc-${step.id}`}>
              <Input
                id={`step-desc-${step.id}`}
                placeholder="Mô tả chi tiết về bước này"
                value={step.description || ""}
                onChange={(e: any) =>
                  updateField("description", e.target.value)
                }
              />
            </FormField>

            <FormField
              label="Thời gian (phút)"
              htmlFor={`step-time-${step.id}`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <Input
                  id={`step-time-${step.id}`}
                  type="number"
                  placeholder="0"
                  value={step.timeAllocation || ""}
                  onChange={(e: any) =>
                    updateField(
                      "timeAllocation",
                      parseInt(e.target.value) || undefined
                    )
                  }
                />
              </div>
            </FormField>
          </div>
        )}
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4">
          {/* Keywords */}
          <KeywordManager
            keywords={step.keywords}
            onUpdate={updateKeyword}
            onDelete={deleteKeyword}
            onDragEnd={onKeywordDragEnd}
            mode={mode}
          />

          {/* Action Buttons - Only for Staff */}
          {mode === "staff" && (
            <div className="flex gap-2 w-full">
              <Button
                size="sm"
                onClick={addKeyword}
                className="w-full h-10 bg-neutral-50 border-neutral-400 border border-dashed text-neutral-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm từ khóa
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
