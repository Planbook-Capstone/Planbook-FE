import { QuestionBankItem } from "@/services/questionBankServices";

// Convert QuestionBankItem to exam context format for PART_I (Multiple Choice)
export const convertToMultipleChoiceQuestion = (question: QuestionBankItem) => {
  const optionsArray = question.questionContent.options
    ? [
        question.questionContent.options.A || "",
        question.questionContent.options.B || "",
        question.questionContent.options.C || "",
        question.questionContent.options.D || "",
      ]
    : ["", "", "", ""];

  return {
    id: `qb_${question.id}_${Date.now()}`,
    question: question.questionContent.question,
    options: optionsArray,
    correctAnswer: question.questionContent.answer
      ? ["A", "B", "C", "D"].indexOf(question.questionContent.answer)
      : 0,
    type: "single" as const,
    illustrationImage: question.questionContent.image,
  };
};

// Convert QuestionBankItem to ExamResultEditor format for PART_I (Multiple Choice)
export const convertToExamResultMultipleChoice = (question: QuestionBankItem) => {
  const options = question.questionContent.options || {};

  return {
    questionNumber: 1, // Will be updated when added to the array
    question: question.questionContent.question,
    options: {
      A: options.A || "",
      B: options.B || "",
      C: options.C || "",
      D: options.D || "",
    },
    answer: question.questionContent.answer || "A",
    difficultyLevel: question.difficultyLevel || "KNOWLEDGE",
    image: question.questionContent.image || undefined,
    explanation: question.explanation || "",
    referenceSource: question.referenceSource || "",
  };
};

// Convert QuestionBankItem to exam context format for PART_II (Yes/No)
export const convertToYesNoQuestion = (question: QuestionBankItem) => {
  const statementsData = question.questionContent.statements as any;
  const answersData = question.questionContent.answers as any;

  const statements = {
    a: {
      text:
        typeof statementsData?.a === "object" && statementsData.a?.text
          ? String(statementsData.a.text)
          : String(statementsData?.a || ""),
      answer:
        typeof statementsData?.a === "object" &&
        typeof statementsData.a?.answer === "boolean"
          ? statementsData.a.answer
          : Boolean(answersData?.a || false),
    },
    b: {
      text:
        typeof statementsData?.b === "object" && statementsData.b?.text
          ? String(statementsData.b.text)
          : String(statementsData?.b || ""),
      answer:
        typeof statementsData?.b === "object" &&
        typeof statementsData.b?.answer === "boolean"
          ? statementsData.b.answer
          : Boolean(answersData?.b || false),
    },
    c: {
      text:
        typeof statementsData?.c === "object" && statementsData.c?.text
          ? String(statementsData.c.text)
          : String(statementsData?.c || ""),
      answer:
        typeof statementsData?.c === "object" &&
        typeof statementsData.c?.answer === "boolean"
          ? statementsData.c.answer
          : Boolean(answersData?.c || false),
    },
    d: {
      text:
        typeof statementsData?.d === "object" && statementsData.d?.text
          ? String(statementsData.d.text)
          : String(statementsData?.d || ""),
      answer:
        typeof statementsData?.d === "object" &&
        typeof statementsData.d?.answer === "boolean"
          ? statementsData.d.answer
          : Boolean(answersData?.d || false),
    },
  };

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

  const statements = {
    a: {
      text:
        typeof statementsData?.a === "object" && statementsData.a?.text
          ? String(statementsData.a.text)
          : String(statementsData?.a || ""),
      answer:
        typeof statementsData?.a === "object" &&
        typeof statementsData.a?.answer === "boolean"
          ? statementsData.a.answer
          : Boolean(answersData?.a || false),
    },
    b: {
      text:
        typeof statementsData?.b === "object" && statementsData.b?.text
          ? String(statementsData.b.text)
          : String(statementsData?.b || ""),
      answer:
        typeof statementsData?.b === "object" &&
        typeof statementsData.b?.answer === "boolean"
          ? statementsData.b.answer
          : Boolean(answersData?.b || false),
    },
    c: {
      text:
        typeof statementsData?.c === "object" && statementsData.c?.text
          ? String(statementsData.c.text)
          : String(statementsData?.c || ""),
      answer:
        typeof statementsData?.c === "object" &&
        typeof statementsData.c?.answer === "boolean"
          ? statementsData.c.answer
          : Boolean(answersData?.c || false),
    },
    d: {
      text:
        typeof statementsData?.d === "object" && statementsData.d?.text
          ? String(statementsData.d.text)
          : String(statementsData?.d || ""),
      answer:
        typeof statementsData?.d === "object" &&
        typeof statementsData.d?.answer === "boolean"
          ? statementsData.d.answer
          : Boolean(answersData?.d || false),
    },
  };

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
