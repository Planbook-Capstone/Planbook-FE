"use client";

import React, { useState, useMemo } from "react";
import { Portal } from "@/components/ui/Portal";
import {
  useQuestionBankFilterService,
  QuestionBankFilterParams,
  QuestionBankItem,
} from "@/services/questionBankServices";
import { useLessonsService } from "@/services/lessonServices";
import { useExamContext } from "@/contexts/ExamContext";
import { toast } from "sonner";

// Helper function to strip HTML tags for toast display
const stripHtmlTags = (html: string): string => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};
import { QuestionHeader } from "@/components/ui/QuestionHeader";
import { FilterSidebar } from "@/components/ui/FilterSidebar";
import { QuestionContent } from "@/components/ui/QuestionContent";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  convertToMultipleChoiceQuestion,
  convertToYesNoQuestion,
  convertToShortAnswerQuestion,
  getSectionName,
  filterQuestionsBySearch,
} from "@/utils/questionBankUtils";

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuestion?: (question: QuestionBankItem) => void;
  lessonId?: number;
  title?: string;
  // New props for ExamResultEditor integration
  mode?: "exam-context" | "exam-result-editor";
  onAddToExamResult?: (question: QuestionBankItem) => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  isOpen,
  onClose,
  onSelectQuestion,
  lessonId,
  mode = "exam-context",
  onAddToExamResult,
}) => {
  // State management
  const [searchValue, setSearchValue] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(
    new Set()
  );
  const [selectedQuestionsData, setSelectedQuestionsData] = useState<
    QuestionBankItem[]
  >([]);
  const [showSelectedQuestions, setShowSelectedQuestions] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"clear" | "remove" | null>(
    null
  );
  const [questionToRemove, setQuestionToRemove] =
    useState<QuestionBankItem | null>(null);
  const [filterParams, setFilterParams] = useState<QuestionBankFilterParams>({
    page: 0,
    size: 20,
  });

  // Exam context for adding questions
  const {
    addQuestionWithData,
    addYesNoQuestionWithData,
    addShortQuestionWithData,
  } = useExamContext();

  // API calls
  const {
    data: questionBankData,
    isLoading,
    error,
  } = useQuestionBankFilterService(filterParams);

  const { data: lessonsData } = useLessonsService();

  // Log PART_II questions for debugging
  React.useEffect(() => {
    if (questionBankData?.data) {
      const part2Questions = questionBankData.data.filter(
        (q) => q.questionType === "PART_II"
      );
      if (part2Questions.length > 0) {
        console.log(
          "🔍 Found PART_II questions in question bank:",
          part2Questions.map((q) => ({
            id: q.id,
            questionContent: q.questionContent,
            statements: q.questionContent.statements,
            answers: q.questionContent.answers,
          }))
        );
      }
    }
  }, [questionBankData]);
  // Filter handlers
  const handleQuestionTypeChange = (value: string) => {
    if (value === "all") {
      setFilterParams((prev) => ({ ...prev, questionTypes: undefined }));
    } else {
      setFilterParams((prev) => ({ ...prev, questionTypes: [value] }));
    }
  };

  const handleDifficultyChange = (value: string) => {
    if (value === "all") {
      setFilterParams((prev) => ({ ...prev, difficultyLevels: undefined }));
    } else {
      setFilterParams((prev) => ({ ...prev, difficultyLevels: [value] }));
    }
  };

  const handleLessonChange = (value: string) => {
    if (value === "all") {
      setFilterParams((prev) => ({ ...prev, lessonId: undefined }));
    } else {
      setFilterParams((prev) => ({ ...prev, lessonId: parseInt(value) }));
    }
  };

  // Filtered questions based on search
  const filteredQuestions = useMemo(() => {
    if (!questionBankData?.data) return [];
    return filterQuestionsBySearch(questionBankData.data, searchValue);
  }, [questionBankData?.data, searchValue]);

  const clearFilters = () => {
    setFilterParams({
      lessonId: lessonId || undefined,
      page: 0,
      size: 20,
      questionTypes: undefined,
      difficultyLevels: undefined,
    });
    setSearchValue("");
  };

  // Confirmation handlers
  const handleConfirmAction = () => {
    if (confirmAction === "clear") {
      // Clear all selected questions
      setSelectedQuestions(new Set());
      setSelectedQuestionsData([]);
      // Switch back to all questions view after clearing
      setShowSelectedQuestions(false);
      toast.info("Đã xóa tất cả câu hỏi đã chọn");
    } else if (confirmAction === "remove" && questionToRemove) {
      // Remove specific question
      setSelectedQuestions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(questionToRemove.id);
        return newSet;
      });
      setSelectedQuestionsData((prev) =>
        prev.filter((q) => q.id !== questionToRemove.id)
      );
      toast.info("Đã bỏ chọn câu hỏi", {
        description:
          stripHtmlTags(questionToRemove.questionContent.question).substring(
            0,
            50
          ) + "...",
        duration: 2000,
      });
    }

    // Reset confirmation state
    setShowConfirmDialog(false);
    setConfirmAction(null);
    setQuestionToRemove(null);
  };

  const handleCancelConfirm = () => {
    setShowConfirmDialog(false);
    setConfirmAction(null);
    setQuestionToRemove(null);
  };

  // Toggle question selection
  const toggleQuestionSelection = (question: QuestionBankItem) => {
    const isSelected = selectedQuestions.has(question.id);

    if (isSelected) {
      // Show confirmation for removing
      setQuestionToRemove(question);
      setConfirmAction("remove");
      setShowConfirmDialog(true);
    } else {
      // Add to selection (no confirmation needed)
      setSelectedQuestions((prev) => new Set([...prev, question.id]));
      setSelectedQuestionsData((prev) => [...prev, question]);
      toast.info("Đã bỏ chọn câu hỏi", {
        description:
          stripHtmlTags(questionToRemove.questionContent.question).substring(
            0,
            50
          ) + "...",
        duration: 2000,
      });
      toast.success("Đã chọn câu hỏi", {
        description:
          stripHtmlTags(question.questionContent.question).substring(0, 50) +
          "...",
        duration: 2000,
      });
    }
  };

  // Function to convert QuestionBankItem to exam context format and add to appropriate section
  const handleAddQuestionToExam = (question: QuestionBankItem) => {
    const { questionType, questionContent } = question;

    // Check mode and use appropriate handler
    if (mode === "exam-result-editor" && onAddToExamResult) {
      // Use ExamResultEditor handler
      onAddToExamResult(question);
    } else {
      // Use ExamContext handler (default behavior)
      switch (questionType) {
        case "PART_I":
          const mcQuestion = convertToMultipleChoiceQuestion(question);
          addQuestionWithData(mcQuestion);
          break;

        case "PART_II":
          const ynQuestion = convertToYesNoQuestion(question);
          addYesNoQuestionWithData(ynQuestion);
          break;

        case "PART_III":
          const shortQuestion = convertToShortAnswerQuestion(question);
          addShortQuestionWithData(shortQuestion);
          break;
      }
    }

    // Show success feedback
    setSelectedQuestions((prev) => new Set([...prev, question.id]));

    // Show toast notification
    const sectionName = getSectionName(questionType);
    toast.success(`Đã thêm câu hỏi vào ${sectionName}`, {
      description:
        stripHtmlTags(questionContent.question).substring(0, 80) + "...",
      duration: 3000,
    });

    // Call original callback if provided
    if (onSelectQuestion) {
      onSelectQuestion(question);
    }
  };

  // Handler functions for components
  const handleToggleView = () => {
    setShowSelectedQuestions(!showSelectedQuestions);
  };

  const handleClearSelected = () => {
    setConfirmAction("clear");
    setShowConfirmDialog(true);
  };

  const handleAddSelectedToExam = () => {
    selectedQuestionsData.forEach((question) => {
      handleAddQuestionToExam(question);
    });
    // Clear selections after adding
    setSelectedQuestions(new Set());
    setSelectedQuestionsData([]);
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="w-full h-full bg-white flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <QuestionHeader onClose={onClose} />

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar - Filters */}
            <FilterSidebar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              filterParams={filterParams}
              onQuestionTypeChange={handleQuestionTypeChange}
              onDifficultyChange={handleDifficultyChange}
              onLessonChange={handleLessonChange}
              onClearFilters={clearFilters}
              lessonsData={lessonsData}
              lessonId={lessonId}
            />

            {/* Right Content - Questions */}
            <QuestionContent
              isLoading={isLoading}
              error={error}
              questions={filteredQuestions}
              selectedQuestions={selectedQuestions}
              selectedQuestionsData={selectedQuestionsData}
              showSelectedQuestions={showSelectedQuestions}
              onToggleView={handleToggleView}
              onToggleSelection={toggleQuestionSelection}
              onClearSelected={handleClearSelected}
              onAddSelectedToExam={handleAddSelectedToExam}
              lessonId={filterParams.lessonId}
            />
          </div>
        </div>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showConfirmDialog}
          onConfirm={handleConfirmAction}
          onCancel={handleCancelConfirm}
          action={confirmAction}
          selectedCount={selectedQuestions.size}
          questionToRemove={questionToRemove}
        />
      </div>
    </Portal>
  );
};
