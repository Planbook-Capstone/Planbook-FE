"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import QuestionItem from "@/components/organisms/exam-question-item";
import YesNoQuestionItem from "@/components/organisms/yes-no-question-item";
import ShortQuestionItem from "@/components/organisms/short-question-item";
import BasicExamInfoComponent from "@/components/organisms/basic-exam-info";
import { Question } from "../exam-question-item/types";
import { YesNoQuestion } from "../yes-no-question-item/types";
import { ShortQuestion } from "../short-question-item/types";
import { useExamContext } from "@/contexts/ExamContext";

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
  // Get exam context for basic info
  const { basicExamInfo, updateBasicExamInfo } = useExamContext();

  // State for collapse/expand sections
  const [isSection1Collapsed, setIsSection1Collapsed] = useState(false);
  const [isSection2Collapsed, setIsSection2Collapsed] = useState(false);
  const [isSection3Collapsed, setIsSection3Collapsed] = useState(false);
  return (
    <main className="flex-1 px-2 py-6 bg-white">
      <div className="w-full">
        {/* Basic Exam Info */}
        <BasicExamInfoComponent
          examInfo={basicExamInfo}
          onUpdate={updateBasicExamInfo}
        />

        {/* Section 1: Multiple Choice Questions */}

        <div
          className="flex justify-between items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
          onClick={() => setIsSection1Collapsed(!isSection1Collapsed)}
        >
          <h1 className="font-calsans text-lg">
            Phần I: Câu trắc nghiệm nhiều phương án lựa chọn ({questions.length}
            )
          </h1>
          {isSection1Collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </div>

        {!isSection1Collapsed && (
          <div className="ml-1 mt-4">
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
          </div>
        )}

        {/* Section 2: Yes/No Questions */}
        <div className="">
          <div
            className="flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
            onClick={() => setIsSection2Collapsed(!isSection2Collapsed)}
          >
            <h1 className="font-calsans text-lg">
              Phần II: Câu trắc nghiệm đúng sai ({yesNoQuestions.length})
            </h1>
            {isSection2Collapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </div>

          {!isSection2Collapsed && (
            <div className="ml-1 mt-4">
              {yesNoQuestions.map((question, index) => (
                <YesNoQuestionItem
                  key={question.id}
                  question={question}
                  index={questions?.length + index}
                  onUpdate={onYesNoQuestionUpdate}
                  onDelete={onYesNoQuestionDelete}
                />
              ))}

              <Button
                variant="dash"
                onClick={onAddYesNoQuestion}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm câu hỏi đúng/sai
              </Button>
            </div>
          )}
        </div>
        {/* Section 3: Short Answer Questions */}
        <div className="">
          <div
            className="flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
            onClick={() => setIsSection3Collapsed(!isSection3Collapsed)}
          >
            <h1 className="font-calsans text-lg">
              Phần III: Câu hỏi tự luận ({shortQuestions.length})
            </h1>
            {isSection3Collapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </div>

          {!isSection3Collapsed && (
            <div className="ml-1 mt-4">
              {shortQuestions.map((question, index) => (
                <ShortQuestionItem
                  key={question.id}
                  question={question}
                  index={questions.length + yesNoQuestions.length + index}
                  onUpdate={onShortQuestionUpdate}
                  onDelete={onShortQuestionDelete}
                />
              ))}

              <Button
                variant="dash"
                onClick={onAddShortQuestion}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm câu hỏi tự luận
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export type { ExamContentProps };
