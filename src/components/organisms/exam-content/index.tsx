"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import QuestionItem from "@/components/organisms/exam-question-item";
import YesNoQuestionItem from "@/components/organisms/yes-no-question-item";
import ShortQuestionItem from "@/components/organisms/short-question-item";
import { Question } from "../exam-question-item/types";
import { YesNoQuestion } from "../yes-no-question-item/types";
import { ShortQuestion } from "../short-question-item/types";

interface ExamContentProps {
  questions: Question[];
  yesNoQuestions: YesNoQuestion[];
  shortQuestions: ShortQuestion[];
  onQuestionUpdate: (question: Question) => void;
  onQuestionDelete: (questionId: string) => void;
  onYesNoQuestionUpdate: (question: YesNoQuestion) => void;
  onYesNoQuestionDelete: (questionId: string) => void;
  onShortQuestionUpdate: (question: ShortQuestion) => void;
  onShortQuestionDelete: (questionId: string) => void;
  onAddQuestion: () => void;
  onAddYesNoQuestion: () => void;
  onAddShortQuestion: () => void;
}

export default function ExamContent({
  questions,
  yesNoQuestions,
  shortQuestions,
  onQuestionUpdate,
  onQuestionDelete,
  onYesNoQuestionUpdate,
  onYesNoQuestionDelete,
  onShortQuestionUpdate,
  onShortQuestionDelete,
  onAddQuestion,
  onAddYesNoQuestion,
  onAddShortQuestion,
}: ExamContentProps) {
  return (
    <main className="flex-1 px-8 py-6 bg-white">
      <div className="max-w-4xl">
        <>
          <h1 className="font-calsans text-lg pb-2">
            Phần I: Câu trắc nghiệm nhiều phương án lựa chọn
          </h1>
          {questions?.map((question, index) => (
            <QuestionItem
              key={question.id}
              question={question}
              index={index}
              onUpdate={onQuestionUpdate}
              onDelete={onQuestionDelete}
            />
          ))}

          <Button variant="dash" onClick={onAddQuestion} className="w-full ">
            <Plus className="h-4 w-4 mr-2" />
            Thêm câu hỏi
          </Button>
        </>
        <>
          <h1 className="font-calsans text-lg py-2">
            Phần II: Câu trắc nghiệm đúng sai.
          </h1>
          {yesNoQuestions.map((question, index) => (
            <YesNoQuestionItem
              key={question.id}
              question={question}
              index={questions?.length + index}
              onUpdate={onYesNoQuestionUpdate}
              onDelete={onYesNoQuestionDelete}
            />
          ))}

          <Button variant="dash" onClick={onAddYesNoQuestion} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Thêm câu hỏi đúng/sai
          </Button>
        </>
        <>
          <h1 className="font-calsans text-lg py-2">
            Phần III: Câu hỏi tự luận.
          </h1>
          {shortQuestions.map((question, index) => (
            <ShortQuestionItem
              key={question.id}
              question={question}
              index={questions.length + yesNoQuestions.length + index}
              onUpdate={onShortQuestionUpdate}
              onDelete={onShortQuestionDelete}
            />
          ))}

          <Button variant="dash" onClick={onAddShortQuestion} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Thêm câu hỏi tự luận
          </Button>
        </>
      </div>
    </main>
  );
}

export type { ExamContentProps };
