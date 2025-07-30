"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import AssetsPanel from "@/components/organisms/assets-panel";
import ExamPreviewModal from "@/components/organisms/exam-preview-modal";
import GradingPanel from "@/components/organisms/grading-panel";
import StepContainer from "@/components/organisms/exam-steps/StepContainer";
import { StepProvider } from "@/contexts/StepContext";

import { useExamContext } from "@/contexts/ExamContext";
import { useExamTemplateContext } from "@/contexts/ExamTemplateContext";
import { Button } from "@/components/ui/Button";
import {
  Save,
  Eye,
  RotateCcw,
  Cloud,
  CloudAlert,
  CloudUpload,
} from "lucide-react";
import {
  useCreateExamTemplateService,
  useUpdateExamTemplateService,
} from "@/services/examTemplateServices";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
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
    basicExamInfo,
    clearExamData,
    hasUnsavedChanges,
    markAsSaved,
  } = useExamContext();
  const { templateMetadata, setTemplateMetadata } = useExamTemplateContext();

  const isCreateMode = pathname === "/exam-templates/create";
  const templateId = isCreateMode ? null : pathname.split("/").pop();
  const router = useRouter();
  // Sync templateMetadata with basicExamInfo changes
  useEffect(() => {
    if (templateMetadata && basicExamInfo.template_name) {
      // Update templateMetadata name when basicExamInfo.template_name changes
      if (templateMetadata.name !== basicExamInfo.template_name) {
        setTemplateMetadata({
          ...templateMetadata,
          name: basicExamInfo.template_name,
        });
      }
    }
  }, [basicExamInfo.template_name, templateMetadata, setTemplateMetadata]);

  const { mutate: createTemplate, isPending: isCreating } =
    useCreateExamTemplateService();

  const { mutate: updateTemplate, isPending: isUpdating } =
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

  const handleOpenPreviewModal = () => {
    setIsPreviewModalOpen(true);
  };

  const handleClosePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  const handleResetData = () => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác."
    );

    if (confirmed) {
      clearExamData();
      setCanvasElements([]);
      toast.success("Đã xóa tất cả dữ liệu thành công!");
    }
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
      console.log(
        "💾 Save Template - Current examQuestions:",
        examQuestions.map((q) => ({
          id: q.id,
          correctAnswer: q.correctAnswer,
          answer: q.answer,
        }))
      );

      const part1Questions = examQuestions.map((q, index) => {
        // Preserve original ID if it exists, otherwise create new UUID
        const questionId =
          typeof q.id === "string" && q.id.includes("-")
            ? q.id // Keep original format like "0-0", "0-1", etc.
            : q.id || uuidv4(); // Use existing ID or create new UUID

        const convertedQuestion = {
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
          answer: ["A", "B", "C", "D"][q.correctAnswer] || "A", // Always use current correctAnswer
          illustrationImage: q.illustrationImage, // Include image data
        };

        console.log(
          `💾 Question ${q.id}: correctAnswer=${q.correctAnswer} → answer=${convertedQuestion.answer}`
        );
        return convertedQuestion;
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
          illustrationImage: q.illustrationImage, // Include image data
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
          illustrationImage: q.illustrationImage, // Include image data
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
    console.log("💾 Creating template with basicExamInfo:", basicExamInfo);
    console.log(
      "💾 Creating template with templateMetadata:",
      templateMetadata
    );

    const templateData = {
      name: basicExamInfo.template_name || templateMetadata.name, // Use template_name from basicExamInfo first
      subject: basicExamInfo.subject, // Use from basicExamInfo instead of templateMetadata
      grade: basicExamInfo.grade, // Use from basicExamInfo instead of templateMetadata
      durationMinutes: basicExamInfo.duration_minutes, // Use from basicExamInfo instead of templateMetadata
      school: basicExamInfo.school, // Add school info
      examCode: basicExamInfo.exam_code, // Add exam code
      atomicMasses: basicExamInfo.atomic_masses, // Add atomic masses
      totalScore: calculatedTotalScore, // Tính tự động dựa trên số câu hỏi
      scoringConfig: scoringConfig, // Thêm cấu hình chấm điểm
      contentJson: {
        parts,
      },
    };

    console.log("💾 Final templateData being sent to API:", templateData);

    // Call appropriate API based on mode
    if (!isCreateMode && templateId) {
      // Update existing template

      updateTemplate(
        { id: templateId, data: templateData },
        {
          onSuccess: () => {
            toast.success("Đề thi đã được cập nhật thành công!");
            markAsSaved();
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
        onSuccess: () => {
          toast.success("Đề thi đã được tạo thành công!");
          markAsSaved();
          router.push("/exam-templates");
        },
        onError: () => {
          toast.error("Tạo đề thilate thất bại. Vui lòng thử lại!");
        },
      });
    }
  };

  return (
    <StepProvider>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex h-screen flex-col">
          {/* Header with template info and actions */}
          <div className="bg-white border-b border-gray-200 p-3 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <div onClick={() => router.back()} className="cursor-pointer">
                  Quay lại |
                </div>
                <h2 className="font-calsans text-base">
                  {templateMetadata?.name || "Template mới"}
                </h2>
                {hasUnsavedChanges && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-neutral-800">
                    <CloudAlert />
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 font-questrial">
                {templateMetadata
                  ? `${templateMetadata.subject} - Lớp ${templateMetadata.grade} - ${templateMetadata.durationMinutes} phút`
                  : "Chưa có thông tin template"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetData}
                className="text-neutral-800 font-questrial hover:text-red-700 hover:bg-red-50 py-5 rounded-full"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenPreviewModal}
                className="py-5 rounded-full font-questrial"
              >
                <Eye className="h-4 w-4 mr-1" />
                Xem trước
              </Button>
              <Button
                size="sm"
                onClick={handleSaveTemplate}
                disabled={isSaving}
                className="py-5 rounded-full font-questrial bg-[linear-gradient(227deg,_#20DCDF_30%,_#25BEE5_50%,_#2C99EE_70%,_#368BEB_80%,_#3860D2_90%)]"
              >
                <CloudUpload className="h-4 w-4 mr-1" />
                {isSaving
                  ? !isCreateMode
                    ? "Đang cập nhật..."
                    : "Đang tạo..."
                  : !isCreateMode
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

            {/* Step Container - Center */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
              <StepContainer className="h-full flex flex-col p-2 sm:p-4" />
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
    </StepProvider>
  );
}
