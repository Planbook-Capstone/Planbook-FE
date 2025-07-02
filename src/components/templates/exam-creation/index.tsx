"use client";

import React, { useState } from "react";
import DocumentInfoPanel, {
  DocumentInfo,
} from "@/components/organisms/exam-document-panel";
import AssetsPanel from "@/components/organisms/assets-panel";
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
  // Parse examData and populate questions
  React.useEffect(() => {
    if (examData) {
      console.log("=== EXAM DATA RECEIVED ===");
      console.log("Full API Response:", examData);

      // Extract parts from API response structure
      const parts = examData?.data?.data?.parts || examData?.data?.parts || examData?.parts || examData;

      if (Array.isArray(parts)) {
        console.log("Extracted Parts:", parts);

        // Parse Part I - Multiple Choice Questions
        const part1 = parts.find((part: any) => part.part === "Phần I");
        if (part1 && part1.questions) {
          const multipleChoiceQuestions = part1.questions.map((q: any) => ({
            id: String(q.id),
            question: q.question,
            options: q.options, // Keep original format {A, B, C, D}
            correctAnswer: q.answer === "A" ? 0 : q.answer === "B" ? 1 : q.answer === "C" ? 2 : 3,
            type: "single" as const
          }));
          console.log("✅ Parsed Multiple Choice Questions:", multipleChoiceQuestions);
          setExamQuestions(multipleChoiceQuestions);
        }

        // Parse Part II - Yes/No Questions
        const part2 = parts.find((part: any) => part.part === "Phần II");
        if (part2 && part2.questions) {
          const yesNoQuestions = part2.questions.map((q: any) => ({
            id: String(q.id),
            question: q.question,
            statements: q.statements,
            type: "yes-no" as const
          }));
          console.log("✅ Parsed Yes/No Questions:", yesNoQuestions);
          setExamYesNoQuestions(yesNoQuestions);
        }

        // Parse Part III - Short Answer Questions
        const part3 = parts.find((part: any) => part.part === "Phần III");
        if (part3 && part3.questions) {
          const shortQuestions = part3.questions.map((q: any) => ({
            id: String(q.id),
            question: q.question,
            answer: q.answer,
            type: "short" as const
          }));
          console.log("✅ Parsed Short Questions:", shortQuestions);
          setExamShortQuestions(shortQuestions);
        }

        // Log exam metadata
        const examInfo = examData?.data?.data || examData?.data || examData;
        if (examInfo) {
          console.log("📋 Exam Metadata:", {
            subject: examInfo.subject,
            grade: examInfo.grade,
            duration: examInfo.duration_minutes,
            school: examInfo.school,
            atomicMasses: examInfo.atomic_masses
          });
        }
      } else {
        console.warn("⚠️ Parts not found or not an array:", parts);
      }
    }
  }, [examData]);

  const [examQuestions, setExamQuestions] = useState<Question[]>(
    examData?.data?.data?.parts[0]?.questions || []
  );

  const [examYesNoQuestions, setExamYesNoQuestions] = useState<YesNoQuestion[]>(
    examData?.data?.data?.parts[1]?.questions || []
  );

  const [examShortQuestions, setExamShortQuestions] = useState<ShortQuestion[]>(
    examData?.data?.data?.parts[2]?.questions || []
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
      question: "",
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
      question: "",
      type: "yes-no",
      statements: {
        a: { text: "", answer: false },
        b: { text: "", answer: false },
        c: { text: "", answer: false },
        d: { text: "", answer: false },
      },
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

  const handleImageDropToQuestion = (questionId: string, imageSrc: string) => {
    console.log('🖼️ Handling image drop to question:', questionId, imageSrc);

    // Update the question with the image
    const updatedQuestions = examQuestions.map((q) =>
      q.id.toString() === questionId ? { ...q, illustrationImage: imageSrc } : q
    );
    setExamQuestions(updatedQuestions);
    onQuestionUpdate?.(updatedQuestions);
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
