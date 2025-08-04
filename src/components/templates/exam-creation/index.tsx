"use client";

import React, { useState } from "react";
import DocumentInfoPanel, {
  DocumentInfo,
} from "@/components/organisms/document-panel";
import AssetsPanel from "@/components/organisms/assets-panel";
import ExamContent from "@/components/organisms/exam-content";
import ExamSidebar from "@/components/organisms/exam-sidebar";
import { Question } from "@/components/organisms/exam-question-item/types";
import { YesNoQuestion } from "@/components/organisms/yes-no-question-item/types";
import { ShortQuestion } from "@/components/organisms/short-question-item/types";
import { useExamContext } from "@/contexts/ExamContext";

interface ExamCreationTemplateProps {
  documentInfo?: DocumentInfo;
  questions?: Question[];
  yesNoQuestions?: YesNoQuestion[];
  shortQuestions?: ShortQuestion[];
  onQuestionUpdate?: (questions: Question[]) => void;
  onYesNoQuestionUpdate?: (yesNoQuestions: YesNoQuestion[]) => void;
  onShortQuestionUpdate?: (shortQuestions: ShortQuestion[]) => void;
  examData?: any; // Data from API response when importing exam
  onImageDrop?: (questionId: string, imageSrc: string) => void;
}

export default function ExamCreationTemplate({
  documentInfo,
  questions = [],
  yesNoQuestions = [],
  shortQuestions = [],
  onQuestionUpdate,
  onYesNoQuestionUpdate,
  onShortQuestionUpdate,
  examData,
  onImageDrop,
}: ExamCreationTemplateProps) {
  // Use ExamContext instead of local state
  const {
    examQuestions,
    examYesNoQuestions,
    examShortQuestions,
    updateQuestion,
    updateYesNoQuestion,
    updateShortQuestion,
    deleteQuestion,
    deleteYesNoQuestion,
    deleteShortQuestion,
    addQuestion,
    addYesNoQuestion,
    addShortQuestion,
    updateQuestionImage,
    updateYesNoQuestionImage,
    updateShortQuestionImage,
  } = useExamContext();

  const handleQuestionUpdate = (updatedQuestion: Question) => {
    updateQuestion(updatedQuestion);
    onQuestionUpdate?.(
      examQuestions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      )
    );
  };

  const handleQuestionDelete = (questionId: string) => {
    deleteQuestion(questionId);
    onQuestionUpdate?.(examQuestions.filter((q) => q.id !== questionId));
  };

  const handleYesNoQuestionUpdate = (updatedQuestion: YesNoQuestion) => {
    updateYesNoQuestion(updatedQuestion);
    onYesNoQuestionUpdate?.(
      examYesNoQuestions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      )
    );
  };

  const handleYesNoQuestionDelete = (questionId: string) => {
    deleteYesNoQuestion(questionId);
    onYesNoQuestionUpdate?.(
      examYesNoQuestions.filter((q) => q.id !== questionId)
    );
  };

  const handleAddQuestion = () => {
    addQuestion();
    onQuestionUpdate?.([
      ...examQuestions,
      {
        id: Date.now().toString(),
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        type: "single",
      },
    ]);
  };

  const handleShortQuestionUpdate = (updatedQuestion: ShortQuestion) => {
    updateShortQuestion(updatedQuestion);
    onShortQuestionUpdate?.(
      examShortQuestions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      )
    );
  };

  const handleShortQuestionDelete = (questionId: string) => {
    deleteShortQuestion(questionId);
    onShortQuestionUpdate?.(
      examShortQuestions.filter((q) => q.id !== questionId)
    );
  };

  const handleAddYesNoQuestion = () => {
    addYesNoQuestion();
    onYesNoQuestionUpdate?.([
      ...examYesNoQuestions,
      {
        id: Date.now().toString(),
        question: "",
        type: "yes-no",
        statements: {
          a: { text: "", answer: false },
          b: { text: "", answer: false },
          c: { text: "", answer: false },
          d: { text: "", answer: false },
        },
      },
    ]);
  };

  const handleAddShortQuestion = () => {
    addShortQuestion();
    onShortQuestionUpdate?.([
      ...examShortQuestions,
      {
        id: Date.now().toString(),
        text: "",
        answer: "",
        type: "short",
      },
    ]);
  };

  const handleImageDropToQuestion = (questionId: string, imageSrc: string) => {
    console.log("🖼️ Handling image drop to question:", questionId, imageSrc);

    // Update the question with the image using context
    updateQuestionImage(questionId, imageSrc);
    onImageDrop?.(questionId, imageSrc);
  };

  console.log(examData?.data?.data?.parts, "tran");

  return (
    <div className="grid grid-cols-5 min-h-screen ">
      <div className="col-span-1 sticky top-0 h-screen">
        <AssetsPanel />
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
