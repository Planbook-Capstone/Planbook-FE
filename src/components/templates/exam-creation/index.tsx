"use client";

import React, { useState } from "react";
import DocumentInfoPanel, {
  DocumentInfo,
} from "@/components/organisms/exam-document-panel";
import ExamContent from "@/components/organisms/exam-content";
import ExamSidebar from "@/components/organisms/exam-sidebar";
import { Question } from "@/components/organisms/exam-question-item/types";
import { YesNoQuestion } from "@/components/organisms/yes-no-question-item/types";
import { ShortQuestion } from "@/components/organisms/short-question-item/types";

interface ExamCreationTemplateProps {
  documentInfo?: DocumentInfo;
  questions?: Question[];
  yesNoQuestions?: YesNoQuestion[];
  shortQuestions?: ShortQuestion[];
  onQuestionUpdate?: (questions: Question[]) => void;
  onYesNoQuestionUpdate?: (yesNoQuestions: YesNoQuestion[]) => void;
  onShortQuestionUpdate?: (shortQuestions: ShortQuestion[]) => void;
}

export default function ExamCreationTemplate({
  documentInfo,
  questions = [],
  yesNoQuestions = [],
  shortQuestions = [],
  onQuestionUpdate,
  onYesNoQuestionUpdate,
  onShortQuestionUpdate,
}: ExamCreationTemplateProps) {
  const [examQuestions, setExamQuestions] = useState<Question[]>(
    questions.length > 0
      ? questions
      : [
          {
            id: "1",
            text: "Nhúng thanh Fe vào dung dịch CuSO4. Sau một thời gian, quan sát thấy hiện tượng gì?",
            options: [
              "Thanh Fe có màu đỏ và dd nhạt dần màu xanh.",
              "Thanh Fe có màu đỏ và dd dần có màu xanh.",
              "Thanh Fe có màu trắng xám và dd nhạt dần màu xanh.",
              "Thanh Fe có màu trắng và dd nhạt dần màu xanh.",
            ],
            correctAnswer: 1,
            type: "single",
          },
        ]
  );

  const [examYesNoQuestions, setExamYesNoQuestions] = useState<YesNoQuestion[]>(
    yesNoQuestions.length > 0
      ? yesNoQuestions
      : [
          {
            id: "2",
            text: "Xét về cấu tạo nguyên tử Hydrogen (H), cho biết các phát biểu sau đúng hay sai:",
            type: "yes-no",
            options: [
              {
                id: "2a",
                text: "Nguyên tử Hydrogen chỉ chứa proton và electron.",
                isCorrect: true,
              },
              {
                id: "2b",
                text: "Hạt nhân của nguyên tử Hydrogen chứa cả proton và neutron.",
                isCorrect: false,
              },
              {
                id: "2c",
                text: "Số proton trong hạt nhân nguyên tử Hydrogen bằng số electron trong lớp vỏ.",
                isCorrect: true,
              },
              {
                id: "2d",
                text: "Hydrogen là nguyên tố phổ biến nhất trong vỏ Trái Đất.",
                isCorrect: false,
              },
            ],
          },
        ]
  );

  const [examShortQuestions, setExamShortQuestions] = useState<ShortQuestion[]>(
    shortQuestions.length > 0
      ? shortQuestions
      : [
          {
            id: "3",
            text: "Viết phương trình hóa học của phản ứng giữa axit clohidric và natri hiđroxit.",
            answer: "HCl + NaOH → NaCl + H2O.",
            type: "short",
          },
        ]
  );

  const handleQuestionUpdate = (updatedQuestion: Question) => {
    const newQuestions = examQuestions.map((q) =>
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    setExamQuestions(newQuestions);
    onQuestionUpdate?.(newQuestions);
  };

  const handleQuestionDelete = (questionId: string) => {
    const newQuestions = examQuestions.filter((q) => q.id !== questionId);
    setExamQuestions(newQuestions);
    onQuestionUpdate?.(newQuestions);
  };

  const handleYesNoQuestionUpdate = (updatedQuestion: YesNoQuestion) => {
    const updatedQuestions = examYesNoQuestions.map((q) =>
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    setExamYesNoQuestions(updatedQuestions);
    onYesNoQuestionUpdate?.(updatedQuestions);
  };

  const handleYesNoQuestionDelete = (questionId: string) => {
    const filteredQuestions = examYesNoQuestions.filter(
      (q) => q.id !== questionId
    );
    setExamYesNoQuestions(filteredQuestions);
    onYesNoQuestionUpdate?.(filteredQuestions);
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      type: "single",
    };
    const newQuestions = [...examQuestions, newQuestion];
    setExamQuestions(newQuestions);
    onQuestionUpdate?.(newQuestions);
  };

  const handleShortQuestionUpdate = (updatedQuestion: ShortQuestion) => {
    const updatedQuestions = examShortQuestions.map((q) =>
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    setExamShortQuestions(updatedQuestions);
    onShortQuestionUpdate?.(updatedQuestions);
  };

  const handleShortQuestionDelete = (questionId: string) => {
    const filteredQuestions = examShortQuestions.filter(
      (q) => q.id !== questionId
    );
    setExamShortQuestions(filteredQuestions);
    onShortQuestionUpdate?.(filteredQuestions);
  };

  const handleAddYesNoQuestion = () => {
    const newQuestion: YesNoQuestion = {
      id: Date.now().toString(),
      text: "",
      type: "yes-no",
      options: [
        {
          id: Date.now().toString() + "a",
          text: "",
          isCorrect: false,
        },
      ],
    };
    const newQuestions = [...examYesNoQuestions, newQuestion];
    setExamYesNoQuestions(newQuestions);
    onYesNoQuestionUpdate?.(newQuestions);
  };

  const handleAddShortQuestion = () => {
    const newQuestion: ShortQuestion = {
      id: Date.now().toString(),
      text: "",
      answer: "",
      type: "short",
    };
    const newQuestions = [...examShortQuestions, newQuestion];
    setExamShortQuestions(newQuestions);
    onShortQuestionUpdate?.(newQuestions);
  };

  return (
    <div className="grid grid-cols-5 min-h-screen ">
      <div className="col-span-1 sticky top-0 h-screen">
        <DocumentInfoPanel documentInfo={documentInfo} />
      </div>

      <div className="col-span-3 border-l">
        <ExamContent
          questions={examQuestions}
          yesNoQuestions={examYesNoQuestions}
          shortQuestions={examShortQuestions}
          onQuestionUpdate={handleQuestionUpdate}
          onQuestionDelete={handleQuestionDelete}
          onYesNoQuestionUpdate={handleYesNoQuestionUpdate}
          onYesNoQuestionDelete={handleYesNoQuestionDelete}
          onShortQuestionUpdate={handleShortQuestionUpdate}
          onShortQuestionDelete={handleShortQuestionDelete}
          onAddQuestion={handleAddQuestion}
          onAddYesNoQuestion={handleAddYesNoQuestion}
          onAddShortQuestion={handleAddShortQuestion}
        />
      </div>

      <ExamSidebar
        totalQuestions={examQuestions.length}
        currentQuestion={1}
        onQuestionSelect={(questionNumber) => {
          console.log("Selected question:", questionNumber);
        }}
      />
    </div>
  );
}
