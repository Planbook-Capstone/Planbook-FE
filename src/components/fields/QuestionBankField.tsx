import React, { useState } from "react";
import { LessonPlanQuestionBankModal } from "@/components/modals/LessonPlanQuestionBankModal";

interface QuestionBankFieldProps {
  nodeId: string;
  content: string;
  onUpdateContent: (nodeId: string, content: string) => void;
  questionsData?: any[];
}

export const QuestionBankField: React.FC<QuestionBankFieldProps> = ({
  nodeId,
  content,
  onUpdateContent,
  questionsData = [],
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("QuestionBankField questionsData:", questionsData, "questions");

  const handleSelectQuestion = (data: any) => {
    // Update node content with selected questions
    let questionText = "Không có nội dung";

    if (data.content) {
      // Combined content from multiple questions
      questionText = data.content;
    } else if (data.text) {
      // Single question with text property
      questionText = data.text;
    } else if (data.questionContent) {
      // Single question with questionContent
      const content = data.questionContent;
      if (typeof content === "string") {
        questionText = content;
      } else if (content && content.question) {
        questionText = content.question;
      }
    }

    onUpdateContent(nodeId, questionText);
    setIsModalOpen(false);
  };

  // Check if content has been set (not default placeholder)
  const hasContent = content && content !== "Nhập câu hỏi của bạn ở đây...";

  return (
    <div className="field-question-bank w-full">
      <div
        className={`border-1 border-dashed rounded-lg p-4 cursor-pointer transition-colors ${
          hasContent
            ? "border-emerald-300 bg-emerald-50 hover:bg-emerald-50 hover:border-emerald-400"
            : "border-sky-300 bg-sky-50 hover:bg-sky-100 hover:border-sky-400"
        }`}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center gap-2">
          {hasContent ? (
            <div className="w-full">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-medium text-sm">
                  Nhấn vào đây để thay đổi câu hỏi
                </span>
              </div>
            </div>
          ) : (
            <span className="text-sky-600 font-medium">
              Nhấn vào đây để chọn câu hỏi từ ngân hàng
            </span>
          )}
        </div>
      </div>

      {/* Question Bank Modal */}
      <LessonPlanQuestionBankModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectQuestion={handleSelectQuestion}
      />
    </div>
  );
};
