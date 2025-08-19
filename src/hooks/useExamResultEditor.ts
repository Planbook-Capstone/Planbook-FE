import { useState, useCallback } from "react";
import { QuestionBankItem } from "@/services/questionBankServices";
import {
  convertToExamResultMultipleChoice,
  convertToExamResultYesNo,
  convertToExamResultShortAnswer,
} from "@/utils/questionBankUtils";

interface UseExamResultEditorProps {
  examResult: any;
  onDataChange?: (updatedData: any) => void;
}

export const useExamResultEditor = ({ examResult, onDataChange }: UseExamResultEditorProps) => {
  const [forceUpdate, setForceUpdate] = useState(0);

  // Force re-render helper
  const triggerUpdate = useCallback(() => {
    setForceUpdate(prev => prev + 1);
    if (onDataChange) {
      onDataChange(examResult);
    }
  }, [examResult, onDataChange]);

  // Add question from question bank to specific part
  const addQuestionFromBank = useCallback((question: QuestionBankItem, partIndex: number) => {
    if (!examResult?.data?.parts?.[partIndex]) {
      console.error(`Part ${partIndex} not found in exam result`);
      return;
    }

    let convertedQuestion: any;
    
    switch (partIndex) {
      case 0: // PART_I - Multiple Choice
        convertedQuestion = convertToExamResultMultipleChoice(question);
        break;
      case 1: // PART_II - Yes/No
        convertedQuestion = convertToExamResultYesNo(question);
        break;
      case 2: // PART_III - Short Answer
        convertedQuestion = convertToExamResultShortAnswer(question);
        break;
      default:
        console.error(`Invalid part index: ${partIndex}`);
        return;
    }

    // Ensure questions array exists
    if (!examResult.data.parts[partIndex].questions) {
      examResult.data.parts[partIndex].questions = [];
    }

    // Update question number based on current array length
    const currentQuestions = examResult.data.parts[partIndex].questions;
    convertedQuestion.questionNumber = currentQuestions.length + 1;

    // Add the question to the array
    currentQuestions.push(convertedQuestion);

    console.log(`✅ Added question from bank to part ${partIndex + 1}:`, convertedQuestion);
    
    // Trigger re-render
    triggerUpdate();
  }, [examResult, triggerUpdate]);

  // Add question from question bank based on question type
  const addQuestionFromBankByType = useCallback((question: QuestionBankItem) => {
    const { questionType } = question;
    
    switch (questionType) {
      case "PART_I":
        addQuestionFromBank(question, 0);
        break;
      case "PART_II":
        addQuestionFromBank(question, 1);
        break;
      case "PART_III":
        addQuestionFromBank(question, 2);
        break;
      default:
        console.error(`Unknown question type: ${questionType}`);
    }
  }, [addQuestionFromBank]);

  // Delete question from specific part
  const deleteQuestion = useCallback((partIndex: number, questionIndex: number) => {
    if (!examResult?.data?.parts?.[partIndex]?.questions) {
      console.error(`Part ${partIndex} or questions not found`);
      return;
    }

    // Remove the question from the array
    examResult.data.parts[partIndex].questions.splice(questionIndex, 1);

    // Update question numbers for remaining questions
    examResult.data.parts[partIndex].questions.forEach((q: any, idx: number) => {
      q.questionNumber = idx + 1;
    });

    console.log(`🗑️ Deleted question ${questionIndex + 1} from part ${partIndex + 1}`);
    
    // Trigger re-render
    triggerUpdate();
  }, [examResult, triggerUpdate]);

  // Add new empty question to specific part
  const addEmptyQuestion = useCallback((partIndex: number) => {
    if (!examResult?.data?.parts?.[partIndex]) {
      console.error(`Part ${partIndex} not found in exam result`);
      return;
    }

    // Ensure questions array exists
    if (!examResult.data.parts[partIndex].questions) {
      examResult.data.parts[partIndex].questions = [];
    }

    const currentQuestions = examResult.data.parts[partIndex].questions;
    const newQuestionNumber = currentQuestions.length + 1;

    let newQuestion: any = {
      questionNumber: newQuestionNumber,
      question: "",
      difficultyLevel: "KNOWLEDGE",
      explanation: "",
      referenceSource: "",
    };

    // Create question based on part type
    if (partIndex === 0) {
      // Part 1 - Multiple Choice
      newQuestion = {
        ...newQuestion,
        options: {
          A: "",
          B: "",
          C: "",
          D: "",
        },
        answer: "A",
      };
    } else if (partIndex === 1) {
      // Part 2 - True/False
      newQuestion = {
        ...newQuestion,
        statements: {
          a: { text: "", answer: true },
          b: { text: "", answer: false },
          c: { text: "", answer: true },
          d: { text: "", answer: false },
        },
      };
    } else if (partIndex === 2) {
      // Part 3 - Essay
      newQuestion = {
        ...newQuestion,
        answer: "",
      };
    }

    // Add the new question to the array
    currentQuestions.push(newQuestion);

    console.log(`➕ Added new empty question ${newQuestionNumber} to part ${partIndex + 1}`);
    
    // Trigger re-render
    triggerUpdate();
  }, [examResult, triggerUpdate]);

  // Clear all questions from a specific part
  const clearPartQuestions = useCallback((partIndex: number) => {
    if (!examResult?.data?.parts?.[partIndex]) {
      console.error(`Part ${partIndex} not found in exam result`);
      return;
    }

    examResult.data.parts[partIndex].questions = [];
    
    console.log(`🧹 Cleared all questions from part ${partIndex + 1}`);
    
    // Trigger re-render
    triggerUpdate();
  }, [examResult, triggerUpdate]);

  return {
    addQuestionFromBank,
    addQuestionFromBankByType,
    deleteQuestion,
    addEmptyQuestion,
    clearPartQuestions,
    forceUpdate,
  };
};
