import { QuestionBankItem } from "@/services/questionBankServices";

// Helper function to normalize statements data
const normalizeStatementsData = (statementsData: any, answersData: any) => {
  if (!statementsData) return {};

  const result: any = {};

  Object.keys(statementsData).forEach(key => {
    const value = statementsData[key];

    if (typeof value === "object" && value !== null && value.text !== undefined) {
      // Format: { text: string, answer: boolean }
      result[key] = {
        text: String(value.text || ""),
        answer: Boolean(value.answer)
      };
    } else {
      // Legacy format: statements are strings, answers are separate
      result[key] = {
        text: String(value || ""),
        answer: Boolean(answersData?.[key] || false)
      };
    }
  });

  return result;
};

// Convert QuestionBankItem to exam context format for PART_I (Multiple Choice)
export const convertToMultipleChoiceQuestion = (question: QuestionBankItem) => {
  const options = question.questionContent.options || {};

  // Handle both uppercase and lowercase option keys
  const optionsArray = [
    options.A || options.a || "",
    options.B || options.b || "",
    options.C || options.c || "",
    options.D || options.d || "",
  ];

  // Handle both uppercase and lowercase answer
  const answer = question.questionContent.answer || "";
  const answerIndex = ["A", "B", "C", "D", "a", "b", "c", "d"].indexOf(answer);
  const correctAnswer = answerIndex >= 0 ? answerIndex % 4 : 0;

  return {
    id: `qb_${question.id}_${Date.now()}`,
    question: question.questionContent.question,
    options: optionsArray,
    correctAnswer: correctAnswer,
    type: "single" as const,
    illustrationImage: question.questionContent.image,
  };
};

// Convert QuestionBankItem to ExamResultEditor format for PART_I (Multiple Choice)
export const convertToExamResultMultipleChoice = (question: QuestionBankItem) => {
  const options = question.questionContent.options || {};

  console.log("🔍 Converting PART_I question:", {
    questionId: question.id,
    originalOptions: options,
    originalAnswer: question.questionContent.answer,
    questionContent: question.questionContent
  });

  // Handle both uppercase and lowercase option keys
  const normalizedOptions = {
    A: options.A || options.a || "",
    B: options.B || options.b || "",
    C: options.C || options.c || "",
    D: options.D || options.d || "",
  };

  // Ensure answer is uppercase to match option keys
  const normalizedAnswer = (question.questionContent.answer || "A").toUpperCase();

  const result = {
    questionNumber: 1, // Will be updated when added to the array
    question: question.questionContent.question,
    options: normalizedOptions,
    answer: normalizedAnswer,
    difficultyLevel: question.difficultyLevel || "KNOWLEDGE",
    image: question.questionContent.image || undefined,
    explanation: question.explanation || "",
    referenceSource: question.referenceSource || "",
  };

  console.log("🔍 Converted PART_I result:", result);
  return result;
};

// Convert QuestionBankItem to exam context format for PART_II (Yes/No)
export const convertToYesNoQuestion = (question: QuestionBankItem) => {
  const statementsData = question.questionContent.statements as any;
  const answersData = question.questionContent.answers as any;

  // Normalize and convert to a, b, c, d format for exam context
  const normalizedData = normalizeStatementsData(statementsData, answersData);
  const statementKeys = Object.keys(normalizedData);
  const targetKeys = ['a', 'b', 'c', 'd'];

  const statements: any = {};
  targetKeys.forEach((targetKey, index) => {
    if (index < statementKeys.length) {
      const sourceKey = statementKeys[index];
      statements[targetKey] = normalizedData[sourceKey];
    } else {
      statements[targetKey] = { text: "", answer: false };
    }
  });

  return {
    id: `qb_${question.id}_${Date.now()}`,
    question: question.questionContent.question,
    statements: statements,
    type: "yes-no" as const,
    illustrationImage: question.questionContent.image,
  };
};

// Convert QuestionBankItem to ExamResultEditor format for PART_II (Yes/No)
export const convertToExamResultYesNo = (question: QuestionBankItem) => {
  const statementsData = question.questionContent.statements as any;
  const answersData = question.questionContent.answers as any;

  // Normalize statements data and preserve original keys
  const statements = normalizeStatementsData(statementsData, answersData);

  return {
    questionNumber: 1, // Will be updated when added to the array
    question: question.questionContent.question,
    statements: statements,
    difficultyLevel: question.difficultyLevel || "KNOWLEDGE",
    image: question.questionContent.image || undefined,
    explanation: question.explanation || "",
    referenceSource: question.referenceSource || "",
  };
};

// Convert QuestionBankItem to exam context format for PART_III (Short Answer)
export const convertToShortAnswerQuestion = (question: QuestionBankItem) => {
  return {
    id: `qb_${question.id}_${Date.now()}`,
    question: question.questionContent.question,
    answer: question.questionContent.answer || "",
    type: "short" as const,
    illustrationImage: question.questionContent.image,
  };
};

// Convert QuestionBankItem to ExamResultEditor format for PART_III (Short Answer)
export const convertToExamResultShortAnswer = (question: QuestionBankItem) => {
  return {
    questionNumber: 1, // Will be updated when added to the array
    question: question.questionContent.question,
    answer: question.questionContent.answer || "",
    difficultyLevel: question.difficultyLevel || "KNOWLEDGE",
    image: question.questionContent.image || undefined,
    explanation: question.explanation || "",
    referenceSource: question.referenceSource || "",
  };
};

// Get section name for question type
export const getSectionName = (questionType: string) => {
  switch (questionType) {
    case "PART_I":
      return "Phần I - Trắc nghiệm";
    case "PART_II":
      return "Phần II - Đúng/Sai";
    case "PART_III":
      return "Phần III - Tự luận";
    default:
      return "Phần không xác định";
  }
};

// Filter questions based on search value
export const filterQuestionsBySearch = (
  questions: QuestionBankItem[],
  searchValue: string
) => {
  if (!searchValue.trim()) return questions;
  
  const searchLower = searchValue.toLowerCase();
  return questions.filter(
    (question) =>
      question.questionContent.question.toLowerCase().includes(searchLower) ||
      question.explanation.toLowerCase().includes(searchLower)
  );
};

// Check if filters are active
export const hasActiveFilters = (
  filterParams: any,
  searchValue: string,
  lessonId?: number
) => {
  return (
    filterParams.questionTypes?.length ||
    filterParams.difficultyLevels?.length ||
    searchValue.trim() ||
    (filterParams.lessonId && filterParams.lessonId !== lessonId)
  );
};
