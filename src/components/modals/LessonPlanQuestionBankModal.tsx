import React, { useState } from "react";
import { X, Copy, Check, ChevronRight, Folder, FileText } from "lucide-react";
import { useGradesService } from "@/services/gradeServices";
import { useSubjectsByGradeService } from "@/services/subjectServices";
import { useBooksBySubjectService } from "@/services/bookServices";
import { useChaptersByBookService } from "@/services/chapterServices";
import { useLessonsByChaptersService } from "@/services/lessonServices";
import { useQuestionBanksWithParamsService } from "@/services/questionBankServices";

interface LessonPlanQuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuestion: (question: any) => void;
}

export const LessonPlanQuestionBankModal: React.FC<
  LessonPlanQuestionBankModalProps
> = ({ isOpen, onClose, onSelectQuestion }) => {
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);

  // Navigation state
  const [currentView, setCurrentView] = useState<
    "grades" | "subjects" | "books" | "lessons" | "questions"
  >("grades");
  const [selectedGrade, setSelectedGrade] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  // API calls
  const { data: gradesData } = useGradesService();
  console.log("🔍 gradesData:", gradesData);
  const { data: subjectsData } = useSubjectsByGradeService(
    selectedGrade?.id || "",
    {
      enabled: !!selectedGrade,
    }
  );
  console.log("🔍 subjectsData:", subjectsData);

  const { data: booksData } = useBooksBySubjectService(
    selectedSubject?.id || "",
    {
      enabled: !!selectedSubject,
    }
  );
  console.log("🔍 booksData:", booksData);

  // Get chapters by book, then lessons by chapters
  const { data: chaptersData } = useChaptersByBookService(
    selectedBook?.id || "",
    {
      enabled: !!selectedBook,
    }
  );
  console.log("🔍 chaptersData:", chaptersData);

  // Get lessons from chapters - use conditional logic to avoid Rules of Hooks
  const chapters = chaptersData?.data?.content || [];
  const chapterIds = selectedBook ? chapters.map((ch: any) => ch.id) : [];
  console.log("🔍 chapterIds:", chapterIds);

  // Only call lessons service if we have chapters
  const lessonQueries = useLessonsByChaptersService(chapterIds);
  console.log("🔍 lessonQueries:", lessonQueries);

  // Flatten lessons from all chapters
  const lessonsData = {
    data: selectedBook
      ? lessonQueries
          .filter((query: any) => query.data)
          .map((query: any) => query.data?.data?.content || [])
          .flat()
      : [],
  };
  console.log("🔍 lessonsData:", lessonsData);

  // Dynamic questions API call with filters
  const buildQuestionFilters = () => {
    const filters: any = {};

    if (selectedGrade) filters.gradeId = selectedGrade.id;
    if (selectedSubject) filters.subjectId = selectedSubject.id;
    if (selectedBook) filters.bookId = selectedBook.id;
    if (selectedLesson) filters.lessonIds = selectedLesson.id;

    return filters;
  };

  const questionFilters = buildQuestionFilters();
  const { data: filteredQuestionsData } = useQuestionBanksWithParamsService(
    selectedLesson ? [selectedLesson.id] : [], // lessonIds array
    { enabled: !!selectedLesson }, // only call when lesson is selected
    questionFilters // filter parameters
  );
  console.log("🔍 filteredQuestionsData:", filteredQuestionsData);

  // Use filtered questions from API
  const currentQuestionsData = filteredQuestionsData?.data || [];
  console.log("🔍 currentQuestionsData:", currentQuestionsData);

  // Group questions by questionType
  const groupedQuestions = currentQuestionsData.reduce(
    (groups: any, question: any) => {
      const type = question.questionType || "Khác";
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(question);
      return groups;
    },
    {}
  );

  // State for collapsed sections
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  );

  const toggleSection = (sectionType: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(sectionType)) {
      newCollapsed.delete(sectionType);
    } else {
      newCollapsed.add(sectionType);
    }
    setCollapsedSections(newCollapsed);
  };

  if (!isOpen) return null;

  // Helper function for difficulty text
  const getDifficultyText = (level: string) => {
    switch (level) {
      case "KNOWLEDGE":
        return "Nhận biết";
      case "COMPREHENSION":
        return "Thông hiểu";
      case "APPLICATION":
        return "Vận dụng";
      case "ANALYSIS":
        return "Phân tích";
      default:
        return "Chưa xác định";
    }
  };

  // Helper function for question type text
  const getQuestionTypeText = (type: string) => {
    switch (type) {
      case "PART_I":
        return "Phần I";
      case "PART_II":
        return "Phần II";
      case "PART_III":
        return "Phần III";
      case "PART_IV":
        return "Phần IV";
      case "PART_V":
        return "Phần V";
      default:
        return type; // Return original if no match
    }
  };

  // Navigation handlers
  const handleGradeSelect = (grade: any) => {
    setSelectedGrade(grade);
    setCurrentView("subjects");
  };

  const handleSubjectSelect = (subject: any) => {
    setSelectedSubject(subject);
    setCurrentView("books");
  };

  const handleBookSelect = (book: any) => {
    setSelectedBook(book);
    setCurrentView("lessons");
  };

  const handleLessonSelect = (lesson: any) => {
    setSelectedLesson(lesson);
    setCurrentView("questions");
  };

  const handleBackNavigation = () => {
    if (currentView === "subjects") {
      setCurrentView("grades");
      setSelectedGrade(null);
    } else if (currentView === "books") {
      setCurrentView("subjects");
      setSelectedSubject(null);
    } else if (currentView === "lessons") {
      setCurrentView("books");
      setSelectedBook(null);
    } else if (currentView === "questions") {
      setCurrentView("lessons");
      setSelectedLesson(null);
    }
  };

  const handleToggleSelectQuestion = (question: any) => {
    const isSelected = selectedQuestions.some((q) => q.id === question.id);

    if (isSelected) {
      setSelectedQuestions((prev) => prev.filter((q) => q.id !== question.id));
    } else {
      setSelectedQuestions((prev) => [...prev, question]);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedQuestions.length > 0) {
      // Group selected questions by questionType
      const groupedSelectedQuestions = selectedQuestions.reduce(
        (groups: any, question: any) => {
          const type = question.questionType || "Khác";
          if (!groups[type]) {
            groups[type] = [];
          }
          groups[type].push(question);
          return groups;
        },
        {}
      );

      const formatQuestionForOutput = (
        question: any,
        questionIndex: number,
        questionType: string
      ) => {
        const content = renderQuestionContent(question);
        const options = question.questionContent?.options;
        const answer = question.questionContent?.answer;

        // Metadata
        const metadata = [];
        if (question.difficultyLevel) {
          metadata.push(
            `Độ khó: ${getDifficultyText(question.difficultyLevel)}`
          );
        }
        if (question.referenceSource) {
          metadata.push(`Nguồn: ${question.referenceSource}`);
        }

        let formatted = `**Câu ${questionIndex + 1}**`;
        if (metadata.length > 0) {
          formatted += ` (${metadata.join(" | ")})`;
        }
        formatted += `\n**${content}**\n`;

        // Format based on question type
        if (questionType === "PART_I") {
          // Multiple choice - options + answer at end
          if (options) {
            Object.entries(options).forEach(([key, value]: [string, any]) => {
              formatted += `${key}. ${value}\n`;
            });
          }
          if (answer) {
            formatted += `\n**Đáp án: ${answer}**`;
          }
        } else if (questionType === "PART_II") {
          // True/False - statements with answer on each
          const statements = question.questionContent?.statements;
          if (statements) {
            Object.entries(statements).forEach(
              ([key, value]: [string, any]) => {
                formatted += `${key}. ${value.text} ${
                  value.answer ? "✓" : "✗"
                }\n`;
              }
            );
          }
        } else if (questionType === "PART_III") {
          // Essay - answer at bottom
          if (answer) {
            formatted += `\n**Đáp án: ${answer}**`;
          }
        } else {
          // Default format for other types
          if (options) {
            formatted += "\n";
            Object.entries(options).forEach(([key, value]: [string, any]) => {
              formatted += `\n${key}. ${value}`;
            });
          }
          if (answer) {
            formatted += `\n\n**Đáp án: ${answer}**`;
          }
        }

        return formatted;
      };

      // Build output by sections in correct order
      let combinedContent = "";
      const orderedTypes = [
        "PART_I",
        "PART_II",
        "PART_III",
        "PART_IV",
        "PART_V",
      ];

      orderedTypes.forEach((questionType) => {
        if (groupedSelectedQuestions[questionType]) {
          const questions = groupedSelectedQuestions[questionType];
          combinedContent += `**${getQuestionTypeText(questionType)}:**\n\n`;

          questions.forEach((question: any, index: number) => {
            combinedContent += formatQuestionForOutput(
              question,
              index,
              questionType
            );
            combinedContent += "\n\n";
          });

          combinedContent += "\n";
        }
      });

      onSelectQuestion({ content: combinedContent.trim() });
    }
    onClose();
  };

  const renderQuestionContent = (question: any) => {
    const content = question.questionContent;
    if (!content) return "Không có nội dung";

    if (typeof content === "string") {
      return content;
    }

    if (content.question) {
      return content.question;
    }

    return "Không có nội dung";
  };

  const renderQuestionOptions = (question: any) => {
    const content = question.questionContent;
    if (!content || typeof content === "string") return null;

    const questionType = question.questionType;

    // PART_I: Multiple choice with options
    if (questionType === "PART_I" && content.options) {
      const options = content.options;
      const correctAnswer = content.answer;

      return (
        <div className="space-y-2 mt-3">
          <p className="text-sm font-medium text-gray-600 mb-2">
            Các phương án lựa chọn:
          </p>
          {Object.entries(options).map(([key, value]: [string, any]) => (
            <div
              key={key}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                key === correctAnswer
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <span
                className={`font-bold min-w-[24px] h-6 flex items-center justify-center rounded-full text-sm ${
                  key === correctAnswer
                    ? "bg-green-500 text-white"
                    : "bg-gray-400 text-white"
                }`}
              >
                {key}
              </span>
              <span
                className={`text-gray-800 ${
                  key === correctAnswer ? "font-medium" : ""
                }`}
              >
                {value}
              </span>
              {key === correctAnswer && (
                <span className="ml-auto text-green-600 text-sm font-medium">
                  ✓ Đúng
                </span>
              )}
            </div>
          ))}
        </div>
      );
    }

    // PART_II: True/False with statements
    if (questionType === "PART_II" && content.statements) {
      const statements = content.statements;

      return (
        <div className="space-y-2 mt-3">
          <p className="text-sm font-medium text-gray-600 mb-2">
            Các phát biểu:
          </p>
          {Object.entries(statements).map(([key, value]: [string, any]) => (
            <div
              key={key}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                value.answer
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <span
                className={`font-bold min-w-[24px] h-6 flex items-center justify-center rounded-full text-sm ${
                  value.answer
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {key}
              </span>
              <span className="text-gray-800 flex-1">{value.text}</span>
              <span
                className={`text-sm font-medium ${
                  value.answer ? "text-green-600" : "text-red-600"
                }`}
              >
                {value.answer ? "✓ Đúng" : "✗ Sai"}
              </span>
            </div>
          ))}
        </div>
      );
    }

    // PART_III: Essay - no options to display
    return null;
  };

  const renderNavigationContent = () => {
    switch (currentView) {
      case "grades":
        return (
          <div className="space-y-2">
            {gradesData?.data?.content &&
            Array.isArray(gradesData.data.content) ? (
              gradesData.data.content.map((grade: any) => (
                <div
                  key={grade.id}
                  onClick={() => handleGradeSelect(grade)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  <Folder size={20} className="text-yellow-600" />
                  <span className="font-medium">Khối {grade.name}</span>
                  <ChevronRight size={16} className="ml-auto text-gray-400" />
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Đang tải dữ liệu khối...</p>
              </div>
            )}
          </div>
        );

      case "subjects":
        return (
          <div className="space-y-2">
            <button
              onClick={handleBackNavigation}
              className="flex items-center gap-2 p-2 text-blue-600 hover:bg-blue-50 rounded"
            >
              ← Quay lại Khối
            </button>
            {subjectsData?.data?.content &&
            Array.isArray(subjectsData.data.content) ? (
              subjectsData.data.content.map((subject: any) => (
                <div
                  key={subject.id}
                  onClick={() => handleSubjectSelect(subject)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  <Folder size={20} className="text-yellow-600" />
                  <span className="font-medium">{subject.name}</span>
                  <ChevronRight size={16} className="ml-auto text-gray-400" />
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Đang tải dữ liệu môn học...</p>
              </div>
            )}
          </div>
        );

      case "books":
        return (
          <div className="space-y-2">
            <button
              onClick={handleBackNavigation}
              className="flex items-center gap-2 p-2 text-blue-600 hover:bg-blue-50 rounded"
            >
              ← Quay lại Môn học
            </button>
            {booksData?.data?.content &&
            Array.isArray(booksData.data.content) ? (
              booksData.data.content.map((book: any) => (
                <div
                  key={book.id}
                  onClick={() => handleBookSelect(book)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  <FileText size={20} className="text-blue-600" />
                  <span className="font-medium">{book.name}</span>
                  <ChevronRight size={16} className="ml-auto text-gray-400" />
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Đang tải dữ liệu sách...</p>
              </div>
            )}
          </div>
        );

      case "lessons":
        return (
          <div className="space-y-2">
            <button
              onClick={handleBackNavigation}
              className="flex items-center gap-2 p-2 text-blue-600 hover:bg-blue-50 rounded"
            >
              ← Quay lại Sách
            </button>
            {lessonsData?.data && Array.isArray(lessonsData.data) ? (
              lessonsData.data.map((lesson: any) => (
                <div
                  key={lesson.id}
                  onClick={() => handleLessonSelect(lesson)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  <FileText size={20} className="text-green-600" />
                  <span className="font-medium">{lesson.name}</span>
                  <ChevronRight size={16} className="ml-auto text-gray-400" />
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Đang tải dữ liệu bài học...</p>
              </div>
            )}
          </div>
        );

      case "questions":
        return (
          <div className="space-y-4">
            <button
              onClick={handleBackNavigation}
              className="flex items-center gap-2 p-2 text-blue-600 hover:bg-blue-50 rounded"
            >
              ← Quay lại Bài học
            </button>
            {Object.keys(groupedQuestions).length > 0 ? (
              Object.entries(groupedQuestions).map(
                ([questionType, questions]: [string, any]) => (
                  <div key={questionType} className="mb-6">
                    {/* Section Header */}
                    <div
                      onClick={() => toggleSection(questionType)}
                      className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors mb-3"
                    >
                      <h3 className="font-semibold text-gray-800">
                        {getQuestionTypeText(questionType)}
                      </h3>
                      <span className="text-sm text-gray-600">
                        ({questions.length} câu)
                      </span>
                      <span className="ml-auto text-gray-400">
                        {collapsedSections.has(questionType) ? "▶" : "▼"}
                      </span>
                    </div>

                    {/* Questions in this section */}
                    {!collapsedSections.has(questionType) && (
                      <div className="space-y-4 ml-4">
                        {questions.map((question: any, index: number) => (
                          <div
                            key={question.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            {/* Header với thông tin phân loại */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold text-gray-800">
                                    Câu {index + 1}
                                  </h4>
                                  {/* Nguồn */}
                                  {question.referenceSource && (
                                    <span className="text-xs">
                                      [
                                      {question.referenceSource ==
                                      "Imported from DOCX"
                                        ? "Nhập từ tài liệu"
                                        : question.referenceSource}
                                      ]
                                    </span>
                                  )}
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full ${
                                      question.difficultyLevel === "KNOWLEDGE"
                                        ? "bg-green-100 text-green-700"
                                        : question.difficultyLevel ===
                                          "COMPREHENSION"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : question.difficultyLevel ===
                                          "APPLICATION"
                                        ? "bg-orange-100 text-orange-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    {getDifficultyText(
                                      question.difficultyLevel
                                    )}
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={() =>
                                  handleToggleSelectQuestion(question)
                                }
                                className={`p-2 rounded-full transition-colors ${
                                  selectedQuestions.some(
                                    (q) => q.id === question.id
                                  )
                                    ? "bg-green-100 text-green-600"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                              >
                                {selectedQuestions.some(
                                  (q) => q.id === question.id
                                ) ? (
                                  <Check size={16} />
                                ) : (
                                  <Copy size={16} />
                                )}
                              </button>
                            </div>

                            {/* Nội dung câu hỏi */}
                            <div className="mb-4">
                              <p className="text-gray-900 font-medium mb-3">
                                {renderQuestionContent(question)}
                              </p>
                              {renderQuestionOptions(question)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              )
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Không có câu hỏi nào</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-calsans text-gray-900">
            Ngân hàng câu hỏi
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Content - 2 columns */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Navigation */}
          <div className="w-1/2 h-full flex flex-col border-r border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-800">
                {currentView === "grades" && "Chọn Khối"}
                {currentView === "subjects" && "Chọn Môn học"}
                {currentView === "books" && "Chọn Sách giáo khoa"}
                {currentView === "lessons" && "Chọn Bài học"}
                {currentView === "questions" && "Chọn Câu hỏi"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {currentView === "grades" && "Chọn khối lớp để xem môn học"}
                {currentView === "subjects" &&
                  `Khối ${selectedGrade?.name} - Chọn môn học`}
                {currentView === "books" &&
                  `${selectedSubject?.name} - Chọn sách giáo khoa`}
                {currentView === "lessons" &&
                  `${selectedBook?.name} - Chọn bài học`}
                {currentView === "questions" &&
                  `Tổng cộng ${currentQuestionsData.length} câu hỏi`}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {renderNavigationContent()}
            </div>
          </div>

          {/* Right Panel - Selected Questions */}
          <div className="w-1/2 h-full bg-gray-50 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="text-lg font-calsans text-gray-800">
                Câu hỏi đã chọn
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {selectedQuestions.length} câu hỏi được chọn
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {selectedQuestions.length > 0 ? (
                <div className="space-y-4">
                  {selectedQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      {/* Header với thông tin phân loại */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-800">
                              Câu {index + 1}
                            </h4>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {question.questionType}
                            </span>
                          </div>

                          {/* 3 phần phân loại - compact version */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {/* Độ khó */}
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                question.difficultyLevelDescription ===
                                "KNOWLEDGE"
                                  ? "bg-green-100 text-green-700"
                                  : question.difficultyLevelDescription ===
                                    "COMPREHENSION"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : question.difficultyLevelDescription ===
                                    "APPLICATION"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              🎯{" "}
                              {getDifficultyText(
                                question.difficultyLevelDescription
                              )}
                            </span>

                            {/* Đáp án */}
                            {question.questionContent?.answer && (
                              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                                ✓ {question.questionContent.answer}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleSelectQuestion(question)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* Nội dung câu hỏi - compact */}
                      <div className="mb-3">
                        <p className="text-gray-900 text-sm font-medium mb-2">
                          {renderQuestionContent(question)}
                        </p>

                        {/* Options compact */}
                        {question.questionContent?.options && (
                          <div className="space-y-1">
                            {Object.entries(
                              question.questionContent.options
                            ).map(([key, value]: [string, any]) => (
                              <div
                                key={key}
                                className={`flex items-start gap-2 text-xs p-2 rounded ${
                                  key === question.questionContent.answer
                                    ? "bg-green-50 text-green-800"
                                    : "bg-gray-50 text-gray-700"
                                }`}
                              >
                                <span className="font-bold">{key}.</span>
                                <span className="line-clamp-2">{value}</span>
                                {key === question.questionContent.answer && (
                                  <span className="ml-auto text-green-600">
                                    ✓
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Nguồn */}
                      {question.referenceSource && (
                        <div className="text-xs text-gray-500 border-t pt-2">
                          📚 {question.referenceSource}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <p className="text-lg mb-2">
                      Chưa có câu hỏi nào được chọn
                    </p>
                    <p className="text-sm">
                      {currentView === "questions"
                        ? "Chọn câu hỏi từ danh sách bên trái"
                        : "Chọn khối → môn → sách → bài học để xem câu hỏi"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Đã chọn {selectedQuestions.length} câu hỏi
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmSelection}
                disabled={selectedQuestions.length === 0}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedQuestions.length > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Xác nhận ({selectedQuestions.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
