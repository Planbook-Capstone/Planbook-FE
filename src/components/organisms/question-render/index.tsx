"use client";

import React from "react";
import { ExamPart, ExamQuestion } from "@/services/studentExamServices";
import { ResultDetail } from "@/services/examInstanceServices";

interface QuestionRenderProps {
  parts: ExamPart[];
  studentResult?: ResultDetail[];
}

interface MultipleChoiceQuestionProps {
  question: ExamQuestion;
  partTitle: string;
  studentAnswer?: ResultDetail;
}

interface TrueFalseQuestionProps {
  question: ExamQuestion;
  partTitle: string;
  studentAnswers?: ResultDetail[];
}

interface ShortAnswerQuestionProps {
  question: ExamQuestion;
  partTitle: string;
  studentAnswer?: ResultDetail;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  partTitle,
  studentAnswer,
}) => {
  return (
    <div className="mb-6 p-5 border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="mb-4">
        <div className="flex items-start gap-2">
          <span className="font-bold text-blue-700 text-lg min-w-fit">
            Câu {question.questionNumber}:
          </span>
          <span
            className="text-gray-800 text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: question.question }}
          />
        </div>
      </div>

      {/* Student Answer Summary */}
      {studentAnswer && (
        <div className="mb-4 p-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-600">Câu trả lời của bạn: </span>
                <span
                  className={`font-semibold ${
                    studentAnswer.isCorrect ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {studentAnswer.studentAnswer || "Chưa trả lời"}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Đáp án đúng: </span>
                <span className="font-semibold text-green-700">
                  {studentAnswer.correctAnswer}
                </span>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-bold ${
                studentAnswer.isCorrect
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {studentAnswer.isCorrect ? "✓ Đúng" : "✗ Sai"}
            </div>
          </div>
        </div>
      )}

      {question.options && (
        <div className="space-y-2 ml-6">
          {Object.entries(question.options).map(([key, value]) => {
            const isCorrectAnswer = question.answer === key;
            const isStudentAnswer = studentAnswer?.studentAnswer === key;

            let bgClass = "bg-gray-50 border border-gray-200";
            let textClass = "text-gray-700";

            if (isCorrectAnswer) {
              bgClass = "bg-green-50 border-2 border-green-300 shadow-sm";
              textClass = "text-green-800 font-semibold";
            } else if (isStudentAnswer && !isCorrectAnswer) {
              bgClass = "bg-red-50 border-2 border-red-300 shadow-sm";
              textClass = "text-red-800 font-semibold";
            }

            return (
              <div
                key={key}
                className={`flex items-start gap-3 p-3 rounded-lg transition-all ${bgClass}`}
              >
                <span className="font-bold text-gray-700 min-w-[24px] text-base">
                  {key}.
                </span>
                <span
                  className={`flex-1 text-base leading-relaxed ${textClass}`}
                >
                  <span
                    className="text-gray-800 text-base leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: value }}
                  />
                </span>
                <div className="flex items-center gap-1">
                  {isCorrectAnswer && (
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                      ✓ Đáp án đúng
                    </span>
                  )}
                  {isStudentAnswer && !isCorrectAnswer && (
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                      ✗ Bạn chọn
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({
  question,
  partTitle,
  studentAnswers,
}) => {
  return (
    <div className="mb-6 p-5 border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="mb-4">
        <div className="flex items-start gap-2">
          <span className="font-bold text-blue-700 text-lg min-w-fit">
            Câu {question.questionNumber}:
          </span>

          <span
            className="text-gray-800 text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: question.question }}
          />
        </div>
      </div>

      {question.statements && (
        <div className="ml-6 space-y-3">
          {Object.entries(question.statements).map(([key, statement]) => {
            // Tìm câu trả lời của học sinh cho statement này bằng cách sử dụng questionId và statementKey
            const studentAnswer = findStudentAnswerForStatement(
              question.id,
              key,
              studentAnswers || []
            );

            const isCorrect = statement.answer;
            const studentAnswerValue = studentAnswer?.studentAnswer;
            const isStudentCorrect = studentAnswer?.isCorrect;

            return (
              <div
                key={key}
                className={`flex flex-col gap-3 p-4 rounded-lg border-2 transition-all ${
                  isCorrect
                    ? "bg-green-50 border-green-300 shadow-sm"
                    : "bg-red-50 border-red-300 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="font-bold text-gray-700 min-w-[24px] text-base">
                    {key.toUpperCase()}.
                  </span>
                  <span
                    className="flex-1 text-base leading-relaxed text-gray-800"
                    dangerouslySetInnerHTML={{ __html: statement.text }}
                  />

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        isCorrect
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {isCorrect ? "✓ Đúng" : "✗ Sai"}
                    </span>
                  </div>
                </div>

                {/* Student Answer for this statement */}
                {studentAnswer && (
                  <div className="ml-8 p-3 rounded-lg border border-gray-300 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Bạn trả lời: </span>
                          <span
                            className={`font-semibold ${
                              isStudentCorrect
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            {studentAnswerValue === "true"
                              ? "Đúng"
                              : studentAnswerValue === "false"
                              ? "Sai"
                              : studentAnswerValue === "null" ||
                                !studentAnswerValue
                              ? "Chưa trả lời"
                              : studentAnswerValue}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Đáp án: </span>
                          <span className="font-semibold text-green-700">
                            {isCorrect ? "Đúng" : "Sai"}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          isStudentCorrect
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isStudentCorrect ? "✓" : "✗"}
                      </div>
                    </div>
                  </div>
                )}

                {/* Show "Chưa trả lời" message if no student answer found */}
                {!studentAnswer && (
                  <div className="ml-8 p-3 rounded-lg border border-gray-300 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-gray-600">Bạn trả lời: </span>
                        <span className="font-semibold text-gray-500">
                          Chưa trả lời
                        </span>
                      </div>
                      <div className="px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                        ?
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Helper function to extract question ID from questionId string
const extractQuestionId = (questionId: string): string => {
  // Extract ID after "Q" character
  // Example: "PHẦN I_Q6167e9e9-2241-420f-a935-1e82389efb5a" -> "6167e9e9-2241-420f-a935-1e82389efb5a"
  const qIndex = questionId.indexOf("Q");
  if (qIndex !== -1 && qIndex < questionId.length - 1) {
    return questionId.substring(qIndex + 1);
  }
  return questionId;
};

// Helper function to find student answer for a question
const findStudentAnswer = (
  questionId: string,
  studentResult: ResultDetail[]
): ResultDetail | undefined => {
  const extractedId = extractQuestionId(questionId);
  return studentResult.find((result) => {
    const resultId = extractQuestionId(result.questionId);
    return resultId === extractedId;
  });
};

// Helper function to find student answers for true/false statements
const findStudentAnswersForStatements = (
  questionId: string,
  studentResult: ResultDetail[]
): ResultDetail[] => {
  const extractedId = extractQuestionId(questionId);
  return studentResult.filter((result) => {
    const resultId = extractQuestionId(result.questionId);
    return resultId === extractedId;
  });
};

// Helper function to find student answer for a specific statement
const findStudentAnswerForStatement = (
  questionId: string,
  statementKey: string,
  studentResult: ResultDetail[]
): ResultDetail | undefined => {
  const extractedId = extractQuestionId(questionId);
  const result = studentResult.find((result) => {
    const resultId = extractQuestionId(result.questionId);
    const matches =
      resultId === extractedId && result.statementKey === statementKey;

    // Debug logging
    if (resultId === extractedId) {
      console.log("🔍 Statement matching:", {
        questionId,
        extractedId,
        resultId,
        statementKey,
        resultStatementKey: result.statementKey,
        matches,
      });
    }

    return matches;
  });

  return result;
};

const ShortAnswerQuestion: React.FC<ShortAnswerQuestionProps> = ({
  question,
  partTitle,
  studentAnswer,
}) => {
  return (
    <div className="mb-6 p-5 border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="mb-4">
        <div className="flex items-start gap-2">
          <span className="font-bold text-blue-700 text-lg min-w-fit">
            Câu {question.questionNumber}:
          </span>
          <span
            className="text-gray-800 text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: question.question }}
          />
        </div>
      </div>

      {/* Student Answer Summary */}
      {studentAnswer && (
        <div className="mb-4 p-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-600">Câu trả lời của bạn: </span>
                <span
                  className={`font-semibold ${
                    studentAnswer.isCorrect ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {studentAnswer.studentAnswer || "Chưa trả lời"}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Đáp án đúng: </span>
                <span className="font-semibold text-green-700">
                  {studentAnswer.correctAnswer}
                </span>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-bold ${
                studentAnswer.isCorrect
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {studentAnswer.isCorrect ? "✓ Đúng" : "✗ Sai"}
            </div>
          </div>
        </div>
      )}

      {question.answer && (
        <div className="ml-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg shadow-sm">
          <span className="font-medium text-green-800">
            Đáp án đúng: {question.answer}
          </span>
        </div>
      )}
    </div>
  );
};

const QuestionRender: React.FC<QuestionRenderProps> = ({
  parts,
  studentResult = [],
}) => {
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
                const studentAnswer = findStudentAnswer(
                  question.id,
                  studentResult
                );
                return (
                  <MultipleChoiceQuestion
                    key={question.id || questionIndex}
                    question={question}
                    partTitle={part.title}
                    studentAnswer={studentAnswer}
                  />
                );
              } else if (question.statements) {
                // True/False question - pass all student results to let the component find specific answers
                return (
                  <TrueFalseQuestion
                    key={question.id || questionIndex}
                    question={question}
                    partTitle={part.title}
                    studentAnswers={studentResult}
                  />
                );
              } else {
                // Short answer or other types
                const studentAnswer = findStudentAnswer(
                  question.id,
                  studentResult
                );
                return (
                  <ShortAnswerQuestion
                    key={question.id || questionIndex}
                    question={question}
                    partTitle={part.title}
                    studentAnswer={studentAnswer}
                  />
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
