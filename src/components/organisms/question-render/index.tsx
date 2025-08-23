"use client";

import React from "react";
import { ExamPart, ExamQuestion } from "@/services/studentExamServices";

interface QuestionRenderProps {
  parts: ExamPart[];
}

interface MultipleChoiceQuestionProps {
  question: ExamQuestion;
  partTitle: string;
}

interface TrueFalseQuestionProps {
  question: ExamQuestion;
  partTitle: string;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  partTitle,
}) => {
  return (
    <div className="mb-6 p-5 border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="mb-4">
        <div className="flex items-start gap-2">
          <span className="font-bold text-blue-700 text-lg min-w-fit">
            Câu {question.questionNumber}:
          </span>
          <span className="text-gray-800 text-base leading-relaxed">
            {question.question}
          </span>
        </div>
      </div>

      {question.options && (
        <div className="space-y-2 ml-6">
          {Object.entries(question.options).map(([key, value]) => (
            <div
              key={key}
              className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                question.answer === key
                  ? "bg-green-50 border-2 border-green-300 shadow-sm"
                  : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <span className="font-bold text-gray-700 min-w-[24px] text-base">
                {key}.
              </span>
              <span
                className={`flex-1 text-base leading-relaxed ${
                  question.answer === key
                    ? "text-green-800 font-semibold"
                    : "text-gray-700"
                }`}
              >
                {value}
              </span>
              {question.answer === key && (
                <div className="flex items-center gap-1">
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    ✓ Đáp án đúng
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({
  question,
  partTitle,
}) => {
  return (
    <div className="mb-6 p-5 border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="mb-4">
        <div className="flex items-start gap-2">
          <span className="font-bold text-blue-700 text-lg min-w-fit">
            Câu {question.questionNumber}:
          </span>
          <span className="text-gray-800 text-base leading-relaxed">
            {question.question}
          </span>
        </div>
      </div>

      {question.statements && (
        <div className="ml-6 space-y-3">
          {Object.entries(question.statements).map(([key, statement]) => (
            <div
              key={key}
              className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${
                statement.answer
                  ? "bg-green-50 border-green-300 shadow-sm"
                  : "bg-red-50 border-red-300 shadow-sm"
              }`}
            >
              <span className="font-bold text-gray-700 min-w-[24px] text-base">
                {key.toUpperCase()}.
              </span>
              <span className="flex-1 text-base leading-relaxed text-gray-800">
                {statement.text}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    statement.answer
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {statement.answer ? "✓ Đúng" : "✗ Sai"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const QuestionRender: React.FC<QuestionRenderProps> = ({ parts }) => {
  return (
    <div className="space-y-8">
      {parts.map((part, partIndex) => (
        <div key={partIndex} className="space-y-4">
          {/* Part Header */}
          <div className="border-b border-gray-300 pb-3 flex justify-start items-end gap-1">
            <h2 className="text-lg font-bold text-gray-800">{part.part}:</h2>
            <h3 className="text-lg font-bold text-gray-800">{part.title}</h3>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {part.questions.map((question, questionIndex) => {
              // Determine question type based on data structure
              if (question.options) {
                // Multiple choice question
                return (
                  <MultipleChoiceQuestion
                    key={question.id || questionIndex}
                    question={question}
                    partTitle={part.title}
                  />
                );
              } else if (question.statements) {
                // True/False question
                return (
                  <TrueFalseQuestion
                    key={question.id || questionIndex}
                    question={question}
                    partTitle={part.title}
                  />
                );
              } else {
                // Short answer or other types
                return (
                  <div
                    key={question.id || questionIndex}
                    className="mb-6 p-4 border border-gray-200 rounded-lg bg-white"
                  >
                    <div className="mb-3">
                      <span className="font-semibold text-gray-800">
                        Câu {question.questionNumber}:
                      </span>
                      <span className="ml-2 text-gray-700">
                        {question.question}
                      </span>
                    </div>
                    {question.answer && (
                      <div className="ml-4 p-3 bg-blue-50 border border-blue-200 rounded">
                        <span className="font-medium text-blue-800">
                          Đáp án: {question.answer}
                        </span>
                      </div>
                    )}
                  </div>
                );
              }
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionRender;
