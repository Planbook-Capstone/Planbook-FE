"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import AssetsPanel from "@/components/organisms/assets-panel";
import CanvasArea from "@/components/organisms/canvas-area";
import ExamPreviewModal from "@/components/organisms/exam-preview-modal";
import GradingPanel from "@/components/organisms/grading-panel";

import { useExamContext } from "@/contexts/ExamContext";
import { useExamTemplateContext } from "@/contexts/ExamTemplateContext";
import { Button } from "@/components/ui/Button";
import { Save, Eye } from "lucide-react";
import {
  useCreateExamTemplateService,
  useUpdateExamTemplateService,
} from "@/services/examTemplateServices";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export interface CanvasElement {
  id: string;
  type: "image" | "text" | "shape";
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style?: Record<string, any>;
}

export function TemplateCanvaLayoutContent() {
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const pathname = usePathname();

  const {
    updateQuestionImage,
    updateYesNoQuestionImage,
    updateShortQuestionImage,
    examQuestions,
    examYesNoQuestions,
    examShortQuestions,
  } = useExamContext();
  const { templateMetadata } = useExamTemplateContext();

  const isEditMode = pathname.includes("/exam-templates/");
  const templateId = isEditMode ? pathname.split("/").pop() : null;

  const { mutate: createTemplate, isLoading: isCreating } =
    useCreateExamTemplateService();

  const { mutate: updateTemplate, isLoading: isUpdating } =
    useUpdateExamTemplateService();

  const isSaving = isCreating || isUpdating;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.data.current) {
      const assetData = active.data.current;

      // Handle image drops on questions
      if (assetData.type === "image" && over.data.current) {
        const targetData = over.data.current;

        if (targetData.type === "question") {
          const questionId = targetData.id;
          const questionType = targetData.questionType;

          // Call the appropriate image drop handler
          handleImageDrop(
            questionId,
            active.data.current.content,
            questionType
          );
        }
      }
    }

    setActiveId(null);
  };

  const handleImageDrop = (
    questionId: string,
    imageSrc: string,
    questionType: string
  ) => {
    // Update the appropriate question type with the image
    if (questionType === "multiple-choice") {
      updateQuestionImage(questionId, imageSrc);
    } else if (questionType === "yes-no") {
      updateYesNoQuestionImage(questionId, imageSrc);
    } else if (questionType === "short-answer") {
      updateShortQuestionImage(questionId, imageSrc);
    }
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setCanvasElements((elements) =>
      elements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const deleteElement = (id: string) => {
    setCanvasElements((elements) => elements.filter((el) => el.id !== id));
  };

  const handleOpenPreviewModal = () => {
    setIsPreviewModalOpen(true);
  };

  const handleClosePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  const handleSaveTemplate = () => {
    if (!templateMetadata) {
      toast.error("Thông tin template chưa được thiết lập!");
      return;
    }

    // Get scoring config first
    const scoringConfig = templateMetadata?.scoringConfig;

    // Convert questions to template format
    const parts: any[] = [];

    // Process multiple choice questions
    if (examQuestions.length > 0) {
      const part1Questions = examQuestions.map((q, index) => {
        // Preserve original ID if it exists, otherwise create new UUID
        const questionId =
          typeof q.id === "string" && q.id.includes("-")
            ? q.id // Keep original format like "0-0", "0-1", etc.
            : q.id || uuidv4(); // Use existing ID or create new UUID

        return {
          id: questionId,
          questionNumber: index + 1, // Reset về 1 cho mỗi phần: 1, 2, 3...
          question: q.question,
          options: Array.isArray(q.options)
            ? {
                A: q.options[0] || "",
                B: q.options[1] || "",
                C: q.options[2] || "",
                D: q.options[3] || "",
              }
            : q.options || { A: "", B: "", C: "", D: "" },
          answer: q.answer || ["A", "B", "C", "D"][q.correctAnswer] || "A",
        };
      });

      parts.push({
        part: "PHẦN I",
        title: "Câu trắc nghiệm nhiều phương án lựa chọn",
        questions: part1Questions,
      });
    }

    // Process yes/no questions if needed
    if (examYesNoQuestions.length > 0) {
      const part2Questions = examYesNoQuestions.map((q, index) => {
        // Preserve original ID if it exists, otherwise create new UUID
        const questionId =
          typeof q.id === "string" && q.id.includes("-")
            ? q.id // Keep original format like "1-0", "1-1", etc.
            : q.id || uuidv4(); // Use existing ID or create new UUID

        return {
          id: questionId,
          questionNumber: index + 1, // Reset về 1 cho phần này: 1, 2, 3...
          question: q.question,
          // Lưu statements với các luận điểm con
          statements: {
            a: { text: q.statements.a.text, answer: q.statements.a.answer },
            b: { text: q.statements.b.text, answer: q.statements.b.answer },
            c: { text: q.statements.c.text, answer: q.statements.c.answer },
            d: { text: q.statements.d.text, answer: q.statements.d.answer },
          },
        };
      });

      parts.push({
        part: "PHẦN II",
        title: "Câu hỏi Đúng/Sai",
        questions: part2Questions,
      });
    }

    // Process short answer questions if needed
    if (examShortQuestions.length > 0) {
      const part3Questions = examShortQuestions.map((q, index) => {
        // Preserve original ID if it exists, otherwise create new UUID
        const questionId =
          typeof q.id === "string" && q.id.includes("-")
            ? q.id // Keep original format like "2-0", "2-1", etc.
            : q.id || uuidv4(); // Use existing ID or create new UUID

        return {
          id: questionId,
          questionNumber: index + 1, // Reset về 1 cho phần này: 1, 2, 3...
          question: q.question || q.text || "", // Support both question and text fields
          answer: q.answer || "", // Chỉ có question và answer, không có options
        };
      });

      parts.push({
        part: "PHẦN III",
        title: "Câu hỏi tự luận",
        questions: part3Questions,
      });
    }

    // Calculate total score based on scoring config
    let calculatedTotalScore: number;

    if (scoringConfig && !scoringConfig.useStandardScoring) {
      // Tùy chỉnh
      const part1Score = examQuestions.length * scoringConfig.part1Score;
      const part2Score =
        examYesNoQuestions.length *
        (scoringConfig.part2ScoringType === "standard"
          ? 1.0
          : scoringConfig.part2ScoringType === "auto"
          ? scoringConfig.part2CustomScore
          : scoringConfig.part2ManualScores[4]);
      const part3Score = examShortQuestions.length * scoringConfig.part3Score;
      calculatedTotalScore = part1Score + part2Score + part3Score;
    } else {
      // Chuẩn: Phần 1 = 0.25, Phần 2 = 1.0, Phần 3 = 0.25
      calculatedTotalScore =
        examQuestions.length * 0.25 +
        examYesNoQuestions.length * 1.0 +
        examShortQuestions.length * 0.25;
    }

    // Create template data
    const templateData = {
      name: templateMetadata.name,
      subject: templateMetadata.subject,
      grade: templateMetadata.grade,
      durationMinutes: templateMetadata.durationMinutes,
      totalScore: calculatedTotalScore, // Tính tự động dựa trên số câu hỏi
      scoringConfig: scoringConfig, // Thêm cấu hình chấm điểm
      contentJson: {
        parts,
      },
    };

    // Call appropriate API based on mode
    if (isEditMode && templateId) {
      // Update existing template

      updateTemplate(
        { id: templateId, data: templateData },
        {
          onSuccess: (response) => {
            toast.success("Template đã được cập nhật thành công!");
          },
          onError: (error) => {
            toast.error(
              `Cập nhật template thất bại: ${
                error.response?.data?.message || error.message
              }`
            );
          },
        }
      );
    } else {
      // Create new template
      createTemplate(templateData, {
        onSuccess: (response) => {
          toast.success("Template đã được tạo thành công!");
        },
        onError: (error) => {
          toast.error("Tạo template thất bại. Vui lòng thử lại!");
        },
      });
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen flex-col">
        {/* Header with template info and actions */}
        <div className="bg-white border-b border-gray-200 p-3 flex justify-between items-center">
          <div>
            <h2 className="font-semibold">
              {templateMetadata?.name || "Template mới"}
            </h2>
            <p className="text-sm text-gray-500">
              {templateMetadata
                ? `${templateMetadata.subject} - Lớp ${templateMetadata.grade} - ${templateMetadata.durationMinutes} phút`
                : "Chưa có thông tin template"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenPreviewModal}
            >
              <Eye className="h-4 w-4 mr-1" />
              Xem trước
            </Button>
            <Button size="sm" onClick={handleSaveTemplate} disabled={isSaving}>
              <Save className="h-4 w-4 mr-1" />
              {isSaving
                ? isEditMode
                  ? "Đang cập nhật..."
                  : "Đang tạo..."
                : isEditMode
                ? "Cập nhật template"
                : "Tạo template"}
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Assets Panel - Left */}
          <div className="bg-white border-r border-gray-200 flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
            <AssetsPanel />
          </div>

          {/* Canvas Area - Center */}
          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
            <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
              <CanvasArea
                elements={canvasElements}
                onUpdateElement={updateElement}
                onDeleteElement={deleteElement}
              />
            </div>
          </div>

          {/* Grading Panel - Right */}
          <GradingPanel />
        </div>

        {/* Preview Modal */}
        <ExamPreviewModal
          isOpen={isPreviewModalOpen}
          onClose={handleClosePreviewModal}
          elements={canvasElements}
        />
      </div>
    </DndContext>
  );
}
