"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { QuestionBankItem } from "@/services/questionBankServices";

interface ExamResultEditorContextType {
  isExamResultEditor: boolean;
  onAddQuestionFromBank?: (question: QuestionBankItem) => void;
}

const ExamResultEditorContext = createContext<ExamResultEditorContextType | undefined>(undefined);

export const useExamResultEditorContext = () => {
  const context = useContext(ExamResultEditorContext);
  return context; // Return undefined if not in ExamResultEditor context
};

interface ExamResultEditorProviderProps {
  children: ReactNode;
  onAddQuestionFromBank?: (question: QuestionBankItem) => void;
}

export const ExamResultEditorProvider: React.FC<ExamResultEditorProviderProps> = ({
  children,
  onAddQuestionFromBank,
}) => {
  const value: ExamResultEditorContextType = {
    isExamResultEditor: true,
    onAddQuestionFromBank,
  };

  return (
    <ExamResultEditorContext.Provider value={value}>
      {children}
    </ExamResultEditorContext.Provider>
  );
};
