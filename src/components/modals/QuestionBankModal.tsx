"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Search,
  X,
  Plus,
  Filter,
  CheckCircle,
  BookOpen,
  Target,
} from "lucide-react";
import { Portal } from "@/components/ui/Portal";
import {
  useQuestionBankFilterService,
  QuestionBankFilterParams,
  QuestionBankItem,
} from "@/services/questionBankServices";
import { useExamContext } from "@/contexts/ExamContext";
import { toast } from "sonner";
// import Loading from "../ui/loading";

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuestion?: (question: QuestionBankItem) => void;
  lessonId?: number;
  title?: string;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  isOpen,
  onClose,
  onSelectQuestion,
  lessonId,
  title = "Ngân hàng đề",
}) => {
  // State management
  const [searchValue, setSearchValue] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(
    new Set()
  );
  const [showFilters, setShowFilters] = useState(false);
  const [filterParams, setFilterParams] = useState<QuestionBankFilterParams>({
    lessonId: lessonId || 2, // Default to lesson 2 if not provided
    page: 0,
    size: 20,
  });

  // Exam context for adding questions
  const {
    addQuestionWithData,
    addYesNoQuestionWithData,
    addShortQuestionWithData,
  } = useExamContext();

  // API call
  const {
    data: questionBankData,
    isLoading,
    error,
  } = useQuestionBankFilterService(filterParams);

  // Debug logging
  console.log("Filter params:", filterParams);
  console.log("Question bank data:", questionBankData);
  console.log("Is loading:", isLoading);
  console.log("Error:", error);

  // Filter options
  const questionTypeOptions = [
    { value: "PART_I", label: "Phần I - Trắc nghiệm nhiều phương án" },
    { value: "PART_II", label: "Phần II - Trắc nghiệm đúng sai" },
    { value: "PART_III", label: "Phần III - Câu trả lời ngắn" },
  ];

  const difficultyLevelOptions = [
    { value: "KNOWLEDGE", label: "Biết" },
    { value: "COMPREHENSION", label: "Hiểu" },
    { value: "APPLICATION", label: "Vận dụng" },
    { value: "ANALYSIS", label: "Vận dụng cao" },
  ];

  // Filtered questions based on search
  const filteredQuestions = useMemo(() => {
    if (!questionBankData?.data) return [];

    return questionBankData.data.filter(
      (question: QuestionBankItem) =>
        question.questionContent.question
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        question.explanation.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [questionBankData?.data, searchValue]);

  // Group questions by type
  const groupedQuestions = useMemo(() => {
    const groups = {
      PART_I: [] as QuestionBankItem[],
      PART_II: [] as QuestionBankItem[],
      PART_III: [] as QuestionBankItem[],
    };

    filteredQuestions.forEach((question: QuestionBankItem) => {
      if (groups[question.questionType as keyof typeof groups]) {
        groups[question.questionType as keyof typeof groups].push(question);
      }
    });

    return groups;
  }, [filteredQuestions]);

  // Handle filter changes
  const handleQuestionTypeChange = (questionType: string, checked: boolean) => {
    setFilterParams((prev) => {
      const currentTypes = prev.questionTypes || [];
      const newTypes = checked
        ? [...currentTypes, questionType]
        : currentTypes.filter((type) => type !== questionType);

      return {
        ...prev,
        questionTypes: newTypes.length > 0 ? newTypes : undefined,
      };
    });
  };

  const handleDifficultyLevelChange = (
    difficultyLevel: string,
    checked: boolean
  ) => {
    setFilterParams((prev) => {
      const currentLevels = prev.difficultyLevels || [];
      const newLevels = checked
        ? [...currentLevels, difficultyLevel]
        : currentLevels.filter((level) => level !== difficultyLevel);

      return {
        ...prev,
        difficultyLevels: newLevels.length > 0 ? newLevels : undefined,
      };
    });
  };

  const handleLessonIdChange = (lessonId: string) => {
    setFilterParams((prev) => ({
      ...prev,
      lessonId: lessonId ? parseInt(lessonId) : undefined,
    }));
  };

  const clearFilters = () => {
    setFilterParams({
      lessonId: lessonId,
      page: 0,
      size: 20,
    });
    setSearchValue("");
  };

  // Toggle question selection
  const toggleQuestionSelection = (questionId: number) => {
    setSelectedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // Function to convert QuestionBankItem to exam context format and add to appropriate section
  const handleAddQuestionToExam = (question: QuestionBankItem) => {
    const { questionType, questionContent } = question;

    console.log("Adding question to exam:", {
      questionType,
      questionContent,
      imageField: questionContent.image,
      fullQuestion: question,
    });

    switch (questionType) {
      case "PART_I":
        // Convert options from Record<string, string> to string array
        const optionsArray = questionContent.options
          ? [
              questionContent.options.A || "",
              questionContent.options.B || "",
              questionContent.options.C || "",
              questionContent.options.D || "",
            ]
          : ["", "", "", ""];

        const mcQuestion = {
          id: `qb_${question.id}_${Date.now()}`,
          question: questionContent.question,
          options: optionsArray,
          correctAnswer: questionContent.answer
            ? ["A", "B", "C", "D"].indexOf(questionContent.answer)
            : 0,
          type: "single" as const,
          illustrationImage: questionContent.image,
        };

        console.log("Adding PART_I question:", mcQuestion);
        addQuestionWithData(mcQuestion);
        break;

      case "PART_II":
        // Map statements and answers correctly
        // questionContent.statements is Record<string, string>
        // questionContent.answers is Record<string, boolean>
        const statements = {
          a: {
            text: (questionContent.statements as any)?.a || "",
            answer: (questionContent.answers as any)?.a || false,
          },
          b: {
            text: (questionContent.statements as any)?.b || "",
            answer: (questionContent.answers as any)?.b || false,
          },
          c: {
            text: (questionContent.statements as any)?.c || "",
            answer: (questionContent.answers as any)?.c || false,
          },
          d: {
            text: (questionContent.statements as any)?.d || "",
            answer: (questionContent.answers as any)?.d || false,
          },
        };

        const ynQuestion = {
          id: `qb_${question.id}_${Date.now()}`,
          question: questionContent.question,
          statements: statements,
          type: "yes-no" as const,
          illustrationImage: questionContent.image,
        };

        console.log("Adding PART_II question:", ynQuestion);
        addYesNoQuestionWithData(ynQuestion);
        break;

      case "PART_III":
        const shortQuestion = {
          id: `qb_${question.id}_${Date.now()}`,
          question: questionContent.question,
          answer: questionContent.answer || "",
          type: "short" as const,
          illustrationImage: questionContent.image,
        };

        console.log("Adding PART_III question:", shortQuestion);
        addShortQuestionWithData(shortQuestion);
        break;
    }

    // Show success feedback
    setSelectedQuestions((prev) => new Set([...prev, question.id]));

    // Show toast notification
    const sectionName =
      questionType === "PART_I"
        ? "Phần I - Trắc nghiệm"
        : questionType === "PART_II"
        ? "Phần II - Đúng/Sai"
        : "Phần III - Tự luận";

    toast.success(`Đã thêm câu hỏi vào ${sectionName}`, {
      description: questionContent.question.substring(0, 80) + "...",
      duration: 3000,
    });

    // Call original callback if provided
    if (onSelectQuestion) {
      onSelectQuestion(question);
    }
  };

  const renderQuestionContent = (question: QuestionBankItem) => {
    const { questionContent, questionType } = question;

    return (
      <div className="space-y-2">
        {/* Question Text */}
        <div className="text-lg text-gray-800 leading-relaxed font-semibold">
          {questionContent.question}
        </div>

        {/* Question Image */}
        {questionContent.image && (
          <div className="flex justify-center">
            <img
              src={questionContent.image}
              alt="Hình minh họa câu hỏi"
              className="max-w-full h-auto max-h-32 rounded border border-gray-200"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Options for PART_I */}
        {questionType === "PART_I" && questionContent.options && (
          <div className="grid grid-cols-1 gap-1.5">
            {Object.entries(questionContent.options).map(([key, value]) => (
              <div
                key={key}
                className={`flex items-start gap-2 p-2 rounded border ${
                  questionContent.answer === key
                    ? "bg-blue-50 border-blue-300"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                    questionContent.answer === key
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {key.toUpperCase()}
                </span>
                <span className="text-sm text-gray-700 flex-1">{value}</span>
                {questionContent.answer === key && (
                  <CheckCircle className="w-3 h-3 text-blue-500" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Statements for PART_II */}
        {questionType === "PART_II" && questionContent.statements && (
          <div className="grid grid-cols-1 gap-1.5">
            {Object.entries(questionContent.statements).map(([key, value]) => {
              const isCorrect = questionContent.answers?.[key];
              return (
                <div
                  key={key}
                  className={`flex items-start gap-2 p-2 rounded border ${
                    isCorrect
                      ? "bg-blue-50 border-blue-300"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                      isCorrect
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {key.toUpperCase()}
                  </span>
                  <div className="flex-1">
                    <span className="text-sm text-gray-700 block">{value}</span>
                    <span
                      className={`mt-0.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                        isCorrect
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isCorrect ? "✓ Đúng" : "✗ Sai"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Answer for PART_III */}
        {questionType === "PART_III" && questionContent.answer && (
          <div className="p-2 bg-blue-50 rounded border border-blue-200">
            <div className="text-sm">
              <span className="font-medium text-blue-800">Đáp án: </span>
              <span className="text-blue-700">{questionContent.answer}</span>
            </div>
          </div>
        )}

        {/* Keywords for PART_III */}
        {questionType === "PART_III" &&
          questionContent.keywords &&
          questionContent.keywords.length > 0 && (
            <div>
              <span className="text-xs font-medium text-gray-600 block mb-2">
                Từ khóa:
              </span>
              <div className="flex flex-wrap gap-1">
                {questionContent.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-7xl h-full max-h-[95vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {title}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Chọn câu hỏi từ ngân hàng đề để thêm vào bài thi
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Stats Bar */}
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{questionBankData?.data?.length || 0} câu hỏi</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>{selectedQuestions.size} đã chọn</span>
              </div>
              {filterParams.lessonId && (
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Bài học #{filterParams.lessonId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="p-4 space-y-3">
              {/* Search and Quick Filters in one row */}
              <div className="flex gap-3 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm câu hỏi..."
                    value={searchValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchValue(e.target.value)
                    }
                    className="pl-10 pr-4 h-10 text-sm border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`h-10 px-4 text-sm rounded-lg flex items-center gap-2 font-medium transition-colors ${
                    showFilters
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  {showFilters ? "Ẩn bộ lọc" : "Bộ lọc"}
                </button>
                {(filterParams.questionTypes?.length ||
                  filterParams.difficultyLevels?.length) && (
                  <button
                    onClick={clearFilters}
                    className="h-10 px-3 text-sm rounded-lg bg-white border border-red-300 text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    Xóa
                  </button>
                )}
              </div>

              {/* Filter Controls - Collapsible */}
              {showFilters && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Lesson ID */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        ID Bài học
                      </label>
                      <Input
                        type="number"
                        placeholder="Nhập ID"
                        value={filterParams.lessonId || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleLessonIdChange(e.target.value)
                        }
                        className="w-full h-9 text-sm border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg"
                      />
                    </div>

                    {/* Question Types */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Loại câu hỏi
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {questionTypeOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() =>
                              handleQuestionTypeChange(
                                option.value,
                                !filterParams.questionTypes?.includes(
                                  option.value
                                )
                              )
                            }
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                              filterParams.questionTypes?.includes(option.value)
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {option.label.split(" - ")[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Difficulty Levels */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Mức độ khó
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {difficultyLevelOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() =>
                              handleDifficultyLevelChange(
                                option.value,
                                !filterParams.difficultyLevels?.includes(
                                  option.value
                                )
                              )
                            }
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                              filterParams.difficultyLevels?.includes(
                                option.value
                              )
                                ? "bg-green-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-white">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-64">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 text-sm">
                  Đang tải câu hỏi...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-red-600 mb-2">
                  Có lỗi xảy ra
                </h3>
                <p className="text-red-500 text-sm max-w-md mx-auto">
                  {error.message}
                </p>
              </div>
            ) : !questionBankData?.data ||
              questionBankData.data.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Chưa có dữ liệu
                </h3>
                <p className="text-gray-500 text-sm">
                  {filterParams.lessonId
                    ? `Không tìm thấy câu hỏi nào cho Bài học #${filterParams.lessonId}`
                    : "Vui lòng nhập ID bài học để tìm kiếm câu hỏi"}
                </p>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Không tìm thấy kết quả
                </h3>
                <p className="text-gray-500 text-sm">
                  Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-6">
                {/* Phần I - Trắc nghiệm nhiều phương án */}
                {groupedQuestions.PART_I.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Phần I - Trắc nghiệm nhiều phương án
                      </h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {groupedQuestions.PART_I.length} câu hỏi
                      </span>
                    </div>
                    {groupedQuestions.PART_I.map(
                      (question: QuestionBankItem) => {
                        const isSelected = selectedQuestions.has(question.id);
                        return (
                          <div
                            key={question.id}
                            className={`bg-white rounded-lg border-2 transition-all ${
                              isSelected
                                ? "border-blue-500 shadow-md"
                                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                            }`}
                          >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                              <div className="flex items-center gap-3">
                                <div className="flex gap-2">
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded font-mono">
                                    #{question.id}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddQuestionToExam(question);
                                }}
                                disabled={isSelected}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                  isSelected
                                    ? "bg-green-500 text-white cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md"
                                }`}
                              >
                                {isSelected ? (
                                  <>
                                    <CheckCircle className="w-4 h-4" />
                                    Đã thêm
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-4 h-4" />
                                    Thêm vào đề
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                              {renderQuestionContent(question)}

                              {/* Explanation */}
                              {question.explanation && (
                                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                  <div className="flex items-start gap-2">
                                    <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-white text-xs font-bold">
                                        !
                                      </span>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-amber-800 mb-1">
                                        Giải thích
                                      </h4>
                                      <p className="text-sm text-amber-700 leading-relaxed">
                                        {question.explanation}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Reference Source */}
                              {question.referenceSource && (
                                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                  <BookOpen className="w-3 h-3" />
                                  <span className="font-medium">
                                    Nguồn tham khảo:
                                  </span>
                                  <span className="italic">
                                    {question.referenceSource}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}

                {/* Phần II - Trắc nghiệm đúng sai */}
                {groupedQuestions.PART_II.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Phần II - Trắc nghiệm đúng sai
                      </h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {groupedQuestions.PART_II.length} câu hỏi
                      </span>
                    </div>
                    {groupedQuestions.PART_II.map(
                      (question: QuestionBankItem) => {
                        const isSelected = selectedQuestions.has(question.id);
                        return (
                          <div
                            key={question.id}
                            className={`bg-white rounded-lg border-2 transition-all ${
                              isSelected
                                ? "border-blue-500 shadow-md"
                                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                            }`}
                          >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                              <div className="flex items-center gap-3">
                                <div className="flex gap-2">
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded font-mono">
                                    #{question.id}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddQuestionToExam(question);
                                }}
                                disabled={isSelected}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                  isSelected
                                    ? "bg-green-500 text-white cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md"
                                }`}
                              >
                                {isSelected ? (
                                  <>
                                    <CheckCircle className="w-4 h-4" />
                                    Đã thêm
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-4 h-4" />
                                    Thêm vào đề
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                              {renderQuestionContent(question)}

                              {/* Explanation */}
                              {question.explanation && (
                                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                  <div className="flex items-start gap-2">
                                    <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-white text-xs font-bold">
                                        !
                                      </span>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-amber-800 mb-1">
                                        Giải thích
                                      </h4>
                                      <p className="text-sm text-amber-700 leading-relaxed">
                                        {question.explanation}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Reference Source */}
                              {question.referenceSource && (
                                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                  <BookOpen className="w-3 h-3" />
                                  <span className="font-medium">
                                    Nguồn tham khảo:
                                  </span>
                                  <span className="italic">
                                    {question.referenceSource}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}

                {/* Phần III - Câu trả lời ngắn */}
                {groupedQuestions.PART_III.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Phần III - Câu trả lời ngắn
                      </h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {groupedQuestions.PART_III.length} câu hỏi
                      </span>
                    </div>
                    {groupedQuestions.PART_III.map(
                      (question: QuestionBankItem) => {
                        const isSelected = selectedQuestions.has(question.id);
                        return (
                          <div
                            key={question.id}
                            className={`bg-white rounded-lg border-2 transition-all ${
                              isSelected
                                ? "border-blue-500 shadow-md"
                                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                            }`}
                          >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                              <div className="flex items-center gap-3"></div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddQuestionToExam(question);
                                }}
                                disabled={isSelected}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                  isSelected
                                    ? "bg-green-500 text-white cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md"
                                }`}
                              >
                                {isSelected ? (
                                  <>
                                    <CheckCircle className="w-4 h-4" />
                                    Đã thêm
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-4 h-4" />
                                    Thêm vào đề
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                              {renderQuestionContent(question)}

                              {/* Explanation */}
                              {question.explanation && (
                                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                  <div className="flex items-start gap-2">
                                    <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-white text-xs font-bold">
                                        !
                                      </span>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-amber-800 mb-1">
                                        Giải thích
                                      </h4>
                                      <p className="text-sm text-amber-700 leading-relaxed">
                                        {question.explanation}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Reference Source */}
                              {question.referenceSource && (
                                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                  <BookOpen className="w-3 h-3" />
                                  <span className="font-medium">
                                    Nguồn tham khảo:
                                  </span>
                                  <span className="italic">
                                    {question.referenceSource}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 p-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  {questionBankData?.data ? (
                    <span>
                      Hiển thị {filteredQuestions.length} /{" "}
                      {questionBankData.data.length} câu hỏi
                    </span>
                  ) : (
                    <span>Đang tải...</span>
                  )}
                </div>
                {selectedQuestions.size > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-lg border border-green-200">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      Đã chọn {selectedQuestions.size} câu hỏi
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {selectedQuestions.size > 0 && (
                  <button
                    onClick={() => setSelectedQuestions(new Set())}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Xóa lựa chọn
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Hoàn thành
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};
